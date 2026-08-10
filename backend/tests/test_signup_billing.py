"""Phase 4: self-serve signup, provisioning defaults, subscription gating."""
from __future__ import annotations

import hashlib
import hmac
import json
import uuid

from app.extensions import db
from app.models.organization import Organization, OrgStatus
from tests.conftest import PASSWORD, _host


def _csrf(client, host):
    return client.get("/api/auth/csrf", headers={"Host": host}).get_json()["data"]["csrfToken"]


def test_signup_provisions_workspace(app):
    client = app.test_client()
    apex = "lvh.me"
    slug = f"glow{uuid.uuid4().hex[:6]}"
    token = _csrf(client, apex)
    r = client.post("/api/signup", json={
        "orgName": "Glow Studio", "slug": slug,
        "adminUsername": "owner", "adminEmail": f"owner@{slug}.example.com",
        "adminPassword": "OwnerPass123!",
    }, headers={"Host": apex, "X-CSRF-Token": token})
    assert r.status_code == 201, r.get_json()
    assert r.get_json()["data"]["slug"] == slug

    # New workspace: trial status + seeded defaults (hours + payment methods)
    with app.app_context():
        org = db.session.execute(
            db.select(Organization).filter_by(slug=slug).execution_options(skip_tenant_filter=True)
        ).scalar_one()
        assert org.status == OrgStatus.TRIAL and org.trial_ends_at is not None

    # The seeded admin can log in on the new subdomain
    r = client.get("/api/auth/csrf", headers={"Host": _host(slug)})
    stoken = r.get_json()["data"]["csrfToken"]
    r = client.post("/api/auth/login",
                    json={"email": f"owner@{slug}.example.com", "password": "OwnerPass123!"},
                    headers={"Host": _host(slug), "X-CSRF-Token": stoken})
    assert r.status_code == 200
    csrf2 = client.get_cookie("paulux_csrf", domain="lvh.me").value
    # Default business hours + manual methods were seeded
    r = client.get("/api/business-hours", headers={"Host": _host(slug)})
    assert len(r.get_json()["data"]) == 7
    r = client.get("/api/payments/manual-methods", headers={"Host": _host(slug), "X-CSRF-Token": csrf2})
    assert len(r.get_json()["data"]) >= 2


def test_signup_slug_rules(app):
    client = app.test_client()
    token = _csrf(client, "lvh.me")
    # Reserved slug rejected
    r = client.post("/api/signup", json={
        "orgName": "Test Studio", "slug": "admin", "adminUsername": "owner",
        "adminEmail": "a@x.example.com", "adminPassword": "Password123!",
    }, headers={"Host": "lvh.me", "X-CSRF-Token": token})
    assert r.status_code == 422

    # Duplicate slug rejected (acme already exists)
    r = client.post("/api/signup", json={
        "orgName": "Test Studio", "slug": "acme", "adminUsername": "owner",
        "adminEmail": "a2@x.example.com", "adminPassword": "Password123!",
    }, headers={"Host": "lvh.me", "X-CSRF-Token": token})
    assert r.status_code == 409

    # Availability endpoint
    r = client.get("/api/signup/slug-available?slug=acme", headers={"Host": "lvh.me"})
    assert r.get_json()["data"]["available"] is False
    r = client.get(f"/api/signup/slug-available?slug=fresh{uuid.uuid4().hex[:6]}", headers={"Host": "lvh.me"})
    assert r.get_json()["data"]["available"] is True


def _login(client, slug):
    t = _csrf(client, _host(slug))
    client.post("/api/auth/login",
                json={"email": "admin@shared.example.com", "password": PASSWORD},
                headers={"Host": _host(slug), "X-CSRF-Token": t})
    return client.get_cookie("paulux_csrf", domain="lvh.me").value


def _set_status(app, slug, status):
    with app.app_context():
        org = db.session.execute(
            db.select(Organization).filter_by(slug=slug).execution_options(skip_tenant_filter=True)
        ).scalar_one()
        org.status = status
        db.session.commit()


def test_suspended_org_is_gated_but_can_reach_billing(app):
    client = app.test_client()
    csrf = _login(client, "zen")
    _set_status(app, "zen", OrgStatus.SUSPENDED)

    # Admin data endpoints blocked with 402
    r = client.get("/api/bookings", headers={"Host": _host("zen")})
    assert r.status_code == 402
    assert r.get_json()["error"]["code"] == "SUBSCRIPTION_REQUIRED"

    # Billing endpoints remain reachable so they can re-subscribe
    r = client.get("/api/billing/subscription", headers={"Host": _host("zen")})
    assert r.status_code == 200
    assert r.get_json()["data"]["status"] == "SUSPENDED"

    _set_status(app, "zen", OrgStatus.ACTIVE)  # restore for other tests
    r = client.get("/api/bookings", headers={"Host": _host("zen")})
    assert r.status_code == 200


def test_free_plan_checkout_activates_and_webhook(app):
    client = app.test_client()
    csrf = _login(client, "acme")

    # Free plan activates immediately
    r = client.post("/api/billing/checkout", json={"plan": "starter"},
                    headers={"Host": _host("acme"), "X-CSRF-Token": csrf})
    assert r.status_code == 200 and r.get_json()["data"]["activated"] is True

    # Paid plan returns a checkout url, not yet active
    r = client.post("/api/billing/checkout", json={"plan": "independent"},
                    headers={"Host": _host("acme"), "X-CSRF-Token": csrf})
    assert r.get_json()["data"]["checkoutUrl"] is not None

    # Webhook flips to ACTIVE on the independent plan
    event = {"event": "subscription.activated", "orgSlug": "acme", "plan": "independent",
             "subscriptionId": "sub_123"}
    raw = json.dumps(event).encode()
    r = client.post("/api/billing/webhook", data=raw,
                    headers={"Host": "lvh.me", "Content-Type": "application/json"})
    assert r.status_code == 200
    r = client.get("/api/billing/subscription", headers={"Host": _host("acme")})
    data = r.get_json()["data"]
    assert data["status"] == "ACTIVE" and data["plan"] == "independent"

    # Payment failure -> PAST_DUE (still allowed, grace period)
    raw = json.dumps({"event": "invoice.payment_failed", "orgSlug": "acme"}).encode()
    client.post("/api/billing/webhook", data=raw,
                headers={"Host": "lvh.me", "Content-Type": "application/json"})
    r = client.get("/api/billing/subscription", headers={"Host": _host("acme")})
    assert r.get_json()["data"]["status"] == "PAST_DUE"


def test_plans_are_public(app):
    client = app.test_client()
    r = client.get("/api/billing/plans", headers={"Host": "lvh.me"})
    assert r.status_code == 200
    plans = r.get_json()["data"]
    ids = [p["id"] for p in plans]
    # Only the two public subscription plans are offered; starter is internal.
    assert "independent" in ids and "team" in ids
    assert "starter" not in ids
    # Display metadata for the marketing/pricing UI is included.
    team = next(p for p in plans if p["id"] == "team")
    assert team["price"] == 41.95 and team["unit"] == "/member/mo" and team["perSeat"] is True
