"""add organizations.trial_extensions_used

Revision ID: 0010_trial_extensions
Revises: 0009_billing_period
"""
from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0010_trial_extensions"
down_revision = "0009_billing_period"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "organizations",
        sa.Column("trial_extensions_used", sa.Integer(), nullable=False, server_default="0"),
    )
    op.alter_column("organizations", "trial_extensions_used", server_default=None)


def downgrade() -> None:
    op.drop_column("organizations", "trial_extensions_used")
