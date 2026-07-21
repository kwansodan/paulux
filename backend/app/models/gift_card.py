"""Gift card domain: cards, item snapshots, redemptions.

Port of Prisma `GiftCard`, `GiftCardItem`, `GiftCardRedemption`; card codes
are unique per tenant. Redemptions are applied to bookings as Payment rows
(provider GIFT_CARD) so all money flows share one audit trail.
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
from app.models.booking import PaymentStatus


class GiftCardStatus(enum.Enum):
    PENDING_PAYMENT = "PENDING_PAYMENT"
    ACTIVE = "ACTIVE"
    PARTIALLY_REDEEMED = "PARTIALLY_REDEEMED"
    REDEEMED = "REDEEMED"
    EXPIRED = "EXPIRED"
    CANCELLED = "CANCELLED"


class GiftCardDeliveryMethod(enum.Enum):
    SMS = "SMS"
    EMAIL = "EMAIL"
    BOTH = "BOTH"


class GiftCardItemType(enum.Enum):
    SERVICE = "SERVICE"
    PRODUCT = "PRODUCT"


class GiftCard(UUIDPkMixin, TimestampMixin, TenantMixin, db.Model):
    __tablename__ = "gift_cards"
    __table_args__ = (
        UniqueConstraint("organization_id", "code", name="uq_gift_cards_org_code"),
        Index("ix_gift_cards_org", "organization_id"),
        Index("ix_gift_cards_payment_ref", "payment_ref"),
    )

    code: Mapped[str] = mapped_column(String(20), nullable=False)  # GFT-XXXXXXXX

    sender_name: Mapped[str] = mapped_column(String(200), nullable=False)
    sender_email: Mapped[str] = mapped_column(String(255), nullable=False)
    sender_phone: Mapped[str] = mapped_column(String(40), nullable=False)

    recipient_name: Mapped[str] = mapped_column(String(200), nullable=False)
    recipient_email: Mapped[str | None] = mapped_column(String(255))
    recipient_phone: Mapped[str | None] = mapped_column(String(40))
    message: Mapped[str | None] = mapped_column(Text)

    delivery_method: Mapped[GiftCardDeliveryMethod] = mapped_column(
        Enum(GiftCardDeliveryMethod, name="gift_card_delivery_method"),
        default=GiftCardDeliveryMethod.EMAIL, nullable=False,
    )
    delivered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    total_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    balance: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="GHS", nullable=False)

    status: Mapped[GiftCardStatus] = mapped_column(
        Enum(GiftCardStatus, name="gift_card_status"),
        default=GiftCardStatus.PENDING_PAYMENT, nullable=False,
    )
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    payment_status: Mapped[PaymentStatus] = mapped_column(
        Enum(PaymentStatus, name="payment_status", create_type=False),
        default=PaymentStatus.PENDING, nullable=False,
    )
    payment_ref: Mapped[str | None] = mapped_column(String(100))

    items: Mapped[list["GiftCardItem"]] = relationship(
        back_populates="gift_card", cascade="all, delete-orphan"
    )
    redemptions: Mapped[list["GiftCardRedemption"]] = relationship(
        back_populates="gift_card", cascade="all, delete-orphan"
    )


class GiftCardItem(UUIDPkMixin, db.Model):
    __tablename__ = "gift_card_items"
    __table_args__ = (Index("ix_gift_card_items_card", "gift_card_id"),)

    gift_card_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("gift_cards.id", ondelete="CASCADE"), nullable=False
    )
    gift_card: Mapped["GiftCard"] = relationship(back_populates="items")

    item_type: Mapped[GiftCardItemType] = mapped_column(
        Enum(GiftCardItemType, name="gift_card_item_type"), nullable=False
    )
    # Snapshot references — intentionally NOT FKs so later catalog deletions
    # don't affect historical cards.
    service_id: Mapped[uuid.UUID | None] = mapped_column()
    product_id: Mapped[uuid.UUID | None] = mapped_column()

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)


class GiftCardRedemption(UUIDPkMixin, TimestampMixin, TenantMixin, db.Model):
    __tablename__ = "gift_card_redemptions"
    __table_args__ = (
        Index("ix_gift_card_redemptions_org", "organization_id"),
        Index("ix_gift_card_redemptions_card", "gift_card_id"),
    )

    gift_card_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("gift_cards.id", ondelete="CASCADE"), nullable=False
    )
    gift_card: Mapped["GiftCard"] = relationship(back_populates="redemptions")

    booking_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("bookings.id", ondelete="SET NULL")
    )
    amount_applied: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

    redeemed_by_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL")
    )
