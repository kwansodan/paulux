"""Helpers to set/clear the session and CSRF cookies with correct scope.

Both cookies are scoped to ``.<APP_BASE_DOMAIN>`` so a single login works across
every tenant subdomain. The session cookie is httpOnly; the CSRF cookie is
readable by JS so the SPA can echo it back in a header (double-submit).
"""
from __future__ import annotations

from flask import Response, current_app


def _domain() -> str:
    # Leading dot -> valid for apex and all subdomains. Omit for bare localhost.
    base = current_app.config["APP_BASE_DOMAIN"]
    if base in ("localhost", "127.0.0.1"):
        return None
    return f".{base}"


def set_session_cookie(resp: Response, token: str) -> None:
    resp.set_cookie(
        current_app.config["SESSION_COOKIE_NAME"],
        token,
        max_age=current_app.config["SESSION_MAX_DURATION_DAYS"] * 86400,
        httponly=True,
        secure=current_app.config["SECURE_COOKIES"],
        samesite="Lax",
        domain=_domain(),
        path="/",
    )


def clear_session_cookie(resp: Response) -> None:
    resp.delete_cookie(
        current_app.config["SESSION_COOKIE_NAME"],
        domain=_domain(),
        path="/",
    )


def set_csrf_cookie(resp: Response, token: str) -> None:
    resp.set_cookie(
        "paulux_csrf",
        token,
        max_age=current_app.config["SESSION_MAX_DURATION_DAYS"] * 86400,
        httponly=False,  # JS must read it to send back in the X-CSRF-Token header
        secure=current_app.config["SECURE_COOKIES"],
        samesite="Lax",
        domain=_domain(),
        path="/",
    )
