"""Celery worker entrypoint.

Run in production alongside the API:
    celery -A celery_worker.celery worker --loglevel=info

Requires a real broker (Redis) — set CELERY_BROKER_URL or REDIS_URL. In dev/test
tasks run eagerly in-process, so no worker is needed.
"""
from app import create_app
from app.tasks import notify  # noqa: F401  — registers the shared tasks

flask_app = create_app()
celery = flask_app.extensions["celery"]
