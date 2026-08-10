"""Standalone-interest lead capture — runs at the apex (no tenant).

A prospect who wants their own domain / a dedicated deployment submits the
marketing "standalone" form. We persist the lead and notify the platform team;
follow-up is manual.
"""
from __future__ import annotations

from flask import Blueprint

from app.auth.decorators import csrf_protect
from app.blueprints.helpers import ok, parse_body
from app.extensions import db, limiter
from app.models.marketing import Lead
from app.notifications.events import notify_ops_lead
from app.schemas.leads import LeadInput

bp = Blueprint("leads", __name__, url_prefix="/api/leads")


@bp.post("")
@csrf_protect
@limiter.limit("10 per hour")
def create_lead():
    data = parse_body(LeadInput)
    lead = Lead(
        name=data.name,
        business_name=data.business_name,
        email=data.email,
        phone=data.phone,
        city=data.city,
        team_size=data.team_size,
        message=data.message,
    )
    db.session.add(lead)
    db.session.commit()
    # Never let a notification failure fail the submission — the row is saved.
    notify_ops_lead(lead)
    return ok({"received": True}, status=201)
