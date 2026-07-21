"""Catalog routes: service categories, services, packages.

Read endpoints are public on a tenant subdomain (the customer booking flow
browses services unauthenticated) but only expose *active* items unless the
caller is signed in with catalog permission. All mutations are permission-gated
— unlike the old app, where several of these routes shipped unauthenticated.
"""
from __future__ import annotations

from flask import Blueprint

from app.auth.decorators import require_permission
from app.blueprints.helpers import (
    get_or_404,
    maybe_user,
    money,
    ok,
    parse_body,
    require_tenant,
)
from app.errors import ApiError
from app.extensions import db
from app.models.catalog import Service, ServiceCategory, ServicePackage
from app.schemas.catalog import (
    CategoryInput,
    PackageInput,
    ServiceInput,
    StatusInput,
)

bp = Blueprint("catalog", __name__, url_prefix="/api")


# --- serializers ---------------------------------------------------------------

def serialize_category(c: ServiceCategory) -> dict:
    return {
        "id": str(c.id),
        "name": c.name,
        "capacity": c.capacity,
        "createdAt": c.created_at.isoformat(),
        "updatedAt": c.updated_at.isoformat(),
    }


def serialize_service(s: Service) -> dict:
    return {
        "id": str(s.id),
        "name": s.name,
        "description": s.description,
        "durationMinutes": s.duration_minutes,
        "price": money(s.price),
        "currency": s.currency,
        "minDepositFixed": money(s.min_deposit_fixed),
        "maxBookingsPerDay": s.max_bookings_per_day,
        "latestBookingTime": s.latest_booking_time,
        "isActive": s.is_active,
        "imageUrl": s.image_url,
        "categoryId": str(s.category_id) if s.category_id else None,
        "category": serialize_category(s.category) if s.category else None,
        "createdAt": s.created_at.isoformat(),
        "updatedAt": s.updated_at.isoformat(),
    }


def serialize_package(p: ServicePackage) -> dict:
    return {
        "id": str(p.id),
        "name": p.name,
        "description": p.description,
        "imageUrl": p.image_url,
        "price": money(p.price),
        "currency": p.currency,
        "minDepositFixed": money(p.min_deposit_fixed),
        "isActive": p.is_active,
        "services": [serialize_service(s) for s in p.services],
        "createdAt": p.created_at.isoformat(),
        "updatedAt": p.updated_at.isoformat(),
    }


def _can_see_inactive() -> bool:
    user = maybe_user()
    return user is not None and (
        "*" in user.permission_keys or "services.view" in user.permission_keys
    )


# --- service categories ---------------------------------------------------------

@bp.get("/service-categories")
def list_categories():
    require_tenant()
    rows = db.session.execute(
        db.select(ServiceCategory).order_by(ServiceCategory.name)
    ).scalars().all()
    return ok([serialize_category(c) for c in rows])


@bp.post("/service-categories")
@require_permission("services.view")
def create_category():
    org = require_tenant()
    data = parse_body(CategoryInput)
    existing = db.session.execute(
        db.select(ServiceCategory).filter_by(name=data.name)
    ).scalar_one_or_none()
    if existing:
        raise ApiError("A category with this name already exists", status=409, code="DUPLICATE")
    row = ServiceCategory(organization_id=org.id, name=data.name, capacity=data.capacity)
    db.session.add(row)
    db.session.commit()
    return ok(serialize_category(row), status=201)


@bp.put("/service-categories/<uuid:category_id>")
@require_permission("services.view")
def update_category(category_id):
    row = get_or_404(ServiceCategory, category_id, label="Category")
    data = parse_body(CategoryInput)
    row.name = data.name
    row.capacity = data.capacity
    db.session.commit()
    return ok(serialize_category(row))


@bp.delete("/service-categories/<uuid:category_id>")
@require_permission("services.view")
def delete_category(category_id):
    row = get_or_404(ServiceCategory, category_id, label="Category")
    db.session.delete(row)
    db.session.commit()
    return ok(None)


# --- services --------------------------------------------------------------------

