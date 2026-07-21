"""Business hours + blocked dates. Public reads (the booking flow needs them);
settings-gated writes — the old app left business-hours mutations open.
"""
from __future__ import annotations

from datetime import datetime

from flask import Blueprint

from app.auth.decorators import require_permission
from app.blueprints.helpers import get_or_404, ok, parse_body, require_tenant
from app.errors import ApiError
from app.extensions import db
from app.models.schedule import BlockedDate, BusinessHour
from app.schemas.gift_card import BlockedDateInput, BusinessHoursInput

bp = Blueprint("schedule", __name__, url_prefix="/api")


@bp.get("/business-hours")
def list_business_hours():
    require_tenant()
    rows = db.session.execute(
        db.select(BusinessHour).order_by(BusinessHour.day_of_week)
    ).scalars().all()
    return ok([
        {
            "dayOfWeek": h.day_of_week,
            "startTime": h.start_time,
            "endTime": h.end_time,
            "isOpen": h.is_open,
            "maxConcurrentBookings": h.max_concurrent_bookings,
        }
        for h in rows
    ])


@bp.put("/business-hours")
@require_permission("settings.view")
def upsert_business_hours():
    """Bulk upsert the week's hours in one transaction."""
    org = require_tenant()
    data = parse_body(BusinessHoursInput)
    seen = set()
    for line in data.hours:
        if line.day_of_week in seen:
            raise ApiError("Duplicate day in payload", status=400, code="INVALID_INPUT")
        seen.add(line.day_of_week)
        row = db.session.execute(
            db.select(BusinessHour).filter_by(day_of_week=line.day_of_week)
        ).scalar_one_or_none()
        if row is None:
            row = BusinessHour(organization_id=org.id, day_of_week=line.day_of_week,
                               start_time="09:00", end_time="17:00")
            db.session.add(row)
        row.start_time = line.start_time
        row.end_time = line.end_time
        row.is_open = line.is_open
        row.max_concurrent_bookings = line.max_concurrent_bookings
    db.session.commit()
    return list_business_hours()


@bp.get("/blocked-dates")
def list_blocked_dates():
    require_tenant()
    rows = db.session.execute(
        db.select(BlockedDate).order_by(BlockedDate.date)
    ).scalars().all()
    return ok([
        {
            "id": str(b.id),
            "date": b.date.isoformat(),
            "reason": b.reason,
            "startTime": b.start_time,
            "endTime": b.end_time,
        }
        for b in rows
    ])


@bp.post("/blocked-dates")
@require_permission("settings.view")
def create_blocked_date():
    org = require_tenant()
    data = parse_body(BlockedDateInput)
    date_val = datetime.strptime(data.date, "%Y-%m-%d").date()
    if db.session.execute(
        db.select(BlockedDate).filter_by(date=date_val)
    ).scalar_one_or_none():
        raise ApiError("This date is already blocked", status=409, code="DUPLICATE")
    row = BlockedDate(
        organization_id=org.id, date=date_val, reason=data.reason,
        start_time=data.start_time, end_time=data.end_time,
    )
    db.session.add(row)
    db.session.commit()
    return ok({"id": str(row.id), "date": row.date.isoformat()}, status=201)


@bp.delete("/blocked-dates/<uuid:blocked_id>")
@require_permission("settings.view")
def delete_blocked_date(blocked_id):
    row = get_or_404(BlockedDate, blocked_id, label="Blocked date")
    db.session.delete(row)
    db.session.commit()
    return ok(None)
