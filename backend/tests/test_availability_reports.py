"""Availability enforcement, invoices, dashboard metrics, upload presign."""
from __future__ import annotations

import uuid
from datetime import date, timedelta

from tests.conftest import PASSWORD, _host

# Availability rules are weekday/past-date sensitive, so dates are computed
# relative to today (Python weekday: Mon=0 … Sun=6) rather than hardcoded — a
# fixed date silently rots into "the past" and breaks the suite.
_TODAY = date.today()


def _upcoming(weekday: int) -> date:
    """The next date on the given weekday, at least a week out (clear of today)."""
    d = _TODAY + timedelta(days=7)
    while d.weekday() != weekday:
        d += timedelta(days=1)
    return d


PAST_DATE = (_TODAY - timedelta(days=30)).isoformat()
SUNDAY = _upcoming(6).isoformat()      # closed day
MONDAY = _upcoming(0).isoformat()      # open weekday used for the valid slots
BLOCKED_DATE = (_upcoming(0) + timedelta(days=7)).isoformat()  # a later open Monday, blocked
FUTURE_DATE = (_TODAY + timedelta(days=40)).isoformat()        # for admin bookings


def _login_client(client, slug):
    r = client.get("/api/auth/csrf", headers={"Host": _host(slug)})
    token = r.get_json()["data"]["csrfToken"]
    r = client.post(
        "/api/auth/login",
        json={"email": "admin@shared.example.com", "password": PASSWORD},
        headers={"Host": _host(slug), "X-CSRF-Token": token},
    )
    assert r.status_code == 200
    return client.get_cookie("paulux_csrf", domain="lvh.me").value


def _mk_service(client, headers):
    r = client.post(
        "/api/services",
        json={"name": f"Avail {uuid.uuid4().hex[:6]}", "durationMinutes": 30,
              "price": "40.00", "isActive": True},
        headers=headers,
    )
    return r.get_json()["data"]["id"]


def _public_payload(svc_id, date, time):
    return {
        "clientName": "Yaa", "clientEmail": "yaa@customer.example.com",
        "clientPhone": "+233551234567", "bookingDate": date, "bookingTime": time,
        "services": [{"serviceId": svc_id}],
    }


def test_availability_rules(app):
    zen = app.test_client()
    token = _login_client(zen, "zen")
    h = {"Host": _host("zen"), "X-CSRF-Token": token}
    svc = _mk_service(zen, h)
    anon = app.test_client()
    pub_h = {"Host": _host("zen")}

    # Configure zen: closed Sundays, open 09:00-17:00, capacity 1
    hours = [{"dayOfWeek": d, "startTime": "09:00", "endTime": "17:00",
              "isOpen": d != 0, "maxConcurrentBookings": 1} for d in range(7)]
    assert zen.put("/api/business-hours", json={"hours": hours}, headers=h).status_code == 200
    # Block a future open Monday fully
    assert zen.post("/api/blocked-dates", json={"date": BLOCKED_DATE, "reason": "Maintenance"},
                    headers=h).status_code == 201

    # Past date rejected
    r = anon.post("/api/bookings/public", json=_public_payload(svc, PAST_DATE, "10:00"), headers=pub_h)
    assert r.status_code == 422

    # Blocked date rejected
    r = anon.post("/api/bookings/public", json=_public_payload(svc, BLOCKED_DATE, "10:00"), headers=pub_h)
    assert r.status_code == 422

    # Sunday rejected (closed)
    r = anon.post("/api/bookings/public", json=_public_payload(svc, SUNDAY, "10:00"), headers=pub_h)
    assert r.status_code == 422

    # Outside hours rejected (open weekday at 20:00)
    r = anon.post("/api/bookings/public", json=_public_payload(svc, MONDAY, "20:00"), headers=pub_h)
    assert r.status_code == 422

    # Valid slot accepted
    r = anon.post("/api/bookings/public", json=_public_payload(svc, MONDAY, "10:00"), headers=pub_h)
    assert r.status_code == 201, r.get_json()

    # Same slot again: capacity 1 -> full
    r = anon.post("/api/bookings/public", json=_public_payload(svc, MONDAY, "10:00"), headers=pub_h)
    assert r.status_code == 422
    # Different time is fine
    r = anon.post("/api/bookings/public", json=_public_payload(svc, MONDAY, "11:00"), headers=pub_h)
    assert r.status_code == 201

    # Admin walk-ins bypass availability (blocked date allowed via admin)
    r = zen.post("/api/bookings",
                 json={**_public_payload(svc, BLOCKED_DATE, "10:00"), "bookingType": "WALKIN"},
                 headers=h)
    assert r.status_code == 201


