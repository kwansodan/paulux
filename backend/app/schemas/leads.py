from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field


class LeadInput(BaseModel):
    """A standalone/own-domain enquiry from the marketing site (apex, no tenant)."""

    name: str = Field(min_length=2, max_length=120)
    business_name: str = Field(alias="businessName", min_length=2, max_length=200)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=40)
    city: str | None = Field(default=None, max_length=120)
    team_size: int | None = Field(default=None, alias="teamSize", ge=1, le=100000)
    message: str | None = Field(default=None, max_length=2000)

    model_config = {"populate_by_name": True}
