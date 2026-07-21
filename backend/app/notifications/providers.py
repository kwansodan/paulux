"""Email + SMS delivery providers.

Each has three interchangeable backends chosen by the app config:
- ``resend``/``arkesel`` — real delivery (production),
- ``console`` — structured-log only (local dev; nothing leaves the box),
- ``memory`` — appended to an in-process outbox for tests to assert against.

The backend is read from ``current_app.config`` (set once in the factory) so
per-app settings — including the testing override — are honored.
"""
from __future__ import annotations

from dataclasses import dataclass, field

import structlog
from flask import current_app, has_app_context

log = structlog.get_logger()


@dataclass
class SentEmail:
    to: str
    subject: str
    html: str
    kind: str = ""


@dataclass
class SentSms:
    to: str
    body: str
    kind: str = ""


@dataclass
class Outbox:
    emails: list[SentEmail] = field(default_factory=list)
    sms: list[SentSms] = field(default_factory=list)

    def clear(self) -> None:
        self.emails.clear()
        self.sms.clear()


# Shared in-memory outbox (used by the "memory" backend and tests).
outbox = Outbox()


def _config(key: str, default: str = "") -> str:
    if has_app_context():
        return current_app.config.get(key, default)
    return default


def send_email(to: str, subject: str, html: str, *, kind: str = "") -> None:
    if not to:
        return
    backend = _config("EMAIL_BACKEND", "console")
    if backend == "memory":
        outbox.emails.append(SentEmail(to=to, subject=subject, html=html, kind=kind))
        return
    if backend == "resend":
        _send_email_resend(to, subject, html)
        return
    log.info("email.console", to=to, subject=subject, kind=kind)


def send_sms(to: str, body: str, *, kind: str = "") -> None:
    if not to:
        return
    backend = _config("SMS_BACKEND", "console")
    if backend == "memory":
        outbox.sms.append(SentSms(to=to, body=body, kind=kind))
        return
    if backend == "arkesel":
        _send_sms_arkesel(to, body)
        return
    log.info("sms.console", to=to, body=body, kind=kind)


def _send_email_resend(to: str, subject: str, html: str) -> None:
    try:
        import resend

        resend.api_key = _config("RESEND_API_KEY")
        resend.Emails.send(
            {"from": _config("EMAIL_FROM"), "to": [to], "subject": subject, "html": html}
        )
    except Exception as e:  # pragma: no cover - network path
        log.error("email.resend_failed", to=to, error=str(e))


def _send_sms_arkesel(to: str, body: str) -> None:
    import requests

    try:
        requests.post(
            "https://sms.arkesel.com/api/v2/sms/send",
            headers={"api-key": _config("ARKESEL_API_KEY")},
            json={"sender": _config("ARKESEL_SENDER"), "message": body, "recipients": [to]},
            timeout=15,
        )
    except Exception as e:  # pragma: no cover - network path
        log.error("sms.arkesel_failed", to=to, error=str(e))