@bp.get("/services")
def list_services():
    require_tenant()
    stmt = db.select(Service).order_by(Service.created_at.desc())
    if not _can_see_inactive():
        stmt = stmt.filter_by(is_active=True)
    rows = db.session.execute(stmt).scalars().all()
    return ok([serialize_service(s) for s in rows])


@bp.get("/services/<uuid:service_id>")
def get_service(service_id):
    row = get_or_404(Service, service_id, label="Service")
    if not row.is_active and not _can_see_inactive():
        raise ApiError("Service not found", status=404, code="NOT_FOUND")
    return ok(serialize_service(row))


def _apply_service_input(row: Service, data: ServiceInput) -> None:
    if data.category_id is not None:
        # Validate the category belongs to this tenant before linking.
        get_or_404(ServiceCategory, data.category_id, label="Category")
    row.name = data.name
    row.description = data.description
    row.duration_minutes = data.duration_minutes
    row.price = data.price
    row.currency = data.currency
    row.min_deposit_fixed = data.min_deposit_fixed
    row.max_bookings_per_day = data.max_bookings_per_day
    row.latest_booking_time = data.latest_booking_time
    row.is_active = data.is_active
    row.image_url = data.image_url
    row.category_id = data.category_id


@bp.post("/services")
@require_permission("services.view")
def create_service():
    org = require_tenant()
    data = parse_body(ServiceInput)
    row = Service(organization_id=org.id, name="", duration_minutes=1, price=0)
    _apply_service_input(row, data)
    db.session.add(row)
    db.session.commit()
    return ok(serialize_service(row), status=201)


@bp.put("/services/<uuid:service_id>")
@require_permission("services.view")
def update_service(service_id):
    row = get_or_404(Service, service_id, label="Service")
    data = parse_body(ServiceInput)
    _apply_service_input(row, data)
    db.session.commit()
    return ok(serialize_service(row))


@bp.patch("/services/<uuid:service_id>/status")
@require_permission("services.view")
def update_service_status(service_id):
    row = get_or_404(Service, service_id, label="Service")
    data = parse_body(StatusInput)
    row.is_active = data.is_active
    db.session.commit()
    return ok(serialize_service(row))


@bp.delete("/services/<uuid:service_id>")
@require_permission("services.view")
def delete_service(service_id):
    row = get_or_404(Service, service_id, label="Service")
    db.session.delete(row)
    db.session.commit()
    return ok(None)


# --- packages ----------------------------------------------------------------------

@bp.get("/packages")
def list_packages():
    require_tenant()
    stmt = db.select(ServicePackage).order_by(ServicePackage.created_at.desc())
    if not _can_see_inactive():
        stmt = stmt.filter_by(is_active=True)
    rows = db.session.execute(stmt).scalars().all()
    return ok([serialize_package(p) for p in rows])


@bp.post("/packages")
@require_permission("services.view")
def create_package():
    org = require_tenant()
    data = parse_body(PackageInput)
    row = ServicePackage(
        organization_id=org.id,
        name=data.name,
        description=data.description,
        image_url=data.image_url,
        price=data.price,
        currency=data.currency,
        min_deposit_fixed=data.min_deposit_fixed,
        is_active=data.is_active,
    )
    row.services = [
        get_or_404(Service, sid, label="Service") for sid in data.service_ids
    ]
    db.session.add(row)
    db.session.commit()
    return ok(serialize_package(row), status=201)


@bp.put("/packages/<uuid:package_id>")
@require_permission("services.view")
def update_package(package_id):
    row = get_or_404(ServicePackage, package_id, label="Package")
    data = parse_body(PackageInput)
    row.name = data.name
    row.description = data.description
    row.image_url = data.image_url
    row.price = data.price
    row.currency = data.currency
    row.min_deposit_fixed = data.min_deposit_fixed
    row.is_active = data.is_active
    row.services = [
        get_or_404(Service, sid, label="Service") for sid in data.service_ids
    ]
    db.session.commit()
    return ok(serialize_package(row))


@bp.delete("/packages/<uuid:package_id>")
@require_permission("services.view")
def delete_package(package_id):
    row = get_or_404(ServicePackage, package_id, label="Package")
    db.session.delete(row)
    db.session.commit()
    return ok(None)
