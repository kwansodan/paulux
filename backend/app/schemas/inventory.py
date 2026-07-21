"""Input validation for the inventory domain (port of the zod schemas in
``next_polaris/src/features/product/utils/validation.ts``).
"""
from __future__ import annotations

import uuid
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field, field_validator

from app.schemas.catalog import _to_money


class ProductInput(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=1000)
    price: Decimal
    is_active: bool = Field(alias="isActive", default=True)
    image_url: str | None = Field(alias="imageUrl", default=None, max_length=500)
    category_id: uuid.UUID | None = Field(alias="categoryId", default=None)
    low_stock_threshold: int = Field(alias="lowStockThreshold", default=5, ge=0)
    track_stock: bool = Field(alias="trackStock", default=False)
    currency: str = "GHS"

    model_config = {"populate_by_name": True}

    @field_validator("price", mode="before")
    @classmethod
    def _money(cls, v):
        return _to_money(v)


class ProductCategoryInput(BaseModel):
    name: str = Field(min_length=1, max_length=120)


class StockMovementInput(BaseModel):
    type: Literal["IN", "OUT", "ADJUSTMENT"]
    quantity: int = Field(gt=0)
    notes: str | None = Field(default=None, max_length=500)
