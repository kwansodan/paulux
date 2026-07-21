"""Shared model mixins: UUID PKs, timestamps, and tenant scoping.

``TenantMixin`` is the backbone of isolation — every business table inherits it,
so ``organization_id`` exists uniformly and the tenant query filter (see
``app.tenancy``) can be applied generically.
"""
from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Index, Uuid, func
from sqlalchemy.orm import Mapped, declared_attr, mapped_column


class UUIDPkMixin:
    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, default=uuid.uuid4
    )


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class TenantMixin:
    """Adds a non-null, indexed ``organization_id`` FK to a business table."""

    @declared_attr
    def organization_id(cls) -> Mapped[uuid.UUID]:  # noqa: N805
        return mapped_column(
            Uuid,
            ForeignKey("organizations.id", ondelete="CASCADE"),
            nullable=False,
        )

    @declared_attr
    def __table_args__(cls):  # noqa: N805
        return (Index(f"ix_{cls.__tablename__}_org", "organization_id"),)
