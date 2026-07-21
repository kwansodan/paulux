"""Inventory routes: product categories, products, stock movements.

Same access model as the catalog: public reads (active items only for anonymous
callers), permission-gated mutations. Stock changes take a row lock so the
read-modify-write is atomic — the old app computed the new quantity outside the
transaction, which raced under concurrent movements.
"""
from __future__ import annotations

from flask import Blueprint

from app.auth.decorators import load_current_user, require_permission
from app.blueprints.helpers import (
    get_or_404,
    maybe_user,
    money,
    ok,
    parse_body,
    require_tenant,
)
from app.errors import ApiError
from app.extensions import db
from app.models.inventory import (
    Product,
    ProductCategory,
    ProductStockMovement,
    StockMovementType,
)
from app.schemas.catalog import StatusInput
from app.schemas.inventory import (
    ProductCategoryInput,
    ProductInput,
    StockMovementInput,
)

bp = Blueprint("inventory", __name__, url_prefix="/api")


# --- serializers ---------------------------------------------------------------

def serialize_product_category(c: ProductCategory) -> dict:
    return {
        "id": str(c.id),
        "name": c.name,
        "createdAt": c.created_at.isoformat(),
        "updatedAt": c.updated_at.isoformat(),
    }


def serialize_product(p: Product) -> dict:
    return {
        "id": str(p.id),
        "name": p.name,
        "description": p.description,
        "price": money(p.price),
        "currency": p.currency,
        "isActive": p.is_active,
        "imageUrl": p.image_url,
        "stockQuantity": p.stock_quantity,
        "lowStockThreshold": p.low_stock_threshold,
        "trackStock": p.track_stock,
        "categoryId": str(p.category_id) if p.category_id else None,
        "category": serialize_product_category(p.category) if p.category else None,
        "createdAt": p.created_at.isoformat(),
        "updatedAt": p.updated_at.isoformat(),
    }


def serialize_movement(m: ProductStockMovement) -> dict:
    return {
        "id": str(m.id),
        "productId": str(m.product_id),
        "type": m.type.value,
        "quantity": m.quantity,
        "notes": m.notes,
        "createdAt": m.created_at.isoformat(),
    }


def _can_see_inactive() -> bool:
    user = maybe_user()
    return user is not None and (
        "*" in user.permission_keys or "products.view" in user.permission_keys
    )


# --- product categories ----------------------------------------------------------

@bp.get("/product-categories")
def list_product_categories():
    require_tenant()
    rows = db.session.execute(
        db.select(ProductCategory).order_by(ProductCategory.name)
    ).scalars().all()
    return ok([serialize_product_category(c) for c in rows])


@bp.post("/product-categories")
@require_permission("products.view")
def create_product_category():
    org = require_tenant()
    data = parse_body(ProductCategoryInput)
    if db.session.execute(
        db.select(ProductCategory).filter_by(name=data.name)
    ).scalar_one_or_none():
        raise ApiError("A category with this name already exists", status=409, code="DUPLICATE")
    row = ProductCategory(organization_id=org.id, name=data.name)
    db.session.add(row)
    db.session.commit()
    return ok(serialize_product_category(row), status=201)


@bp.delete("/product-categories/<uuid:category_id>")
@require_permission("products.view")
def delete_product_category(category_id):
    row = get_or_404(ProductCategory, category_id, label="Category")
    db.session.delete(row)
    db.session.commit()
    return ok(None)


# --- products ---------------------------------------------------------------------

@bp.get("/products")
def list_products():
    require_tenant()
    stmt = db.select(Product).order_by(Product.created_at.desc())
    if not _can_see_inactive():
        stmt = stmt.filter_by(is_active=True)
    rows = db.session.execute(stmt).scalars().all()
    return ok([serialize_product(p) for p in rows])


@bp.get("/products/<uuid:product_id>")
def get_product(product_id):
    row = get_or_404(Product, product_id, label="Product")
    if not row.is_active and not _can_see_inactive():
        raise ApiError("Product not found", status=404, code="NOT_FOUND")
    return ok(serialize_product(row))


