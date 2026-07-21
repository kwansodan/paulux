"""Money-state transitions. Small, pure-ish functions so the critical rules
(amount validation, idempotency, booking status recompute) are unit-testable
without HTTP or Paystack.

All functions mutate ORM objects inside the caller's transaction; callers
commit. Every transition writes a PaymentAuditLog row in the same transaction.
"""
from __future__ import annotations

from decimal import Decimal

import structlog

from app.extensions import db
from app.models.booking import Booking, PaymentStatus
from app.models.payment import Payment, PaymentAuditLog

log = structlog.get_logger()


class PaymentProcessingError(Exception):
    """Raised when a verified gateway response must NOT mark a payment paid."""

    def __init__(self, message: str, code: str = "PAYMENT_INVALID"):
        super().__init__(message)
        self.message = message
        self.code = code


def audit(
    org_id,
    action: str,
    *,
    booking: Booking | None = None,
    payment: Payment | None = None,
    old: dict | None = None,
    new: dict | None = None,
    meta: dict | None = None,
) -> None:
    db.session.add(
        PaymentAuditLog(
            organization_id=org_id,
            booking_id=booking.id if booking else None,
            payment_id=payment.id if payment else None,
            action=action,
            old_value=old,
            new_value=new,
            meta=meta,
        )
    )


def paid_total(booking: Booking) -> Decimal:
    return sum(
        (p.amount for p in booking.payments if p.status == PaymentStatus.PAID),
        Decimal("0"),
    )


def recompute_booking_payment_status(booking: Booking) -> None:
    total_paid = paid_total(booking)
    if total_paid <= 0:
        booking.payment_status = PaymentStatus.PENDING
    elif total_paid >= booking.total:
        booking.payment_status = PaymentStatus.PAID
    else:
        booking.payment_status = PaymentStatus.PARTIAL


def process_verified_payment(payment: Payment, verified: dict) -> bool:
    """Apply a gateway-verified charge to a PENDING payment.

    Returns True if the payment transitioned to PAID, False if it was already
    PAID (idempotent re-delivery). Raises PaymentProcessingError on any
    mismatch — the payment is then marked FAILED with the reason recorded.
    """
    if payment.status == PaymentStatus.PAID:
        return False  # duplicate webhook/verify — nothing to do

    gateway_status = verified.get("status")
    if gateway_status != "success":
        payment.status = PaymentStatus.FAILED
        payment.reason = f"Gateway status: {gateway_status}"
        payment.raw_payload = verified
        audit(payment.organization_id, "PAYMENT_FAILED", payment=payment,
              booking=payment.booking, new={"gatewayStatus": gateway_status})
        raise PaymentProcessingError("Payment was not successful", "PAYMENT_NOT_SUCCESSFUL")

    # --- Amount validation: the gateway amount must exactly match what we
    # expected for this payment. Anything else is rejected loudly.
    expected_pesewas = int(payment.amount * 100)
    got_pesewas = int(verified.get("amount") or -1)
    got_currency = verified.get("currency")
    if got_pesewas != expected_pesewas or got_currency != payment.currency:
        payment.status = PaymentStatus.FAILED
        payment.reason = (
            f"Amount mismatch: expected {expected_pesewas} {payment.currency}, "
            f"got {got_pesewas} {got_currency}"
        )
        payment.raw_payload = verified
        audit(payment.organization_id, "PAYMENT_AMOUNT_MISMATCH", payment=payment,
              booking=payment.booking,
              new={"expected": expected_pesewas, "got": got_pesewas, "currency": got_currency})
        log.error("payment_amount_mismatch", payment_id=str(payment.id),
                  expected=expected_pesewas, got=got_pesewas)
        raise PaymentProcessingError("Payment amount mismatch", "AMOUNT_MISMATCH")

    old_status = payment.status.value
    payment.status = PaymentStatus.PAID
    payment.raw_payload = verified
    recompute_booking_payment_status(payment.booking)
    issue_invoice(payment)
    audit(payment.organization_id, "PAYMENT_RECEIVED", payment=payment,
          booking=payment.booking,
          old={"status": old_status},
          new={"status": "PAID", "amount": str(payment.amount)})
    return True


def issue_invoice(payment: Payment, *, kind: str = "PAYMENT") -> None:
    """Record a numbered invoice for a captured (or refunded) payment."""
    from app.models.invoice import Invoice, next_invoice_number

    db.session.add(
        Invoice(
            organization_id=payment.organization_id,
            invoice_number=next_invoice_number(payment.organization_id),
            booking_id=payment.booking_id,
            payment_id=payment.id,
            amount=payment.amount,
            currency=payment.currency,
            kind=kind,
        )
    )


def apply_refund(payment: Payment, *, reason: str | None, meta: dict | None = None) -> None:
    """Mark a PAID payment refunded and recompute the booking status."""
    if payment.status != PaymentStatus.PAID:
        raise PaymentProcessingError("Only paid payments can be refunded", "NOT_REFUNDABLE")
    payment.status = PaymentStatus.REFUNDED
    payment.reason = reason
    recompute_booking_payment_status(payment.booking)
    issue_invoice(payment, kind="REFUND")
    audit(payment.organization_id, "PAYMENT_REFUNDED", payment=payment,
          booking=payment.booking, new={"reason": reason}, meta=meta)
