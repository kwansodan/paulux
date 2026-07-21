"""High-level notification triggers.

Each function takes domain objects, renders the right template, and dispatches
email/SMS via Celery tasks (eager in dev/test). Handlers never raise into the
request path — a notification failure must not fail the booking/payment.
"""
from __future__ import annotations

import structlog

from app.notifications.render import render_email
from app.tasks.notify import send_email_task, send_sms_task
from app.tenancy import current_org

log = structlog.get_logger()


def _org_name() -> str:
    org = current_org()
    return org.name if org else "Paulux"


def _money(v) -> str:
    return f"{v:.2f}" if v is not None else "0.00"


def notify_booking_created(booking) -> None:
    try:
        services = [
            {"name": i.service.name if i.service else "Service",
             "price": _money(i.price_at_booking), "quantity": i.quantity}
            for i in booking.services
        ]
        html = render_email(
            "booking_confirmation.html",
            org_name=_org_name(),
            client_name=booking.client_name,
            reference=booking.booking_reference,
            date=booking.booking_date,
            time=booking.booking_time,
            services=services,
            total=_money(booking.total),
            deposit=_money(booking.min_deposit_fixed),
        )
        send_email_task.delay(booking.client_email,
                              f"Booking confirmed · {booking.booking_reference}",
                              html, "booking_confirmation")
        send_sms_task.delay(
            booking.client_phone,
            f"{_org_name()}: booking {booking.booking_reference} confirmed for "
            f"{booking.booking_date} {booking.booking_time}.",
            "booking_confirmation",
        )
    except Exception as e:  # pragma: no cover - defensive
        log.error("notify_booking_created_failed", error=str(e))


def notify_booking_status(booking, *, heading: str, message: str) -> None:
    try:
        html = render_email(
            "booking_status.html",
            org_name=_org_name(),
            heading=heading, message=message,
            reference=booking.booking_reference,
            date=booking.booking_date, time=booking.booking_time,
        )
        send_email_task.delay(booking.client_email,
                              f"{heading} · {booking.booking_reference}", html, "booking_status")
        send_sms_task.delay(booking.client_phone,
                            f"{_org_name()}: {message}", "booking_status")
    except Exception as e:  # pragma: no cover
        log.error("notify_booking_status_failed", error=str(e))


def notify_payment_received(payment, *, invoice_number: str | None = None) -> None:
    try:
        booking = payment.booking
        if booking is None:
            return
        html = render_email(
            "payment_receipt.html",
            org_name=_org_name(),
            amount=_money(payment.amount),
            reference=booking.booking_reference,
            invoice_number=invoice_number,
        )
        send_email_task.delay(booking.client_email,
                              f"Payment received · {booking.booking_reference}",
                              html, "payment_receipt")
    except Exception as e:  # pragma: no cover
        log.error("notify_payment_received_failed", error=str(e))


def notify_gift_card_delivery(card) -> None:
    """Deliver an activated gift card to the recipient (or sender if no recipient)."""
    try:
        to = card.recipient_email or card.sender_email
        html = render_email(
            "gift_card.html",
            org_name=_org_name(),
            sender_name=card.sender_name,
            personal_message=card.message,
            code=card.code,
            amount=_money(card.total_amount),
        )
        send_email_task.delay(to, "You've received a Paulux gift card", html, "gift_card")
        if card.recipient_phone:
            send_sms_task.delay(
                card.recipient_phone,
                f"{_org_name()}: you've received a gift card! Code {card.code}, "
                f"GHS {_money(card.total_amount)}.",
                "gift_card",
            )
    except Exception as e:  # pragma: no cover
        log.error("notify_gift_card_failed", error=str(e))


def notify_low_stock(product, admin_emails: list[str]) -> None:
    try:
        html = render_email(
            "low_stock.html",
            org_name=_org_name(),
            product_name=product.name,
            stock=product.stock_quantity,
        )
        for email in admin_emails:
            send_email_task.delay(email, f"Low stock · {product.name}", html, "low_stock")
    except Exception as e:  # pragma: no cover
        log.error("notify_low_stock_failed", error=str(e))
