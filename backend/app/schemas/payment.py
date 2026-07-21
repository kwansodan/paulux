"""Input validation for the payments domain. Note: amounts for gateway
payments are never client-supplied — the server derives them from the booking.
"""
from __future__ import annotations

import uuid
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field, field_validator

from app.schemas.catalog import _to_money


class InitializePaymentInput(BaseModel):
    booking_reference: str = Field(alias="bookingReference", min_length=1, max_length=20)
    # DEPOSIT pays the outstanding minimum deposit; BALANCE pays everything left.
    purpose: Literal["DEPOSIT", "BALANCE"] = "BALANCE"

    model_config = {"populate_by_name": True}


class ManualPaymentInput(BaseModel):
    booking_id: uuid.UUID = Field(alias="bookingId")
    amount: Decimal
    manual_method_id: uuid.UUID = Field(alias="manualMethodId")
    note: str | None = Field(default=None, max_length=500)

    model_config = {"populate_by_name": True}

    @field_validator("amount", mode="before")
    @classmethod
    def _money(cls, v):
        d = _to_money(v)
        if d <= 0:
            raise ValueError("Amount must be greater than zero")
        return d


class RefundInput(BaseModel):
    reason: str | None = Field(default=None, max_length=500)


class ManualMethodInput(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    is_active: bool = Field(alias="isActive", default=True)
    sort_order: int = Field(alias="sortOrder", default=0)

    model_config = {"populate_by_name": True}
