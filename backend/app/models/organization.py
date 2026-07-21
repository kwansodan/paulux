"""The tenant root. Every business row hangs off an Organization."""
from __future__ import annotations

import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.extensions import db
from app.models.base import TimestampMixin, UUIDPkMixin


class OrgStatus(enum.Enum):
    TRIAL = "TRIAL"
    ACTIVE = "ACTIVE"
    PAST_DUE = "PAST_DUE"
    SUSPENDED = "SUSPENDED"


class Organization(UUIDPkMixin, TimestampMixin, db.Model):
    __tablename__ = "organizations"

    # slug is the subdomain label: <slug>.<APP_BASE_DOMAIN>
    slug: Mapped[str] = mapped_column(String(63), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)

    status: Mapped[OrgStatus] = mapped_column(
        Enum(OrgStatus, name="org_status"), default=OrgStatus.TRIAL, nullable=False
    )

    # Branding
    logo_url: Mapped[str | None] = mapped_column(String(500))
    primary_color: Mapped[str | None] = mapped_column(String(20))

    # Billing (fleshed out in Phase 4)
    plan: Mapped[str | None] = mapped_column(String(50))
    billing_customer_id: Mapped[str | None] = mapped_column(String(120))
    subscription_id: Mapped[str | None] = mapped_column(String(120))
    trial_ends_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    trial_extensions_used: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    current_period_end: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    # Per-tenant payment credentials (Paystack), encrypted at rest.
    paystack_secret_encrypted: Mapped[str | None] = mapped_column(Text)
    paystack_public_key: Mapped[str | None] = mapped_column(String(120))

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    def __repr__(self) -> str:  # pragma: no cover
        return f"<Organization {self.slug}>"
