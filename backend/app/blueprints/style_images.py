"""Style images (lookbook). Public read of active images; settings-gated writes."""
from __future__ import annotations

from flask import Blueprint

from app.auth.decorators import require_permission
from app.blueprints.helpers import get_or_404, maybe_user, ok, parse_body, require_tenant
from app.extensions import db
from app.models.style_image import StyleImage
from pydantic import BaseModel, Field

bp = Blueprint("style_images", __name__, url_prefix="/api/style-images")


class StyleImageInput(BaseModel):
    url: str = Field(min_length=1, max_length=500)
    object_name: str | None = Field(alias="objectName", default=None, max_length=500)
    caption: str | None = Field(default=None, max_length=255)
    sort_order: int = Field(alias="sortOrder", default=0)
    is_active: bool = Field(alias="isActive", default=True)

    model_config = {"populate_by_name": True}


def serialize(img: StyleImage) -> dict:
    return {
        "id": str(img.id),
        "url": img.url,
        "caption": img.caption,
        "sortOrder": img.sort_order,
        "isActive": img.is_active,
    }


def _can_see_inactive() -> bool:
    user = maybe_user()
    return user is not None and (
        "*" in user.permission_keys or "settings.view" in user.permission_keys
    )


@bp.get("")
def list_style_images():
    require_tenant()
    stmt = db.select(StyleImage).order_by(StyleImage.sort_order, StyleImage.created_at)
    if not _can_see_inactive():
        stmt = stmt.filter_by(is_active=True)
    rows = db.session.execute(stmt).scalars().all()
    return ok([serialize(i) for i in rows])


@bp.post("")
@require_permission("settings.view")
def create_style_image():
    org = require_tenant()
    data = parse_body(StyleImageInput)
    row = StyleImage(
        organization_id=org.id, url=data.url, object_name=data.object_name,
        caption=data.caption, sort_order=data.sort_order, is_active=data.is_active,
    )
    db.session.add(row)
    db.session.commit()
    return ok(serialize(row), status=201)


@bp.put("/<uuid:image_id>")
@require_permission("settings.view")
def update_style_image(image_id):
    row = get_or_404(StyleImage, image_id, label="Style image")
    data = parse_body(StyleImageInput)
    row.url = data.url
    row.object_name = data.object_name
    row.caption = data.caption
    row.sort_order = data.sort_order
    row.is_active = data.is_active
    db.session.commit()
    return ok(serialize(row))


@bp.delete("/<uuid:image_id>")
@require_permission("settings.view")
def delete_style_image(image_id):
    row = get_or_404(StyleImage, image_id, label="Style image")
    db.session.delete(row)
    db.session.commit()
    return ok(None)
