"""payments: manual_payment_methods, payments, payment_audit_logs

Revision ID: 0005_payments
Revises: 0004_bookings
"""
from __future__ import annotations

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "0005_payments"
down_revision = "0004_bookings"
branch_labels = None
depends_on = None

payment_provider = postgresql.ENUM("PAYSTACK", "MANUAL", name="payment_provider", create_type=False)
payment_status = postgresql.ENUM(
    "PENDING", "PAID", "PARTIAL", "REFUNDED", "FAILED", name="payment_status", create_type=False
)


def upgrade() -> None:
    payment_provider.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "manual_payment_methods",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("organization_id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("organization_id", "name", name="uq_manual_methods_org_name"),
    )
    op.create_index("ix_manual_methods_org", "manual_payment_methods", ["organization_id"])

    op.create_table(
        "payments",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("organization_id", sa.Uuid(), nullable=False),
        sa.Column("booking_id", sa.Uuid(), nullable=False),
        sa.Column("provider", payment_provider, nullable=False),
        sa.Column("provider_ref", sa.String(length=100), nullable=False),
        sa.Column("amount", sa.Numeric(10, 2), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False),
        sa.Column("status", payment_status, nullable=False),
        sa.Column("raw_payload", postgresql.JSONB()),
        sa.Column("reason", sa.String(length=500)),
        sa.Column("manual_method_id", sa.Uuid()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["booking_id"], ["bookings.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["manual_method_id"], ["manual_payment_methods.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("organization_id", "provider", "provider_ref", name="uq_payments_org_provider_ref"),
    )
    op.create_index("ix_payments_org", "payments", ["organization_id"])
    op.create_index("ix_payments_booking", "payments", ["booking_id"])

    op.create_table(
        "payment_audit_logs",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("organization_id", sa.Uuid(), nullable=False),
        sa.Column("booking_id", sa.Uuid()),
        sa.Column("payment_id", sa.Uuid()),
        sa.Column("action", sa.String(length=60), nullable=False),
        sa.Column("old_value", postgresql.JSONB()),
        sa.Column("new_value", postgresql.JSONB()),
        sa.Column("metadata", postgresql.JSONB()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["booking_id"], ["bookings.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["payment_id"], ["payments.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_payment_audit_logs_org", "payment_audit_logs", ["organization_id"])
    op.create_index("ix_payment_audit_logs_booking", "payment_audit_logs", ["booking_id"])


def downgrade() -> None:
    op.drop_table("payment_audit_logs")
    op.drop_table("payments")
    op.drop_table("manual_payment_methods")
    payment_provider.drop(op.get_bind(), checkfirst=True)
