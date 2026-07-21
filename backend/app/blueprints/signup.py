"""Self-serve signup — runs at the apex (no tenant). Creates a workspace and
its first admin, then the client redirects to ``<slug>.<domain>`` to log in.
"""
from __future__ import annotations

from flask import Blueprint, request

from app.auth.decorators import csrf_protect
from app.blueprints.helpers import ok, parse_body
from app.extensions import limiter
from app.services.provisioning import (
    normalize_slug,
    provision_organization,
    slug_available,
    validate_slug,
)
from app.schemas.signup import SignupInput

bp = Blueprint("signup", __name__, url_prefix="/api/signup")


@bp.get("/slug-available")
@limiter.limit("60 per hour")
def check_slug():
    raw = request.args.get("slug", "")
    slug = normalize_slug(raw)
    try:
        validate_slug(slug)
    except Exception:
        return ok({"slug": slug, "available": False, "reason": "invalid"})
    return ok({"slug": slug, "available": slug_available(slug)})


@bp.post("")
@csrf_protect
@limiter.limit("10 per hour")
def signup():
    data = parse_body(SignupInput)
    org, admin = provision_organization(
        org_name=data.org_name,
        slug=data.slug,
        admin_username=data.admin_username,
        admin_email=data.admin_email,
        admin_password=data.admin_password,
    )
    base = request.host.split(":", 1)[0]
    # If we're on the apex, build the workspace host for the client to redirect to.
    return ok({
        "slug": org.slug,
        "workspaceHost": f"{org.slug}.{base}" if not base.startswith(org.slug + ".") else base,
        "adminEmail": admin.email,
    }, status=201)
