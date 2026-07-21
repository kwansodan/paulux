"""Uniform API errors. Handlers return a stable JSON envelope and never leak
internals (stack traces / SQL) to clients — those go to logs/Sentry instead.
"""
from __future__ import annotations

import structlog
from flask import Flask, jsonify
from werkzeug.exceptions import HTTPException

log = structlog.get_logger()


class ApiError(Exception):
    """Expected, client-facing error. The message is safe to return."""

    def __init__(self, message: str, status: int = 400, code: str = "BAD_REQUEST"):
        super().__init__(message)
        self.message = message
        self.status = status
        self.code = code


def _envelope(message: str, code: str):
    return {"success": False, "error": {"code": code, "message": message}}


def init_error_handlers(app: Flask) -> None:
    @app.errorhandler(ApiError)
    def _handle_api_error(err: ApiError):
        return jsonify(_envelope(err.message, err.code)), err.status

    @app.errorhandler(HTTPException)
    def _handle_http(err: HTTPException):
        return jsonify(_envelope(err.description, err.name.upper().replace(" ", "_"))), err.code

    @app.errorhandler(Exception)
    def _handle_unexpected(err: Exception):
        # Log the real error; return a generic message.
        log.error("unhandled_exception", error=str(err), exc_info=err)
        return jsonify(_envelope("Internal server error", "INTERNAL")), 500
