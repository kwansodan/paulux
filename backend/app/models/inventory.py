"""Inventory domain: product categories, products, stock movements.

Port of Prisma `ProductCategory`, `Product`, `ProductStockMovement` with tenant
scoping; category-name uniqueness becomes per-tenant.
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
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db
from app.models.base import TenantMixin, TimestampMixin, UUIDPkMixin
from app.models.catalog import DEFAULT_CURRENCY


class StockMovementType(enum.Enum):
    IN = "IN"
    OUT = "OUT"
    ADJUSTMENT = "ADJUSTMENT"


class ProductCategory(UUIDPkMixin, TimestampMixin, TenantMixin, db.Model):
    __tablename__ = "product_categories"
    __table_args__ = (
        UniqueConstraint("organization_id", "name", name="uq_product_categories_org_name"),
        Index("ix_product_categories_org", "organization_id"),
    )

    name: Mapped[str] = mapped_column(String(120), nullable=False)

    products: Mapped[list["Product"]] = relationship(back_populates="category")


class Product(UUIDPkMixin, TimestampMixin, TenantMixin, db.Model):
    __tablename__ = "products"
    __table_args__ = (
        Index("ix_products_org", "organization_id"),
        Index("ix_products_category", "category_id"),
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default=DEFAULT_CURRENCY, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(500))

    stock_quantity: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    low_stock_threshold: Mapped[int] = mapped_column(Integer, default=5, nullable=False)
    track_stock: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    category_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("product_categories.id", ondelete="SET NULL")
    )
    category: Mapped["ProductCategory | None"] = relationship(back_populates="products")

    stock_movements: Mapped[list["ProductStockMovement"]] = relationship(
        back_populates="product", cascade="all, delete-orphan"
    )


class ProductStockMovement(UUIDPkMixin, TimestampMixin, TenantMixin, db.Model):
    __tablename__ = "product_stock_movements"
    __table_args__ = (
        Index("ix_product_stock_movements_org", "organization_id"),
        Index("ix_product_stock_movements_product", "product_id"),
    )

    product_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"), nullable=False
    )
    product: Mapped["Product"] = relationship(back_populates="stock_movements")

    type: Mapped[StockMovementType] = mapped_column(
        Enum(StockMovementType, name="stock_movement_type"), nullable=False
    )
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    notes: Mapped[str | None] = mapped_column(String(500))

    created_by_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL")
    )
