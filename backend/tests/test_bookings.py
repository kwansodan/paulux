"""Bookings: public creation, snapshots, promo math, transitions, isolation."""
from __future__ import annotations

from datetime import date, timedelta

from tests.conftest import PASSWORD, _host

# A comfortably-future date so bookings are never rejected as past. Computed at
# run time (not hardcoded) so the suite doesn't rot as the calendar advances.
FUTURE_DATE = (date.today() + timedelta(days=30)).isoformat()


def _login_client(client, slug):
    r = client.get("/api/auth/csrf", headers={"Host": _host(slug)})
    token = r.get_json()["data"]["csrfToken"]
    r = client.post(
        "/api/auth/login",
        json={"email": "admin@shared.example.com", "password": PASSWORD},
        headers={"Host": _host(slug), "X-CSRF-Token": token},
    )
    assert r.status_code == 200
    cookie = client.get_cookie("paulux_csrf", domain="lvh.me")
    assert cookie is not None
    return cookie.value


def _mk_service(client, headers, name="Braiding", price="100.00", deposit="25.00"):
    r = client.post(
        "/api/services",
        json={
            "name": name,
            "durationMinutes": 90,
            "price": price,
            "minDepositFixed": deposit,
            "isActive": True,
        },
        headers=headers,
    )
    assert r.status_code == 201, r.get_json()
    return r.get_json()["data"]


def _client_payload(service_id, **overrides):
    payload = {
        "clientName": "Ama Mensah",
        "clientEmail": "ama@customer.example.com",
        "clientPhone": "+233201234567",
        "bookingDate": FUTURE_DATE,
        "bookingTime": "10:30",
        "services": [{"serviceId": service_id, "quantity": 1}],
        "termsAccepted": True,
    }
    payload.update(overrides)
    return payload


def test_public_booking_with_promo_and_snapshot(app):
    acme = app.test_client()
    token = _login_client(acme, "acme")
    admin_h = {"Host": _host("acme"), "X-CSRF-Token": token}

    svc = _mk_service(acme, admin_h, name="Silk Press", price="200.00", deposit="50.00")

    # Admin creates a 10%-off promo
    r = acme.post(
        "/api/promo-codes",
        json={"code": "welcome10", "discountType": "PERCENTAGE", "discountValue": "10"},
        headers=admin_h,
    )
    assert r.status_code == 201
    assert r.get_json()["data"]["code"] == "WELCOME10"  # normalized

    # Anonymous customer books with the promo (case-insensitive)
    anon = app.test_client()
    r = anon.post(
        "/api/bookings/public",
        json=_client_payload(svc["id"], promoCode="Welcome10"),
        headers={"Host": _host("acme")},
    )
    assert r.status_code == 201, r.get_json()
    b = r.get_json()["data"]
    assert b["status"] == "PENDING"
    assert b["subtotal"] == "200.00"
    assert b["discountAmount"] == "20.00"
    assert b["total"] == "180.00"
    assert b["minDepositFixed"] == "50.00"
    assert b["bookingReference"].startswith("BK-")
    assert b["services"][0]["priceAtBooking"] == "200.00"

    # Promo usage counted
    r = acme.get("/api/promo-codes", headers={"Host": _host("acme")})
    promo = next(p for p in r.get_json()["data"] if p["code"] == "WELCOME10")
    assert promo["usedCount"] == 1

    # Price snapshot survives a later price change
    r = acme.put(
        f"/api/services/{svc['id']}",
        json={"name": "Silk Press", "durationMinutes": 90, "price": "500.00",
              "minDepositFixed": "50.00", "isActive": True},
        headers=admin_h,
    )
    assert r.status_code == 200
    r = acme.get(f"/api/bookings/{b['id']}", headers={"Host": _host("acme")})
    assert r.get_json()["data"]["subtotal"] == "200.00"  # unchanged


def test_status_transitions(app):
    acme = app.test_client()
    token = _login_client(acme, "acme")
    admin_h = {"Host": _host("acme"), "X-CSRF-Token": token}
    svc = _mk_service(acme, admin_h, name="Transition Trim", price="60.00")

    r = acme.post("/api/bookings", json=_client_payload(svc["id"]), headers=admin_h)
    assert r.status_code == 201
    bid = r.get_json()["data"]["id"]

    # PENDING -> COMPLETED is illegal
    r = acme.patch(f"/api/bookings/{bid}/status", json={"status": "COMPLETED"}, headers=admin_h)
    assert r.status_code == 422

    # PENDING -> CONFIRMED -> COMPLETED is legal
    r = acme.patch(f"/api/bookings/{bid}/status", json={"status": "CONFIRMED"}, headers=admin_h)
    assert r.status_code == 200
    r = acme.patch(f"/api/bookings/{bid}/status", json={"status": "COMPLETED"}, headers=admin_h)
    assert r.status_code == 200

    # COMPLETED is terminal
    r = acme.patch(f"/api/bookings/{bid}/status", json={"status": "CANCELLED"}, headers=admin_h)
    assert r.status_code == 422


def test_booking_isolation(app):
    acme = app.test_client()
    zen = app.test_client()
    acme_token = _login_client(acme, "acme")
    zen_token = _login_client(zen, "zen")
    acme_h = {"Host": _host("acme"), "X-CSRF-Token": acme_token}
    zen_h = {"Host": _host("zen"), "X-CSRF-Token": zen_token}

    svc = _mk_service(acme, acme_h, name="Isolation Locs", price="150.00")
    r = acme.post("/api/bookings", json=_client_payload(svc["id"]), headers=acme_h)
    bid = r.get_json()["data"]["id"]

    # zen admin cannot list, read, or transition acme's booking
    r = zen.get("/api/bookings", headers={"Host": _host("zen")})
    assert all(x["id"] != bid for x in r.get_json()["data"])
    assert zen.get(f"/api/bookings/{bid}", headers={"Host": _host("zen")}).status_code == 404
    r = zen.patch(f"/api/bookings/{bid}/status", json={"status": "CONFIRMED"}, headers=zen_h)
    assert r.status_code == 404

    # zen customers cannot book acme's service (cross-tenant service id -> 404)
    anon = app.test_client()
    r = anon.post(
        "/api/bookings/public",
        json=_client_payload(svc["id"]),
        headers={"Host": _host("zen")},
    )
    assert r.status_code == 404


def test_public_booking_rejects_other_tenants_promo(app):
    acme = app.test_client()
    zen = app.test_client()
    acme_token = _login_client(acme, "acme")
    zen_token = _login_client(zen, "zen")

    # acme-only promo
    acme.post(
        "/api/promo-codes",
        json={"code": "ACMEONLY", "discountType": "FIXED", "discountValue": "5"},
        headers={"Host": _host("acme"), "X-CSRF-Token": acme_token},
    )
    zen_svc = _mk_service(zen, {"Host": _host("zen"), "X-CSRF-Token": zen_token},
                          name="Zen Facial", price="90.00")

    anon = app.test_client()
    r = anon.post(
        "/api/bookings/public",
        json=_client_payload(zen_svc["id"], promoCode="ACMEONLY"),
        headers={"Host": _host("zen")},
    )
    assert r.status_code == 422  # promo invalid for zen
