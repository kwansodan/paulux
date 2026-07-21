"""Payment routes.

Design rules (fixes for the old app's holes):
- Clients NEVER post payment state or amounts for gateway payments; the server
  derives the amount from the booking and validates the gateway's response.
- The webhook verifies an HMAC-SHA512 of the RAW body against the tenant's own
  secret and is idempotent on ``provider_ref``.
- Refunds are an explicit, permission-gated admin action — nothing refunds
  automatically.
- Manual payments are admin-only and capped at the booking's outstanding total.
"""
from __future__ import annotations

import secrets
import string
from decimal import Decimal

from flask import Blueprint, request

from app.auth.decorators import require_permission
from app.blueprints.helpers import get_or_404, money, ok, parse_body, require_tenant
from app.errors import ApiError
from app.extensions import db, limiter
from app.models.booking import Booking, PaymentStatus
from app.models.payment import ManualPaymentMethod, Payment, PaymentProvider
from app.schemas.payment import (
    InitializePaymentInput,
    ManualMethodInput,
    ManualPaymentInput,
    RefundInput,
)
from app.notifications.events import notify_payment_received
from app.services import paystack
from app.services.payment_flow import (
    PaymentProcessingError,
    apply_refund,
    audit,
    issue_invoice,
    paid_total,
    process_verified_payment,
    recompute_booking_payment_status,
)

bp = Blueprint("payments", __name__, url_prefix="/api/payments")

REF_ALPHABET = string.ascii_uppercase + string.digits


def _generate_payment_ref(org_id) -> str:
    for _ in range(10):
        ref = "PAY-" + "".join(secrets.choice(REF_ALPHABET) for _ in range(10))
        exists = db.session.execute(
            db.select(Payment.id)
            .filter_by(organization_id=org_id, provider_ref=ref)
            .execution_options(skip_tenant_filter=True)
        ).scalar_one_or_none()
        if exists is None:
            return ref
    raise ApiError("Could not generate payment reference", status=500, code="INTERNAL")


def serialize_payment(p: Payment) -> dict:
    return {
        "id": str(p.id),
        "bookingId": str(p.booking_id),
        "bookingReference": p.booking.booking_reference if p.booking else None,
        "provider": p.provider.value,
        "providerRef": p.provider_ref,
        "amount": money(p.amount),
        "currency": p.currency,
        "status": p.status.value,
        "reason": p.reason,
        "manualMethod": p.manual_method.name if p.manual_method else None,
        "createdAt": p.created_at.isoformat(),
    }


def _outstanding(booking: Booking) -> Decimal:
    return max(Decimal("0"), booking.total - paid_total(booking))


def _deposit_outstanding(booking: Booking) -> Decimal:
    deposit = booking.min_deposit_fixed or Decimal("0")
    return max(Decimal("0"), min(deposit, booking.total) - paid_total(booking))


# --- public: initialize + verify + webhook ---------------------------------------

@bp.post("/initialize")
@limiter.limit("30 per hour")
def initialize_payment():
    org = require_tenant()
    data = parse_body(InitializePaymentInput)

    booking = db.session.execute(
        db.select(Booking).filter_by(booking_reference=data.booking_reference)
    ).scalar_one_or_none()
    if booking is None:
        raise ApiError("Booking not found", status=404, code="NOT_FOUND")

    amount = (
        _deposit_outstanding(booking)
        if data.purpose == "DEPOSIT"
        else _outstanding(booking)
    )
    if amount <= 0:
        raise ApiError("Nothing left to pay on this booking", status=422, code="NOTHING_DUE")

    payment = Payment(
        organization_id=org.id,
        booking_id=booking.id,
        provider=PaymentProvider.PAYSTACK,
        provider_ref=_generate_payment_ref(org.id),
        amount=amount,
        currency="GHS",
        status=PaymentStatus.PENDING,
    )
    db.session.add(payment)
    audit(org.id, "PAYMENT_INITIALIZED", booking=booking,
          new={"amount": str(amount), "purpose": data.purpose})

    origin = request.headers.get("Origin")
    resp = paystack.initialize_transaction(
        org,
        email=booking.client_email,
        amount_pesewas=int(amount * 100),
        reference=payment.provider_ref,
        phone=booking.client_phone,
        callback_url=f"{origin}/pay/callback" if origin else None,
    )
    if not resp.get("status"):
        db.session.rollback()
        raise ApiError("Could not start payment", status=502, code="GATEWAY_ERROR")

    db.session.commit()
    return ok({
        "authorizationUrl": resp["data"]["authorization_url"],
        "reference": payment.provider_ref,
        "amount": money(amount),
    }, status=201)


