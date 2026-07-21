"""Invoices — issued automatically when a payment is captured, one per payment.

Slimmer than the old app's draft/child-invoice machinery: an invoice here is a
numbered, immutable record of money received (or refunded), suitable for
receipts and reporting. Numbering is per-tenant and sequential.
"""
from __future__ import annotations

import uuid
from decimal import Decimal

from sqlalchemy import ForeignKey, Index, Numeric, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db
from app.models.base import TenantMixin, TimestampMixin, UUIDPkMixin


class Invoice(UUIDPkMixin, TimestampMixin, TenantMixin, db.Model):
    __tablename__ = "invoices"
    __table_args__ = (
        UniqueConstraint("organization_id", "invoice_number", name="uq_invoices_org_number"),
        Index("ix_invoices_org", "organization_id"),
        Index("ix_invoices_booking", "booking_id"),
    )

    invoice_number: Mapped[str] = mapped_column(String(30), nullable=False)

    booking_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("bookings.id", ondelete="SET NULL")
    )
    booking = relationship("Booking")
    payment_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("payments.id", ondelete="SET NULL")
    )
    payment = relationship("Payment")

    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="GHS", nullable=False)
    # PAYMENT (money in) or REFUND (money out)
    kind: Mapped[str] = mapped_column(String(10), default="PAYMENT", nullable=False)


def next_invoice_number(org_id) -> str:
    """Sequential per-tenant number: INV-000001, INV-000002, …"""
    count = db.session.execute(
        db.select(db.func.count(Invoice.id))
        .where(Invoice.organization_id == org_id)
        .execution_options(skip_tenant_filter=True)
    ).scalar_one()
    return f"INV-{count + 1:06d}"
