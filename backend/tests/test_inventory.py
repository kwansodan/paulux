"""Inventory: product CRUD, stock movement math, and cross-tenant isolation."""
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
    cookie = client.get_cookie("paulux_csrf", domain="lvh.me")
    assert cookie is not None
    return cookie.value


PRODUCT_BODY = {
    "name": "Argan Hair Oil",
    "price": "45.00",
    "isActive": True,
    "trackStock": True,
    "lowStockThreshold": 3,
}


def test_product_stock_flow_and_isolation(app):
    acme = app.test_client()
    zen = app.test_client()
    acme_token = _login_client(acme, "acme")
    zen_token = _login_client(zen, "zen")
    acme_h = {"Host": _host("acme"), "X-CSRF-Token": acme_token}
    zen_h = {"Host": _host("zen"), "X-CSRF-Token": zen_token}

    r = acme.post("/api/products", json=PRODUCT_BODY, headers=acme_h)
    assert r.status_code == 201, r.get_json()
    product = r.get_json()["data"]
    pid = product["id"]
    assert product["stockQuantity"] == 0

    # IN 10 -> 10
    r = acme.post(f"/api/products/{pid}/stock",
                  json={"type": "IN", "quantity": 10}, headers=acme_h)
    assert r.status_code == 200
    assert r.get_json()["data"]["newStock"] == 10

    # OUT 4 -> 6
    r = acme.post(f"/api/products/{pid}/stock",
                  json={"type": "OUT", "quantity": 4}, headers=acme_h)
    assert r.get_json()["data"]["newStock"] == 6

    # OUT 100 -> clamped at 0
    r = acme.post(f"/api/products/{pid}/stock",
                  json={"type": "OUT", "quantity": 100}, headers=acme_h)
    assert r.get_json()["data"]["newStock"] == 0

    # ADJUSTMENT 7 -> exactly 7
    r = acme.post(f"/api/products/{pid}/stock",
                  json={"type": "ADJUSTMENT", "quantity": 7}, headers=acme_h)
    assert r.get_json()["data"]["newStock"] == 7

    # Movement history recorded (4 movements)
    r = acme.get(f"/api/products/{pid}/stock", headers={"Host": _host("acme")})
    assert len(r.get_json()["data"]) == 4

    # zen cannot see, mutate, or move stock on acme's product
    assert zen.get(f"/api/products/{pid}", headers={"Host": _host("zen")}).status_code == 404
    r = zen.post(f"/api/products/{pid}/stock",
                 json={"type": "IN", "quantity": 99}, headers=zen_h)
    assert r.status_code == 404
    # acme's stock untouched by the failed attempt
    r = acme.get(f"/api/products/{pid}", headers={"Host": _host("acme")})
    assert r.get_json()["data"]["stockQuantity"] == 7


def test_stock_requires_permission(app):
    anon = app.test_client()
    r = anon.post(
        "/api/products/00000000-0000-0000-0000-000000000000/stock",
        json={"type": "IN", "quantity": 1},
        headers={"Host": _host("acme")},
    )
    assert r.status_code in (401, 403)
