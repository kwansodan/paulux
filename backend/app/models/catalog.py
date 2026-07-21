"""Catalog domain: service categories, services, and service packages.

Ported from the Prisma models `ServiceCategory`, `Service`, `ServicePackage`,
`PackageService` — with tenant scoping added and the old global unique on
category name converted to a per-tenant composite unique.
"""
from __future__ import annotations

import uuid
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Table,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db
from app.models.base import TenantMixin, TimestampMixin, UUIDPkMixin

# Currency kept as a short string column (old schema: enum with only GHS).
DEFAULT_CURRENCY = "GHS"


class ServiceCategory(UUIDPkMixin, TimestampMixin, TenantMixin, db.Model):
    __tablename__ = "service_categories"
    __table_args__ = (
        UniqueConstraint("organization_id", "name", name="uq_service_categories_org_name"),
        Index("ix_service_categories_org", "organization_id"),
    )

    name: Mapped[str] = mapped_column(String(120), nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    services: Mapped[list["Service"]] = relationship(back_populates="category")


class Service(UUIDPkMixin, TimestampMixin, TenantMixin, db.Model):
    __tablename__ = "services"
    __table_args__ = (
        Index("ix_services_org", "organization_id"),
        Index("ix_services_category", "category_id"),
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(
        String(3), default=DEFAULT_CURRENCY, nullable=False
    )

    category_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("service_categories.id", ondelete="SET NULL")
    )
    category: Mapped["ServiceCategory | None"] = relationship(back_populates="services")

    max_bookings_per_day: Mapped[int | None] = mapped_column(Integer)
    latest_booking_time: Mapped[str | None] = mapped_column(String(5))  # "HH:mm"
    min_deposit_fixed: Mapped[Decimal] = mapped_column(
        Numeric(10, 2), default=Decimal("0"), nullable=False
    )

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(500))


package_services = Table(
    "package_services",
    db.metadata,
    Column(
        "package_id",
        ForeignKey("packages.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "service_id",
        ForeignKey("services.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)


class ServicePackage(UUIDPkMixin, TimestampMixin, TenantMixin, db.Model):
    __tablename__ = "packages"
    __table_args__ = (Index("ix_packages_org", "organization_id"),)

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    image_url: Mapped[str | None] = mapped_column(String(500))
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(
        String(3), default=DEFAULT_CURRENCY, nullable=False
    )
    min_deposit_fixed: Mapped[Decimal] = mapped_column(
        Numeric(10, 2), default=Decimal("0"), nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    services: Mapped[list["Service"]] = relationship(secondary=package_services)
