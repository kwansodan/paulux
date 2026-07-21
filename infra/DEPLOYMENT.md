# Paulux — Deployment

Multi-tenant SaaS. The React SPA is hosted on **Vercel**; the Flask API, Celery
worker, Postgres, Redis and MinIO run on a **VPS**, deployed with **Komodo**.

| Host | Serves | Where |
|---|---|---|
| `paulux.app`, `*.paulux.app` | SPA (tenants live at `<slug>.paulux.app`) | Vercel |
| `api.paulux.app` | Flask API | VPS (Caddy → `api:5000`) |
| `files.paulux.app` | MinIO object storage | VPS (Caddy → `minio:9000`) |

## Why the domain matters

Both halves **must** sit under one registrable domain. Session and CSRF cookies
are scoped to `.paulux.app` with `SameSite=Lax`, so `acme.paulux.app` →
`api.paulux.app` is cross-*origin* but same-*site* and the cookies ride along.

Serving the SPA from a `*.vercel.app` URL instead would make those cookies
third-party — Safari and Firefox block them outright and **login would break for
a large share of users**. Attach the real domain to Vercel before going live.

Wildcard subdomains on Vercel require a **Pro plan**; Hobby cannot serve
`*.paulux.app`.

## Tenant resolution

The backend normally derives the tenant from the request Host. With the API on
its own host that no longer works (`api` is a reserved label), so the SPA sends
`X-Tenant-Slug` and `app/tenancy.py` falls back to it when the Host yields
nothing. Host still wins where meaningful, so a same-origin deployment behaves
exactly as before.

The header is **not** a trust boundary: authenticated routes still require the
session user's `organization_id` to match the resolved org, so a forged slug
yields 401. Covered by `backend/tests/test_split_hosting.py`.

## VPS stack (infra/docker-compose.yml)
| Service | Role |
|---|---|
| `caddy` | TLS + reverse proxy for `api.` and `files.` (HTTP-01 — no DNS plugin) |
| `api` | Gunicorn (Flask); runs Alembic `upgrade` on start (`RUN_MIGRATIONS=1`) |
| `worker` | Celery worker (emails/SMS/calendar); `RUN_MIGRATIONS=0` |
| `db` | Postgres 16 (named volume) |
| `redis` | Rate-limit store + Celery broker |
| `minio` | S3-compatible uploads |

## First deploy — VPS

1. **DNS** → A records for `api.paulux.app` and `files.paulux.app` pointing at
   the VPS. (The apex and `*.paulux.app` point at Vercel instead.)
2. **Firewall**: allow 22, 80, 443. Nothing else needs to be public — Postgres,
   Redis and MinIO are reachable only on the compose network.
3. `cp infra/.env.example infra/.env` and fill every `change-me`. Generate:
   ```
   SECRET_KEY:               openssl rand -base64 48
   SECRETS_ENCRYPTION_KEY:   python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
   ```
4. In Komodo, create a **Stack** pointing at this repo with file path
   `infra/docker-compose.yml`, and put the contents of `.env` in the stack's
   environment. Deploy.

   Or manually:
   ```
   docker compose -f infra/docker-compose.yml --env-file infra/.env up -d --build
   ```

Migrations apply automatically on API start — no destructive `db push`.

### MinIO bucket setup (one-time)

The browser PUTs directly to `files.paulux.app` against a presigned URL, so the
bucket needs a CORS rule and public read:
```
mc alias set paulux https://files.paulux.app "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"
mc mb --ignore-existing paulux/paulux-uploads
mc anonymous set download paulux/paulux-uploads
```
Then allow `PUT`/`GET` from `https://*.paulux.app` in the bucket's CORS config.

`MINIO_ENDPOINT` must be the **public** host: presigned URLs are signed against
it and the browser's `Host` has to match, or MinIO rejects the signature.
Presigning is local crypto, so the API never dials MinIO directly.

## First deploy — Vercel

1. New project → this repo, **Root Directory = `frontend`**. `vercel.json`
   supplies the Vite build and SPA rewrite.
2. Add domains `paulux.app` and `*.paulux.app` (Pro plan).
3. Environment variables:
   | Name | Value |
   |---|---|
   | `VITE_BASE_DOMAIN` | `paulux.app` |
   | `VITE_API_BASE_URL` | `https://api.paulux.app` |

   These are **compile-time** — changing one needs a redeploy, not just a restart.

## CI/CD (.github/workflows/ci.yml)
- Every push/PR: backend `pytest` (Postgres service, incl. tenant isolation,
  split-hosting and payment tests) and frontend `typecheck` + `build`.
- Push to `main`: once both gates pass, POSTs to `KOMODO_WEBHOOK_URL` to
  redeploy the VPS stack. Vercel deploys the SPA on its own Git integration.
- Secrets needed: `KOMODO_WEBHOOK_URL`, `KOMODO_WEBHOOK_SECRET`.

## Backups
`infra/backup.sh` runs `pg_dump | gzip` into `$BACKUP_DIR`, prunes >14 days.
Cron nightly:
```
0 2 * * * /home/paulux/paulux/infra/backup.sh >> /var/log/paulux-backup.log 2>&1
```
Rehearse a restore against a scratch database. **The MinIO volume is not covered
by this script** — back it up separately (`mc mirror`) or accept that uploads are
unrecoverable.

## Operational notes
- Per-tenant Paystack keys are stored **encrypted** (`SECRETS_ENCRYPTION_KEY`);
  the secret is write-only and never returned by the API.
- A suspended/expired workspace is gated at the API (402) but can still reach
  billing to re-subscribe.
- Sentry: set `SENTRY_DSN` to capture errors from api + worker.
- CORS allowed origins are derived from `APP_BASE_DOMAIN`. Vercel **preview**
  deployments (`*.vercel.app`) are deliberately not allowed — they cannot hold a
  session anyway. Preview against a staging subdomain if you need a live API.
