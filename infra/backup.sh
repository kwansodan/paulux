#!/usr/bin/env bash
# Nightly Postgres backup for the Paulux stack.
# Cron example (2am daily, keep 14 days):
#   0 2 * * * /home/paulux/paulux/infra/backup.sh >> /var/log/paulux-backup.log 2>&1
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/paulux}"
KEEP_DAYS="${KEEP_DAYS:-14}"
STAMP="$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "[$(date -Is)] dumping database..."
docker compose -f "$(dirname "$0")/docker-compose.yml" exec -T db \
  pg_dump -U "${POSTGRES_USER:-paulux}" "${POSTGRES_DB:-paulux}" \
  | gzip > "$BACKUP_DIR/paulux-$STAMP.sql.gz"

echo "[$(date -Is)] pruning backups older than ${KEEP_DAYS} days..."
find "$BACKUP_DIR" -name 'paulux-*.sql.gz' -mtime "+$KEEP_DAYS" -delete

echo "[$(date -Is)] backup complete: paulux-$STAMP.sql.gz"

# Restore rehearsal (documented, run manually against a scratch db):
#   gunzip -c paulux-<stamp>.sql.gz | docker compose exec -T db psql -U paulux -d paulux_restore
