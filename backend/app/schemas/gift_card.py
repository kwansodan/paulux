"""Input validation for gift cards, business hours, blocked dates, staff,
roles, and settings."""
from __future__ import annotations

import re
import uuid
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.schemas.catalog import _to_money

TIME_RE = re.compile(r"^\d{2}:\d{2}$")


class GiftCardItemLine(BaseModel):
    item_type: Literal["SERVICE", "PRODUCT"] = Field(alias="itemType")
    item_id: uuid.UUID = Field(alias="itemId")
    quantity: int = Field(default=1, ge=1)

    model_config = {"populate_by_name": True}


class GiftCardPurchaseInput(BaseModel):
    sender_name: str = Field(alias="senderName", min_length=1, max_length=200)
    sender_email: EmailStr = Field(alias="senderEmail")
    sender_phone: str = Field(alias="senderPhone", min_length=3, max_length=40)
    recipient_name: str = Field(alias="recipientName", min_length=1, max_length=200)
    recipient_email: EmailStr | None = Field(alias="recipientEmail", default=None)
    recipient_phone: str | None = Field(alias="recipientPhone", default=None, max_length=40)
    message: str | None = Field(default=None, max_length=1000)
    delivery_method: Literal["SMS", "EMAIL", "BOTH"] = Field(
        alias="deliveryMethod", default="EMAIL"
    )
    items: list[GiftCardItemLine] = Field(min_length=1)

    model_config = {"populate_by_name": True}


class GiftCardRedeemInput(BaseModel):
    code: str = Field(min_length=4, max_length=20)
    booking_id: uuid.UUID = Field(alias="bookingId")
    amount: Decimal | None = None  # None = apply as much as possible

    model_config = {"populate_by_name": True}

    @field_validator("amount", mode="before")
    @classmethod
    def _money(cls, v):
        if v is None:
            return None
        d = _to_money(v)
        if d <= 0:
            raise ValueError("Amount must be greater than zero")
        return d


class BusinessHourLine(BaseModel):
    day_of_week: int = Field(alias="dayOfWeek", ge=0, le=6)
    start_time: str = Field(alias="startTime")
    end_time: str = Field(alias="endTime")
    is_open: bool = Field(alias="isOpen", default=True)
    max_concurrent_bookings: int = Field(alias="maxConcurrentBookings", default=4, ge=1)

    model_config = {"populate_by_name": True}

    @field_validator("start_time", "end_time")
    @classmethod
    def _time(cls, v):
        if not TIME_RE.match(v):
            raise ValueError("Time must be HH:mm")
        return v


class BusinessHoursInput(BaseModel):
    hours: list[BusinessHourLine] = Field(min_length=1, max_length=7)


class BlockedDateInput(BaseModel):
    date: str  # YYYY-MM-DD
    reason: str | None = Field(default=None, max_length=255)
    start_time: str | None = Field(alias="startTime", default=None)
    end_time: str | None = Field(alias="endTime", default=None)

    model_config = {"populate_by_name": True}

    @field_validator("date")
    @classmethod
    def _date(cls, v):
        from datetime import datetime

        datetime.strptime(v, "%Y-%m-%d")
        return v


class StaffCreateInput(BaseModel):
    username: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    phone: str | None = Field(default=None, max_length=40)
    role: Literal["ADMIN", "STAFF"] = "STAFF"
    custom_role_id: uuid.UUID | None = Field(alias="customRoleId", default=None)

    model_config = {"populate_by_name": True}


class StaffUpdateInput(BaseModel):
    role: Literal["ADMIN", "STAFF"] | None = None
    custom_role_id: uuid.UUID | None = Field(alias="customRoleId", default=None)
    phone: str | None = Field(default=None, max_length=40)

    model_config = {"populate_by_name": True}


class RoleInput(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    description: str | None = Field(default=None, max_length=255)
    permissions: list[str] = Field(default_factory=list)


class SettingsInput(BaseModel):
    settings: dict[str, str]


class OrgBrandingInput(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    logo_url: str | None = Field(alias="logoUrl", default=None, max_length=500)
    primary_color: str | None = Field(alias="primaryColor", default=None, max_length=20)
    # Write-only Paystack credentials (stored encrypted when a key is configured)
    paystack_secret_key: str | None = Field(alias="paystackSecretKey", default=None, max_length=200)
    paystack_public_key: str | None = Field(alias="paystackPublicKey", default=None, max_length=120)

    model_config = {"populate_by_name": True}
