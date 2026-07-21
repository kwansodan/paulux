"""Payment domain: payments, manual payment methods, audit log.

Port of Prisma `Payment`, `ManualPaymentMethod`, `PaymentAuditLog`, with:
- per-tenant provider config (each org brings its own Paystack account, so the
  old PRIMARY/SECONDARY dual-gateway split collapses to a single PAYSTACK
  provider),
- `(organization_id, provider, provider_ref)` unique for webhook idempotency.
Invoices are deferred to a later slice — the audit log covers traceability.
"""
from __future__ import annotations

import enum
import uuid
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    Enum,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db
from app.models.base import TenantMixin, TimestampMixin, UUIDPkMixin
from app.models.booking import PaymentStatus


class PaymentProvider(enum.Enum):
    PAYSTACK = "PAYSTACK"
    MANUAL = "MANUAL"
    GIFT_CARD = "GIFT_CARD"  # booking paid (partly) by redeeming a gift card


class ManualPaymentMethod(UUIDPkMixin, TimestampMixin, TenantMixin, db.Model):
    __tablename__ = "manual_payment_methods"
    __table_args__ = (
        UniqueConstraint("organization_id", "name", name="uq_manual_methods_org_name"),
        Index("ix_manual_methods_org", "organization_id"),
    )

    name: Mapped[str] = mapped_column(String(120), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class Payment(UUIDPkMixin, TimestampMixin, TenantMixin, db.Model):
    __tablename__ = "payments"
    __table_args__ = (
        UniqueConstraint(
            "organization_id", "provider", "provider_ref",
            name="uq_payments_org_provider_ref",
        ),
        Index("ix_payments_org", "organization_id"),
        Index("ix_payments_booking", "booking_id"),
    )

    booking_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False
    )
    booking = relationship("Booking", backref="payments")

    provider: Mapped[PaymentProvider] = mapped_column(
        Enum(PaymentProvider, name="payment_provider"), nullable=False
    )
    provider_ref: Mapped[str] = mapped_column(String(100), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="GHS", nullable=False)

    status: Mapped[PaymentStatus] = mapped_column(
        Enum(PaymentStatus, name="payment_status", create_type=False),
        default=PaymentStatus.PENDING, nullable=False,
    )
    raw_payload: Mapped[dict | None] = mapped_column(JSONB)
    reason: Mapped[str | None] = mapped_column(String(500))

    manual_method_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("manual_payment_methods.id", ondelete="SET NULL")
    )
    manual_method = relationship("ManualPaymentMethod")


class PaymentAuditLog(UUIDPkMixin, TimestampMixin, TenantMixin, db.Model):
    __tablename__ = "payment_audit_logs"
    __table_args__ = (
        Index("ix_payment_audit_logs_org", "organization_id"),
        Index("ix_payment_audit_logs_booking", "booking_id"),
    )

    booking_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("bookings.id", ondelete="SET NULL")
    )
    payment_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("payments.id", ondelete="SET NULL")
    )

    action: Mapped[str] = mapped_column(String(60), nullable=False)
    old_value: Mapped[dict | None] = mapped_column(JSONB)
    new_value: Mapped[dict | None] = mapped_column(JSONB)
    meta: Mapped[dict | None] = mapped_column("metadata", JSONB)
