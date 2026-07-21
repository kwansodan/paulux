"""Celery integration.

Tasks are defined with ``@shared_task`` (see ``notify.py``) so they don't need
the Celery instance at import time. ``celery_init_app`` builds the app in the
Flask factory, wires a Flask-app-context task base, and — when no broker is
configured outside production — runs everything eagerly (inline), so the system
works without Redis in dev/test and scales to a real worker in prod.
"""
from __future__ import annotations

from celery import Celery, Task
from flask import Flask

from app.config import get_settings


def celery_init_app(app: Flask) -> Celery:
    settings = get_settings()

    class FlaskTask(Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    broker = settings.celery_broker_url or (
        settings.redis_url if settings.is_production else "memory://"
    )
    celery = Celery(app.name, task_cls=FlaskTask)
    celery.conf.update(
        broker_url=broker,
        result_backend=settings.celery_result_backend or None,
        task_always_eager=settings.celery_eager,
        task_eager_propagates=True,
        broker_connection_retry_on_startup=True,
        task_ignore_result=True,
    )
    celery.set_default()
    app.extensions["celery"] = celery
    return celery
