"""Phase 2 gap coverage: reschedule, top-up, per-service assignment,
availability slots, public lookup/reschedule, style images, reports."""
from __future__ import annotations

import uuid

from tests.conftest import PASSWORD, _host


def _login(client, slug):
    r = client.get("/api/auth/csrf", headers={"Host": _host(slug)})
    token = r.get_json()["data"]["csrfToken"]
    r = client.post("/api/auth/login",
                    json={"email": "admin@shared.example.com", "password": PASSWORD},
                    headers={"Host": _host(slug), "X-CSRF-Token": token})
    assert r.status_code == 200
    return client.get_cookie("paulux_csrf", domain="lvh.me").value


def _svc(client, h, price="40.00", name=None):
    r = client.post("/api/services",
                    json={"name": name or f"S {uuid.uuid4().hex[:6]}",
                          "durationMinutes": 30, "price": price, "isActive": True},
                    headers=h)
    return r.get_json()["data"]["id"]


def _booking(client, h, svc_ids):
    r = client.post("/api/bookings",
                    json={"clientName": "Kojo", "clientEmail": "kojo@customer.example.com",
                          "clientPhone": "+233501110000", "bookingDate": "2026-09-15",
                          "bookingTime": "10:00",
                          "services": [{"serviceId": s} for s in svc_ids]},
                    headers=h)
    assert r.status_code == 201, r.get_json()
    return r.get_json()["data"]


def test_reschedule_and_topup(app):
    acme = app.test_client()
    token = _login(acme, "acme")
    h = {"Host": _host("acme"), "X-CSRF-Token": token}
    s1 = _svc(acme, h, "40.00")
    booking = _booking(acme, h, [s1])
    bid = booking["id"]
    assert booking["total"] == "40.00"

    # Reschedule
    r = acme.post(f"/api/bookings/{bid}/reschedule",
                  json={"bookingDate": "2026-09-20", "bookingTime": "14:00"}, headers=h)
    assert r.status_code == 200
    assert r.get_json()["data"]["bookingDate"] == "2026-09-20"

    # Top-up with a second service -> total grows
    s2 = _svc(acme, h, "25.00")
    r = acme.post(f"/api/bookings/{bid}/top-up",
                  json={"services": [{"serviceId": s2}]}, headers=h)
    assert r.status_code == 200
    assert r.get_json()["data"]["total"] == "65.00"
    # Duplicate service rejected
    r = acme.post(f"/api/bookings/{bid}/top-up",
                  json={"services": [{"serviceId": s2}]}, headers=h)
    assert r.status_code == 422

    # Cancelled booking can't be rescheduled
    acme.patch(f"/api/bookings/{bid}/status", json={"status": "CANCELLED"}, headers=h)
    r = acme.post(f"/api/bookings/{bid}/reschedule",
                  json={"bookingDate": "2026-09-25", "bookingTime": "09:00"}, headers=h)
    assert r.status_code == 422


def test_per_service_assignment(app):
    acme = app.test_client()
    token = _login(acme, "acme")
    h = {"Host": _host("acme"), "X-CSRF-Token": token}
    s1 = _svc(acme, h)
    s2 = _svc(acme, h)
    booking = _booking(acme, h, [s1, s2])

    # Create a staff member to assign
    uname = f"stylist-{uuid.uuid4().hex[:6]}"
    r = acme.post("/api/staff",
                  json={"username": uname, "email": f"{uname}@example.com",
                        "password": "StaffPass123!", "role": "STAFF"}, headers=h)
    staff_id = r.get_json()["data"]["id"]

    r = acme.post(f"/api/bookings/{booking['id']}/assign-services",
                  json={"assignments": [{"serviceId": s1, "assignedToId": staff_id}]},
                  headers=h)
    assert r.status_code == 200
    services = {s["serviceId"]: s for s in r.get_json()["data"]["services"]}
    assert services[s1]["assignedToId"] == staff_id
    assert services[s2]["assignedToId"] is None

    # Assigning a service not on the booking -> 422
    r = acme.post(f"/api/bookings/{booking['id']}/assign-services",
                  json={"assignments": [{"serviceId": str(uuid.uuid4()), "assignedToId": staff_id}]},
                  headers=h)
    assert r.status_code == 422


