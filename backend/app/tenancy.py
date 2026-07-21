"""Tenant resolution and automatic query scoping.

Two layers of isolation:

1. **Resolution** — a ``before_request`` hook reads the subdomain from the Host
   header, looks up the Organization, and stashes it on ``flask.g``.
2. **Auto-scoping** — a SQLAlchemy ``do_orm_execute`` event injects
   ``organization_id = <current org>`` into every SELECT against a tenant table,
   so a forgotten ``.filter()`` cannot leak across tenants. Explicit ownership
   checks in handlers remain the second line of defence.

Reserved labels (``www``, ``app``, ``admin``, ``api``) and the bare apex resolve
to *no tenant* — used by signup, marketing, and the platform console.

When the SPA is hosted separately from the API (frontend on Vercel at
``<slug>.<base>``, API at ``api.<base>``) the API's own Host carries no tenant,
so the client states it via the ``X-Tenant-Slug`` header. That header is only
consulted when the Host yields nothing, so same-origin deployments are
unaffected and the Host always wins where it is meaningful. The header is not a
trust boundary: authenticated routes still require the session user's
``organization_id`` to match the resolved org (see ``auth.decorators``), so a
forged slug yields 401 rather than cross-tenant access.
"""
from __future__ import annotations

import re
import uuid

from flask import Flask, g, request
from sqlalchemy import event
from sqlalchemy.orm import ORMExecuteState, with_loader_criteria

from app.extensions import db
from app.models.base import TenantMixin
from app.models.organization import Organization

RESERVED_LABELS = {"www", "app", "admin", "api", "", "localhost"}

TENANT_SLUG_HEADER = "X-Tenant-Slug"
_SLUG_RE = re.compile(r"^[a-z0-9-]{1,63}$")


def resolve_tenant_slug_from_header(value: str | None) -> str | None:
    """Return a tenant slug supplied by the client, or None if absent/invalid.

    Shape is validated so a malformed header can never reach the query as
    something other than a single DNS label.
    """
    if not value:
        return None
    label = value.strip().lower()
    if not _SLUG_RE.match(label) or label in RESERVED_LABELS:
        return None
    return label


def resolve_tenant_slug(host: str, base_domain: str) -> str | None:
    """Return the tenant slug from a Host header, or None for apex/reserved.

    ``acme.paulux.app`` -> ``acme``; ``paulux.app`` / ``www.paulux.app`` -> None.
    Host may include a port (``acme.lvh.me:5000``) which is stripped.
    """
    hostname = host.split(":", 1)[0].strip().lower()
    if not hostname or hostname == base_domain:
        return None
    suffix = "." + base_domain
    if not hostname.endswith(suffix):
        return None
    label = hostname[: -len(suffix)]
    # Only a single-label subdomain is a tenant (ignore deeper nesting).
    if "." in label or label in RESERVED_LABELS:
        return None
    return label


def current_org() -> Organization | None:
    return getattr(g, "organization", None)


def current_org_id() -> uuid.UUID | None:
    org = current_org()
    return org.id if org else None


def init_tenancy(app: Flask) -> None:
    base_domain = app.config["APP_BASE_DOMAIN"]

    @app.before_request
    def _load_tenant() -> None:
        g.organization = None
        # Host is authoritative; the header is the fallback for split hosting.
        slug = resolve_tenant_slug(request.host, base_domain) or (
            resolve_tenant_slug_from_header(request.headers.get(TENANT_SLUG_HEADER))
        )
        if slug:
            g.organization = db.session.execute(
                db.select(Organization).filter_by(slug=slug, is_active=True)
            ).scalar_one_or_none()

    # Auto-inject the tenant filter on every ORM SELECT.
    @event.listens_for(db.session.__class__, "do_orm_execute")
    def _apply_tenant_filter(state: ORMExecuteState) -> None:  # noqa: ANN001
        if not state.is_select or state.is_column_load or state.is_relationship_load:
            return
        # Allow explicit opt-out (e.g. tenant resolution itself, super-admin tools).
        if state.execution_options.get("skip_tenant_filter"):
            return
        org_id = current_org_id()
        if org_id is None:
            return
        state.statement = state.statement.options(
            with_loader_criteria(
                TenantMixin,
                lambda cls: cls.organization_id == org_id,
                include_aliases=True,
            )
        )
