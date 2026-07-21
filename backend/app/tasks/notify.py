"""Background tasks that actually deliver notifications.

They take only serializable primitives (already-rendered subject/html/body), so
they enqueue cleanly and carry no ORM state. Rendering happens in
``app.notifications.events`` before dispatch.
"""
from __future__ import annotations

from celery import shared_task

from app.notifications import providers


@shared_task(name="notify.send_email")
def send_email_task(to: str, subject: str, html: str, kind: str = "") -> None:
    providers.send_email(to, subject, html, kind=kind)


@shared_task(name="notify.send_sms")
def send_sms_task(to: str, body: str, kind: str = "") -> None:
    providers.send_sms(to, body, kind=kind)


@shared_task(name="calendar.sync_booking")
def sync_booking_calendar_task(booking_id: str) -> None:
    """Reconcile a booking's Google Calendar event (no-op if not configured)."""
    import uuid

    from app.extensions import db
    from app.models.booking import Booking
    from app.services.calendar import upsert_booking_event

    booking = db.session.get(
        Booking, uuid.UUID(booking_id), execution_options={"skip_tenant_filter": True}
    )
    if booking is None:
        return
    event_id = upsert_booking_event(booking)
    if event_id and event_id != booking.google_event_id:
        booking.google_event_id = event_id
        db.session.commit()
