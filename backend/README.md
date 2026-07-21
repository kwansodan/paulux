# Paulux Booking — Backend (Flask API)

Multitenant SaaS API. Row-level `organization_id` isolation, subdomain-based
tenant resolution, httpOnly cookie sessions + CSRF.

## Stack
Flask 3 · SQLAlchemy 2 · Alembic (Flask-Migrate) · Postgres · Redis (rate limit / jobs) · pydantic

## Layout
```
app/
  __init__.py     app factory
  config.py       typed settings (pydantic-settings)
  extensions.py   db, migrate, limiter singletons + declarative Base
  tenancy.py      subdomain resolution + automatic query scoping
  security.py     password hashing, tokens, CSRF, secret encryption
  errors.py       uniform JSON error envelope
  permissions.py  permission-key registry
  auth/           session service, cookies, decorators
  models/         Organization, User, Role, Session, ...
  blueprints/     health, auth, (domain features added in Phase 2)
migrations/       Alembic
scripts/seed.py   two-tenant dev seed
tests/            pytest (skips if no Postgres)
```

## Local setup
```bash
python -m venv .venv && . .venv/Scripts/activate   # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
cp .env.example .env                                # then edit DATABASE_URL etc.
flask --app wsgi db upgrade                          # create schema
python -m scripts.seed                               # seed acme + zen tenants
flask --app wsgi run                                 # dev server
```

Requires a Postgres (native ARRAY/ENUM are used, so SQLite won't work). With
`APP_BASE_DOMAIN=lvh.me`, browse `http://acme.lvh.me:5000/api/health` — `lvh.me`
resolves to 127.0.0.1, giving working subdomains locally.

## Tests
```bash
TEST_DATABASE_URL=postgresql+psycopg://user:pass@localhost:5432/paulux_test pytest
```
