"""Booking domain: bookings plus service/product line items with snapshots.

Port of Prisma `Booking`, `BookingService`, `BookingProduct`. Line items
snapshot price (and duration) at booking time so later catalog edits don't
rewrite history. `booking_reference` uniqueness becomes per-tenant.
"""
from __future__ import annotations

import enum
import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db
from app.models.base import TenantMixin, TimestampMixin, UUIDPkMixin


class BookingStatus(enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"
    COMPLETED = "COMPLETED"


class PaymentStatus(enum.Enum):
    PENDING = "PENDING"
    PAID = "PAID"
    PARTIAL = "PARTIAL"
    REFUNDED = "REFUNDED"
    FAILED = "FAILED"


class BookingType(enum.Enum):
    SCHEDULED = "SCHEDULED"
    WALKIN = "WALKIN"


class Booking(UUIDPkMixin, TimestampMixin, TenantMixin, db.Model):
    __tablename__ = "bookings"
    __table_args__ = (
        UniqueConstraint("organization_id", "booking_reference", name="uq_bookings_org_reference"),
        Index("ix_bookings_org", "organization_id"),
        Index("ix_bookings_date", "booking_date"),
        Index("ix_bookings_status", "status"),
        Index("ix_bookings_payment_status", "payment_status"),
    )

    booking_reference: Mapped[str] = mapped_column(String(20), nullable=False)

    client_name: Mapped[str] = mapped_column(String(200), nullable=False)
    client_email: Mapped[str] = mapped_column(String(255), nullable=False)
    client_phone: Mapped[str] = mapped_column(String(40), nullable=False)

    # Kept as strings for parity with the old schema ("YYYY-MM-DD", "HH:mm").
    booking_date: Mapped[str] = mapped_column(String(10), nullable=False)
    booking_time: Mapped[str] = mapped_column(String(5), nullable=False)

    status: Mapped[BookingStatus] = mapped_column(
        Enum(BookingStatus, name="booking_status"),
        default=BookingStatus.PENDING, nullable=False,
    )
    payment_status: Mapped[PaymentStatus] = mapped_column(
        Enum(PaymentStatus, name="payment_status"),
        default=PaymentStatus.PENDING, nullable=False,
    )
    booking_type: Mapped[BookingType] = mapped_column(
        Enum(BookingType, name="booking_type"),
        default=BookingType.SCHEDULED, nullable=False,
    )

    min_deposit_fixed: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))
    cancel_reason: Mapped[str | None] = mapped_column(Text)
    terms_accepted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    google_event_id: Mapped[str | None] = mapped_column(String(255))  # wired in Phase 3

    promo_code_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("promo_codes.id", ondelete="SET NULL")
    )
    promo_code = relationship("PromoCode")
    discount_amount: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))

    assigned_to_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL")
    )
    assigned_to = relationship("User", foreign_keys=[assigned_to_id])
    created_by_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL")
    )

    services: Mapped[list["BookingServiceItem"]] = relationship(
        back_populates="booking", cascade="all, delete-orphan"
    )
    products: Mapped[list["BookingProductItem"]] = relationship(
        back_populates="booking", cascade="all, delete-orphan"
    )

    @property
    def subtotal(self) -> Decimal:
        total = sum(
            (i.price_at_booking * i.quantity for i in self.services), Decimal("0")
        ) + sum(
            (i.price_at_booking * i.quantity for i in self.products), Decimal("0")
        )
        return Decimal(total).quantize(Decimal("0.01"))

    @property
    def total(self) -> Decimal:
        return max(
            Decimal("0"), self.subtotal - (self.discount_amount or Decimal("0"))
        ).quantize(Decimal("0.01"))


class BookingServiceItem(db.Model):
    __tablename__ = "booking_services"
    __table_args__ = (Index("ix_booking_services_booking", "booking_id"),)

    booking_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("bookings.id", ondelete="CASCADE"), primary_key=True
    )
    service_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("services.id"), primary_key=True
    )
    booking: Mapped["Booking"] = relationship(back_populates="services")
    service = relationship("Service")

    price_at_booking: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    duration_at_booking: Mapped[int] = mapped_column(Integer, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    assigned_to_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL")
    )
    assigned_to = relationship("User", foreign_keys=[assigned_to_id])


class BookingProductItem(db.Model):
    __tablename__ = "booking_products"
    __table_args__ = (Index("ix_booking_products_booking", "booking_id"),)

    booking_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("bookings.id", ondelete="CASCADE"), primary_key=True
    )
    product_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("products.id"), primary_key=True
    )
    booking: Mapped["Booking"] = relationship(back_populates="products")
    product = relationship("Product")

    price_at_booking: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
