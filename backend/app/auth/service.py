"""Session lifecycle: issue, validate (with sliding refresh), and revoke.

Mirrors the original app's design — a random token lives in an httpOnly cookie,
only its SHA-256 hash is persisted, and sessions slide forward when used past a
refresh threshold.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone

from flask import current_app

from app.extensions import db
from app.models.user import PasswordResetToken, Session, User
from app.security import generate_token, hash_password, hash_token

RESET_TOKEN_TTL_MINUTES = 30


def _now() -> datetime:
    return datetime.now(timezone.utc)


def create_session(user_id) -> str:
    """Create a session row and return the raw token to set in the cookie."""
    token = generate_token()
    days = current_app.config["SESSION_MAX_DURATION_DAYS"]
    session = Session(
        token_hash=hash_token(token),
        user_id=user_id,
        expires_at=_now() + timedelta(days=days),
    )
    db.session.add(session)
    db.session.commit()
    return token


def validate_session(token: str) -> User | None:
    """Return the User for a valid session token, sliding expiry when near end."""
    if not token:
        return None
    row = db.session.execute(
        db.select(Session)
        .filter_by(token_hash=hash_token(token))
        .execution_options(skip_tenant_filter=True)
    ).scalar_one_or_none()
    if row is None:
        return None

    expires_at = row.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if _now() >= expires_at:
        db.session.delete(row)
        db.session.commit()
        return None

    # Sliding refresh
    max_days = current_app.config["SESSION_MAX_DURATION_DAYS"]
    threshold_days = current_app.config["SESSION_REFRESH_THRESHOLD_DAYS"]
    if _now() >= expires_at - timedelta(days=threshold_days):
        row.expires_at = _now() + timedelta(days=max_days)
        db.session.commit()

    user = db.session.get(
        User, row.user_id, execution_options={"skip_tenant_filter": True}
    )
    return user


def revoke_session(token: str) -> None:
    if not token:
        return
    row = db.session.execute(
        db.select(Session)
        .filter_by(token_hash=hash_token(token))
        .execution_options(skip_tenant_filter=True)
    ).scalar_one_or_none()
    if row is not None:
        db.session.delete(row)
        db.session.commit()


# --- Password reset -----------------------------------------------------------

def create_password_reset(user: User) -> str:
    """Issue a reset token for a user; returns the raw token (only its hash is
    stored). Clears any prior tokens for the user first."""
    db.session.execute(
        db.delete(PasswordResetToken).where(PasswordResetToken.user_id == user.id)
    )
    token = generate_token()
    db.session.add(
        PasswordResetToken(
            token_hash=hash_token(token),
            user_id=user.id,
            expires_at=_now() + timedelta(minutes=RESET_TOKEN_TTL_MINUTES),
        )
    )
    db.session.commit()
    return token


def consume_password_reset(token: str, new_password: str) -> User | None:
    """Validate a reset token, set the new password, and burn the token +
    all of the user's sessions. Returns the user, or None if invalid/expired."""
    if not token:
        return None
    row = db.session.execute(
        db.select(PasswordResetToken)
        .filter_by(token_hash=hash_token(token))
        .execution_options(skip_tenant_filter=True)
    ).scalar_one_or_none()
    if row is None:
        return None

    expires_at = row.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if _now() >= expires_at:
        db.session.delete(row)
        db.session.commit()
        return None

    user = db.session.get(User, row.user_id, execution_options={"skip_tenant_filter": True})
    if user is None:
        return None

    user.password_hash = hash_password(new_password)
    db.session.delete(row)
    # Invalidate existing sessions after a password change.
    db.session.execute(db.delete(Session).where(Session.user_id == user.id))
    db.session.commit()
    return user
