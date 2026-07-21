"""style_images

Revision ID: 0008_style_images
Revises: 0007_invoices
"""
from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0008_style_images"
down_revision = "0007_invoices"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "style_images",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("organization_id", sa.Uuid(), nullable=False),
        sa.Column("url", sa.String(length=500), nullable=False),
        sa.Column("object_name", sa.String(length=500)),
        sa.Column("caption", sa.String(length=255)),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_style_images_org", "style_images", ["organization_id"])


def downgrade() -> None:
    op.drop_table("style_images")
