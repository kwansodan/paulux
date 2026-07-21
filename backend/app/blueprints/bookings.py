"""Booking routes.

Public: customers create PENDING bookings (no auth — but validated, tenant-
scoped, and price-snapshotted server-side; the client never supplies prices).
Admin: list/detail/create walk-ins, status transitions, stylist assignment.
All writes happen in one transaction, including promo redemption which locks
the promo row to make used_count increments race-free.
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
from app.models.booking import (
    Booking,
    BookingProductItem,
    BookingServiceItem,
    BookingStatus,
    BookingType,
    PaymentStatus,
)
from app.models.catalog import Service
from app.models.inventory import Product
from app.models.marketing import PromoCode
from app.notifications.events import notify_booking_created, notify_booking_status
from app.tasks.notify import sync_booking_calendar_task
from app.schemas.booking import (
    BookingAssignInput,
    BookingAssignServicesInput,
    BookingCreateInput,
    BookingRescheduleInput,
    BookingStatusInput,
    BookingTopUpInput,
)

bp = Blueprint("bookings", __name__, url_prefix="/api/bookings")

REFERENCE_ALPHABET = string.ascii_uppercase + string.digits

# Legal transitions for admin status updates.
ALLOWED_TRANSITIONS: dict[BookingStatus, set[BookingStatus]] = {
    BookingStatus.PENDING: {BookingStatus.CONFIRMED, BookingStatus.CANCELLED},
    BookingStatus.CONFIRMED: {BookingStatus.COMPLETED, BookingStatus.CANCELLED},
    BookingStatus.CANCELLED: set(),
    BookingStatus.COMPLETED: set(),
}


def _generate_reference(org_id) -> str:
    for _ in range(10):
        ref = "BK-" + "".join(secrets.choice(REFERENCE_ALPHABET) for _ in range(8))
        exists = db.session.execute(
            db.select(Booking.id)
            .filter_by(organization_id=org_id, booking_reference=ref)
            .execution_options(skip_tenant_filter=True)
        ).scalar_one_or_none()
        if exists is None:
            return ref
    raise ApiError("Could not generate booking reference", status=500, code="INTERNAL")


def serialize_booking(b: Booking) -> dict:
    return {
        "id": str(b.id),
        "bookingReference": b.booking_reference,
        "clientName": b.client_name,
        "clientEmail": b.client_email,
        "clientPhone": b.client_phone,
        "bookingDate": b.booking_date,
        "bookingTime": b.booking_time,
        "status": b.status.value,
        "paymentStatus": b.payment_status.value,
        "bookingType": b.booking_type.value,
        "cancelReason": b.cancel_reason,
        "termsAcceptedAt": b.terms_accepted_at.isoformat() if b.terms_accepted_at else None,
        "promoCode": b.promo_code.code if b.promo_code else None,
        "discountAmount": money(b.discount_amount),
        "subtotal": money(b.subtotal),
        "total": money(b.total),
        "minDepositFixed": money(b.min_deposit_fixed),
        "assignedToId": str(b.assigned_to_id) if b.assigned_to_id else None,
        "assignedTo": b.assigned_to.username if b.assigned_to else None,
        "services": [
            {
                "serviceId": str(i.service_id),
                "name": i.service.name if i.service else None,
                "priceAtBooking": money(i.price_at_booking),
                "durationAtBooking": i.duration_at_booking,
                "quantity": i.quantity,
                "assignedToId": str(i.assigned_to_id) if i.assigned_to_id else None,
            }
            for i in b.services
        ],
        "products": [
            {
                "productId": str(i.product_id),
                "name": i.product.name if i.product else None,
                "priceAtBooking": money(i.price_at_booking),
                "quantity": i.quantity,
            }
            for i in b.products
        ],
        "createdAt": b.created_at.isoformat(),
    }


def _build_booking(data: BookingCreateInput, *, org, created_by=None) -> Booking:
    """Assemble a Booking with snapshotted line items and promo, uncommitted."""
    from datetime import datetime, timezone

    booking = Booking(
        organization_id=org.id,
        booking_reference=_generate_reference(org.id),
        client_name=data.client_name,
        client_email=data.client_email,
        client_phone=data.client_phone,
        booking_date=data.booking_date,
        booking_time=data.booking_time,
        booking_type=BookingType(data.booking_type),
        status=BookingStatus.PENDING,
        payment_status=PaymentStatus.PENDING,
        created_by_id=created_by.id if created_by else None,
        terms_accepted_at=datetime.now(timezone.utc) if data.terms_accepted else None,
    )

    deposit = Decimal("0")
    seen_services: set = set()
    for line in data.services:
        if line.service_id in seen_services:
            raise ApiError("Duplicate service in booking", status=400, code="INVALID_INPUT")
        seen_services.add(line.service_id)
        service = get_or_404(Service, line.service_id, label="Service")
        if not service.is_active:
            raise ApiError(f"Service '{service.name}' is not available", status=422, code="SERVICE_INACTIVE")
        booking.services.append(
            BookingServiceItem(
                service_id=service.id,
                price_at_booking=service.price,
                duration_at_booking=service.duration_minutes,
                quantity=line.quantity,
            )
        )
        deposit += service.min_deposit_fixed * line.quantity

    seen_products: set = set()
    for line in data.products:
        if line.product_id in seen_products:
            raise ApiError("Duplicate product in booking", status=400, code="INVALID_INPUT")
        seen_products.add(line.product_id)
        product = get_or_404(Product, line.product_id, label="Product")
        if not product.is_active:
            raise ApiError(f"Product '{product.name}' is not available", status=422, code="PRODUCT_INACTIVE")
        booking.products.append(
            BookingProductItem(
                product_id=product.id,
                price_at_booking=product.price,
                quantity=line.quantity,
            )
        )

    booking.min_deposit_fixed = deposit

    if data.promo_code:
        # Lock the promo row: check + increment must be atomic under load.
        promo = db.session.execute(
            db.select(PromoCode)
            .filter_by(code=data.promo_code.strip().upper())
            .with_for_update()
        ).scalar_one_or_none()
        if promo is None or promo.organization_id != org.id:
            raise ApiError("Invalid promo code", status=422, code="PROMO_INVALID")
        reason = promo.usable_for(booking.subtotal)
        if reason:
            raise ApiError(reason, status=422, code="PROMO_NOT_APPLICABLE")
        booking.promo_code_id = promo.id
        booking.discount_amount = promo.discount_for(booking.subtotal)
        promo.used_count += 1

    return booking


@bp.get("/calendar")
@require_permission("bookings.view")
def bookings_calendar():
    """Per-day non-cancelled booking counts for a month (YYYY-MM), for the
    admin calendar view. Tenant-scoped via the auto filter."""
    from flask import request

    require_tenant()
    month = request.args.get("month", "")
    if not month or len(month) != 7:
        raise ApiError("A month (YYYY-MM) is required", status=400, code="INVALID_INPUT")
    # booking_date is stored as "YYYY-MM-DD" text, so a prefix match scopes the month.
    rows = db.session.execute(
        db.select(Booking.booking_date, db.func.count(Booking.id))
        .where(
            Booking.booking_date.like(f"{month}-%"),
            Booking.status != BookingStatus.CANCELLED,
        )
        .group_by(Booking.booking_date)
    ).all()
    return ok([{"date": d, "count": c} for d, c in rows])


@bp.get("/availability")
def get_availability():
    """Public: list bookable HH:mm slots for a date, honouring business hours,
    blocked dates, and per-slot capacity. Used by the customer booking picker.
    """
    from datetime import date as date_type, datetime, timedelta

    from flask import request

    from app.models.schedule import BlockedDate, BusinessHour

    org = require_tenant()
    date_str = request.args.get("date")
    if not date_str:
        raise ApiError("A date is required", status=400, code="INVALID_INPUT")
    try:
        day = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise ApiError("Date must be YYYY-MM-DD", status=400, code="INVALID_INPUT")

    if day < date_type.today():
        return ok({"date": date_str, "slots": []})

    weekday = (day.weekday() + 1) % 7
    hours = db.session.execute(
        db.select(BusinessHour).filter_by(day_of_week=weekday)
    ).scalar_one_or_none()
    # No hours configured -> unconstrained; return a default grid.
    if hours is not None and not hours.is_open:
        return ok({"date": date_str, "slots": []})

    block = db.session.execute(
        db.select(BlockedDate).filter_by(date=day)
    ).scalar_one_or_none()
    if block is not None and (block.start_time is None or block.end_time is None):
        return ok({"date": date_str, "slots": []})

    start = hours.start_time if hours else "09:00"
    end = hours.end_time if hours else "18:00"
    capacity = hours.max_concurrent_bookings if hours else 9999

    # Count non-cancelled bookings per slot for this date.
    rows = db.session.execute(
        db.select(Booking.booking_time, db.func.count(Booking.id)).where(
            Booking.booking_date == date_str,
            Booking.status != BookingStatus.CANCELLED,
        ).group_by(Booking.booking_time)
    ).all()
    taken = {t: c for t, c in rows}

    slots = []
    t = datetime.strptime(start, "%H:%M")
    end_t = datetime.strptime(end, "%H:%M")
    while t < end_t:
        slot = t.strftime("%H:%M")
        blocked_partial = (
            block is not None
            and block.start_time is not None
            and block.start_time <= slot < block.end_time
        )
        if not blocked_partial and taken.get(slot, 0) < capacity:
            slots.append(slot)
        t += timedelta(minutes=30)

    return ok({"date": date_str, "slots": slots})


@bp.post("/public")
@limiter.limit("20 per hour")
def create_public_booking():
    """Customer-facing booking creation. Rate-limited; always PENDING."""
    from app.services.availability import check_availability

    org = require_tenant()
    data = parse_body(BookingCreateInput)
    # Validate request contents first (unknown/cross-tenant service -> 404),
    # then check slot availability (-> 422). Content errors take precedence.
    booking = _build_booking(data, org=org)
    check_availability(org.id, data.booking_date, data.booking_time)
    db.session.add(booking)
    db.session.commit()
    notify_booking_created(booking)
    sync_booking_calendar_task.delay(str(booking.id))
    return ok(serialize_booking(booking), status=201)


def _public_booking_view(b: Booking) -> dict:
    """Customer-safe booking view — omits internal fields (assignment, audit)."""
    return {
        "bookingReference": b.booking_reference,
        "clientName": b.client_name,
        "bookingDate": b.booking_date,
        "bookingTime": b.booking_time,
        "status": b.status.value,
        "paymentStatus": b.payment_status.value,
        "subtotal": money(b.subtotal),
        "discountAmount": money(b.discount_amount),
        "total": money(b.total),
        "minDepositFixed": money(b.min_deposit_fixed),
        "services": [
            {"name": i.service.name if i.service else None,
             "priceAtBooking": money(i.price_at_booking), "quantity": i.quantity}
            for i in b.services
        ],
    }


def _find_by_reference(reference: str) -> Booking:
    booking = db.session.execute(
        db.select(Booking).filter_by(booking_reference=reference.strip().upper())
    ).scalar_one_or_none()
    if booking is None:
        raise ApiError("Booking not found", status=404, code="NOT_FOUND")
    return booking


@bp.get("/public/<reference>")
def get_public_booking(reference: str):
    """Customer lookup by reference (the reference acts as a capability token)."""
    require_tenant()
    return ok(_public_booking_view(_find_by_reference(reference)))


@bp.post("/public/<reference>/reschedule")
@limiter.limit("10 per hour")
def reschedule_public_booking(reference: str):
    from app.services.availability import check_availability

    org = require_tenant()
    booking = _find_by_reference(reference)
    if booking.status in (BookingStatus.CANCELLED, BookingStatus.COMPLETED):
        raise ApiError(
            f"Cannot reschedule a {booking.status.value} booking",
            status=422, code="INVALID_STATE",
        )
    data = parse_body(BookingRescheduleInput)
    check_availability(org.id, data.booking_date, data.booking_time)
    booking.booking_date = data.booking_date
    booking.booking_time = data.booking_time
    db.session.commit()
    return ok(_public_booking_view(booking))


@bp.post("")
@require_permission("bookings.view")
def create_booking_admin():
    org = require_tenant()
    user = load_current_user()
    data = parse_body(BookingCreateInput)
    booking = _build_booking(data, org=org, created_by=user)
    if data.booking_type == "WALKIN":
        booking.status = BookingStatus.CONFIRMED
    db.session.add(booking)
    db.session.commit()
    notify_booking_created(booking)
    sync_booking_calendar_task.delay(str(booking.id))
    return ok(serialize_booking(booking), status=201)


@bp.get("")
@require_permission("bookings.view")
def list_bookings():
    from flask import request

    require_tenant()
    stmt = db.select(Booking).order_by(Booking.created_at.desc())
    if date := request.args.get("date"):
        stmt = stmt.filter_by(booking_date=date)
    if status := request.args.get("status"):
        try:
            stmt = stmt.filter_by(status=BookingStatus(status))
        except ValueError:
            raise ApiError("Invalid status filter", status=400, code="INVALID_INPUT")
    if pstatus := request.args.get("paymentStatus"):
        try:
            stmt = stmt.filter_by(payment_status=PaymentStatus(pstatus))
        except ValueError:
            raise ApiError("Invalid paymentStatus filter", status=400, code="INVALID_INPUT")
    if search := request.args.get("search"):
        like = f"%{search}%"
        stmt = stmt.where(
            db.or_(
                Booking.client_name.ilike(like),
                Booking.client_email.ilike(like),
                Booking.client_phone.ilike(like),
                Booking.booking_reference.ilike(like),
            )
        )
    rows = db.session.execute(stmt.limit(200)).scalars().all()
    return ok([serialize_booking(b) for b in rows])


@bp.get("/<uuid:booking_id>")
@require_permission("bookings.view")
def get_booking(booking_id):
    row = get_or_404(Booking, booking_id, label="Booking")
    return ok(serialize_booking(row))


@bp.patch("/<uuid:booking_id>/status")
@require_permission("bookings.view")
def update_booking_status(booking_id):
    row = get_or_404(Booking, booking_id, label="Booking")
    data = parse_body(BookingStatusInput)
    target = BookingStatus(data.status)
    if target == row.status:
        return ok(serialize_booking(row))
    if target not in ALLOWED_TRANSITIONS[row.status]:
        raise ApiError(
            f"Cannot move a {row.status.value} booking to {target.value}",
            status=422, code="INVALID_TRANSITION",
        )
    row.status = target
    if target == BookingStatus.CANCELLED:
        row.cancel_reason = data.cancel_reason
        # Refund of captured payments is handled by the payments domain,
        # which requires auth + explicit action — never automatic here.
    db.session.commit()
    if target == BookingStatus.CANCELLED:
        notify_booking_status(row, heading="Booking cancelled",
                              message=f"Your booking {row.booking_reference} has been cancelled.")
    elif target == BookingStatus.CONFIRMED:
        notify_booking_status(row, heading="Booking confirmed",
                              message=f"Your booking {row.booking_reference} is confirmed.")
    return ok(serialize_booking(row))


@bp.post("/<uuid:booking_id>/assign")
@require_permission("bookings.view")
def assign_booking(booking_id):
    from app.models.user import User

    row = get_or_404(Booking, booking_id, label="Booking")
    data = parse_body(BookingAssignInput)
    if data.assigned_to_id is not None:
        staff = get_or_404(User, data.assigned_to_id, label="Staff member")
        row.assigned_to_id = staff.id
    else:
        row.assigned_to_id = None
    db.session.commit()
    return ok(serialize_booking(row))


@bp.post("/<uuid:booking_id>/assign-services")
@require_permission("bookings.view")
def assign_services(booking_id):
    """Assign a stylist to each service line (per-service assignment)."""
    from app.models.user import User

    row = get_or_404(Booking, booking_id, label="Booking")
    data = parse_body(BookingAssignServicesInput)
    lines_by_service = {item.service_id: item for item in row.services}
    for a in data.assignments:
        item = lines_by_service.get(a.service_id)
        if item is None:
            raise ApiError("Service is not part of this booking", status=422, code="NOT_IN_BOOKING")
        if a.assigned_to_id is not None:
            staff = get_or_404(User, a.assigned_to_id, label="Staff member")
            item.assigned_to_id = staff.id
        else:
            item.assigned_to_id = None
    db.session.commit()
    return ok(serialize_booking(row))


@bp.post("/<uuid:booking_id>/reschedule")
@require_permission("bookings.view")
def reschedule_booking(booking_id):
    row = get_or_404(Booking, booking_id, label="Booking")
    if row.status in (BookingStatus.CANCELLED, BookingStatus.COMPLETED):
        raise ApiError(
            f"Cannot reschedule a {row.status.value} booking",
            status=422, code="INVALID_STATE",
        )
    data = parse_body(BookingRescheduleInput)
    row.booking_date = data.booking_date
    row.booking_time = data.booking_time
    db.session.commit()
    notify_booking_status(
        row, heading="Booking rescheduled",
        message=f"Your booking {row.booking_reference} is now on "
                f"{row.booking_date} at {row.booking_time}.",
    )
    sync_booking_calendar_task.delay(str(row.id))
    return ok(serialize_booking(row))


@bp.post("/<uuid:booking_id>/top-up")
@require_permission("bookings.view")
def top_up_booking(booking_id):
    """Add services/products to an existing booking (front-desk up-sell)."""
    row = get_or_404(Booking, booking_id, label="Booking")
    if row.status in (BookingStatus.CANCELLED, BookingStatus.COMPLETED):
        raise ApiError(
            f"Cannot modify a {row.status.value} booking", status=422, code="INVALID_STATE"
        )
    data = parse_body(BookingTopUpInput)
    if not data.services and not data.products:
        raise ApiError("Nothing to add", status=400, code="INVALID_INPUT")

    existing_services = {i.service_id for i in row.services}
    for line in data.services:
        if line.service_id in existing_services:
            raise ApiError("Service already on this booking", status=422, code="DUPLICATE")
        service = get_or_404(Service, line.service_id, label="Service")
        if not service.is_active:
            raise ApiError(f"Service '{service.name}' is not available", status=422, code="SERVICE_INACTIVE")
        row.services.append(
            BookingServiceItem(
                service_id=service.id,
                price_at_booking=service.price,
                duration_at_booking=service.duration_minutes,
                quantity=line.quantity,
            )
        )

    existing_products = {i.product_id for i in row.products}
    for line in data.products:
        if line.product_id in existing_products:
            raise ApiError("Product already on this booking", status=422, code="DUPLICATE")
        product = get_or_404(Product, line.product_id, label="Product")
        if not product.is_active:
            raise ApiError(f"Product '{product.name}' is not available", status=422, code="PRODUCT_INACTIVE")
        row.products.append(
            BookingProductItem(
                product_id=product.id,
                price_at_booking=product.price,
                quantity=line.quantity,
            )
        )

    db.session.commit()
    # Payment status recompute isn't needed: total went up, remaining is derived.
    return ok(serialize_booking(row))
