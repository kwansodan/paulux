"""Gift card routes.

Public: purchase (creates PENDING_PAYMENT card + Paystack init), validate a
code, verify purchase payment. Admin: list, redeem against a booking, cancel.

Redemption locks the card row, decrements the balance, and applies the amount
to the booking as a Payment(provider=GIFT_CARD) — one audit trail for all
money. Unlike the old app, redemption requires gift_cards.manage permission.
"""
from __future__ import annotations

import secrets
import string
from decimal import Decimal

from flask import Blueprint

from app.auth.decorators import load_current_user, require_permission
from app.blueprints.helpers import get_or_404, money, ok, parse_body, require_tenant
from app.errors import ApiError
from app.extensions import db, limiter
from app.models.booking import Booking, PaymentStatus
from app.models.catalog import Service
from app.models.gift_card import (
    GiftCard,
    GiftCardDeliveryMethod,
    GiftCardItem,
    GiftCardItemType,
    GiftCardRedemption,
    GiftCardStatus,
)
from app.models.inventory import Product
from app.models.payment import Payment, PaymentProvider
from app.schemas.gift_card import GiftCardPurchaseInput, GiftCardRedeemInput
from app.services import paystack
from app.services.payment_flow import (
    audit,
    issue_invoice,
    paid_total,
    recompute_booking_payment_status,
)

bp = Blueprint("gift_cards", __name__, url_prefix="/api/gift-cards")

CODE_ALPHABET = string.ascii_uppercase + string.digits


def _generate_code(org_id) -> str:
    for _ in range(10):
        code = "GFT-" + "".join(secrets.choice(CODE_ALPHABET) for _ in range(8))
        exists = db.session.execute(
            db.select(GiftCard.id)
            .filter_by(organization_id=org_id, code=code)
            .execution_options(skip_tenant_filter=True)
        ).scalar_one_or_none()
        if exists is None:
            return code
    raise ApiError("Could not generate gift card code", status=500, code="INTERNAL")


def serialize_gift_card(g: GiftCard, *, admin: bool = False) -> dict:
    data = {
        "id": str(g.id),
        "code": g.code,
        "recipientName": g.recipient_name,
        "totalAmount": money(g.total_amount),
        "balance": money(g.balance),
        "currency": g.currency,
        "status": g.status.value,
        "expiresAt": g.expires_at.isoformat() if g.expires_at else None,
        "createdAt": g.created_at.isoformat(),
    }
    if admin:
        data.update({
            "senderName": g.sender_name,
            "senderEmail": g.sender_email,
            "senderPhone": g.sender_phone,
            "recipientEmail": g.recipient_email,
            "recipientPhone": g.recipient_phone,
            "message": g.message,
            "deliveryMethod": g.delivery_method.value,
            "paymentStatus": g.payment_status.value,
            "items": [
                {
                    "itemType": i.item_type.value,
                    "name": i.name,
                    "unitPrice": money(i.unit_price),
                    "quantity": i.quantity,
                }
                for i in g.items
            ],
            "redemptions": [
                {
                    "amountApplied": money(r.amount_applied),
                    "bookingId": str(r.booking_id) if r.booking_id else None,
                    "createdAt": r.created_at.isoformat(),
                }
                for r in g.redemptions
            ],
        })
    return data


