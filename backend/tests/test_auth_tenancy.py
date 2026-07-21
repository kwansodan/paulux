"""Phase 0 verification: auth round-trip, CSRF, and cross-tenant isolation."""
from __future__ import annotations

from tests.conftest import BASE_DOMAIN, PASSWORD, _host


def _csrf(client, slug):
    r = client.get("/api/auth/csrf", headers={"Host": _host(slug)})
    return r.get_json()["data"]["csrfToken"]


def _login(client, slug, email="admin@shared.example.com", password=PASSWORD):
    token = _csrf(client, slug)
    return client.post(
        "/api/auth/login",
        json={"email": email, "password": password},
        headers={"Host": _host(slug), "X-CSRF-Token": token},
    )


def test_health_reports_tenant(client):
    r = client.get("/api/health", headers={"Host": _host("acme")})
    assert r.status_code == 200
    assert r.get_json()["data"]["tenant"] == "acme"


def test_login_success_scoped_to_tenant(client):
    r = _login(client, "acme")
    assert r.status_code == 200
    user = r.get_json()["data"]["user"]
    assert user["email"] == "admin@shared.example.com"
    # /me on the same subdomain returns the acme user
    me = client.get("/api/auth/me", headers={"Host": _host("acme")})
    assert me.get_json()["data"]["user"]["organizationId"] == user["organizationId"]


def test_login_requires_csrf(client):
    # No X-CSRF-Token header -> rejected even with valid creds.
    r = client.post(
        "/api/auth/login",
        json={"email": "admin@shared.example.com", "password": PASSWORD},
        headers={"Host": _host("acme")},
    )
    assert r.status_code == 403


def test_wrong_password_rejected(client):
    r = _login(client, "acme", password="nope")
    assert r.status_code == 401


def test_login_on_unknown_tenant_404(client):
    r = _login(client, "ghost")
    assert r.status_code == 404


def test_session_does_not_leak_across_tenants(client):
    # Log in on acme, then try to use that session on zen's subdomain.
    login = _login(client, "acme")
    assert login.status_code == 200
    me_zen = client.get("/api/auth/me", headers={"Host": _host("zen")})
    # Same cookie jar, different subdomain -> treated as no user.
    assert me_zen.get_json()["data"]["user"] is None


def test_same_email_allowed_across_tenants(client):
    # Both orgs were seeded with admin@shared.example.com; logging into each works,
    # proving (organization_id, email) composite uniqueness rather than global.
    assert _login(client, "acme").status_code == 200
    # fresh client to avoid cookie carryover
    assert _login(client, "zen").status_code == 200