@bp.get("/verify/<reference>")
def verify_payment(reference: str):
    org = require_tenant()
    payment = db.session.execute(
        db.select(Payment).filter_by(provider_ref=reference)
    ).scalar_one_or_none()
    if payment is None:
        raise ApiError("Payment not found", status=404, code="NOT_FOUND")

    if payment.status != PaymentStatus.PAID:  # idempotent short-circuit
        resp = paystack.verify_transaction(org, reference)
        verified = resp.get("data") or {}
        try:
            transitioned = process_verified_payment(payment, verified)
            db.session.commit()
            if transitioned:
                notify_payment_received(payment)
        except PaymentProcessingError as e:
            db.session.commit()  # persist FAILED + audit
            raise ApiError(e.message, status=422, code=e.code)

    return ok({
        "payment": serialize_payment(payment),
        "bookingPaymentStatus": payment.booking.payment_status.value,
    })


@bp.post("/webhook")
def webhook():
    org = require_tenant()
    raw = request.get_data()  # raw bytes — signature is computed over these
    signature = request.headers.get("X-Paystack-Signature")
    secret = paystack.get_org_secret_key(org)
    if not paystack.verify_webhook_signature(secret, raw, signature):
        raise ApiError("Invalid signature", status=401, code="INVALID_SIGNATURE")

    event = request.get_json(force=True, silent=True) or {}
    kind = event.get("event")
    payload = event.get("data") or {}
    reference = payload.get("reference")
    if not reference:
        return ok({"handled": False})

    payment = db.session.execute(
        db.select(Payment).filter_by(provider_ref=reference)
    ).scalar_one_or_none()
    if payment is None:
        # Maybe a gift card purchase — those carry their own references.
        from app.blueprints.gift_cards import activate_gift_card_if_valid
        from app.models.gift_card import GiftCard

        card = db.session.execute(
            db.select(GiftCard).filter_by(payment_ref=reference)
        ).scalar_one_or_none()
        if card is not None and kind == "charge.success":
            if activate_gift_card_if_valid(card, payload):
                db.session.commit()
                from app.notifications.events import notify_gift_card_delivery

                notify_gift_card_delivery(card)
            else:
                db.session.commit()
            return ok({"handled": True})
        return ok({"handled": False})  # not ours; ack so Paystack stops retrying

    if kind == "charge.success":
        try:
            transitioned = process_verified_payment(payment, payload)
            db.session.commit()
            if transitioned:
                notify_payment_received(payment)
        except PaymentProcessingError:
            db.session.commit()  # FAILED state + audit persisted; ack anyway
    elif kind == "charge.failed":
        if payment.status == PaymentStatus.PENDING:
            payment.status = PaymentStatus.FAILED
            payment.reason = payload.get("gateway_response") or "charge.failed"
            audit(org.id, "PAYMENT_FAILED", payment=payment, booking=payment.booking,
                  new={"via": "webhook"})
            db.session.commit()

    return ok({"handled": True})


# --- admin ------------------------------------------------------------------------

@bp.get("")
@require_permission("payments.view")
def list_payments():
    require_tenant()
    rows = db.session.execute(
        db.select(Payment).order_by(Payment.created_at.desc()).limit(200)
    ).scalars().all()
    return ok([serialize_payment(p) for p in rows])


