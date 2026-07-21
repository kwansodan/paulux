"""Shared helpers for route handlers: JSON validation, tenant-scoped lookups,
and response envelopes.
"""
from __future__ import annotations

from decimal import Decimal

from flask import g, jsonify, request
from pydantic import BaseModel, ValidationError

from app.errors import ApiError
from app.extensions import db
from app.tenancy import current_org


def parse_body(schema: type[BaseModel]) -> BaseModel:
    """Validate the request JSON body against a pydantic schema."""
    payload = request.get_json(force=True, silent=True)
    if payload is None:
        raise ApiError("Request body must be JSON", status=400, code="INVALID_INPUT")
    try:
        return schema.model_validate(payload)
    except ValidationError as e:
        first = e.errors()[0]
        loc = ".".join(str(p) for p in first["loc"]) or "body"
        raise ApiError(f"{loc}: {first['msg']}", status=400, code="VALIDATION_ERROR")


def require_tenant():
    """Return the current Organization or 404 (unknown subdomain)."""
    org = current_org()
    if org is None:
        raise ApiError("Unknown workspace", status=404, code="TENANT_NOT_FOUND")
    return org


def get_or_404(model, entity_id, *, label: str):
    """Tenant-scoped fetch by id. The auto tenant filter narrows the SELECT, and
    we assert ownership explicitly as a second line of defence (anti-IDOR)."""
    org = require_tenant()
    row = db.session.execute(
        db.select(model).filter_by(id=entity_id)
    ).scalar_one_or_none()
    if row is None or row.organization_id != org.id:
        raise ApiError(f"{label} not found", status=404, code="NOT_FOUND")
    return row


def ok(data, status: int = 200):
    return jsonify({"success": True, "data": data}), status


def money(value: Decimal | None) -> str | None:
    """Serialize money losslessly as a 2dp string."""
    if value is None:
        return None
    return f"{Decimal(value):.2f}"


def maybe_user():
    """Current user or None, without raising (for public routes that behave
    differently when an admin is signed in)."""
    from app.auth.decorators import load_current_user

    user = load_current_user()
    if user is None:
        return None
    org = current_org()
    if org is None:
        return None
    if user.organization_id != org.id and user.role.value != "SUPER_ADMIN":
        return None
    return user
