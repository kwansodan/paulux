"""Style images — the customer-facing lookbook/gallery, per tenant."""
from __future__ import annotations

from sqlalchemy import Boolean, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.extensions import db
from app.models.base import TenantMixin, TimestampMixin, UUIDPkMixin


class StyleImage(UUIDPkMixin, TimestampMixin, TenantMixin, db.Model):
    __tablename__ = "style_images"
    __table_args__ = (Index("ix_style_images_org", "organization_id"),)

    url: Mapped[str] = mapped_column(String(500), nullable=False)
    object_name: Mapped[str | None] = mapped_column(String(500))
    caption: Mapped[str | None] = mapped_column(String(255))
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
