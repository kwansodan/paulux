"""Application factory. Builds a fully-wired Flask app from ``Settings``."""
from __future__ import annotations

import logging

import structlog
from flask import Flask
from flask_cors import CORS

from app.config import Settings, get_settings
from app.extensions import db, limiter, migrate


def _configure_logging(settings: Settings) -> None:
    logging.basicConfig(level=settings.log_level, format="%(message)s")
    structlog.configure(
        wrapper_class=structlog.make_filtering_bound_logger(
            logging.getLevelName(settings.log_level)
        ),
        processors=[
            structlog.processors.add_log_level,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.JSONRenderer(),
        ],
    )


def _init_sentry(settings: Settings) -> None:
    if not settings.sentry_dsn:
        return
    import sentry_sdk
    from sentry_sdk.integrations.flask import FlaskIntegration

    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        integrations=[FlaskIntegration()],
        environment=settings.flask_env,
        traces_sample_rate=0.1,
    )


def create_app(settings: Settings | None = None) -> Flask:
    settings = settings or get_settings()
    _configure_logging(settings)
    _init_sentry(settings)

    app = Flask(__name__)
    app.config.update(
        SECRET_KEY=settings.secret_key,
        SQLALCHEMY_DATABASE_URI=settings.database_url,
        SQLALCHEMY_ENGINE_OPTIONS={"pool_pre_ping": True},
        APP_BASE_DOMAIN=settings.app_base_domain,
        FRONTEND_ORIGIN=settings.frontend_origin,
        SESSION_COOKIE_NAME=settings.session_cookie_name,
        SESSION_MAX_DURATION_DAYS=settings.session_max_duration_days,
        SESSION_REFRESH_THRESHOLD_DAYS=settings.session_refresh_threshold_days,
        SECURE_COOKIES=settings.secure_cookies,
        # Notifications — resolved once so tests/dev/prod pick the right backend.
        EMAIL_BACKEND=settings.resolved_email_backend,
        SMS_BACKEND=settings.resolved_sms_backend,
        RESEND_API_KEY=settings.resend_api_key,
        EMAIL_FROM=settings.email_from,
        OPS_EMAIL=settings.ops_email,
        ARKESEL_API_KEY=settings.arkesel_api_key,
        ARKESEL_SENDER=settings.arkesel_sender,
    )

    # Rate-limit storage: Redis in production, in-memory for local dev so a
    # running Redis isn't required to boot. Must be set before init_app.
    # Disabled entirely under test — the suite logs in dozens of times.
    if settings.flask_env.lower() == "testing":
        app.config["RATELIMIT_ENABLED"] = False
    if settings.is_production and settings.redis_url:
        app.config["RATELIMIT_STORAGE_URI"] = settings.redis_url

    # Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    limiter.init_app(app)

    # CORS: allow the SPA apex + any tenant subdomain, with credentials.
    # localhost is included outside production for the dev preview.
    base = settings.app_base_domain.replace(".", r"\.")
    origin_regex = rf"^https?://([a-z0-9-]+\.)?{base}(:\d+)?$"
    if not settings.is_production:
        origin_regex = rf"^https?://(([a-z0-9-]+\.)?{base}|localhost|127\.0\.0\.1)(:\d+)?$"
    CORS(
        app,
        resources={r"/api/*": {"origins": origin_regex}},
        supports_credentials=True,
        allow_headers=["Content-Type", "X-CSRF-Token", "X-Tenant-Slug"],
    )

    # Import models so metadata is registered before migrate/first request.
    from app import models  # noqa: F401

    # Request/response wiring
    from app.errors import init_error_handlers
    from app.tenancy import init_tenancy

    init_tenancy(app)
    init_error_handlers(app)

    # Background jobs (Celery). Eager in dev/test, Redis-backed in prod.
    from app.tasks.celery_app import celery_init_app

    celery_init_app(app)

    from app.blueprints import register_blueprints

    register_blueprints(app)

    return app
