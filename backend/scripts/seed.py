"""Seed two organizations with an admin each — for local dev and the
tenant-isolation verification described in the plan.

Run: ``python -m scripts.seed`` (from the backend/ directory, venv active).
"""
from __future__ import annotations

from app import create_app
from app.extensions import db
from app.models.organization import Organization, OrgStatus
from app.models.user import User, UserRole
from app.security import hash_password

TENANTS = [
    {
        "slug": "acme",
        "name": "Acme Beauty Lounge",
        "admin_email": "admin@acme.example.com",
    },
    {
        "slug": "zen",
        "name": "Zen Spa",
        "admin_email": "admin@zen.example.com",
    },
]
DEFAULT_PASSWORD = "AdminPass123!"


def seed() -> None:
    app = create_app()
    with app.app_context():
        for t in TENANTS:
            org = db.session.execute(
                db.select(Organization).filter_by(slug=t["slug"])
                .execution_options(skip_tenant_filter=True)
            ).scalar_one_or_none()
            if org is None:
                org = Organization(
                    slug=t["slug"], name=t["name"], status=OrgStatus.ACTIVE
                )
                db.session.add(org)
                db.session.flush()
                print(f"created org {org.slug} ({org.id})")

            username = f"{t['slug']}-admin"
            existing = db.session.execute(
                db.select(User)
                .filter_by(organization_id=org.id, username=username)
                .execution_options(skip_tenant_filter=True)
            ).scalar_one_or_none()
            if existing is None:
                db.session.add(
                    User(
                        organization_id=org.id,
                        username=username,
                        email=t["admin_email"],
                        password_hash=hash_password(DEFAULT_PASSWORD),
                        role=UserRole.ADMIN,
                    )
                )
                print(f"  created admin {t['admin_email']} / {DEFAULT_PASSWORD}")
            else:
                existing.email = t["admin_email"]
                existing.password_hash = hash_password(DEFAULT_PASSWORD)
                print(f"  updated admin -> {t['admin_email']} / {DEFAULT_PASSWORD}")
        db.session.commit()
        print("seed complete")


if __name__ == "__main__":
    seed()
