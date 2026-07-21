"""Tenant settings: key-value settings, branding, and payment credentials.

The Paystack secret is write-only — it is stored encrypted (when an encryption
key is configured) and never returned by any endpoint.
"""
from __future__ import annotations

from flask import Blueprint

from app.auth.decorators import require_permission
from app.blueprints.helpers import ok, parse_body, require_tenant
from app.config import get_settings
from app.extensions import db
from app.models.schedule import SystemSetting
from app.schemas.gift_card import OrgBrandingInput, SettingsInput
from app.security import encrypt_secret

bp = Blueprint("org_settings", __name__, url_prefix="/api")


@bp.get("/organization")
def get_organization_public():
    """Public branding for the current tenant (used by the customer SPA)."""
    org = require_tenant()
    return ok({
        "slug": org.slug,
        "name": org.name,
        "logoUrl": org.logo_url,
        "primaryColor": org.primary_color,
        "paystackPublicKey": org.paystack_public_key,
        "paymentsConfigured": bool(org.paystack_secret_encrypted),
    })


@bp.put("/organization")
@require_permission("settings.view")
def update_organization():
    org = require_tenant()
    data = parse_body(OrgBrandingInput)
    if data.name is not None:
        org.name = data.name
    if data.logo_url is not None:
        org.logo_url = data.logo_url
    if data.primary_color is not None:
        org.primary_color = data.primary_color
    if data.paystack_public_key is not None:
        org.paystack_public_key = data.paystack_public_key
    if data.paystack_secret_key is not None:
        enc_key = get_settings().secrets_encryption_key
        org.paystack_secret_encrypted = (
            encrypt_secret(data.paystack_secret_key, enc_key)
            if enc_key
            else data.paystack_secret_key  # dev fallback (no encryption key set)
        )
    db.session.commit()
    return get_organization_public()


@bp.get("/settings")
@require_permission("settings.view")
def get_app_settings():
    require_tenant()
    rows = db.session.execute(db.select(SystemSetting)).scalars().all()
    return ok({s.key: s.value for s in rows})


@bp.put("/settings")
@require_permission("settings.view")
def put_app_settings():
    org = require_tenant()
    data = parse_body(SettingsInput)
    for key, value in data.settings.items():
        row = db.session.execute(
            db.select(SystemSetting).filter_by(key=key)
        ).scalar_one_or_none()
        if row is None:
            db.session.add(SystemSetting(organization_id=org.id, key=key, value=value))
        else:
            row.value = value
    db.session.commit()
    return get_app_settings()
