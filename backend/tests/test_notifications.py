"""Phase 3: notifications dispatch (email/SMS) on domain events.

The test env uses the in-memory notification backend and eager Celery, so we
assert against the shared outbox without sending anything real.
"""
from __future__ import annotations

import hashlib
import hmac
import json
import uuid
from decimal import Decimal

import pytest

from app.extensions import db
from app.models.booking import Booking, PaymentStatus
from app.models.organization import Organization
from app.models.payment import Payment, PaymentProvider
from app.notifications.providers import outbox
from tests.conftest import PASSWORD, _host


@pytest.fixture(autouse=True)
def _clear_outbox():
    outbox.clear()
    yield
    outbox.clear()


def _login(client, slug):
    r = client.get("/api/auth/csrf", headers={"Host": _host(slug)})
    token = r.get_json()["data"]["csrfToken"]
    r = client.post("/api/auth/login",
                    json={"email": "admin@shared.example.com", "password": PASSWORD},
                    headers={"Host": _host(slug), "X-CSRF-Token": token})
    assert r.status_code == 200
    return client.get_cookie("paulux_csrf", domain="lvh.me").value


def _svc(client, h, price="80.00"):
    r = client.post("/api/services",
                    json={"name": f"N {uuid.uuid4().hex[:6]}", "durationMinutes": 30,
                          "price": price, "isActive": True, "minDepositFixed": "20.00"},
                    headers=h)
    return r.get_json()["data"]["id"]


def _public_booking(client, host, svc_id, email="guest@customer.example.com"):
    return client.post("/api/bookings/public", json={
        "clientName": "Ama", "clientEmail": email, "clientPhone": "+233501112222",
        "bookingDate": "2026-11-02", "bookingTime": "10:00",
        "services": [{"serviceId": svc_id}],
    }, headers={"Host": host})


def test_public_booking_sends_confirmation(app):
    acme = app.test_client()
    token = _login(acme, "acme")
    svc = _svc(acme, {"Host": _host("acme"), "X-CSRF-Token": token})

    r = _public_booking(acme, _host("acme"), svc)
    assert r.status_code == 201

    # One confirmation email + one SMS to the client
    assert any(e.kind == "booking_confirmation" and e.to == "guest@customer.example.com"
               for e in outbox.emails)
    assert any(s.kind == "booking_confirmation" for s in outbox.sms)
    email = next(e for e in outbox.emails if e.kind == "booking_confirmation")
    assert r.get_json()["data"]["bookingReference"] in email.html


def test_status_change_notifies(app):
    acme = app.test_client()
    token = _login(acme, "acme")
    h = {"Host": _host("acme"), "X-CSRF-Token": token}
    svc = _svc(acme, h)
    bid = _public_booking(acme, _host("acme"), svc).get_json()["data"]["id"]

    outbox.clear()
    acme.patch(f"/api/bookings/{bid}/status", json={"status": "CONFIRMED"}, headers=h)
    assert any(e.kind == "booking_status" for e in outbox.emails)

    outbox.clear()
    acme.post(f"/api/bookings/{bid}/reschedule",
              json={"bookingDate": "2026-11-05", "bookingTime": "14:00"}, headers=h)
    email = next(e for e in outbox.emails if e.kind == "booking_status")
    assert "rescheduled" in email.subject.lower()


def test_manual_payment_sends_receipt(app):
    acme = app.test_client()
    token = _login(acme, "acme")
    h = {"Host": _host("acme"), "X-CSRF-Token": token}
    svc = _svc(acme, h, price="100.00")
    bid = _public_booking(acme, _host("acme"), svc).get_json()["data"]["id"]

    r = acme.post("/api/payments/manual-methods", json={"name": f"Cash {uuid.uuid4().hex[:4]}"}, headers=h)
    method_id = r.get_json()["data"]["id"]

    outbox.clear()
    r = acme.post("/api/payments/manual",
                  json={"bookingId": bid, "amount": "100.00", "manualMethodId": method_id}, headers=h)
    assert r.status_code == 201
    receipt = next((e for e in outbox.emails if e.kind == "payment_receipt"), None)
    assert receipt is not None and "GHS 100.00" in receipt.html


def test_low_stock_alert_to_admins(app):
    acme = app.test_client()
    token = _login(acme, "acme")
    h = {"Host": _host("acme"), "X-CSRF-Token": token}

    # Product tracking stock, starting at 6, threshold 5
    r = acme.post("/api/products", json={
        "name": f"Oil {uuid.uuid4().hex[:5]}", "price": "45.00",
        "isActive": True, "trackStock": True, "lowStockThreshold": 5,
    }, headers=h)
    pid = r.get_json()["data"]["id"]
    acme.post(f"/api/products/{pid}/stock", json={"type": "IN", "quantity": 6}, headers=h)

    outbox.clear()
    # Sell 2 -> 4, crosses threshold (5) -> alert fires
    acme.post(f"/api/products/{pid}/stock", json={"type": "OUT", "quantity": 2}, headers=h)
    assert any(e.kind == "low_stock" for e in outbox.emails)

    outbox.clear()
    # Sell 1 more -> 3, already below threshold -> no new alert (no spam)
    acme.post(f"/api/products/{pid}/stock", json={"type": "OUT", "quantity": 1}, headers=h)
    assert not any(e.kind == "low_stock" for e in outbox.emails)


def _mk_paid_pending(app, slug, booking_id, amount):
    with app.app_context():
        org = db.session.execute(
            db.select(Organization).filter_by(slug=slug).execution_options(skip_tenant_filter=True)
        ).scalar_one()
        org.paystack_secret_encrypted = "sk_test_notif"
        p = Payment(organization_id=org.id, booking_id=uuid.UUID(booking_id),
                    provider=PaymentProvider.PAYSTACK,
                    provider_ref="PAY-N" + uuid.uuid4().hex[:8].upper(),
                    amount=Decimal(amount), currency="GHS", status=PaymentStatus.PENDING)
        db.session.add(p)
        db.session.commit()
        return "sk_test_notif", p.provider_ref


def test_webhook_success_sends_receipt(app):
    acme = app.test_client()
    token = _login(acme, "acme")
    h = {"Host": _host("acme"), "X-CSRF-Token": token}
    svc = _svc(acme, h, price="150.00")
    bid = _public_booking(acme, _host("acme"), svc).get_json()["data"]["id"]
    secret, ref = _mk_paid_pending(app, "acme", bid, "150.00")

    event = {"event": "charge.success",
             "data": {"reference": ref, "status": "success", "amount": 15000, "currency": "GHS"}}
    raw = json.dumps(event).encode()
    sig = hmac.new(secret.encode(), raw, hashlib.sha512).hexdigest()

    outbox.clear()
    r = app.test_client().post("/api/payments/webhook", data=raw,
                               headers={"Host": _host("acme"), "Content-Type": "application/json",
                                        "X-Paystack-Signature": sig})
    assert r.status_code == 200
    assert any(e.kind == "payment_receipt" for e in outbox.emails)
