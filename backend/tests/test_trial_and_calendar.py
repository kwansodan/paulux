"""Trial base=30d + self-service extensions, and the bookings calendar endpoint."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from app.extensions import db
from app.models.organization import Organization, OrgStatus
from app.services.provisioning import TRIAL_DAYS
from tests.conftest import PASSWORD, _host


def _csrf(client, host):
    return client.get("/api/auth/csrf", headers={"Host": host}).get_json()["data"]["csrfToken"]


def _login(client, slug):
    t = _csrf(client, _host(slug))
    client.post("/api/auth/login",
                json={"email": "admin@shared.example.com", "password": PASSWORD},
                headers={"Host": _host(slug), "X-CSRF-Token": t})
    return client.get_cookie("paulux_csrf", domain="lvh.me").value


def test_trial_base_is_30_days():
    assert TRIAL_DAYS == 30


def _make_trial(app, slug, days_left):
    from datetime import timedelta

    with app.app_context():
        org = db.session.execute(
            db.select(Organization).filter_by(slug=slug).execution_options(skip_tenant_filter=True)
        ).scalar_one()
        org.status = OrgStatus.TRIAL
        org.trial_extensions_used = 0
        org.trial_ends_at = datetime.now(timezone.utc) + timedelta(days=days_left)
        db.session.commit()


def test_extend_trial_twice_then_blocked(app):
    client = app.test_client()
    csrf = _login(client, "zen")
    _make_trial(app, "zen", days_left=2)
    h = {"Host": _host("zen"), "X-CSRF-Token": csrf}

    r = client.get("/api/billing/subscription", headers={"Host": _host("zen")})
    before = r.get_json()["data"]["trialDaysLeft"]
    assert before is not None

    # First extension: +15 days, one remaining
    r = client.post("/api/billing/extend-trial", json={}, headers=h)
    assert r.status_code == 200, r.get_json()
    d = r.get_json()["data"]
    assert d["trialDaysLeft"] >= before + 14  # ~+15
    assert d["trialExtensionsUsed"] == 1 and d["trialExtensionsRemaining"] == 1

    # Second extension: none remaining after
    r = client.post("/api/billing/extend-trial", json={}, headers=h)
    assert r.status_code == 200
    d = r.get_json()["data"]
    assert d["trialExtensionsUsed"] == 2 and d["canExtendTrial"] is False

    # Third extension refused
    r = client.post("/api/billing/extend-trial", json={}, headers=h)
    assert r.status_code == 422
    assert r.get_json()["error"]["code"] == "NO_EXTENSIONS_LEFT"

    # restore for other tests
    with app.app_context():
        org = db.session.execute(
            db.select(Organization).filter_by(slug="zen").execution_options(skip_tenant_filter=True)
        ).scalar_one()
        org.status = OrgStatus.ACTIVE
        db.session.commit()


def test_extend_lifts_the_402_gate(app):
    client = app.test_client()
    csrf = _login(client, "zen")
    _make_trial(app, "zen", days_left=-1)  # already expired
    h = {"Host": _host("zen"), "X-CSRF-Token": csrf}

    # Gated while expired
    assert client.get("/api/bookings", headers={"Host": _host("zen")}).status_code == 402
    # Extend (billing is exempt from the gate)
    assert client.post("/api/billing/extend-trial", json={}, headers=h).status_code == 200
    # Gate lifted
    assert client.get("/api/bookings", headers={"Host": _host("zen")}).status_code == 200

    with app.app_context():
        org = db.session.execute(
            db.select(Organization).filter_by(slug="zen").execution_options(skip_tenant_filter=True)
        ).scalar_one()
        org.status = OrgStatus.ACTIVE
        db.session.commit()


def _svc(client, h):
    r = client.post("/api/services",
                    json={"name": f"Cal {uuid.uuid4().hex[:6]}", "durationMinutes": 30,
                          "price": "40.00", "isActive": True},
                    headers=h)
    return r.get_json()["data"]["id"]


def test_bookings_calendar_counts_and_isolation(app):
    acme = app.test_client()
    zen = app.test_client()
    a = _login(acme, "acme")
    z = _login(zen, "zen")
    ah = {"Host": _host("acme"), "X-CSRF-Token": a}
    svc = _svc(acme, ah)

    def book(date):
        acme.post("/api/bookings", json={
            "clientName": "Cal", "clientEmail": "cal@customer.example.com",
            "clientPhone": "+2330", "bookingDate": date, "bookingTime": "10:00",
            "services": [{"serviceId": svc}]}, headers=ah)

    book("2027-03-04")
    book("2027-03-04")
    book("2027-03-09")

    r = acme.get("/api/bookings/calendar?month=2027-03", headers={"Host": _host("acme")})
    assert r.status_code == 200
    counts = {row["date"]: row["count"] for row in r.get_json()["data"]}
    assert counts.get("2027-03-04") == 2 and counts.get("2027-03-09") == 1

    # zen sees none of acme's March bookings
    r = zen.get("/api/bookings/calendar?month=2027-03", headers={"Host": _host("zen")})
    assert all(row["date"] not in ("2027-03-04", "2027-03-09") for row in r.get_json()["data"])

    # missing month -> 400
    assert acme.get("/api/bookings/calendar", headers={"Host": _host("acme")}).status_code == 400
