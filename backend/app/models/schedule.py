"""Scheduling config: business hours and blocked dates — per tenant.

Old global uniques (day_of_week, date) become per-tenant composites.
"""
from __future__ import annotations

from datetime import date as date_type

from sqlalchemy import Boolean, Date, Index, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.extensions import db
from app.models.base import TenantMixin, TimestampMixin, UUIDPkMixin


class BusinessHour(UUIDPkMixin, TimestampMixin, TenantMixin, db.Model):
    __tablename__ = "business_hours"
    __table_args__ = (
        UniqueConstraint("organization_id", "day_of_week", name="uq_business_hours_org_day"),
        Index("ix_business_hours_org", "organization_id"),
    )

    day_of_week: Mapped[int] = mapped_column(Integer, nullable=False)  # 0=Sun..6=Sat
    start_time: Mapped[str] = mapped_column(String(5), nullable=False)  # "HH:mm"
    end_time: Mapped[str] = mapped_column(String(5), nullable=False)
    is_open: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    max_concurrent_bookings: Mapped[int] = mapped_column(Integer, default=4, nullable=False)


class BlockedDate(UUIDPkMixin, TimestampMixin, TenantMixin, db.Model):
    __tablename__ = "blocked_dates"
    __table_args__ = (
        UniqueConstraint("organization_id", "date", name="uq_blocked_dates_org_date"),
        Index("ix_blocked_dates_org", "organization_id"),
    )

    date: Mapped[date_type] = mapped_column(Date, nullable=False)
    reason: Mapped[str | None] = mapped_column(String(255))
    start_time: Mapped[str | None] = mapped_column(String(5))  # partial-day block
    end_time: Mapped[str | None] = mapped_column(String(5))


class SystemSetting(UUIDPkMixin, TimestampMixin, TenantMixin, db.Model):
    __tablename__ = "system_settings"
    __table_args__ = (
        UniqueConstraint("organization_id", "key", name="uq_system_settings_org_key"),
        Index("ix_system_settings_org", "organization_id"),
    )

    key: Mapped[str] = mapped_column(String(120), nullable=False)
    value: Mapped[str] = mapped_column(String(2000), nullable=False)
