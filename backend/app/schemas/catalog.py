"""Input validation for the catalog domain (port of the zod schemas in
``next_polaris/src/features/service/utils/validation.ts``).
"""
from __future__ import annotations

import re
import uuid
from decimal import Decimal, InvalidOperation

from pydantic import BaseModel, Field, field_validator

TIME_RE = re.compile(r"^\d{2}:\d{2}$")


def _to_money(v) -> Decimal:
    """Accept str|int|float, return a non-negative 2dp Decimal."""
    try:
        d = Decimal(str(v))
    except (InvalidOperation, ValueError):
        raise ValueError("must be a valid amount")
    if d < 0:
        raise ValueError("must be a positive amount")
    return d.quantize(Decimal("0.01"))


class ServiceInput(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=1000)
    duration_minutes: int = Field(alias="durationMinutes", gt=0)
    price: Decimal
    min_deposit_fixed: Decimal = Field(alias="minDepositFixed", default=Decimal("0"))
    max_bookings_per_day: int | None = Field(alias="maxBookingsPerDay", default=None, gt=0)
    latest_booking_time: str | None = Field(alias="latestBookingTime", default=None)
    is_active: bool = Field(alias="isActive", default=True)
    image_url: str | None = Field(alias="imageUrl", default=None, max_length=500)
    category_id: uuid.UUID | None = Field(alias="categoryId", default=None)
    currency: str = "GHS"

    model_config = {"populate_by_name": True}

    @field_validator("price", "min_deposit_fixed", mode="before")
    @classmethod
    def _money(cls, v):
        return _to_money(v)

    @field_validator("latest_booking_time")
    @classmethod
    def _time(cls, v):
        if v is not None and not TIME_RE.match(v):
            raise ValueError("Time must be HH:mm")
        return v


class CategoryInput(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    capacity: int = Field(default=1, ge=1)


class PackageInput(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=1000)
    image_url: str | None = Field(alias="imageUrl", default=None, max_length=500)
    price: Decimal
    min_deposit_fixed: Decimal = Field(alias="minDepositFixed", default=Decimal("0"))
    is_active: bool = Field(alias="isActive", default=True)
    service_ids: list[uuid.UUID] = Field(alias="serviceIds", default_factory=list)
    currency: str = "GHS"

    model_config = {"populate_by_name": True}

    @field_validator("price", "min_deposit_fixed", mode="before")
    @classmethod
    def _money(cls, v):
        return _to_money(v)


class StatusInput(BaseModel):
    is_active: bool = Field(alias="isActive")

    model_config = {"populate_by_name": True}
