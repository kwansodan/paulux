#!/usr/bin/env bash
set -euo pipefail

# Apply versioned migrations (never destructive — no db push, no --accept-data-loss).
# Only the API container should migrate; the worker skips it via RUN_MIGRATIONS=0.
if [ "${RUN_MIGRATIONS:-1}" = "1" ]; then
  echo "Running database migrations..."
  FLASK_APP=wsgi.py flask db upgrade
fi

exec "$@"
