"""Staff + custom roles administration.

Staff CRUD is admin-level (settings.view); role management needs roles.manage.
Passwords are hashed, never echoed; users are always created in the current
tenant. A user cannot delete themselves.
"""
from __future__ import annotations

from flask import Blueprint

from app.auth.decorators import load_current_user, require_permission
from app.blueprints.helpers import get_or_404, ok, parse_body, require_tenant
from app.errors import ApiError
from app.extensions import db
from app.models.user import Role, User, UserRole
from app.permissions import PERMISSION_KEYS, PERMISSIONS
from app.schemas.gift_card import RoleInput, StaffCreateInput, StaffUpdateInput
from app.security import hash_password

bp = Blueprint("staff", __name__, url_prefix="/api")


def serialize_staff(u: User) -> dict:
    return {
        "id": str(u.id),
        "username": u.username,
        "email": u.email,
        "phone": u.phone,
        "role": u.role.value,
        "customRoleId": str(u.custom_role_id) if u.custom_role_id else None,
        "customRoleName": u.custom_role.name if u.custom_role else None,
        "createdAt": u.created_at.isoformat(),
    }


def serialize_role(r: Role) -> dict:
    return {
        "id": str(r.id),
        "name": r.name,
        "description": r.description,
        "permissions": list(r.permissions or []),
        "isSystem": r.is_system,
    }


# --- staff ----------------------------------------------------------------------

@bp.get("/staff")
@require_permission("settings.view")
def list_staff():
    require_tenant()
    rows = db.session.execute(
        db.select(User).order_by(User.created_at)
    ).scalars().all()
    return ok([serialize_staff(u) for u in rows])


@bp.post("/staff")
@require_permission("settings.view")
def create_staff():
    org = require_tenant()
    data = parse_body(StaffCreateInput)
    exists = db.session.execute(
        db.select(User).where(
            db.or_(User.email == data.email, User.username == data.username)
        )
    ).scalar_one_or_none()
    if exists:
        raise ApiError("A user with this email or username already exists",
                       status=409, code="DUPLICATE")
    if data.custom_role_id is not None:
        get_or_404(Role, data.custom_role_id, label="Role")
    user = User(
        organization_id=org.id,
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password),
        phone=data.phone,
        role=UserRole(data.role),
        custom_role_id=data.custom_role_id,
    )
    db.session.add(user)
    db.session.commit()
    return ok(serialize_staff(user), status=201)


@bp.patch("/staff/<uuid:user_id>")
@require_permission("settings.view")
def update_staff(user_id):
    row = get_or_404(User, user_id, label="Staff member")
    data = parse_body(StaffUpdateInput)
    if data.role is not None:
        row.role = UserRole(data.role)
    if data.custom_role_id is not None:
        get_or_404(Role, data.custom_role_id, label="Role")
        row.custom_role_id = data.custom_role_id
    if data.phone is not None:
        row.phone = data.phone
    db.session.commit()
    return ok(serialize_staff(row))


@bp.delete("/staff/<uuid:user_id>")
@require_permission("settings.view")
def delete_staff(user_id):
    me = load_current_user()
    row = get_or_404(User, user_id, label="Staff member")
    if me and row.id == me.id:
        raise ApiError("You cannot delete your own account", status=422, code="SELF_DELETE")
    db.session.delete(row)
    db.session.commit()
    return ok(None)


# --- roles ----------------------------------------------------------------------

@bp.get("/permissions")
@require_permission("roles.manage")
def list_permissions():
    return ok(PERMISSIONS)


@bp.get("/roles")
@require_permission("roles.manage")
def list_roles():
    require_tenant()
    rows = db.session.execute(db.select(Role).order_by(Role.name)).scalars().all()
    return ok([serialize_role(r) for r in rows])


def _validate_permissions(keys: list[str]) -> list[str]:
    bad = [k for k in keys if k not in PERMISSION_KEYS]
    if bad:
        raise ApiError(f"Unknown permission keys: {', '.join(bad)}",
                       status=400, code="INVALID_INPUT")
    return sorted(set(keys))


@bp.post("/roles")
@require_permission("roles.manage")
def create_role():
    org = require_tenant()
    data = parse_body(RoleInput)
    if db.session.execute(
        db.select(Role).filter_by(name=data.name)
    ).scalar_one_or_none():
        raise ApiError("A role with this name already exists", status=409, code="DUPLICATE")
    row = Role(
        organization_id=org.id,
        name=data.name,
        description=data.description,
        permissions=_validate_permissions(data.permissions),
    )
    db.session.add(row)
    db.session.commit()
    return ok(serialize_role(row), status=201)


@bp.put("/roles/<uuid:role_id>")
@require_permission("roles.manage")
def update_role(role_id):
    row = get_or_404(Role, role_id, label="Role")
    if row.is_system:
        raise ApiError("System roles cannot be edited", status=422, code="SYSTEM_ROLE")
    data = parse_body(RoleInput)
    row.name = data.name
    row.description = data.description
    row.permissions = _validate_permissions(data.permissions)
    db.session.commit()
    return ok(serialize_role(row))


@bp.delete("/roles/<uuid:role_id>")
@require_permission("roles.manage")
def delete_role(role_id):
    row = get_or_404(Role, role_id, label="Role")
    if row.is_system:
        raise ApiError("System roles cannot be deleted", status=422, code="SYSTEM_ROLE")
    db.session.delete(row)
    db.session.commit()
    return ok(None)
