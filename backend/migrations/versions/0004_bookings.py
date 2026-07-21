"""bookings + promo codes: promo_codes, bookings, booking_services, booking_products

Revision ID: 0004_bookings
Revises: 0003_inventory
"""
from __future__ import annotations

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "0004_bookings"
down_revision = "0003_inventory"
branch_labels = None
depends_on = None

discount_type = postgresql.ENUM("PERCENTAGE", "FIXED", name="discount_type", create_type=False)
booking_status = postgresql.ENUM(
    "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", name="booking_status", create_type=False
)
payment_status = postgresql.ENUM(
    "PENDING", "PAID", "PARTIAL", "REFUNDED", "FAILED", name="payment_status", create_type=False
)
booking_type = postgresql.ENUM("SCHEDULED", "WALKIN", name="booking_type", create_type=False)


def upgrade() -> None:
    bind = op.get_bind()
    for enum in (discount_type, booking_status, payment_status, booking_type):
        enum.create(bind, checkfirst=True)

    op.create_table(
        "promo_codes",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("organization_id", sa.Uuid(), nullable=False),
        sa.Column("code", sa.String(length=64), nullable=False),
        sa.Column("description", sa.String(length=255)),
        sa.Column("discount_type", discount_type, nullable=False),
        sa.Column("discount_value", sa.Numeric(10, 2), nullable=False),
        sa.Column("max_uses", sa.Integer()),
        sa.Column("used_count", sa.Integer(), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True)),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("min_booking_amount", sa.Numeric(10, 2)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("organization_id", "code", name="uq_promo_codes_org_code"),
    )
    op.create_index("ix_promo_codes_org", "promo_codes", ["organization_id"])

    op.create_table(
        "bookings",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("organization_id", sa.Uuid(), nullable=False),
        sa.Column("booking_reference", sa.String(length=20), nullable=False),
        sa.Column("client_name", sa.String(length=200), nullable=False),
        sa.Column("client_email", sa.String(length=255), nullable=False),
        sa.Column("client_phone", sa.String(length=40), nullable=False),
        sa.Column("booking_date", sa.String(length=10), nullable=False),
        sa.Column("booking_time", sa.String(length=5), nullable=False),
        sa.Column("status", booking_status, nullable=False),
        sa.Column("payment_status", payment_status, nullable=False),
        sa.Column("booking_type", booking_type, nullable=False),
        sa.Column("min_deposit_fixed", sa.Numeric(10, 2)),
        sa.Column("cancel_reason", sa.Text()),
        sa.Column("terms_accepted_at", sa.DateTime(timezone=True)),
        sa.Column("google_event_id", sa.String(length=255)),
        sa.Column("promo_code_id", sa.Uuid()),
        sa.Column("discount_amount", sa.Numeric(10, 2)),
        sa.Column("assigned_to_id", sa.Uuid()),
        sa.Column("created_by_id", sa.Uuid()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["promo_code_id"], ["promo_codes.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["assigned_to_id"], ["users.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["created_by_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("organization_id", "booking_reference", name="uq_bookings_org_reference"),
    )
    op.create_index("ix_bookings_org", "bookings", ["organization_id"])
    op.create_index("ix_bookings_date", "bookings", ["booking_date"])
    op.create_index("ix_bookings_status", "bookings", ["status"])
    op.create_index("ix_bookings_payment_status", "bookings", ["payment_status"])

    op.create_table(
        "booking_services",
        sa.Column("booking_id", sa.Uuid(), nullable=False),
        sa.Column("service_id", sa.Uuid(), nullable=False),
        sa.Column("price_at_booking", sa.Numeric(10, 2), nullable=False),
        sa.Column("duration_at_booking", sa.Integer(), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("assigned_to_id", sa.Uuid()),
        sa.ForeignKeyConstraint(["booking_id"], ["bookings.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["service_id"], ["services.id"]),
        sa.ForeignKeyConstraint(["assigned_to_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("booking_id", "service_id"),
    )
    op.create_index("ix_booking_services_booking", "booking_services", ["booking_id"])

    op.create_table(
        "booking_products",
        sa.Column("booking_id", sa.Uuid(), nullable=False),
        sa.Column("product_id", sa.Uuid(), nullable=False),
        sa.Column("price_at_booking", sa.Numeric(10, 2), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["booking_id"], ["bookings.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["product_id"], ["products.id"]),
        sa.PrimaryKeyConstraint("booking_id", "product_id"),
    )
    op.create_index("ix_booking_products_booking", "booking_products", ["booking_id"])


def downgrade() -> None:
    op.drop_table("booking_products")
    op.drop_table("booking_services")
    op.drop_table("bookings")
    op.drop_table("promo_codes")
    bind = op.get_bind()
    for enum in (booking_type, payment_status, booking_status, discount_type):
        enum.drop(bind, checkfirst=True)
