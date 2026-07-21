"""Tenant provisioning: create an Organization + its first admin and seed
sensible defaults, all in one transaction. Used by self-serve signup.
"""
from __future__ import annotations

import re
from datetime import datetime, timedelta, timezone

from app.errors import ApiError
from app.extensions import db
from app.models.organization import Organization, OrgStatus
from app.models.payment import ManualPaymentMethod
from app.models.schedule import BusinessHour
from app.models.user import User, UserRole
from app.security import hash_password

SLUG_RE = re.compile(r"^[a-z0-9]([a-z0-9-]{1,30})[a-z0-9]$")
RESERVED_SLUGS = {
    "www", "app", "admin", "api", "mail", "smtp", "ftp", "blog", "help",
    "support", "status", "billing", "signup", "login", "dashboard", "static",
    "assets", "cdn", "paulux",
}
TRIAL_DAYS = 30

DEFAULT_HOURS = [  # 0=Sun .. 6=Sat — open Mon–Sat 09:00–18:00
    (d, "09:00", "18:00", d != 0) for d in range(7)
]
DEFAULT_PAYMENT_METHODS = ["Cash", "Mobile Money", "Card (POS)"]


def normalize_slug(raw: str) -> str:
    return re.sub(r"[^a-z0-9-]", "", raw.strip().lower())


def validate_slug(slug: str) -> None:
    if slug in RESERVED_SLUGS or not SLUG_RE.match(slug):
        raise ApiError(
            "Choose a workspace address of 3–32 letters, numbers or hyphens.",
            status=422, code="INVALID_SLUG",
        )


def slug_available(slug: str) -> bool:
    existing = db.session.execute(
        db.select(Organization.id)
        .filter_by(slug=slug)
        .execution_options(skip_tenant_filter=True)
    ).scalar_one_or_none()
    return existing is None


def provision_organization(
    *, org_name: str, slug: str, admin_username: str, admin_email: str, admin_password: str
) -> tuple[Organization, User]:
    slug = normalize_slug(slug)
    validate_slug(slug)
    if not slug_available(slug):
        raise ApiError("That workspace address is taken.", status=409, code="SLUG_TAKEN")

    org = Organization(
        slug=slug,
        name=org_name,
        status=OrgStatus.TRIAL,
        plan="starter",
        trial_ends_at=datetime.now(timezone.utc) + timedelta(days=TRIAL_DAYS),
    )
    db.session.add(org)
    db.session.flush()  # org.id

    admin = User(
        organization_id=org.id,
        username=admin_username,
        email=admin_email,
        password_hash=hash_password(admin_password),
        role=UserRole.ADMIN,
    )
    db.session.add(admin)

    for day, start, end, is_open in DEFAULT_HOURS:
        db.session.add(BusinessHour(
            organization_id=org.id, day_of_week=day,
            start_time=start, end_time=end, is_open=is_open,
        ))
    for i, name in enumerate(DEFAULT_PAYMENT_METHODS):
        db.session.add(ManualPaymentMethod(
            organization_id=org.id, name=name, sort_order=i,
        ))

    db.session.commit()
    return org, admin
