"""Per-tenant Google Calendar sync.

Opt-in: a tenant enables sync by storing a service-account JSON and a target
calendar id in system settings (keys ``google_calendar_json`` and
``google_calendar_id``). When unset, every function is a safe no-op — most
tenants won't use it, and it must never break a booking.

The Google client is imported lazily so the dependency is only needed when a
tenant actually enables the feature.
"""
from __future__ import annotations

import json

import structlog

from app.extensions import db
from app.models.schedule import SystemSetting

log = structlog.get_logger()


def _setting(org_id, key: str) -> str | None:
    row = db.session.execute(
        db.select(SystemSetting)
        .filter_by(organization_id=org_id, key=key)
        .execution_options(skip_tenant_filter=True)
    ).scalar_one_or_none()
    return row.value if row else None


def calendar_enabled(org_id) -> bool:
    return bool(_setting(org_id, "google_calendar_json") and _setting(org_id, "google_calendar_id"))


def _service(org_id):
    from google.oauth2 import service_account  # lazy
    from googleapiclient.discovery import build

    creds_json = _setting(org_id, "google_calendar_json")
    creds = service_account.Credentials.from_service_account_info(
        json.loads(creds_json),
        scopes=["https://www.googleapis.com/auth/calendar"],
    )
    return build("calendar", "v3", credentials=creds, cache_discovery=False)


def upsert_booking_event(booking) -> str | None:
    """Create/update a calendar event for a booking. Returns the event id, or
    None when calendar isn't configured (or on any failure — never raises)."""
    org_id = booking.organization_id
    if not calendar_enabled(org_id):
        return None
    try:
        from datetime import datetime, timedelta

        service = _service(org_id)
        cal_id = _setting(org_id, "google_calendar_id")
        start = datetime.strptime(f"{booking.booking_date} {booking.booking_time}", "%Y-%m-%d %H:%M")
        duration = sum((i.duration_at_booking or 30) * i.quantity for i in booking.services) or 60
        body = {
            "summary": f"{booking.client_name} · {booking.booking_reference}",
            "description": f"Paulux booking {booking.booking_reference}",
            "start": {"dateTime": start.isoformat(), "timeZone": "Africa/Accra"},
            "end": {"dateTime": (start + timedelta(minutes=duration)).isoformat(), "timeZone": "Africa/Accra"},
        }
        if booking.google_event_id:
            ev = service.events().update(
                calendarId=cal_id, eventId=booking.google_event_id, body=body
            ).execute()
        else:
            ev = service.events().insert(calendarId=cal_id, body=body).execute()
        return ev.get("id")
    except Exception as e:  # pragma: no cover - network path
        log.error("calendar_upsert_failed", booking=str(booking.id), error=str(e))
        return None