@bp.post("/purchase")
@limiter.limit("10 per hour")
def purchase_gift_card():
    """Public purchase. Amount comes from catalog snapshots, never the client."""
    org = require_tenant()
    data = parse_body(GiftCardPurchaseInput)

    card = GiftCard(
        organization_id=org.id,
        code=_generate_code(org.id),
        sender_name=data.sender_name,
        sender_email=data.sender_email,
        sender_phone=data.sender_phone,
        recipient_name=data.recipient_name,
        recipient_email=data.recipient_email,
        recipient_phone=data.recipient_phone,
        message=data.message,
        delivery_method=GiftCardDeliveryMethod(data.delivery_method),
        total_amount=Decimal("0"),
        balance=Decimal("0"),
        status=GiftCardStatus.PENDING_PAYMENT,
    )

    total = Decimal("0")
    for line in data.items:
        if line.item_type == "SERVICE":
            item = get_or_404(Service, line.item_id, label="Service")
        else:
            item = get_or_404(Product, line.item_id, label="Product")
        if not item.is_active:
            raise ApiError(f"'{item.name}' is not available", status=422, code="ITEM_INACTIVE")
        card.items.append(
            GiftCardItem(
                item_type=GiftCardItemType(line.item_type),
                service_id=item.id if line.item_type == "SERVICE" else None,
                product_id=item.id if line.item_type == "PRODUCT" else None,
                name=item.name,
                unit_price=item.price,
                quantity=line.quantity,
            )
        )
        total += item.price * line.quantity

    card.total_amount = total.quantize(Decimal("0.01"))
    card.payment_ref = "GFTPAY-" + secrets.token_hex(6).upper()
    db.session.add(card)

    from flask import request

    origin = request.headers.get("Origin")
    resp = paystack.initialize_transaction(
        org,
        email=data.sender_email,
        amount_pesewas=int(card.total_amount * 100),
        reference=card.payment_ref,
        phone=data.sender_phone,
        callback_url=f"{origin}/pay/callback" if origin else None,
    )
    if not resp.get("status"):
        db.session.rollback()
        raise ApiError("Could not start payment", status=502, code="GATEWAY_ERROR")

    db.session.commit()
    return ok({
        "code": card.code,
        "totalAmount": money(card.total_amount),
        "authorizationUrl": resp["data"]["authorization_url"],
        "paymentReference": card.payment_ref,
    }, status=201)


def activate_gift_card_if_valid(card: GiftCard, verified: dict) -> bool:
    """Amount-validated activation; mirrors payment processing rules."""
    if card.status != GiftCardStatus.PENDING_PAYMENT:
        return False  # already processed (idempotent)
    expected = int(card.total_amount * 100)
    if (
        verified.get("status") == "success"
        and int(verified.get("amount") or -1) == expected
        and verified.get("currency") == card.currency
    ):
        card.status = GiftCardStatus.ACTIVE
        card.balance = card.total_amount
        card.payment_status = PaymentStatus.PAID
        audit(card.organization_id, "GIFT_CARD_ACTIVATED",
              new={"code": card.code, "amount": str(card.total_amount)})
        return True
    card.payment_status = PaymentStatus.FAILED
    audit(card.organization_id, "GIFT_CARD_PAYMENT_MISMATCH",
          new={"code": card.code, "got": verified.get("amount")})
    return False


@bp.get("/verify/<reference>")
def verify_gift_card_payment(reference: str):
    org = require_tenant()
    card = db.session.execute(
        db.select(GiftCard).filter_by(payment_ref=reference)
    ).scalar_one_or_none()
    if card is None:
        raise ApiError("Gift card not found", status=404, code="NOT_FOUND")

    if card.status == GiftCardStatus.PENDING_PAYMENT:
        resp = paystack.verify_transaction(org, reference)
        activated = activate_gift_card_if_valid(card, resp.get("data") or {})
        db.session.commit()
        if activated:
            from app.notifications.events import notify_gift_card_delivery

            notify_gift_card_delivery(card)
        elif card.status == GiftCardStatus.PENDING_PAYMENT:
            raise ApiError("Payment not confirmed", status=422, code="PAYMENT_NOT_CONFIRMED")

    return ok(serialize_gift_card(card))


