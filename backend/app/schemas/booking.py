"""Input validation for bookings and promo codes."""
from __future__ import annotations

import re
import uuid
from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.schemas.catalog import _to_money

DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
TIME_RE = re.compile(r"^\d{2}:\d{2}$")


class ServiceLine(BaseModel):
    service_id: uuid.UUID = Field(alias="serviceId")
    quantity: int = Field(default=1, ge=1)

    model_config = {"populate_by_name": True}


class ProductLine(BaseModel):
    product_id: uuid.UUID = Field(alias="productId")
    quantity: int = Field(default=1, ge=1)

    model_config = {"populate_by_name": True}


class BookingCreateInput(BaseModel):
    client_name: str = Field(alias="clientName", min_length=1, max_length=200)
    client_email: EmailStr = Field(alias="clientEmail")
    client_phone: str = Field(alias="clientPhone", min_length=3, max_length=40)
    booking_date: str = Field(alias="bookingDate")
    booking_time: str = Field(alias="bookingTime")
    services: list[ServiceLine] = Field(min_length=1)
    products: list[ProductLine] = Field(default_factory=list)
    promo_code: str | None = Field(alias="promoCode", default=None, max_length=64)
    booking_type: Literal["SCHEDULED", "WALKIN"] = Field(
        alias="bookingType", default="SCHEDULED"
    )
    terms_accepted: bool = Field(alias="termsAccepted", default=False)

    model_config = {"populate_by_name": True}

    @field_validator("booking_date")
    @classmethod
    def _date(cls, v):
        if not DATE_RE.match(v):
            raise ValueError("Date must be YYYY-MM-DD")
        datetime.strptime(v, "%Y-%m-%d")  # rejects impossible dates
        return v

    @field_validator("booking_time")
    @classmethod
    def _time(cls, v):
        if not TIME_RE.match(v):
            raise ValueError("Time must be HH:mm")
        h, m = int(v[:2]), int(v[3:])
        if h > 23 or m > 59:
            raise ValueError("Time must be a valid HH:mm")
        return v


class BookingStatusInput(BaseModel):
    status: Literal["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]
    cancel_reason: str | None = Field(alias="cancelReason", default=None, max_length=500)

    model_config = {"populate_by_name": True}


class BookingAssignInput(BaseModel):
    assigned_to_id: uuid.UUID | None = Field(alias="assignedToId")

    model_config = {"populate_by_name": True}


class ServiceAssignmentLine(BaseModel):
    service_id: uuid.UUID = Field(alias="serviceId")
    assigned_to_id: uuid.UUID | None = Field(alias="assignedToId", default=None)

    model_config = {"populate_by_name": True}


class BookingAssignServicesInput(BaseModel):
    assignments: list[ServiceAssignmentLine] = Field(min_length=1)


class BookingRescheduleInput(BaseModel):
    booking_date: str = Field(alias="bookingDate")
    booking_time: str = Field(alias="bookingTime")

    model_config = {"populate_by_name": True}

    @field_validator("booking_date")
    @classmethod
    def _date(cls, v: str):
        if not DATE_RE.match(v):
            raise ValueError("Date must be YYYY-MM-DD")
        datetime.strptime(v, "%Y-%m-%d")
        return v

    @field_validator("booking_time")
    @classmethod
    def _time(cls, v: str):
        if not TIME_RE.match(v):
            raise ValueError("Time must be HH:mm")
        return v


class BookingTopUpInput(BaseModel):
    services: list[ServiceLine] = Field(default_factory=list)
    products: list[ProductLine] = Field(default_factory=list)


class PromoCodeInput(BaseModel):
    code: str = Field(min_length=2, max_length=64)
    description: str | None = Field(default=None, max_length=255)
    discount_type: Literal["PERCENTAGE", "FIXED"] = Field(alias="discountType")
    discount_value: Decimal = Field(alias="discountValue")
    max_uses: int | None = Field(alias="maxUses", default=None, ge=1)
    expires_at: datetime | None = Field(alias="expiresAt", default=None)
    is_active: bool = Field(alias="isActive", default=True)
    min_booking_amount: Decimal | None = Field(alias="minBookingAmount", default=None)

    model_config = {"populate_by_name": True}

    @field_validator("discount_value", "min_booking_amount", mode="before")
    @classmethod
    def _money(cls, v):
        if v is None:
            return None
        return _to_money(v)

    @field_validator("code")
    @classmethod
    def _code(cls, v: str):
        return v.strip().upper()


class PromoValidateInput(BaseModel):
    code: str = Field(min_length=1, max_length=64)
    amount: Decimal

    @field_validator("amount", mode="before")
    @classmethod
    def _money(cls, v):
        return _to_money(v)
