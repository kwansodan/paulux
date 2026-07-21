"""Test harness.

Requires a Postgres reachable at ``TEST_DATABASE_URL`` (Postgres-specific
features — ARRAY, native ENUM — mean SQLite can't stand in). If no database is
reachable, the whole suite is skipped with a clear reason rather than failing,
so it runs green in CI (where Postgres is provisioned) and is skipped on dev
boxes without one.
"""
from __future__ import annotations

import os

import pytest
from sqlalchemy import text

from app import create_app
from app.config import Settings
from app.extensions import db
from app.models.organization import Organization, OrgStatus
from app.models.user import User, UserRole
from app.security import hash_password

TEST_DB_URL = os.environ.get(
    "TEST_DATABASE_URL",
    "postgresql+psycopg://paulux:paulux@localhost:5432/paulux_test",
)
BASE_DOMAIN = "lvh.me"
PASSWORD = "AdminPass123!"


def _db_reachable() -> bool:
    try:
        from sqlalchemy import create_engine

        eng = create_engine(TEST_DB_URL)
        with eng.connect() as c:
            c.execute(text("SELECT 1"))
        eng.dispose()
        return True
    except Exception:
        return False


def pytest_collection_modifyitems(config, items):
    """Skip the whole suite when no test Postgres is reachable (dev boxes),
    so it only actually runs where a database is provisioned (CI)."""
    if _db_reachable():
        return
    skip = pytest.mark.skip(reason=f"No test Postgres reachable at {TEST_DB_URL}")
    for item in items:
        item.add_marker(skip)


@pytest.fixture(scope="session")
def app():
    settings = Settings(
        flask_env="testing",
        secret_key="test-secret",
        app_base_domain=BASE_DOMAIN,
        database_url=TEST_DB_URL,
        secure_cookies=False,
    )
    app = create_app(settings)
    with app.app_context():
        db.drop_all()
        db.create_all()
        _seed()
    yield app
    with app.app_context():
        db.drop_all()


def _seed():
    for slug, name in [("acme", "Acme Beauty"), ("zen", "Zen Spa")]:
        org = Organization(slug=slug, name=name, status=OrgStatus.ACTIVE)
        db.session.add(org)
        db.session.flush()
        db.session.add(
            User(
                organization_id=org.id,
                username=f"{slug}-admin",
                # Same email across tenants proves composite uniqueness works.
                email="admin@shared.example.com",
                password_hash=hash_password(PASSWORD),
                role=UserRole.ADMIN,
            )
        )
    db.session.commit()


@pytest.fixture
def client(app):
    return app.test_client()


def _host(slug: str | None) -> str:
    return f"{slug}.{BASE_DOMAIN}" if slug else BASE_DOMAIN