def test_availability_slots(app):
    zen = app.test_client()
    token = _login(zen, "zen")
    h = {"Host": _host("zen"), "X-CSRF-Token": token}
    # Open Wednesday 09:00-11:00, capacity 1
    hours = [{"dayOfWeek": d, "startTime": "09:00", "endTime": "11:00",
              "isOpen": d == 3, "maxConcurrentBookings": 1} for d in range(7)]
    zen.put("/api/business-hours", json={"hours": hours}, headers=h)

    anon = app.test_client()
    # 2026-09-16 is a Wednesday
    r = anon.get("/api/bookings/availability?date=2026-09-16", headers={"Host": _host("zen")})
    assert r.status_code == 200
    slots = r.get_json()["data"]["slots"]
    assert slots == ["09:00", "09:30", "10:00", "10:30"]

    # Book 09:00 (capacity 1) -> that slot disappears
    svc = _svc(zen, h)
    zen.post("/api/bookings",
             json={"clientName": "X", "clientEmail": "x@customer.example.com",
                   "clientPhone": "+2330", "bookingDate": "2026-09-16",
                   "bookingTime": "09:00", "services": [{"serviceId": svc}]}, headers=h)
    r = anon.get("/api/bookings/availability?date=2026-09-16", headers={"Host": _host("zen")})
    assert "09:00" not in r.get_json()["data"]["slots"]

    # Closed day (Monday 2026-09-14) -> no slots
    r = anon.get("/api/bookings/availability?date=2026-09-14", headers={"Host": _host("zen")})
    assert r.get_json()["data"]["slots"] == []


def test_public_lookup_and_reschedule(app):
    acme = app.test_client()
    token = _login(acme, "acme")
    h = {"Host": _host("acme"), "X-CSRF-Token": token}
    svc = _svc(acme, h)
    booking = _booking(acme, h, [svc])
    ref = booking["bookingReference"]

    anon = app.test_client()
    # Public lookup returns a customer-safe view (no assignment/email fields)
    r = anon.get(f"/api/bookings/public/{ref}", headers={"Host": _host("acme")})
    assert r.status_code == 200
    view = r.get_json()["data"]
    assert view["bookingReference"] == ref
    assert "assignedTo" not in view and "clientEmail" not in view

    # Public reschedule by reference works
    r = anon.post(f"/api/bookings/public/{ref}/reschedule",
                  json={"bookingDate": "2026-09-22", "bookingTime": "11:00"},
                  headers={"Host": _host("acme")})
    assert r.status_code == 200
    assert r.get_json()["data"]["bookingDate"] == "2026-09-22"

    # Unknown reference -> 404; cross-tenant lookup -> 404
    assert anon.get("/api/bookings/public/BK-NONE9999",
                    headers={"Host": _host("acme")}).status_code == 404
    assert anon.get(f"/api/bookings/public/{ref}",
                    headers={"Host": _host("zen")}).status_code == 404


def test_style_images(app):
    acme = app.test_client()
    zen = app.test_client()
    at = _login(acme, "acme")
    zt = _login(zen, "zen")
    ah = {"Host": _host("acme"), "X-CSRF-Token": at}

    r = acme.post("/api/style-images",
                  json={"url": "https://cdn.example.com/a.jpg", "caption": "Braids",
                        "sortOrder": 1, "isActive": True}, headers=ah)
    assert r.status_code == 201
    img_id = r.get_json()["data"]["id"]

    # Inactive image hidden from public, visible to admin
    acme.post("/api/style-images",
              json={"url": "https://cdn.example.com/hidden.jpg", "isActive": False}, headers=ah)
    anon = app.test_client()
    r = anon.get("/api/style-images", headers={"Host": _host("acme")})
    urls = [i["url"] for i in r.get_json()["data"]]
    assert "https://cdn.example.com/a.jpg" in urls
    assert "https://cdn.example.com/hidden.jpg" not in urls

    # Isolation: zen can't see or delete acme's image
    r = zen.get("/api/style-images", headers={"Host": _host("zen")})
    assert all(i["id"] != img_id for i in r.get_json()["data"])
    r = zen.delete(f"/api/style-images/{img_id}",
                   headers={"Host": _host("zen"), "X-CSRF-Token": zt})
    assert r.status_code == 404

    # anon can't write
    assert app.test_client().post("/api/style-images", json={"url": "x"},
                                  headers={"Host": _host("acme")}).status_code in (401, 403)


def test_reports_summary(app):
    acme = app.test_client()
    token = _login(acme, "acme")
    h = {"Host": _host("acme"), "X-CSRF-Token": token}
    r = acme.get("/api/reports/summary", headers={"Host": _host("acme")})
    assert r.status_code == 200
    data = r.get_json()["data"]
    assert set(data.keys()) >= {"totalRevenue", "bookingsCount", "dailyRevenue", "topServices"}
    # anon blocked
    assert app.test_client().get("/api/reports/summary",
                                 headers={"Host": _host("acme")}).status_code in (401, 403)
