"""Gift cards (activation, redemption, isolation) + schedule/staff/roles/settings."""
from __future__ import annotations

import uuid
from decimal import Decimal

from app.extensions import db
from app.models.gift_card import GiftCard, GiftCardStatus
from app.models.organization import Organization
from tests.conftest import PASSWORD, _host


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


def _mk_booking(client, headers, price="100.00"):
    r = client.post(
        "/api/services",
        json={"name": f"GC Svc {uuid.uuid4().hex[:6]}", "durationMinutes": 30,
              "price": price, "isActive": True},
        headers=headers,
    )
    svc_id = r.get_json()["data"]["id"]
    r = client.post(
        "/api/bookings",
        json={"clientName": "Abena", "clientEmail": "abena@customer.example.com",
              "clientPhone": "+233501234567", "bookingDate": "2026-10-01",
              "bookingTime": "09:00", "services": [{"serviceId": svc_id}]},
        headers=headers,
    )
    return r.get_json()["data"]


def _mk_active_card(app, slug, amount="120.00"):
    """Create an ACTIVE gift card directly (purchase flow needs live Paystack)."""
    with app.app_context():
        org = db.session.execute(
            db.select(Organization).filter_by(slug=slug)
            .execution_options(skip_tenant_filter=True)
        ).scalar_one()
        card = GiftCard(
            organization_id=org.id,
            code="GFT-" + uuid.uuid4().hex[:8].upper(),
            sender_name="Sender", sender_email="s@example.com", sender_phone="+2330000",
            recipient_name="Recipient",
            total_amount=Decimal(amount), balance=Decimal(amount),
            status=GiftCardStatus.ACTIVE,
        )
        db.session.add(card)
        db.session.commit()
        return card.code


def test_gift_card_redeem_flow_and_exhaustion(app):
    acme = app.test_client()
    token = _login_client(acme, "acme")
    h = {"Host": _host("acme"), "X-CSRF-Token": token}
    booking = _mk_booking(acme, h, price="100.00")
    code = _mk_active_card(app, "acme", amount="120.00")

    # Public validate shows the balance without PII
    r = app.test_client().post("/api/gift-cards/validate", json={"code": code},
                               headers={"Host": _host("acme")})
    assert r.status_code == 200
    assert r.get_json()["data"]["balance"] == "120.00"

    # Redeem: card covers the 100 booking, 20 left on card
    r = acme.post("/api/gift-cards/redeem",
                  json={"code": code, "bookingId": booking["id"]}, headers=h)
    assert r.status_code == 200, r.get_json()
    data = r.get_json()["data"]
    assert data["amountApplied"] == "100.00"
    assert data["remainingBalance"] == "20.00"
    assert data["cardStatus"] == "PARTIALLY_REDEEMED"
    assert data["bookingPaymentStatus"] == "PAID"

    # Booking fully paid -> nothing due -> further redemption rejected
    r = acme.post("/api/gift-cards/redeem",
                  json={"code": code, "bookingId": booking["id"]}, headers=h)
    assert r.status_code == 422

    # Second booking consumes the remaining 20 -> card REDEEMED, booking PARTIAL
    booking2 = _mk_booking(acme, h, price="50.00")
    r = acme.post("/api/gift-cards/redeem",
                  json={"code": code, "bookingId": booking2["id"]}, headers=h)
    data = r.get_json()["data"]
    assert data["amountApplied"] == "20.00"
    assert data["cardStatus"] == "REDEEMED"
    assert data["bookingPaymentStatus"] == "PARTIAL"

    # Exhausted card unusable
    booking3 = _mk_booking(acme, h, price="10.00")
    r = acme.post("/api/gift-cards/redeem",
                  json={"code": code, "bookingId": booking3["id"]}, headers=h)
    assert r.status_code == 422


def test_gift_card_isolation_and_auth(app):
    acme = app.test_client()
    zen = app.test_client()
    acme_token = _login_client(acme, "acme")
    zen_token = _login_client(zen, "zen")
    code = _mk_active_card(app, "acme", amount="30.00")

    # zen cannot validate or redeem acme's card
    r = app.test_client().post("/api/gift-cards/validate", json={"code": code},
                               headers={"Host": _host("zen")})
    assert r.status_code == 404
    zen_booking = _mk_booking(zen, {"Host": _host("zen"), "X-CSRF-Token": zen_token})
    r = zen.post("/api/gift-cards/redeem",
                 json={"code": code, "bookingId": zen_booking["id"]},
                 headers={"Host": _host("zen"), "X-CSRF-Token": zen_token})
    assert r.status_code == 404

    # anonymous cannot redeem at all (the old app allowed this!)
    r = app.test_client().post(
        "/api/gift-cards/redeem",
        json={"code": code, "bookingId": str(uuid.uuid4())},
        headers={"Host": _host("acme")},
    )
    assert r.status_code in (401, 403)