@bp.post("/validate")
def validate_gift_card():
    """Public balance check: code in, balance/status out. No PII returned."""
    require_tenant()
    from pydantic import BaseModel, Field

    class _In(BaseModel):
        code: str = Field(min_length=4, max_length=20)

    data = parse_body(_In)
    card = db.session.execute(
        db.select(GiftCard).filter_by(code=data.code.strip().upper())
    ).scalar_one_or_none()
    if card is None:
        raise ApiError("Invalid gift card code", status=404, code="NOT_FOUND")
    return ok({
        "code": card.code,
        "status": card.status.value,
        "balance": money(card.balance),
        "currency": card.currency,
    })


@bp.post("/redeem")
@require_permission("gift_cards.manage")
def redeem_gift_card():
    org = require_tenant()
    data = parse_body(GiftCardRedeemInput)
    user = load_current_user()

    booking = get_or_404(Booking, data.booking_id, label="Booking")

    # Lock the card row: balance check + decrement must be atomic.
    card = db.session.execute(
        db.select(GiftCard)
        .filter_by(code=data.code.strip().upper())
        .with_for_update()
    ).scalar_one_or_none()
    if card is None or card.organization_id != org.id:
        raise ApiError("Invalid gift card code", status=404, code="NOT_FOUND")
    if card.status not in (GiftCardStatus.ACTIVE, GiftCardStatus.PARTIALLY_REDEEMED):
        raise ApiError(f"Gift card is {card.status.value}", status=422, code="CARD_NOT_REDEEMABLE")

    outstanding = max(Decimal("0"), booking.total - paid_total(booking))
    if outstanding <= 0:
        raise ApiError("Nothing left to pay on this booking", status=422, code="NOTHING_DUE")

    apply_amount = min(card.balance, outstanding, data.amount or outstanding)
    if apply_amount <= 0:
        raise ApiError("Gift card has no balance", status=422, code="NO_BALANCE")

    card.balance = card.balance - apply_amount
    card.status = (
        GiftCardStatus.REDEEMED if card.balance <= 0 else GiftCardStatus.PARTIALLY_REDEEMED
    )
    redemption = GiftCardRedemption(
        organization_id=org.id,
        gift_card=card,
        booking_id=booking.id,
        amount_applied=apply_amount,
        redeemed_by_id=user.id if user else None,
    )
    db.session.add(redemption)
    db.session.flush()  # redemption.id for the payment ref

    payment = Payment(
        organization_id=org.id,
        booking=booking,
        provider=PaymentProvider.GIFT_CARD,
        provider_ref=f"GC-{redemption.id.hex[:12].upper()}",
        amount=apply_amount,
        currency=card.currency,
        status=PaymentStatus.PAID,
        reason=f"Gift card {card.code}",
    )
    db.session.add(payment)
    recompute_booking_payment_status(booking)
    issue_invoice(payment)
    audit(org.id, "GIFT_CARD_REDEEMED", booking=booking,
          new={"code": card.code, "amount": str(apply_amount),
               "remainingBalance": str(card.balance)})
    db.session.commit()
    return ok({
        "amountApplied": money(apply_amount),
        "remainingBalance": money(card.balance),
        "cardStatus": card.status.value,
        "bookingPaymentStatus": booking.payment_status.value,
    })


@bp.get("")
@require_permission("gift_cards.view")
def list_gift_cards():
    require_tenant()
    rows = db.session.execute(
        db.select(GiftCard).order_by(GiftCard.created_at.desc()).limit(200)
    ).scalars().all()
    return ok([serialize_gift_card(g, admin=True) for g in rows])


@bp.post("/<uuid:card_id>/cancel")
@require_permission("gift_cards.manage")
def cancel_gift_card(card_id):
    card = get_or_404(GiftCard, card_id, label="Gift card")
    if card.status in (GiftCardStatus.REDEEMED, GiftCardStatus.CANCELLED):
        raise ApiError(f"Gift card is already {card.status.value}", status=422, code="INVALID_STATE")
    card.status = GiftCardStatus.CANCELLED
    audit(card.organization_id, "GIFT_CARD_CANCELLED", new={"code": card.code})
    db.session.commit()
    return ok(serialize_gift_card(card, admin=True))
