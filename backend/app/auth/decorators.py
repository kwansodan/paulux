"""Auth/authorization decorators and the CSRF guard.

``require_auth`` enforces three things: a valid session, that the user belongs
to the tenant resolved from the subdomain (SUPER_ADMIN is cross-tenant), and —
for unsafe methods — a valid CSRF double-submit token.
"""
from __future__ import annotations

from functools import wraps

from flask import g, request

from app.auth.service import validate_session
from app.config import get_settings
from app.errors import ApiError
from app.models.user import UserRole
from app.security import csrf_tokens_match
from app.tenancy import current_org

SAFE_METHODS = {"GET", "HEAD", "OPTIONS"}


def load_current_user():
    """Resolve and cache the current user for this request (or None)."""
    if "current_user" in g:
        return g.current_user
    token = request.cookies.get(get_settings().session_cookie_name)
    g.current_user = validate_session(token) if token else None
    return g.current_user


def _check_csrf() -> None:
    if request.method in SAFE_METHODS:
        return
    cookie_token = request.cookies.get("paulux_csrf")
    header_token = request.headers.get("X-CSRF-Token")
    if not csrf_tokens_match(cookie_token, header_token):
        raise ApiError("CSRF token missing or invalid", status=403, code="CSRF_FAILED")


def _check_tenant(user) -> None:
    if user.role == UserRole.SUPER_ADMIN:
        return
    org = current_org()
    if org is None or user.organization_id != org.id:
        # Never reveal cross-tenant existence; treat as unauthenticated.
        raise ApiError("Not authenticated", status=401, code="UNAUTHENTICATED")


# Blueprints reachable even when a subscription lapses, so admins can recover.
_BILLING_EXEMPT = {"billing", "auth", "org_settings"}


def _check_subscription(user) -> None:
    """Block admin actions when the org is suspended or its trial has expired —
    except billing/settings/auth so the admin can re-subscribe."""
    if user.role == UserRole.SUPER_ADMIN:
        return
    if request.blueprint in _BILLING_EXEMPT:
        return
    from app.models.organization import OrgStatus
    from app.services.billing import is_trial_expired

    org = current_org()
    if org is None:
        return
    if org.status == OrgStatus.SUSPENDED or is_trial_expired(org):
        raise ApiError(
            "Your subscription is inactive. Please choose a plan to continue.",
            status=402, code="SUBSCRIPTION_REQUIRED",
        )


def csrf_protect(fn):
    """CSRF guard for unauthenticated-but-state-changing routes (e.g. login)."""

    @wraps(fn)
    def wrapper(*args, **kwargs):
        _check_csrf()
        return fn(*args, **kwargs)

    return wrapper


def require_auth(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        _check_csrf()
        user = load_current_user()
        if user is None:
            raise ApiError("Not authenticated", status=401, code="UNAUTHENTICATED")
        _check_tenant(user)
        return fn(*args, **kwargs)

    return wrapper


def require_permission(permission: str):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            _check_csrf()
            user = load_current_user()
            if user is None:
                raise ApiError("Not authenticated", status=401, code="UNAUTHENTICATED")
            _check_tenant(user)
            _check_subscription(user)
            keys = user.permission_keys
            if "*" not in keys and permission not in keys:
                raise ApiError("Forbidden", status=403, code="FORBIDDEN")
            return fn(*args, **kwargs)

        return wrapper

    return decorator
