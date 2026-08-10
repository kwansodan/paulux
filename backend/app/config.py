"""Typed application configuration loaded from environment / .env.

A single ``Settings`` object is the source of truth; the Flask app copies the
values it needs onto ``app.config`` in the factory. Required secrets are
validated at import time so the process fails fast instead of at first use.
"""
from __future__ import annotations

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    # Core
    flask_env: str = "development"
    secret_key: str = "dev-insecure-secret-key"
    app_base_domain: str = "lvh.me"
    frontend_origin: str = "http://lvh.me:5173"

    # Database
    database_url: str = "postgresql+psycopg://paulux:paulux@localhost:5432/paulux"

    # Sessions / cookies
    session_cookie_name: str = "paulux_session"
    session_max_duration_days: int = 30
    session_refresh_threshold_days: int = 15
    secure_cookies: bool = False

    # Infra
    redis_url: str = "redis://localhost:6379/0"

    # Observability
    sentry_dsn: str = ""
    log_level: str = "INFO"

    # Per-tenant secret encryption (Fernet key). Empty in dev disables encryption.
    secrets_encryption_key: str = Field(default="")

    # --- Notifications / background jobs ---
    # Backends: "resend"|"console"|"memory" (email), "arkesel"|"console"|"memory" (sms).
    # Empty => auto: memory in testing, console in dev, resend/arkesel in prod.
    email_backend: str = ""
    sms_backend: str = ""
    resend_api_key: str = ""
    email_from: str = "Paulux <bookings@paulux.app>"
    # Where standalone/own-domain enquiries are sent. Empty => leads are still
    # persisted, but no email is dispatched.
    ops_email: str = ""
    arkesel_api_key: str = ""
    arkesel_sender: str = "Paulux"
    # Celery broker/result backend. Falls back to Redis URL; eager when unset in dev/test.
    celery_broker_url: str = ""
    celery_result_backend: str = ""

    @property
    def resolved_email_backend(self) -> str:
        if self.email_backend:
            return self.email_backend
        if self.flask_env.lower() == "testing":
            return "memory"
        if self.is_production and self.resend_api_key:
            return "resend"
        return "console"

    @property
    def resolved_sms_backend(self) -> str:
        if self.sms_backend:
            return self.sms_backend
        if self.flask_env.lower() == "testing":
            return "memory"
        if self.is_production and self.arkesel_api_key:
            return "arkesel"
        return "console"

    @property
    def celery_eager(self) -> bool:
        # No broker configured and not production => run tasks inline.
        broker = self.celery_broker_url or (self.redis_url if self.is_production else "")
        return not broker

    @property
    def is_production(self) -> bool:
        return self.flask_env.lower() in {"production", "prod"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
