"""Payments: raw-body HMAC, amount validation, idempotency, manual flow,
refund gating, isolation. Gateway network calls never happen in tests — the
webhook/verify paths are driven with locally-signed payloads and direct calls
to the processing functions.
"""
from __future__ import annotations

import hashlib
import hmac
import json
import uuid
from decimal import Decimal

from app.extensions import db
from app.models.booking import Booking, PaymentStatus
from app.models.organization import Organization
from app.models.payment import Payment, PaymentProvider
from app.services.paystack import verify_webhook_signature
from tests.conftest import PASSWORD, _host

TEST_SECRET = "sk_test_dummy_secret_for_hmac"


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
    return cookie.value


def _mk_booking(client, headers, host, price="100.00"):
    r = client.post(
        "/api/services",
        json={"name": f"PaySvc {uuid.uuid4().hex[:6]}", "durationMinutes": 30,
              "price": price, "isActive": True},
        headers=headers,
    )
    svc_id = r.get_json()["data"]["id"]
    r = client.post(
        "/api/bookings",
        json={
            "clientName": "Kofi Boateng",
            "clientEmail": "kofi@customer.example.com",
            "clientPhone": "+233501112222",
            "bookingDate": "2026-09-01",
            "bookingTime": "11:00",
            "services": [{"serviceId": svc_id}],
        },
        headers=headers,
    )
    assert r.status_code == 201
    return r.get_json()["data"]


def _set_org_secret(app, slug, secret=TEST_SECRET):
    with app.app_context():
        org = db.session.execute(
            db.select(Organization).filter_by(slug=slug)
            .execution_options(skip_tenant_filter=True)
        ).scalar_one()
        org.paystack_secret_encrypted = secret  # plaintext in tests (no enc key)
        db.session.commit()
        return org.id


def _mk_pending_paystack_payment(app, org_id, booking_id, amount: str):
    with app.app_context():
        payment = Payment(
            organization_id=org_id,
            booking_id=uuid.UUID(booking_id),
            provider=PaymentProvider.PAYSTACK,
            provider_ref="PAY-TEST" + uuid.uuid4().hex[:8].upper(),
            amount=Decimal(amount),
            currency="GHS",
            status=PaymentStatus.PENDING,
        )
        db.session.add(payment)
        db.session.commit()
        return payment.provider_ref


def _sign(raw: bytes, secret=TEST_SECRET) -> str:
    return hmac.new(secret.encode(), raw, hashlib.sha512).hexdigest()


# --- signature primitives ----------------------------------------------------------

def test_webhook_signature_over_raw_bytes():
    raw = b'{"event":"charge.success","data":{"amount":10000}}'
    assert verify_webhook_signature(TEST_SECRET, raw, _sign(raw))
    # Tampered body fails
    assert not verify_webhook_signature(TEST_SECRET, raw + b" ", _sign(raw))
    # Wrong key fails; missing signature fails
    assert not verify_webhook_signature("other", raw, _sign(raw))
    assert not verify_webhook_signature(TEST_SECRET, raw, None)


# --- webhook endpoint ---------------------------------------------------------------

def test_webhook_marks_payment_paid_and_is_idempotent(app):
    acme = app.test_client()
    token = _login_client(acme, "acme")
    admin_h = {"Host": _host("acme"), "X-CSRF-Token": token}
    booking = _mk_booking(acme, admin_h, "acme", price="150.00")
    org_id = _set_org_secret(app, "acme")
    ref = _mk_pending_paystack_payment(app, org_id, booking["id"], "150.00")

    event = {
        "event": "charge.success",
        "data": {"reference": ref, "status": "success",
                 "amount": 15000, "currency": "GHS"},
    }
    raw = json.dumps(event).encode()
    anon = app.test_client()
    r = anon.post(
        "/api/payments/webhook", data=raw,
        headers={"Host": _host("acme"), "Content-Type": "application/json",
                 "X-Paystack-Signature": _sign(raw)},
    )
    assert r.status_code == 200, r.get_json()

    r = acme.get(f"/api/bookings/{booking['id']}", headers={"Host": _host("acme")})
    assert r.get_json()["data"]["paymentStatus"] == "PAID"

    # Redelivery: still 200, still exactly one PAID payment
    r = anon.post(
        "/api/payments/webhook", data=raw,
        headers={"Host": _host("acme"), "Content-Type": "application/json",
                 "X-Paystack-Signature": _sign(raw)},
    )
    assert r.status_code == 200
    r = acme.get("/api/payments", headers={"Host": _host("acme")})
    paid = [p for p in r.get_json()["data"] if p["providerRef"] == ref]
    assert len(paid) == 1 and paid[0]["status"] == "PAID"


