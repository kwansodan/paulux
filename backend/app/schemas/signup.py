from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field


class SignupInput(BaseModel):
    org_name: str = Field(alias="orgName", min_length=2, max_length=200)
    slug: str = Field(min_length=3, max_length=32)
    admin_username: str = Field(alias="adminUsername", min_length=2, max_length=120)
    admin_email: EmailStr = Field(alias="adminEmail")
    admin_password: str = Field(alias="adminPassword", min_length=8, max_length=128)

    model_config = {"populate_by_name": True}


class CheckoutInput(BaseModel):
    plan: str = Field(min_length=1, max_length=50)
