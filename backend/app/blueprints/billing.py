"""Subscription billing endpoints.

Plans + current subscription are tenant-scoped (admin views them). Checkout is
abstracted (returns a URL a real provider would supply). The webhook is the
source of truth for state changes and verifies a shared secret.
"""
from __future__ import annotations

import hashlib
import hmac
import os
from datetime import datetime, timezone

from flask import Blueprint, request

from app.auth.decorators import require_permission
from app.blueprints.helpers import ok, parse_body, require_tenant
from app.errors import ApiError
from app.extensions import db
from app.models.organization import Organization
from app.services.billing import (
    PLANS,
    apply_subscription_event,
    extend_trial,
    plan_or_default,
    subscription_view,
)
from app.schemas.signup import CheckoutInput

bp = Blueprint("billing", __name__, url_prefix="/api/billing")


@bp.get("/plans")
def list_plans():
    return ok([
        {"id": pid, "name": p["name"], "price": p["price"],
         "bookingsPerMonth": p["bookings_per_month"], "features": p["features"]}
        for pid, p in PLANS.items()
    ])


@bp.get("/subscription")
@require_permission("settings.view")
def get_subscription():
    org = require_tenant()
    return ok(subscription_view(org))


@bp.post("/extend-trial")
@require_permission("settings.view")
def extend_trial_route():
    """Self-service: extend the trial by 15 days (max twice). Reachable even
    after the trial lapses because billing is exempt from the subscription gate."""
    org = require_tenant()
    extend_trial(org)
    db.session.commit()
    return ok(subscription_view(org))


@bp.post("/checkout")
@require_permission("settings.view")
def create_checkout():
    org = require_tenant()
    data = parse_body(CheckoutInput)
    if data.plan not in PLANS:
        raise ApiError("Unknown plan", status=422, code="INVALID_PLAN")
    plan = plan_or_default(data.plan)
    if plan["price"] == 0:
        # Free plan — activate immediately, no checkout needed.
        apply_subscription_event(org, event="subscription.activated", plan=data.plan)
        db.session.commit()
        return ok({"checkoutUrl": None, "activated": True})
    # A real provider (Stripe/Paystack) would return a hosted checkout URL here.
    # The subscription flips to ACTIVE when the provider webhook confirms payment.
    return ok({
        "checkoutUrl": f"/billing/checkout?plan={data.plan}&org={org.slug}",
        "activated": False,
    })


@bp.post("/webhook")
def billing_webhook():
    """Platform billing webhook (apex). Verifies a shared HMAC secret and moves
    the org's subscription state. Provider-agnostic event names."""
    secret = os.environ.get("BILLING_WEBHOOK_SECRET", "")
    raw = request.get_data()
    signature = request.headers.get("X-Billing-Signature", "")
    if secret:
        expected = hmac.new(secret.encode(), raw, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(expected, signature):
            raise ApiError("Invalid signature", status=401, code="INVALID_SIGNATURE")

    event = request.get_json(force=True, silent=True) or {}
    org_slug = event.get("orgSlug")
    kind = event.get("event")
    org = db.session.execute(
        db.select(Organization).filter_by(slug=org_slug)
        .execution_options(skip_tenant_filter=True)
    ).scalar_one_or_none()
    if org is None:
        return ok({"handled": False})

    period_end = None
    if ts := event.get("periodEnd"):
        period_end = datetime.fromtimestamp(int(ts), tz=timezone.utc)

    apply_subscription_event(
        org, event=kind, plan=event.get("plan"),
        subscription_id=event.get("subscriptionId"), period_end=period_end,
    )
    db.session.commit()
    return ok({"handled": True, "status": org.status.value})
