"""Dashboard metrics + invoice listing."""
from __future__ import annotations

from datetime import date
from decimal import Decimal

from flask import Blueprint

from app.auth.decorators import require_permission
from app.blueprints.helpers import money, ok, require_tenant
from app.extensions import db
from app.models.booking import Booking, BookingStatus, PaymentStatus
from app.models.inventory import Product
from app.models.invoice import Invoice
from app.models.payment import Payment

bp = Blueprint("reports", __name__, url_prefix="/api")


@bp.get("/dashboard/metrics")
@require_permission("dashboard.view")
def dashboard_metrics():
    require_tenant()
    today = date.today().isoformat()

    bookings_today = db.session.execute(
        db.select(db.func.count(Booking.id)).where(
            Booking.booking_date == today,
            Booking.status != BookingStatus.CANCELLED,
        )
    ).scalar_one()

    pending_bookings = db.session.execute(
        db.select(db.func.count(Booking.id)).where(
            Booking.status == BookingStatus.PENDING
        )
    ).scalar_one()

    revenue_today = db.session.execute(
        db.select(db.func.coalesce(db.func.sum(Payment.amount), 0)).where(
            Payment.status == PaymentStatus.PAID,
            db.func.date(Payment.created_at) == date.today(),
        )
    ).scalar_one()

    low_stock = db.session.execute(
        db.select(db.func.count(Product.id)).where(
            Product.track_stock.is_(True),
            Product.is_active.is_(True),
            Product.stock_quantity <= Product.low_stock_threshold,
        )
    ).scalar_one()

    return ok({
        "bookingsToday": bookings_today,
        "pendingBookings": pending_bookings,
        "revenueToday": money(Decimal(revenue_today)),
        "lowStockProducts": low_stock,
    })


@bp.get("/reports/summary")
@require_permission("reports.view")
def reports_summary():
    """Revenue over a date range + top services by booking count."""
    from datetime import datetime, timedelta

    from flask import request

    from app.models.booking import BookingServiceItem

    require_tenant()
    to_str = request.args.get("to") or date.today().isoformat()
    from_str = request.args.get("from") or (
        datetime.strptime(to_str, "%Y-%m-%d") - timedelta(days=29)
    ).strftime("%Y-%m-%d")
    from_date = datetime.strptime(from_str, "%Y-%m-%d").date()
    to_date = datetime.strptime(to_str, "%Y-%m-%d").date()

    # Daily paid revenue in the window (by payment date). Compare a date-typed
    # expression to date objects so Postgres doesn't choke on date-vs-text.
    daily = db.session.execute(
        db.select(
            db.func.date(Payment.created_at).label("day"),
            db.func.coalesce(db.func.sum(Payment.amount), 0),
        ).where(
            Payment.status == PaymentStatus.PAID,
            db.func.date(Payment.created_at) >= from_date,
            db.func.date(Payment.created_at) <= to_date,
        ).group_by(db.text("day")).order_by(db.text("day"))
    ).all()

    total_revenue = sum((row[1] for row in daily), Decimal("0"))

    bookings_count = db.session.execute(
        db.select(db.func.count(Booking.id)).where(
            Booking.booking_date >= from_str,
            Booking.booking_date <= to_str,
            Booking.status != BookingStatus.CANCELLED,
        )
    ).scalar_one()

    # Top services by quantity booked in the window.
    top = db.session.execute(
        db.select(
            BookingServiceItem.service_id,
            db.func.sum(BookingServiceItem.quantity),
        )
        .join(Booking, Booking.id == BookingServiceItem.booking_id)
        .where(
            Booking.booking_date >= from_str,
            Booking.booking_date <= to_str,
            Booking.status != BookingStatus.CANCELLED,
        )
        .group_by(BookingServiceItem.service_id)
        .order_by(db.func.sum(BookingServiceItem.quantity).desc())
        .limit(5)
    ).all()

    from app.models.catalog import Service

    top_services = []
    for service_id, qty in top:
        svc = db.session.get(Service, service_id)
        top_services.append({"name": svc.name if svc else "—", "count": int(qty)})

    return ok({
        "from": from_str,
        "to": to_str,
        "totalRevenue": money(total_revenue),
        "bookingsCount": bookings_count,
        "dailyRevenue": [
            {"date": str(row[0]), "amount": money(Decimal(row[1]))} for row in daily
        ],
        "topServices": top_services,
    })


@bp.get("/invoices")
@require_permission("payments.view")
def list_invoices():
    require_tenant()
    rows = db.session.execute(
        db.select(Invoice).order_by(Invoice.created_at.desc()).limit(200)
    ).scalars().all()
    return ok([
        {
            "id": str(i.id),
            "invoiceNumber": i.invoice_number,
            "bookingReference": i.booking.booking_reference if i.booking else None,
            "amount": money(i.amount),
            "currency": i.currency,
            "kind": i.kind,
            "createdAt": i.created_at.isoformat(),
        }
        for i in rows
    ])
