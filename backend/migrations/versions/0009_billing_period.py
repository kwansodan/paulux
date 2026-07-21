"""add organizations.current_period_end

Revision ID: 0009_billing_period
Revises: 0008_style_images
"""
from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0009_billing_period"
down_revision = "0008_style_images"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "organizations",
        sa.Column("current_period_end", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("organizations", "current_period_end")
