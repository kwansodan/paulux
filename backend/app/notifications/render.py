"""Jinja2 rendering for transactional emails. Templates live in ./templates.

A single elegant base layout wraps each email in the Paulux palette. Kept as
server-rendered HTML (no external CSS/CDN) so it survives email clients.
"""
from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape

TEMPLATE_DIR = Path(__file__).parent / "templates"


@lru_cache
def _env() -> Environment:
    return Environment(
        loader=FileSystemLoader(str(TEMPLATE_DIR)),
        autoescape=select_autoescape(["html"]),
    )


def render_email(template: str, **context) -> str:
    return _env().get_template(template).render(**context)
