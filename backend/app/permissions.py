"""Permission registry (ported from the current app's ``permissions.ts``).

Keys are the contract shared with the SPA; ADMIN/SUPER_ADMIN implicitly hold
all of them (see ``User.permission_keys``).
"""
from __future__ import annotations

PERMISSIONS: list[dict[str, str]] = [
    {"key": "dashboard.view", "label": "Dashboard", "area": "Core"},
    {"key": "bookings.view", "label": "Bookings", "area": "Core"},
    {"key": "payments.view", "label": "Payments", "area": "Core"},
    {"key": "services.view", "label": "Services", "area": "Catalog"},
    {"key": "products.view", "label": "Products", "area": "Catalog"},
    {"key": "reports.view", "label": "Reports", "area": "Analytics"},
    {"key": "promo_codes.view", "label": "Promo Codes", "area": "Marketing"},
    {"key": "gift_cards.view", "label": "Gift Cards", "area": "Marketing"},
    {"key": "gift_cards.manage", "label": "Manage Gift Cards", "area": "Marketing"},
    {"key": "settings.view", "label": "App Settings", "area": "Administration"},
    {"key": "roles.manage", "label": "Roles & Permissions", "area": "Administration"},
]

PERMISSION_KEYS: set[str] = {p["key"] for p in PERMISSIONS}
