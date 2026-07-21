"""Start an embedded dev Postgres via pgserver (no Docker/admin install needed).

Run with the .venv-pg (Python 3.10) interpreter:
    .venv-pg/Scripts/python.exe scripts/dev_pg.py

Uses cleanup_mode=None so the postgres process KEEPS RUNNING after this script
exits. Writes the connection URI to .pgdata/uri.txt. Creates the `paulux` and
`paulux_test` databases if missing. Dev-only tooling — production uses a real
managed Postgres.
"""
from __future__ import annotations

import sys
from pathlib import Path

import pgserver

PGDATA = Path(__file__).resolve().parent.parent / ".pgdata"


def main() -> None:
    PGDATA.mkdir(exist_ok=True)
    server = pgserver.get_server(PGDATA, cleanup_mode=None)
    uri = server.get_uri()
    (PGDATA / "uri.txt").write_text(uri, encoding="utf-8")
    for db in ("paulux", "paulux_test"):
        try:
            server.psql(f'CREATE DATABASE "{db}"')
        except Exception:
            pass  # already exists
    print("URI:", uri)
    print("databases ready: paulux, paulux_test")


if __name__ == "__main__":
    sys.exit(main())
