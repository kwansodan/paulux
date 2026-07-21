"""Authentication endpoints: csrf bootstrap, login, logout, current user.

Login is tenant-scoped: it runs on a tenant subdomain, so the tenant filter
restricts the user lookup to that organization automatically.
"""
from __future__ import annotations

from flask import Blueprint, g, jsonify, request
from pydantic import BaseModel, EmailStr, Field, ValidationError

from app.auth.cookies import (
    clear_session_cookie,
    set_csrf_cookie,
    set_session_cookie,
)
from app.auth.decorators import csrf_protect, load_current_user, require_auth
from app.auth.service import (
    consume_password_reset,
    create_password_reset,
    create_session,
    revoke_session,
)
from app.config import get_settings
from app.errors import ApiError
from app.extensions import db, limiter
from app.models.user import User
from app.security import generate_csrf_token, verify_password
from app.tenancy import current_org

bp = Blueprint("auth", __name__, url_prefix="/api/auth")


class LoginInput(BaseModel):
    email: EmailStr
    password: str


def serialize_user(user: User) -> dict:
    """Public user shape — never includes password_hash."""
    return {
        "id": str(user.id),
        "username": user.username,
        "email": user.email,
        "phone": user.phone,
        "role": user.role.value,
        "permissions": user.permission_keys,
        "organizationId": str(user.organization_id),
    }


@bp.get("/csrf")
def csrf():
    """Issue a CSRF token (cookie + body) for the SPA to echo back in headers."""
    token = generate_csrf_token()
    resp = jsonify({"success": True, "data": {"csrfToken": token}})
    set_csrf_cookie(resp, token)
    return resp


@bp.post("/login")
@csrf_protect
@limiter.limit("10 per minute")
def login():
    org = current_org()
    if org is None:
        raise ApiError("Unknown workspace", status=404, code="TENANT_NOT_FOUND")

    try:
        data = LoginInput.model_validate(request.get_json(force=True, silent=True) or {})
    except ValidationError:
        raise ApiError("Invalid email or password", status=400, code="INVALID_INPUT")

    user = db.session.execute(
        db.select(User).filter_by(email=data.email)
    ).scalar_one_or_none()

    if user is None or not verify_password(data.password, user.password_hash):
        raise ApiError("Invalid email or password", status=401, code="INVALID_CREDENTIALS")

    token = create_session(user.id)
    csrf_token = generate_csrf_token()
    resp = jsonify({"success": True, "data": {"user": serialize_user(user)}})
    set_session_cookie(resp, token)
    set_csrf_cookie(resp, csrf_token)
    return resp


@bp.post("/logout")
@require_auth
def logout():
    token = request.cookies.get(get_settings().session_cookie_name)
    revoke_session(token)
    resp = jsonify({"success": True, "data": None})
    clear_session_cookie(resp)
    return resp


@bp.get("/me")
def me():
    user = load_current_user()
    org = current_org()
    if user is None or (user.organization_id != (org.id if org else None) and user.role.value != "SUPER_ADMIN"):
        return jsonify({"success": True, "data": {"user": None}})
    return jsonify({"success": True, "data": {"user": serialize_user(user)}})


# --- Password reset -----------------------------------------------------------

class ForgotPasswordInput(BaseModel):
    email: EmailStr


class ResetPasswordInput(BaseModel):
    token: str = Field(min_length=8, max_length=128)
    password: str = Field(min_length=8, max_length=128)


@bp.post("/forgot-password")
@csrf_protect
@limiter.limit("5 per hour")
def forgot_password():
    """Issue a reset link. Always returns success so we never reveal whether an
    email is registered (enumeration-safe)."""
    org = current_org()
    if org is None:
        raise ApiError("Unknown workspace", status=404, code="TENANT_NOT_FOUND")
    try:
        data = ForgotPasswordInput.model_validate(request.get_json(force=True, silent=True) or {})
    except ValidationError:
        raise ApiError("A valid email is required", status=400, code="INVALID_INPUT")

    user = db.session.execute(
        db.select(User).filter_by(email=data.email)
    ).scalar_one_or_none()
    if user is not None:
        token = create_password_reset(user)
        _send_reset_email(org, user, token)
    return jsonify({"success": True, "data": None})


@bp.post("/reset-password")
@csrf_protect
@limiter.limit("10 per hour")
def reset_password():
    if current_org() is None:
        raise ApiError("Unknown workspace", status=404, code="TENANT_NOT_FOUND")
    try:
        data = ResetPasswordInput.model_validate(request.get_json(force=True, silent=True) or {})
    except ValidationError:
        raise ApiError("Token and a password (8+ chars) are required", status=400, code="INVALID_INPUT")

    user = consume_password_reset(data.token, data.password)
    if user is None:
        raise ApiError("This reset link is invalid or has expired", status=422, code="INVALID_TOKEN")
    return jsonify({"success": True, "data": None})


def _send_reset_email(org, user, token: str) -> None:
    from app.notifications.render import render_email
    from app.tasks.notify import send_email_task

    origin = request.headers.get("Origin") or f"https://{request.host}"
    link = f"{origin}/reset-password?token={token}"
    html = render_email(
        "password_reset.html",
        org_name=org.name,
        reset_link=link,
    )
    send_email_task.delay(user.email, "Reset your password", html, "password_reset")
