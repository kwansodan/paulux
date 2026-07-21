"""Availability rules for public (customer-scheduled) bookings.

Enforced only when the tenant has configured the relevant constraint:
- date must not be in the past,
- date must not be blocked (full-day, or overlapping a partial-day block),
- the weekday must be open and the time inside opening hours (when hours are
  configured for that weekday),
- concurrent non-cancelled bookings at the same date+time must stay under the
  weekday's ``max_concurrent_bookings``.

Admin-created bookings bypass these checks (front-desk judgment), matching the
old app's behaviour.
"""
from __future__ import annotations

from datetime import date, datetime

from app.errors import ApiError
from app.extensions import db
from app.models.booking import Booking, BookingStatus
from app.models.schedule import BlockedDate, BusinessHour


def _fail(message: str) -> None:
    raise ApiError(message, status=422, code="SLOT_UNAVAILABLE")


def check_availability(org_id, booking_date: str, booking_time: str) -> None:
    day = datetime.strptime(booking_date, "%Y-%m-%d").date()

    if day < date.today():
        _fail("Bookings cannot be made for past dates")

    # Blocked dates
    block = db.session.execute(
        db.select(BlockedDate).filter_by(date=day)
    ).scalar_one_or_none()
    if block is not None:
        if block.start_time is None or block.end_time is None:
            _fail(block.reason or "This date is unavailable")
        elif block.start_time <= booking_time < block.end_time:
            _fail(block.reason or "This time is unavailable")

    # Business hours ("HH:mm" strings compare lexicographically)
    weekday = (day.weekday() + 1) % 7  # Python Mon=0 -> our Sun=0 convention
    hours = db.session.execute(
        db.select(BusinessHour).filter_by(day_of_week=weekday)
    ).scalar_one_or_none()
    if hours is not None:
        if not hours.is_open:
            _fail("We are closed on this day")
        if not (hours.start_time <= booking_time < hours.end_time):
            _fail(f"Bookings are accepted between {hours.start_time} and {hours.end_time}")

        # Capacity at this exact slot
        concurrent = db.session.execute(
            db.select(db.func.count(Booking.id)).where(
                Booking.organization_id == org_id,
                Booking.booking_date == booking_date,
                Booking.booking_time == booking_time,
                Booking.status != BookingStatus.CANCELLED,
            )
        ).scalar_one()
        if concurrent >= hours.max_concurrent_bookings:
            _fail("This time slot is fully booked")
