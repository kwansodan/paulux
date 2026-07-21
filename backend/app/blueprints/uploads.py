"""Image uploads via S3-compatible presigned URLs (MinIO in the compose stack).

Auth-gated (the old app's presign was public). Object keys are prefixed with
the tenant id so buckets stay partitioned per org. Returns 422 with a clear
message when storage isn't configured (e.g. local dev without MinIO).
"""
from __future__ import annotations

import os
import re
import uuid

from flask import Blueprint

from app.auth.decorators import require_auth
from app.blueprints.helpers import ok, parse_body, require_tenant
from app.errors import ApiError
from pydantic import BaseModel, Field

bp = Blueprint("uploads", __name__, url_prefix="/api/uploads")

SAFE_NAME = re.compile(r"[^a-zA-Z0-9._-]+")
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


class PresignInput(BaseModel):
    filename: str = Field(min_length=1, max_length=200)
    content_type: str = Field(alias="contentType")

    model_config = {"populate_by_name": True}


def _minio_client():
    endpoint = os.environ.get("MINIO_ENDPOINT")
    access_key = os.environ.get("MINIO_ACCESS_KEY")
    secret_key = os.environ.get("MINIO_SECRET_KEY")
    if not (endpoint and access_key and secret_key):
        raise ApiError(
            "File storage is not configured", status=422, code="STORAGE_NOT_CONFIGURED"
        )
    from minio import Minio  # lazy: optional dependency in dev

    secure = os.environ.get("MINIO_SECURE", "true").lower() != "false"
    return Minio(endpoint, access_key=access_key, secret_key=secret_key, secure=secure)


@bp.post("/presign")
@require_auth
def presign_upload():
    org = require_tenant()
    data = parse_body(PresignInput)
    if data.content_type not in ALLOWED_CONTENT_TYPES:
        raise ApiError("Only image uploads are allowed", status=422, code="INVALID_TYPE")

    client = _minio_client()
    bucket = os.environ.get("MINIO_BUCKET", "paulux-uploads")
    safe = SAFE_NAME.sub("-", data.filename)[-100:]
    object_name = f"{org.id}/{uuid.uuid4().hex}-{safe}"

    from datetime import timedelta

    url = client.presigned_put_object(bucket, object_name, expires=timedelta(minutes=10))
    public_base = os.environ.get("MINIO_PUBLIC_URL", "")
    return ok({
        "uploadUrl": url,
        "objectName": object_name,
        "publicUrl": f"{public_base.rstrip('/')}/{bucket}/{object_name}" if public_base else None,
    })