def test_business_hours_and_blocked_dates(app):
    acme = app.test_client()
    token = _login_client(acme, "acme")
    h = {"Host": _host("acme"), "X-CSRF-Token": token}

    hours = [{"dayOfWeek": d, "startTime": "09:00", "endTime": "18:00",
              "isOpen": d != 0} for d in range(7)]
    r = acme.put("/api/business-hours", json={"hours": hours}, headers=h)
    assert r.status_code == 200
    got = r.get_json()["data"]
    assert len(got) == 7 and got[0]["isOpen"] is False

    # Anonymous can read, cannot write
    anon = app.test_client()
    assert anon.get("/api/business-hours", headers={"Host": _host("acme")}).status_code == 200
    r = anon.put("/api/business-hours", json={"hours": hours}, headers={"Host": _host("acme")})
    assert r.status_code in (401, 403)

    # Blocked dates: create, duplicate 409, delete
    r = acme.post("/api/blocked-dates", json={"date": "2026-12-25", "reason": "Holiday"}, headers=h)
    assert r.status_code == 201
    blocked_id = r.get_json()["data"]["id"]
    r = acme.post("/api/blocked-dates", json={"date": "2026-12-25"}, headers=h)
    assert r.status_code == 409
    assert acme.delete(f"/api/blocked-dates/{blocked_id}", headers=h).status_code == 200

    # zen's calendar unaffected by acme's blocks
    acme.post("/api/blocked-dates", json={"date": "2026-12-31"}, headers=h)
    r = anon.get("/api/blocked-dates", headers={"Host": _host("zen")})
    assert all(b["date"] != "2026-12-31" for b in r.get_json()["data"])


def test_staff_and_roles(app):
    acme = app.test_client()
    token = _login_client(acme, "acme")
    h = {"Host": _host("acme"), "X-CSRF-Token": token}

    # Custom role with validated permission keys
    r = acme.post("/api/roles",
                  json={"name": f"Front Desk {uuid.uuid4().hex[:4]}",
                        "permissions": ["bookings.view", "gift_cards.view"]},
                  headers=h)
    assert r.status_code == 201
    role_id = r.get_json()["data"]["id"]
    r = acme.post("/api/roles", json={"name": "Bad", "permissions": ["nope.hack"]}, headers=h)
    assert r.status_code == 400

    # Staff user in the tenant, assigned the custom role
    uname = f"stylist-{uuid.uuid4().hex[:6]}"
    r = acme.post("/api/staff",
                  json={"username": uname, "email": f"{uname}@example.com",
                        "password": "StaffPass123!", "role": "STAFF",
                        "customRoleId": role_id},
                  headers=h)
    assert r.status_code == 201, r.get_json()

    # The new STAFF user can log in and sees only granted pages' APIs
    staff = app.test_client()
    r = staff.get("/api/auth/csrf", headers={"Host": _host("acme")})
    stoken = r.get_json()["data"]["csrfToken"]
    r = staff.post("/api/auth/login",
                   json={"email": f"{uname}@example.com", "password": "StaffPass123!"},
                   headers={"Host": _host("acme"), "X-CSRF-Token": stoken})
    assert r.status_code == 200
    assert r.get_json()["data"]["user"]["permissions"] == ["bookings.view", "gift_cards.view"]
    # bookings allowed, services mutation forbidden
    assert staff.get("/api/bookings", headers={"Host": _host("acme")}).status_code == 200
    scsrf = staff.get_cookie("paulux_csrf", domain="lvh.me").value
    r = staff.post("/api/services",
                   json={"name": "X", "durationMinutes": 10, "price": "5"},
                   headers={"Host": _host("acme"), "X-CSRF-Token": scsrf})
    assert r.status_code == 403


def test_org_settings_and_branding(app):
    acme = app.test_client()
    token = _login_client(acme, "acme")
    h = {"Host": _host("acme"), "X-CSRF-Token": token}

    r = acme.put("/api/organization",
                 json={"name": "Acme Beauty & Spa", "primaryColor": "#c04080",
                       "paystackSecretKey": "sk_test_abc", "paystackPublicKey": "pk_test_abc"},
                 headers=h)
    assert r.status_code == 200
    data = r.get_json()["data"]
    assert data["name"] == "Acme Beauty & Spa"
    assert data["paymentsConfigured"] is True
    assert "sk_test" not in str(data)  # secret never echoed

    # Public branding endpoint works anonymously; still no secret
    r = app.test_client().get("/api/organization", headers={"Host": _host("acme")})
    assert r.get_json()["data"]["paystackPublicKey"] == "pk_test_abc"
    assert "sk_test" not in r.get_data(as_text=True)

    # Key-value settings round-trip
    r = acme.put("/api/settings", json={"settings": {"sms_sender": "ACME"}}, headers=h)
    assert r.status_code == 200
    r = acme.get("/api/settings", headers={"Host": _host("acme")})
    assert r.get_json()["data"]["sms_sender"] == "ACME"
