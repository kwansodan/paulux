"""Password reset: forgot (enumeration-safe) + reset (token validation)."""
from __future__ import annotations

from app.auth.service import create_password_reset
from app.extensions import db
from app.models.organization import Organization
from app.models.user import PasswordResetToken, User
from tests.conftest import PASSWORD, _host
from app.notifications.providers import outbox


def _csrf(client, slug):
    return client.get("/api/auth/csrf", headers={"Host": _host(slug)}).get_json()["data"]["csrfToken"]


def _admin_of(slug: str) -> User:
    """The admin for one org. Both seeded orgs share an email, so an unscoped
    ``.first()`` is ambiguous — and its row order shifts once a row is updated,
    which previously made this module reset one org's password and restore the
    other's, breaking login for every test module that ran after it.
    """
    org = db.session.execute(
        db.select(Organization).filter_by(slug=slug)
        .execution_options(skip_tenant_filter=True)
    ).scalars().one()
    return db.session.execute(
        db.select(User)
        .filter_by(email="admin@shared.example.com", organization_id=org.id)
        .execution_options(skip_tenant_filter=True)
    ).scalars().one()


def test_forgot_password_is_enumeration_safe(app):
    client = app.test_client()
    token = _csrf(client, "acme")
    outbox.clear()

    # Known email -> success + email queued
    r = client.post("/api/auth/forgot-password", json={"email": "admin@shared.example.com"},
                    headers={"Host": _host("acme"), "X-CSRF-Token": token})
    assert r.status_code == 200
    assert any(e.kind == "password_reset" for e in outbox.emails)

    # Unknown email -> same success shape, no email
    outbox.clear()
    r = client.post("/api/auth/forgot-password", json={"email": "nobody@nowhere.example.com"},
                    headers={"Host": _host("acme"), "X-CSRF-Token": token})
    assert r.status_code == 200
    assert not outbox.emails


def test_reset_password_flow(app):
    client = app.test_client()
    # Issue a token directly, then reset with it
    with app.app_context():
        token = create_password_reset(_admin_of("acme"))

    csrf = _csrf(client, "acme")
    r = client.post("/api/auth/reset-password",
                    json={"token": token, "password": "BrandNewPass123!"},
                    headers={"Host": _host("acme"), "X-CSRF-Token": csrf})
    assert r.status_code == 200

    # Token is single-use — second attempt fails
    r = client.post("/api/auth/reset-password",
                    json={"token": token, "password": "Another123!"},
                    headers={"Host": _host("acme"), "X-CSRF-Token": csrf})
    assert r.status_code == 422

    # New password works for login on acme
    login = client.post("/api/auth/login",
                        json={"email": "admin@shared.example.com", "password": "BrandNewPass123!"},
                        headers={"Host": _host("acme"), "X-CSRF-Token": csrf})
    assert login.status_code == 200

    # Restore the shared password for other tests — same org that was reset.
    with app.app_context():
        from app.security import hash_password
        _admin_of("acme").password_hash = hash_password(PASSWORD)
        db.session.commit()


def test_invalid_token_rejected(app):
    client = app.test_client()
    csrf = _csrf(client, "acme")
    r = client.post("/api/auth/reset-password",
                    json={"token": "not-a-real-token-000000", "password": "Whatever123!"},
                    headers={"Host": _host("acme"), "X-CSRF-Token": csrf})
    assert r.status_code == 422