def test_webhook_rejects_bad_signature_and_amount_mismatch(app):
    acme = app.test_client()
    token = _login_client(acme, "acme")
    admin_h = {"Host": _host("acme"), "X-CSRF-Token": token}
    booking = _mk_booking(acme, admin_h, "acme", price="80.00")
    org_id = _set_org_secret(app, "acme")
    ref = _mk_pending_paystack_payment(app, org_id, booking["id"], "80.00")

    event = {"event": "charge.success",
             "data": {"reference": ref, "status": "success",
                      "amount": 8000, "currency": "GHS"}}
    raw = json.dumps(event).encode()

    # Bad signature -> 401, payment untouched
    anon = app.test_client()
    r = anon.post("/api/payments/webhook", data=raw,
                  headers={"Host": _host("acme"), "Content-Type": "application/json",
                           "X-Paystack-Signature": "deadbeef"})
    assert r.status_code == 401

    # Valid signature but WRONG amount (paid 1 pesewa) -> payment FAILED, not PAID
    bad_event = {"event": "charge.success",
                 "data": {"reference": ref, "status": "success",
                          "amount": 1, "currency": "GHS"}}
    bad_raw = json.dumps(bad_event).encode()
    r = anon.post("/api/payments/webhook", data=bad_raw,
                  headers={"Host": _host("acme"), "Content-Type": "application/json",
                           "X-Paystack-Signature": _sign(bad_raw)})
    assert r.status_code == 200  # acked, but…
    r = acme.get("/api/payments", headers={"Host": _host("acme")})
    row = next(p for p in r.get_json()["data"] if p["providerRef"] == ref)
    assert row["status"] == "FAILED"
    assert "mismatch" in (row["reason"] or "").lower()
    r = acme.get(f"/api/bookings/{booking['id']}", headers={"Host": _host("acme")})
    assert r.get_json()["data"]["paymentStatus"] == "PENDING"  # not paid!


# --- manual payments -----------------------------------------------------------------

def test_manual_payment_partial_then_full_and_overpayment_guard(app):
    acme = app.test_client()
    token = _login_client(acme, "acme")
    admin_h = {"Host": _host("acme"), "X-CSRF-Token": token}
    booking = _mk_booking(acme, admin_h, "acme", price="200.00")

    r = acme.post("/api/payments/manual-methods",
                  json={"name": f"Cash {uuid.uuid4().hex[:4]}"}, headers=admin_h)
    assert r.status_code == 201
    method_id = r.get_json()["data"]["id"]

    # Partial 50 -> PARTIAL
    r = acme.post("/api/payments/manual",
                  json={"bookingId": booking["id"], "amount": "50.00",
                        "manualMethodId": method_id},
                  headers=admin_h)
    assert r.status_code == 201, r.get_json()
    r = acme.get(f"/api/bookings/{booking['id']}", headers={"Host": _host("acme")})
    assert r.get_json()["data"]["paymentStatus"] == "PARTIAL"

    # Overpayment guard: 200 > 150 outstanding -> 422
    r = acme.post("/api/payments/manual",
                  json={"bookingId": booking["id"], "amount": "200.00",
                        "manualMethodId": method_id},
                  headers=admin_h)
    assert r.status_code == 422

    # Remaining 150 -> PAID
    r = acme.post("/api/payments/manual",
                  json={"bookingId": booking["id"], "amount": "150.00",
                        "manualMethodId": method_id},
                  headers=admin_h)
    assert r.status_code == 201
    r = acme.get(f"/api/bookings/{booking['id']}", headers={"Host": _host("acme")})
    assert r.get_json()["data"]["paymentStatus"] == "PAID"


def test_manual_refund_and_isolation(app):
    acme = app.test_client()
    zen = app.test_client()
    acme_token = _login_client(acme, "acme")
    zen_token = _login_client(zen, "zen")
    acme_h = {"Host": _host("acme"), "X-CSRF-Token": acme_token}
    zen_h = {"Host": _host("zen"), "X-CSRF-Token": zen_token}

    booking = _mk_booking(acme, acme_h, "acme", price="60.00")
    r = acme.post("/api/payments/manual-methods",
                  json={"name": f"MoMo {uuid.uuid4().hex[:4]}"}, headers=acme_h)
    method_id = r.get_json()["data"]["id"]
    r = acme.post("/api/payments/manual",
                  json={"bookingId": booking["id"], "amount": "60.00",
                        "manualMethodId": method_id},
                  headers=acme_h)
    payment_id = r.get_json()["data"]["id"]

    # zen cannot refund acme's payment
    r = zen.post(f"/api/payments/{payment_id}/refund", json={}, headers=zen_h)
    assert r.status_code == 404

    # acme refunds; booking returns to PENDING; double refund blocked
    r = acme.post(f"/api/payments/{payment_id}/refund",
                  json={"reason": "client cancelled"}, headers=acme_h)
    assert r.status_code == 200
    assert r.get_json()["data"]["status"] == "REFUNDED"
    r = acme.get(f"/api/bookings/{booking['id']}", headers={"Host": _host("acme")})
    assert r.get_json()["data"]["paymentStatus"] == "PENDING"
    r = acme.post(f"/api/payments/{payment_id}/refund", json={}, headers=acme_h)
    assert r.status_code == 422


def test_payments_endpoints_require_auth(app):
    anon = app.test_client()
    assert anon.get("/api/payments", headers={"Host": _host("acme")}).status_code in (401, 403)
    r = anon.post("/api/payments/manual",
                  json={"bookingId": str(uuid.uuid4()), "amount": "10",
                        "manualMethodId": str(uuid.uuid4())},
                  headers={"Host": _host("acme")})
    assert r.status_code in (401, 403)
