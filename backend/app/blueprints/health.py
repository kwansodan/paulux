"""Liveness / readiness. Also echoes the resolved tenant for debugging."""
from __future__ import annotations

from flask import Blueprint, jsonify
from sqlalchemy import text

from app.extensions import db
from app.tenancy import current_org

bp = Blueprint("health", __name__)


@bp.get("/api/health")
def health():
    org = current_org()
    db_ok = True
    try:
        db.session.execute(text("SELECT 1"))
    except Exception:  # pragma: no cover
        db_ok = False
    return jsonify(
        {
            "success": True,
            "data": {
                "status": "ok" if db_ok else "degraded",
                "db": db_ok,
                "tenant": org.slug if org else None,
            },
        }
    )