def test_invoices_issued_for_payments(app):
    acme = app.test_client()
    token = _login_client(acme, "acme")
    h = {"Host": _host("acme"), "X-CSRF-Token": token}
    svc = _mk_service(acme, h)
    r = acme.post("/api/bookings", json=_public_payload(svc, FUTURE_DATE, "10:00"), headers=h)
    booking_id = r.get_json()["data"]["id"]

    r = acme.post("/api/payments/manual-methods",
                  json={"name": f"Inv {uuid.uuid4().hex[:4]}"}, headers=h)
    method_id = r.get_json()["data"]["id"]
    r = acme.post("/api/payments/manual",
                  json={"bookingId": booking_id, "amount": "40.00", "manualMethodId": method_id},
                  headers=h)
    payment_id = r.get_json()["data"]["id"]

    r = acme.get("/api/invoices", headers={"Host": _host("acme")})
    assert r.status_code == 200
    invoices = r.get_json()["data"]
    assert any(i["amount"] == "40.00" and i["kind"] == "PAYMENT" for i in invoices)
    numbers = [i["invoiceNumber"] for i in invoices]
    assert all(n.startswith("INV-") for n in numbers)
    assert len(numbers) == len(set(numbers))  # unique

    # Refund issues a REFUND invoice
    r = acme.post(f"/api/payments/{payment_id}/refund", json={"reason": "test"}, headers=h)
    assert r.status_code == 200
    r = acme.get("/api/invoices", headers={"Host": _host("acme")})
    assert any(i["kind"] == "REFUND" for i in r.get_json()["data"])


def test_dashboard_metrics_shape(app):
    acme = app.test_client()
    _login_client(acme, "acme")
    r = acme.get("/api/dashboard/metrics", headers={"Host": _host("acme")})
    assert r.status_code == 200
    data = r.get_json()["data"]
    assert set(data.keys()) == {"bookingsToday", "pendingBookings", "revenueToday", "lowStockProducts"}
    # anonymous blocked
    assert app.test_client().get(
        "/api/dashboard/metrics", headers={"Host": _host("acme")}
    ).status_code in (401, 403)


def test_upload_presign_requires_auth_and_config(app):
    acme = app.test_client()
    token = _login_client(acme, "acme")
    h = {"Host": _host("acme"), "X-CSRF-Token": token}

    # unauthenticated -> 401/403 (the old app's presign was public)
    r = app.test_client().post("/api/uploads/presign",
                               json={"filename": "a.png", "contentType": "image/png"},
                               headers={"Host": _host("acme")})
    assert r.status_code in (401, 403)

    # authenticated but storage unconfigured -> clean 422
    r = acme.post("/api/uploads/presign",
                  json={"filename": "a.png", "contentType": "image/png"}, headers=h)
    assert r.status_code == 422
    assert r.get_json()["error"]["code"] == "STORAGE_NOT_CONFIGURED"

    # non-image type rejected
    r = acme.post("/api/uploads/presign",
                  json={"filename": "a.exe", "contentType": "application/x-msdownload"},
                  headers=h)
    assert r.status_code == 422