def _apply_product_input(row: Product, data: ProductInput) -> None:
    if data.category_id is not None:
        get_or_404(ProductCategory, data.category_id, label="Category")
    row.name = data.name
    row.description = data.description
    row.price = data.price
    row.currency = data.currency
    row.is_active = data.is_active
    row.image_url = data.image_url
    row.low_stock_threshold = data.low_stock_threshold
    row.track_stock = data.track_stock
    row.category_id = data.category_id


@bp.post("/products")
@require_permission("products.view")
def create_product():
    org = require_tenant()
    data = parse_body(ProductInput)
    row = Product(organization_id=org.id, name="", price=0)
    _apply_product_input(row, data)
    db.session.add(row)
    db.session.commit()
    return ok(serialize_product(row), status=201)


@bp.put("/products/<uuid:product_id>")
@require_permission("products.view")
def update_product(product_id):
    row = get_or_404(Product, product_id, label="Product")
    data = parse_body(ProductInput)
    _apply_product_input(row, data)
    db.session.commit()
    return ok(serialize_product(row))


@bp.patch("/products/<uuid:product_id>/status")
@require_permission("products.view")
def update_product_status(product_id):
    row = get_or_404(Product, product_id, label="Product")
    data = parse_body(StatusInput)
    row.is_active = data.is_active
    db.session.commit()
    return ok(serialize_product(row))


@bp.delete("/products/<uuid:product_id>")
@require_permission("products.view")
def delete_product(product_id):
    row = get_or_404(Product, product_id, label="Product")
    db.session.delete(row)
    db.session.commit()
    return ok(None)


# --- stock movements ----------------------------------------------------------------

@bp.get("/products/<uuid:product_id>/stock")
@require_permission("products.view")
def list_stock_movements(product_id):
    get_or_404(Product, product_id, label="Product")
    rows = db.session.execute(
        db.select(ProductStockMovement)
        .filter_by(product_id=product_id)
        .order_by(ProductStockMovement.created_at.desc())
        .limit(100)
    ).scalars().all()
    return ok([serialize_movement(m) for m in rows])


@bp.post("/products/<uuid:product_id>/stock")
@require_permission("products.view")
def record_stock_movement(product_id):
    org = require_tenant()
    get_or_404(Product, product_id, label="Product")
    data = parse_body(StockMovementInput)
    user = load_current_user()

    # Atomic read-modify-write: lock the product row for the duration of the
    # transaction so concurrent movements serialize instead of racing.
    locked = db.session.execute(
        db.select(Product).filter_by(id=product_id).with_for_update()
    ).scalar_one()

    prev = locked.stock_quantity
    if data.type == "IN":
        new_stock = prev + data.quantity
    elif data.type == "OUT":
        new_stock = max(0, prev - data.quantity)
    else:  # ADJUSTMENT sets the absolute quantity
        new_stock = data.quantity

    locked.stock_quantity = new_stock
    movement = ProductStockMovement(
        organization_id=org.id,
        product_id=locked.id,
        type=StockMovementType(data.type),
        quantity=data.quantity,
        notes=data.notes,
        created_by_id=user.id if user else None,
    )
    db.session.add(movement)
    db.session.commit()

    # Low-stock notification: fire only when the movement *crosses* the
    # threshold (or hits zero), so admins aren't spammed on every OUT.
    threshold = locked.low_stock_threshold
    if locked.track_stock and (new_stock == 0 or (prev > threshold >= new_stock)):
        from app.models.user import User, UserRole
        from app.notifications.events import notify_low_stock

        admin_emails = db.session.execute(
            db.select(User.email).where(User.role.in_([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
        ).scalars().all()
        notify_low_stock(locked, list(admin_emails))

    return ok({
        "productId": str(locked.id),
        "previousStock": prev,
        "newStock": new_stock,
        "type": data.type,
        "quantity": data.quantity,
    })