@bp.post("/manual")
@require_permission("payments.view")
def record_manual_payment():
    org = require_tenant()
    data = parse_body(ManualPaymentInput)
    booking = get_or_404(Booking, data.booking_id, label="Booking")
    method = get_or_404(ManualPaymentMethod, data.manual_method_id, label="Payment method")
    if not method.is_active:
        raise ApiError("This payment method is inactive", status=422, code="METHOD_INACTIVE")

    outstanding = _outstanding(booking)
    if data.amount > outstanding:
        raise ApiError(
            f"Amount exceeds outstanding balance ({outstanding:.2f})",
            status=422, code="OVERPAYMENT",
        )

    payment = Payment(
        organization_id=org.id,
        booking=booking,  # via relationship so booking.payments sees it pre-commit
        provider=PaymentProvider.MANUAL,
        provider_ref=_generate_payment_ref(org.id),
        amount=data.amount,
        currency="GHS",
        status=PaymentStatus.PAID,
        manual_method_id=method.id,
        reason=data.note,
    )
    db.session.add(payment)
    recompute_booking_payment_status(booking)
    issue_invoice(payment)
    audit(org.id, "MANUAL_PAYMENT_RECORDED", booking=booking,
          new={"amount": str(data.amount), "method": method.name})
    db.session.commit()
    notify_payment_received(payment)
    return ok(serialize_payment(payment), status=201)


@bp.post("/<uuid:payment_id>/refund")
@require_permission("payments.view")
def refund_payment(payment_id):
    org = require_tenant()
    payment = get_or_404(Payment, payment_id, label="Payment")
    data = parse_body(RefundInput)

    if payment.provider == PaymentProvider.PAYSTACK:
        resp = paystack.initiate_refund(
            org,
            transaction_reference=payment.provider_ref,
            merchant_note=data.reason,
        )
        if not resp.get("status"):
            raise ApiError("Gateway refused the refund", status=502, code="GATEWAY_ERROR")

    try:
        apply_refund(payment, reason=data.reason)
        db.session.commit()
    except PaymentProcessingError as e:
        raise ApiError(e.message, status=422, code=e.code)
    return ok(serialize_payment(payment))


# --- manual payment methods ---------------------------------------------------------

@bp.get("/manual-methods")
@require_permission("payments.view")
def list_manual_methods():
    require_tenant()
    rows = db.session.execute(
        db.select(ManualPaymentMethod).order_by(ManualPaymentMethod.sort_order)
    ).scalars().all()
    return ok([
        {
            "id": str(m.id), "name": m.name,
            "isActive": m.is_active, "sortOrder": m.sort_order,
        }
        for m in rows
    ])


@bp.post("/manual-methods")
@require_permission("payments.view")
def create_manual_method():
    org = require_tenant()
    data = parse_body(ManualMethodInput)
    if db.session.execute(
        db.select(ManualPaymentMethod).filter_by(name=data.name)
    ).scalar_one_or_none():
        raise ApiError("A method with this name already exists", status=409, code="DUPLICATE")
    row = ManualPaymentMethod(
        organization_id=org.id, name=data.name,
        is_active=data.is_active, sort_order=data.sort_order,
    )
    db.session.add(row)
    db.session.commit()
    return ok({"id": str(row.id), "name": row.name}, status=201)


@bp.put("/manual-methods/<uuid:method_id>")
@require_permission("payments.view")
def update_manual_method(method_id):
    row = get_or_404(ManualPaymentMethod, method_id, label="Payment method")
    data = parse_body(ManualMethodInput)
    row.name = data.name
    row.is_active = data.is_active
    row.sort_order = data.sort_order
    db.session.commit()
    return ok({"id": str(row.id), "name": row.name, "isActive": row.is_active})


@bp.delete("/manual-methods/<uuid:method_id>")
@require_permission("payments.view")
def delete_manual_method(method_id):
    row = get_or_404(ManualPaymentMethod, method_id, label="Payment method")
    db.session.delete(row)
    db.session.commit()
    return ok(None)
