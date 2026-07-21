"""Promo code routes: admin CRUD + public validation.

Validation is public (the customer booking flow checks a code before paying)
but only ever confirms/denies a specific code — it never lists codes.
"""
from __future__ import annotations

from flask import Blueprint

from app.auth.decorators import require_permission
from app.blueprints.helpers import get_or_404, money, ok, parse_body, require_tenant
from app.errors import ApiError
from app.extensions import db
from app.models.marketing import DiscountType, PromoCode
from app.schemas.booking import PromoCodeInput, PromoValidateInput

bp = Blueprint("promo_codes", __name__, url_prefix="/api/promo-codes")


def serialize_promo(p: PromoCode) -> dict:
    return {
        "id": str(p.id),
        "code": p.code,
        "description": p.description,
        "discountType": p.discount_type.value,
        "discountValue": money(p.discount_value),
        "maxUses": p.max_uses,
        "usedCount": p.used_count,
        "expiresAt": p.expires_at.isoformat() if p.expires_at else None,
        "isActive": p.is_active,
        "minBookingAmount": money(p.min_booking_amount),
        "createdAt": p.created_at.isoformat(),
        "updatedAt": p.updated_at.isoformat(),
    }


@bp.get("")
@require_permission("promo_codes.view")
def list_promos():
    require_tenant()
    rows = db.session.execute(
        db.select(PromoCode).order_by(PromoCode.created_at.desc())
    ).scalars().all()
    return ok([serialize_promo(p) for p in rows])


@bp.post("")
@require_permission("promo_codes.view")
def create_promo():
    org = require_tenant()
    data = parse_body(PromoCodeInput)
    if db.session.execute(
        db.select(PromoCode).filter_by(code=data.code)
    ).scalar_one_or_none():
        raise ApiError("A promo code with this code already exists", status=409, code="DUPLICATE")
    row = PromoCode(
        organization_id=org.id,
        code=data.code,
        description=data.description,
        discount_type=DiscountType(data.discount_type),
        discount_value=data.discount_value,
        max_uses=data.max_uses,
        expires_at=data.expires_at,
        is_active=data.is_active,
        min_booking_amount=data.min_booking_amount,
    )
    db.session.add(row)
    db.session.commit()
    return ok(serialize_promo(row), status=201)


@bp.put("/<uuid:promo_id>")
@require_permission("promo_codes.view")
def update_promo(promo_id):
    row = get_or_404(PromoCode, promo_id, label="Promo code")
    data = parse_body(PromoCodeInput)
    row.code = data.code
    row.description = data.description
    row.discount_type = DiscountType(data.discount_type)
    row.discount_value = data.discount_value
    row.max_uses = data.max_uses
    row.expires_at = data.expires_at
    row.is_active = data.is_active
    row.min_booking_amount = data.min_booking_amount
    db.session.commit()
    return ok(serialize_promo(row))


@bp.delete("/<uuid:promo_id>")
@require_permission("promo_codes.view")
def delete_promo(promo_id):
    row = get_or_404(PromoCode, promo_id, label="Promo code")
    db.session.delete(row)
    db.session.commit()
    return ok(None)


@bp.post("/validate")
def validate_promo():
    """Public: check a code against a booking amount; returns the discount."""
    require_tenant()
    data = parse_body(PromoValidateInput)
    promo = db.session.execute(
        db.select(PromoCode).filter_by(code=data.code.strip().upper())
    ).scalar_one_or_none()
    if promo is None:
        raise ApiError("Invalid promo code", status=404, code="NOT_FOUND")
    reason = promo.usable_for(data.amount)
    if reason:
        raise ApiError(reason, status=422, code="PROMO_NOT_APPLICABLE")
    return ok({
        "code": promo.code,
        "discountAmount": money(promo.discount_for(data.amount)),
    })
