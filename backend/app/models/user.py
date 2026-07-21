"""Users, roles, sessions, and password-reset tokens — all tenant-scoped.

Uniqueness that was global in the single-tenant app becomes composite here:
``(organization_id, email)`` and ``(organization_id, username)`` so two salons
can each have a user with the same email.
"""
from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    ARRAY,
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db
from app.models.base import TenantMixin, TimestampMixin, UUIDPkMixin


class UserRole(enum.Enum):
    SUPER_ADMIN = "SUPER_ADMIN"  # platform owner, cross-tenant
    ADMIN = "ADMIN"
    STAFF = "STAFF"
    CUSTOMER = "CUSTOMER"


class Role(UUIDPkMixin, TimestampMixin, TenantMixin, db.Model):
    """Custom per-tenant role carrying a permission-key array."""

    __tablename__ = "roles"
    __table_args__ = (
        UniqueConstraint("organization_id", "name", name="uq_roles_org_name"),
        Index("ix_roles_org", "organization_id"),
    )

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(String(255))
    permissions: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    is_system: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    users: Mapped[list["User"]] = relationship(back_populates="custom_role")


class User(UUIDPkMixin, TimestampMixin, TenantMixin, db.Model):
    __tablename__ = "users"
    __table_args__ = (
        UniqueConstraint("organization_id", "email", name="uq_users_org_email"),
        UniqueConstraint("organization_id", "username", name="uq_users_org_username"),
        Index("ix_users_org", "organization_id"),
    )

    username: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(40))

    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role"), default=UserRole.ADMIN, nullable=False
    )

    custom_role_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("roles.id", ondelete="SET NULL")
    )
    custom_role: Mapped["Role | None"] = relationship(back_populates="users")

    sessions: Mapped[list["Session"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )

    @property
    def permission_keys(self) -> list[str]:
        if self.role in (UserRole.ADMIN, UserRole.SUPER_ADMIN):
            return ["*"]
        if self.custom_role:
            return list(self.custom_role.permissions or [])
        return []


class Session(UUIDPkMixin, db.Model):
    """Server-side session. The cookie holds a random token; we store its hash."""

    __tablename__ = "sessions"

    # token_hash is the primary lookup key (sha256 hex of the cookie token)
    token_hash: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    user: Mapped["User"] = relationship(back_populates="sessions")


class PasswordResetToken(db.Model):
    __tablename__ = "password_reset_tokens"

    token_hash: Mapped[str] = mapped_column(String(64), primary_key=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
