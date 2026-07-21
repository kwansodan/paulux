"""Phase 2 verification: catalog CRUD + cross-tenant isolation (anti-IDOR)."""
from __future__ import annotations

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
    # Login rotates the CSRF cookie; use the fresh one (as the SPA does).
    cookie = client.get_cookie("paulux_csrf", domain="lvh.me")
    assert cookie is not None, "csrf cookie missing after login"
    return cookie.value


def _post(client, slug, token, url, body):
    return client.post(
        url, json=body, headers={"Host": _host(slug), "X-CSRF-Token": token}
    )


SERVICE_BODY = {
    "name": "Deep Tissue Massage",
    "durationMinutes": 60,
    "price": "80.00",
    "minDepositFixed": "20.00",
    "isActive": True,
}


def test_service_crud_and_isolation(app):
    acme = app.test_client()
    zen = app.test_client()
    acme_token = _login_client(acme, "acme")
    zen_token = _login_client(zen, "zen")

    # Create a service in acme
    r = _post(acme, "acme", acme_token, "/api/services", SERVICE_BODY)
    assert r.status_code == 201, r.get_json()
    svc = r.get_json()["data"]
    assert svc["price"] == "80.00"
    service_id = svc["id"]

    # acme sees it
    r = acme.get("/api/services", headers={"Host": _host("acme")})
    assert any(s["id"] == service_id for s in r.get_json()["data"])

    # zen's list does NOT include it
    r = zen.get("/api/services", headers={"Host": _host("zen")})
    assert all(s["id"] != service_id for s in r.get_json()["data"])

    # zen cannot fetch it directly by id (404, not 403 — no existence leak)
    r = zen.get(f"/api/services/{service_id}", headers={"Host": _host("zen")})
    assert r.status_code == 404

    # zen cannot mutate or delete it
    r = zen.put(
        f"/api/services/{service_id}",
        json={**SERVICE_BODY, "name": "Hijacked"},
        headers={"Host": _host("zen"), "X-CSRF-Token": zen_token},
    )
    assert r.status_code == 404
    r = zen.delete(
        f"/api/services/{service_id}",
        headers={"Host": _host("zen"), "X-CSRF-Token": zen_token},
    )
    assert r.status_code == 404

    # ... and the service is untouched for acme
    r = acme.get(f"/api/services/{service_id}", headers={"Host": _host("acme")})
    assert r.get_json()["data"]["name"] == "Deep Tissue Massage"


def test_mutations_require_auth(client):
    r = client.post(
        "/api/services", json=SERVICE_BODY, headers={"Host": _host("acme")}
    )
    # No session (and no CSRF) -> rejected, never created
    assert r.status_code in (401, 403)


def test_public_list_hides_inactive(app):
    acme = app.test_client()
    token = _login_client(acme, "acme")
    r = _post(
        acme, "acme", token, "/api/services",
        {**SERVICE_BODY, "name": "Hidden Facial", "isActive": False},
    )
    assert r.status_code == 201

    anon = app.test_client()
    r = anon.get("/api/services", headers={"Host": _host("acme")})
    names = [s["name"] for s in r.get_json()["data"]]
    assert "Hidden Facial" not in names

    # ...but the signed-in admin still sees it
    r = acme.get("/api/services", headers={"Host": _host("acme")})
    names = [s["name"] for s in r.get_json()["data"]]
    assert "Hidden Facial" in names


def test_same_category_name_across_tenants(app):
    acme = app.test_client()
    zen = app.test_client()
    acme_token = _login_client(acme, "acme")
    zen_token = _login_client(zen, "zen")

    body = {"name": "Hair", "capacity": 2}
    assert _post(acme, "acme", acme_token, "/api/service-categories", body).status_code == 201
    # Same name in another tenant is fine (composite unique)...
    assert _post(zen, "zen", zen_token, "/api/service-categories", body).status_code == 201
    # ...but a duplicate within the same tenant conflicts
    assert _post(acme, "acme", acme_token, "/api/service-categories", body).status_code == 409
