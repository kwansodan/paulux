"""Low-level security primitives: password hashing, opaque tokens, CSRF, and
symmetric encryption for per-tenant secrets.
"""
from __future__ import annotations

import hashlib
import hmac
import secrets

import bcrypt


# --- Passwords -----------------------------------------------------------------

def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except (ValueError, TypeError):
        return False


# --- Opaque tokens (sessions, reset tokens) ------------------------------------

def generate_token() -> str:
    """URL-safe random token placed in the cookie; only its hash is stored."""
    return secrets.token_urlsafe(32)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


# --- CSRF (double-submit token) ------------------------------------------------

def generate_csrf_token() -> str:
    return secrets.token_urlsafe(32)


def csrf_tokens_match(cookie_token: str | None, header_token: str | None) -> bool:
    if not cookie_token or not header_token:
        return False
    return hmac.compare_digest(cookie_token, header_token)


# --- Per-tenant secret encryption ---------------------------------------------

def encrypt_secret(plaintext: str, key: str) -> str:
    """Encrypt a tenant secret (e.g. Paystack key). Requires a Fernet key.

    Kept dependency-light: uses cryptography's Fernet lazily so the base install
    doesn't hard-require it until a tenant actually stores a secret.
    """
    from cryptography.fernet import Fernet  # local import: optional dependency

    return Fernet(key.encode()).encrypt(plaintext.encode()).decode()


def decrypt_secret(ciphertext: str, key: str) -> str:
    from cryptography.fernet import Fernet

    return Fernet(key.encode()).decrypt(ciphertext.encode()).decode()
