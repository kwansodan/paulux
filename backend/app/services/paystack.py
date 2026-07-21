"""Paystack client — per-tenant credentials, raw-body webhook verification.

Fixes two defects from the old integration:
- webhook HMAC is computed over the **raw request bytes**, not re-serialized
  JSON (key order made the old check fragile);
- callers must validate the verified amount against the expected amount before
  marking anything paid (see ``payments`` blueprint).
"""
from __future__ import annotations

import hashlib
import hmac
import re

import requests

from app.config import get_settings
from app.errors import ApiError
from app.models.organization import Organization
from app.security import decrypt_secret

PAYSTACK_BASE_URL = "https://api.paystack.co"
TIMEOUT = 30


def get_org_secret_key(org: Organization) -> str:
    """Resolve the tenant's Paystack secret key (decrypting if configured)."""
    if not org.paystack_secret_encrypted:
        raise ApiError(
            "This workspace has not configured payments yet",
            status=422, code="PAYMENTS_NOT_CONFIGURED",
        )
    enc_key = get_settings().secrets_encryption_key
    if enc_key:
        return decrypt_secret(org.paystack_secret_encrypted, enc_key)
    # Dev fallback: stored plaintext when no encryption key is configured.
    return org.paystack_secret_encrypted


def normalize_phone_gh(phone: str | None) -> str | None:
    """0241234567 -> 233241234567 (Paystack MoMo pre-fill)."""
    if not phone:
        return None
    digits = re.sub(r"\D", "", phone)
    return re.sub(r"^0(\d{9})$", r"233\1", digits)


def _headers(secret_key: str) -> dict:
    return {"Authorization": f"Bearer {secret_key}", "Content-Type": "application/json"}


def initialize_transaction(
    org: Organization,
    *,
    email: str,
    amount_pesewas: int,
    reference: str,
    callback_url: str | None = None,
    currency: str = "GHS",
    channels: list[str] | None = None,
    phone: str | None = None,
) -> dict:
    secret = get_org_secret_key(org)
    payload: dict = {
        "email": email,
        "amount": str(amount_pesewas),
        "reference": reference,
        "currency": currency,
        "channels": channels or ["mobile_money", "card"],
    }
    if callback_url:
        payload["callback_url"] = callback_url
    if normalized := normalize_phone_gh(phone):
        payload["phone"] = normalized
    resp = requests.post(
        f"{PAYSTACK_BASE_URL}/transaction/initialize",
        json=payload, headers=_headers(secret), timeout=TIMEOUT,
    )
    resp.raise_for_status()
    return resp.json()


def verify_transaction(org: Organization, reference: str) -> dict:
    secret = get_org_secret_key(org)
    resp = requests.get(
        f"{PAYSTACK_BASE_URL}/transaction/verify/{reference}",
        headers=_headers(secret), timeout=TIMEOUT,
    )
    resp.raise_for_status()
    return resp.json()


def initiate_refund(
    org: Organization,
    *,
    transaction_reference: str,
    amount_pesewas: int | None = None,
    merchant_note: str | None = None,
    customer_note: str | None = None,
) -> dict:
    secret = get_org_secret_key(org)
    payload: dict = {"transaction": transaction_reference}
    if amount_pesewas:
        payload["amount"] = amount_pesewas
    if merchant_note:
        payload["merchant_note"] = merchant_note
    if customer_note:
        payload["customer_note"] = customer_note
    resp = requests.post(
        f"{PAYSTACK_BASE_URL}/refund",
        json=payload, headers=_headers(secret), timeout=TIMEOUT,
    )
    resp.raise_for_status()
    return resp.json()


def verify_webhook_signature(secret_key: str, raw_body: bytes, signature: str | None) -> bool:
    """HMAC-SHA512 over the raw request bytes, constant-time compared."""
    if not signature or not secret_key:
        return False
    digest = hmac.new(secret_key.encode("utf-8"), raw_body, hashlib.sha512).hexdigest()
    return hmac.compare_digest(digest, signature)
