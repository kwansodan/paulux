"""invoices

Revision ID: 0007_invoices
Revises: 0006_gift_cards_schedule
"""
from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0007_invoices"
down_revision = "0006_gift_cards_schedule"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "invoices",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("organization_id", sa.Uuid(), nullable=False),
        sa.Column("invoice_number", sa.String(length=30), nullable=False),
        sa.Column("booking_id", sa.Uuid()),
        sa.Column("payment_id", sa.Uuid()),
        sa.Column("amount", sa.Numeric(10, 2), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False),
        sa.Column("kind", sa.String(length=10), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["booking_id"], ["bookings.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["payment_id"], ["payments.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("organization_id", "invoice_number", name="uq_invoices_org_number"),
    )
    op.create_index("ix_invoices_org", "invoices", ["organization_id"])
    op.create_index("ix_invoices_booking", "invoices", ["booking_id"])


def downgrade() -> None:
    op.drop_table("invoices")
