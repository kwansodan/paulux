"""gift cards, business hours, blocked dates, system settings; GIFT_CARD provider

Revision ID: 0006_gift_cards_schedule
Revises: 0005_payments
"""
from __future__ import annotations

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "0006_gift_cards_schedule"
down_revision = "0005_payments"
branch_labels = None
depends_on = None

gift_card_status = postgresql.ENUM(
    "PENDING_PAYMENT", "ACTIVE", "PARTIALLY_REDEEMED", "REDEEMED", "EXPIRED", "CANCELLED",
    name="gift_card_status", create_type=False,
)
gift_card_delivery_method = postgresql.ENUM(
    "SMS", "EMAIL", "BOTH", name="gift_card_delivery_method", create_type=False
)
gift_card_item_type = postgresql.ENUM(
    "SERVICE", "PRODUCT", name="gift_card_item_type", create_type=False
)
payment_status = postgresql.ENUM(
    "PENDING", "PAID", "PARTIAL", "REFUNDED", "FAILED", name="payment_status", create_type=False
)


def upgrade() -> None:
    bind = op.get_bind()
    for enum in (gift_card_status, gift_card_delivery_method, gift_card_item_type):
        enum.create(bind, checkfirst=True)
    # Extend the provider enum for gift-card-funded booking payments.
    op.execute("ALTER TYPE payment_provider ADD VALUE IF NOT EXISTS 'GIFT_CARD'")

    op.create_table(
        "gift_cards",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("organization_id", sa.Uuid(), nullable=False),
        sa.Column("code", sa.String(length=20), nullable=False),
        sa.Column("sender_name", sa.String(length=200), nullable=False),
        sa.Column("sender_email", sa.String(length=255), nullable=False),
        sa.Column("sender_phone", sa.String(length=40), nullable=False),
        sa.Column("recipient_name", sa.String(length=200), nullable=False),
        sa.Column("recipient_email", sa.String(length=255)),
        sa.Column("recipient_phone", sa.String(length=40)),
        sa.Column("message", sa.Text()),
        sa.Column("delivery_method", gift_card_delivery_method, nullable=False),
        sa.Column("delivered_at", sa.DateTime(timezone=True)),
        sa.Column("total_amount", sa.Numeric(10, 2), nullable=False),
        sa.Column("balance", sa.Numeric(10, 2), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False),
        sa.Column("status", gift_card_status, nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True)),
        sa.Column("payment_status", payment_status, nullable=False),
        sa.Column("payment_ref", sa.String(length=100)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("organization_id", "code", name="uq_gift_cards_org_code"),
    )
    op.create_index("ix_gift_cards_org", "gift_cards", ["organization_id"])
    op.create_index("ix_gift_cards_payment_ref", "gift_cards", ["payment_ref"])

    op.create_table(
        "gift_card_items",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("gift_card_id", sa.Uuid(), nullable=False),
        sa.Column("item_type", gift_card_item_type, nullable=False),
        sa.Column("service_id", sa.Uuid()),
        sa.Column("product_id", sa.Uuid()),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("unit_price", sa.Numeric(10, 2), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["gift_card_id"], ["gift_cards.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_gift_card_items_card", "gift_card_items", ["gift_card_id"])

    op.create_table(
        "gift_card_redemptions",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("organization_id", sa.Uuid(), nullable=False),
        sa.Column("gift_card_id", sa.Uuid(), nullable=False),
        sa.Column("booking_id", sa.Uuid()),
        sa.Column("amount_applied", sa.Numeric(10, 2), nullable=False),
        sa.Column("redeemed_by_id", sa.Uuid()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["gift_card_id"], ["gift_cards.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["booking_id"], ["bookings.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["redeemed_by_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_gift_card_redemptions_org", "gift_card_redemptions", ["organization_id"])
    op.create_index("ix_gift_card_redemptions_card", "gift_card_redemptions", ["gift_card_id"])

    op.create_table(
        "business_hours",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("organization_id", sa.Uuid(), nullable=False),
        sa.Column("day_of_week", sa.Integer(), nullable=False),
        sa.Column("start_time", sa.String(length=5), nullable=False),
        sa.Column("end_time", sa.String(length=5), nullable=False),
        sa.Column("is_open", sa.Boolean(), nullable=False),
        sa.Column("max_concurrent_bookings", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("organization_id", "day_of_week", name="uq_business_hours_org_day"),
    )
    op.create_index("ix_business_hours_org", "business_hours", ["organization_id"])

    op.create_table(
        "blocked_dates",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("organization_id", sa.Uuid(), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("reason", sa.String(length=255)),
        sa.Column("start_time", sa.String(length=5)),
        sa.Column("end_time", sa.String(length=5)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("organization_id", "date", name="uq_blocked_dates_org_date"),
    )
    op.create_index("ix_blocked_dates_org", "blocked_dates", ["organization_id"])

    op.create_table(
        "system_settings",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("organization_id", sa.Uuid(), nullable=False),
        sa.Column("key", sa.String(length=120), nullable=False),
        sa.Column("value", sa.String(length=2000), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("organization_id", "key", name="uq_system_settings_org_key"),
    )
    op.create_index("ix_system_settings_org", "system_settings", ["organization_id"])


def downgrade() -> None:
    op.drop_table("system_settings")
    op.drop_table("blocked_dates")
    op.drop_table("business_hours")
    op.drop_table("gift_card_redemptions")
    op.drop_table("gift_card_items")
    op.drop_table("gift_cards")
    bind = op.get_bind()
    for enum in (gift_card_item_type, gift_card_delivery_method, gift_card_status):
        enum.drop(bind, checkfirst=True)
    # Note: PG cannot drop a single enum VALUE; GIFT_CARD stays on downgrade.
