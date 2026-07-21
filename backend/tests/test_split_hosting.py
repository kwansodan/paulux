"""Tenant resolution when the SPA and API are hosted separately.

With the frontend on Vercel at ``<slug>.<base>`` and the API at ``api.<base>``,
the API's own Host is a reserved label and carries no tenant — the client states
it in ``X-Tenant-Slug`` instead. These tests pin that the fallback works, that
Host still wins where it is meaningful, and that the header is not a way around
tenant isolation.
"""
from __future__ import annotations

from tests.conftest import BASE_DOMAIN, PASSWORD, _host

API_HOST = f"api.{BASE_DOMAIN}"


def _csrf(client, headers):
    r = client.get("/api/auth/csrf", headers=headers)
    return r.get_json()["data"]["csrfToken"]


def test_api_host_alone_resolves_no_tenant(client):
    r = client.get("/api/health", headers={"Host": API_HOST})
    assert r.status_code == 200
    assert r.get_json()["data"]["tenant"] is None


def test_header_resolves_tenant_when_host_has_none(client):
    r = client.get("/api/health", headers={"Host": API_HOST, "X-Tenant-Slug": "acme"})
    assert r.status_code == 200
    assert r.get_json()["data"]["tenant"] == "acme"


def test_host_wins_over_header(client):
    """A meaningful Host is authoritative — the header cannot override it."""
    r = client.get(
        "/api/health", headers={"Host": _host("acme"), "X-Tenant-Slug": "zen"}
    )
    assert r.get_json()["data"]["tenant"] == "acme"


def test_malformed_and_reserved_headers_resolve_no_tenant(client):
    for bad in ["", "not a slug", "acme.lvh.me", "www", "api", "../acme", "A" * 80]:
        r = client.get("/api/health", headers={"Host": API_HOST, "X-Tenant-Slug": bad})
        assert r.status_code == 200
        assert r.get_json()["data"]["tenant"] is None, f"leaked on {bad!r}"


def test_header_cannot_cross_tenants_after_login(client):
    """Swapping the header post-login must not grant access to another org."""
    headers = {"Host": API_HOST, "X-Tenant-Slug": "acme"}
    token = _csrf(client, headers)
    r = client.post(
        "/api/auth/login",
        json={"email": "admin@shared.example.com", "password": PASSWORD},
        headers={**headers, "X-CSRF-Token": token},
    )
    assert r.status_code == 200

    # Same session, but claiming to be the other tenant. /me is a soft probe:
    # it reports no user rather than erroring.
    zen = {"Host": API_HOST, "X-Tenant-Slug": "zen"}
    me = client.get("/api/auth/me", headers=zen)
    assert me.get_json()["data"]["user"] is None

    # A guarded route rejects outright — the header buys no cross-tenant access.
    # Login rotates the CSRF cookie, so echo the *current* one; otherwise this
    # would fail on CSRF (403) and never exercise the tenant check.
    fresh = client.get_cookie("paulux_csrf", domain=BASE_DOMAIN).value
    r = client.post(
        "/api/services",
        json={"name": "Nope", "durationMinutes": 30, "price": "40.00"},
        headers={**zen, "X-CSRF-Token": fresh},
    )
    assert r.status_code == 401

    # Still fine on the tenant the session actually belongs to.
    me = client.get("/api/auth/me", headers=headers)
    assert me.get_json()["data"]["user"]["email"] == "admin@shared.example.com"
