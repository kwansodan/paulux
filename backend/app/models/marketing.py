"""Marketing domain: promo codes. (Gift cards join this module later.)

Port of Prisma `PromoCode`; the old global-unique `code` becomes unique per
tenant so two salons can both run "WELCOME10".
"""
from __future__ import annotations

import enum
from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    Index,
    Integer,
    Numeric,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.extensions import db
from app.models.base import TenantMixin, TimestampMixin, UUIDPkMixin


class DiscountType(enum.Enum):
    PERCENTAGE = "PERCENTAGE"
    FIXED = "FIXED"


class PromoCode(UUIDPkMixin, TimestampMixin, TenantMixin, db.Model):
    __tablename__ = "promo_codes"
    __table_args__ = (
        UniqueConstraint("organization_id", "code", name="uq_promo_codes_org_code"),
        Index("ix_promo_codes_org", "organization_id"),
    )

    code: Mapped[str] = mapped_column(String(64), nullable=False)
    description: Mapped[str | None] = mapped_column(String(255))
    discount_type: Mapped[DiscountType] = mapped_column(
        Enum(DiscountType, name="discount_type"), nullable=False
    )
    discount_value: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    max_uses: Mapped[int | None] = mapped_column(Integer)
    used_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    min_booking_amount: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))

    def usable_for(self, amount: Decimal) -> str | None:
        """Return a rejection reason, or None if the code applies to `amount`."""
        from datetime import timezone

        if not self.is_active:
            return "This promo code is inactive"
        if self.expires_at is not None:
            exp = self.expires_at
            if exp.tzinfo is None:
                exp = exp.replace(tzinfo=timezone.utc)
            if exp < datetime.now(timezone.utc):
                return "This promo code has expired"
        if self.max_uses is not None and self.used_count >= self.max_uses:
            return "This promo code has reached its usage limit"
        if self.min_booking_amount is not None and amount < self.min_booking_amount:
            return f"Minimum booking amount is {self.min_booking_amount:.2f}"
        return None

    def discount_for(self, amount: Decimal) -> Decimal:
        if self.discount_type == DiscountType.PERCENTAGE:
            return (amount * self.discount_value / Decimal(100)).quantize(Decimal("0.01"))
        return min(self.discount_value, amount)
