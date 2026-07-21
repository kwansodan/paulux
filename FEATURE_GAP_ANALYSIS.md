# Feature Gap Analysis — Reference (`next_polaris`) vs. New Build (`backend` + `frontend`)

Compares the original single-tenant Next.js app ("Polaris Beauty Lounge",
`next_polaris/`) against the rebuilt multi-tenant SaaS (Flask API in `backend/`,
React SPA in `frontend/`). Method: full route diff, Prisma-schema vs. SQLAlchemy
model diff, service/job diff, and page diff, plus a read of the non-obvious
business logic (dual gateway, invoices, password reset, notifications).

**Bottom line:** the new app is at parity or ahead on every core domain, and adds
a whole multi-tenant SaaS layer the reference never had. The genuine outstanding
items are: **password reset**, a richer **invoice lifecycle**, and admin **UI**
for booking operations whose backends already exist (assign stylist, top-up,
walk-in create, charge/mark-paid). A few reference features are **intentionally
not ported** because they don't fit a multi-tenant model (dual-Paystack
load-balancing).

---

## 1. Domain-by-domain parity

Legend: ✅ at parity or better · 🟡 partial (backend done, UI/edge missing) ·
🔴 missing · ⚪ intentionally not ported (N/A for multi-tenant)

| Domain | Reference | New build | Status |
|---|---|---|---|
| **Auth — login/logout/session** | cookie sessions | + CSRF, tenant-scoped, sliding refresh | ✅ better |
| **Auth — password reset** | forgot-password + reset-password/[token] + email link | `PasswordResetToken` model only; no endpoints/UI/email | 🔴 missing |
| **Services + categories + status** | full | full (+ inline category create) | ✅ |
| **Packages** | CRUD | CRUD | ✅ |
| **Products + categories + status** | full | full | ✅ |
| **Product stock movements** | in/out/adjust + low-stock job | in/out/adjust (atomic, row-locked) + low-stock alert | ✅ better |
| **Products bulk `stock-tracking` toggle** | dedicated endpoint | per-product edit only | 🟡 minor |
| **Promo codes + validate** | full | full | ✅ |
| **Bookings — list/detail/create** | admin + walk-in | admin + public(customer); walk-in endpoint exists | 🟡 (no walk-in UI) |
| **Bookings — status transitions** | `/status`, `/cancel` | `/status` (cancel via CANCELLED) | ✅ |
| **Bookings — reschedule** | admin + customer | admin + public-by-reference | ✅ |
| **Bookings — assign stylist / assign-services** | endpoints + UI + stylist-notify | endpoints only (no UI, no notify) | 🟡 |
| **Bookings — top-up (add items)** | endpoint + UI | endpoint only (no UI) | 🟡 |
| **Bookings — charge / mark-as-paid** | dedicated endpoints + UI | via `/payments/initialize` + `/payments/manual` (no dedicated UI button) | 🟡 |
| **Bookings — availability** | slots endpoint | slots endpoint | ✅ |
| **Bookings — month calendar** | ❌ none | month grid + per-day counts | ✅ new |
| **Payments — initialize/verify/webhook** | dual-gateway | single per-tenant Paystack, raw-body HMAC, amount validation | ✅ (see §3) |
| **Payments — dual-gateway load balancing** | percentage split across 2 Paystack accts + metrics + allocation UI | — | ⚪ N/A |
| **Payments — manual + refund + methods** | full | full (methods CRUD) | ✅ |
| **Payments — metrics / gateway-metrics** | `/payments/metrics`, `/payments/gateway-metrics` | `/dashboard/metrics` + `/reports/summary` (no gateway split) | ✅ (gateway split ⚪) |
| **Gift cards — purchase/validate/redeem/verify/cancel** | full | full (redeem now permission-gated + atomic) | ✅ better |
| **Invoices** | status lifecycle (DRAFT/ISSUED/PAID/VOID/OVERDUE), parent/child refund links, due/issued/paid dates, invoice #, gateway | flat invoice: number + amount + PAYMENT/REFUND kind, auto-issued | 🟡 simplified |
| **Business hours** | per-day + bulk + per-day status toggle | bulk upsert | ✅ (covers it) |
| **Blocked dates** | full (partial-day) | full (partial-day) | ✅ |
| **Staff + roles + permissions** | full | full | ✅ |
| **Settings (system KV)** | KV + `walkin-email` dedicated | KV store (no walkin-email UI) | 🟡 minor |
| **Style images (lookbook)** | CRUD | CRUD + public gallery on home | ✅ better |
| **Uploads (MinIO presign)** | public presign | auth-gated, tenant-prefixed | ✅ better |
| **Reports (admin page)** | light page | revenue-over-range + top services + daily chart | ✅ |
| **Dashboard** | metrics | metrics tiles | ✅ |
| **Background jobs** | Inngest (6 events) | Celery (eager dev / Redis prod) | ✅ ported |
| **Email (transactional)** | Resend + React Email | Resend + Jinja templates (console/memory backends) | ✅ ported |
| **SMS** | Arkesel | Arkesel (+ console/memory) | ✅ ported |
| **Google Calendar sync** | per-booking event | per-tenant, opt-in, syncs on create/reschedule | ✅ better |

---

## 2. Genuine outstanding features (to build), prioritized

### P1 — Password reset (real gap, affects every tenant)
Reference: `POST /api/forgot-password` issues a hashed, expiring token and emails
a reset link (`app/password.password-reset` job); `reset-password/[tokenId]`
validates and sets a new password. New build has the `PasswordResetToken` model
and the `password_reset_tokens` table, but **no endpoints, no email, no UI**.
- Build: `POST /api/auth/forgot-password` (issue token + enqueue email via the
  existing notifications layer), `POST /api/auth/reset-password` (validate token,
  set new hash), plus `ForgotPasswordPage` / `ResetPasswordPage` in the SPA and a
  new Jinja email template. Reuse `hash_token`/`generate_token` in
  `backend/app/security.py` and the `send_email_task` pipeline.

### P2 — Admin booking-operations UI (backends already exist)
The endpoints exist and are tested, but the admin **Bookings page has no UI** for
them, so staff can't use them:
- **Assign stylist** (`/bookings/{id}/assign`) and **per-service assignment**
  (`/bookings/{id}/assign-services`).
- **Top-up** — add services/products to a booking (`/bookings/{id}/top-up`).
- **Create walk-in / manual booking** from the admin (`POST /api/bookings`).
- **Charge** a booking (payment link via `/payments/initialize`) and **mark
  paid** (via `/payments/manual`) as one-click actions.
- A **booking detail drawer** showing line items, assignment, payment history,
  and invoices.
Recommendation: add a booking-detail panel/drawer to `BookingsPage.tsx` wiring
these existing endpoints; add a "New walk-in" button.

### P2 — Invoice lifecycle & receipts
Reference invoices have a status lifecycle, parent/child linkage (refund invoices
reference the original), and due/issued/paid dates. New invoices are flat
(number + amount + PAYMENT/REFUND). If formal invoicing/receipts matter:
- Add `status`, `parent_invoice_id`, `due_date`/`issued_at`/`paid_at` to the
  `Invoice` model; link refund invoices to their originals; add a
  printable/downloadable receipt (PDF or print view) and an admin invoice list
  UI. (`/api/invoices` list endpoint already exists.)

### P3 — Notifications & smaller items
- **Stylist-assigned notification** — reference emails/SMSes the stylist on
  assignment (`app/booking.stylist-assigned`); new build assigns silently. Add a
  `notify_staff_assigned` trigger in the assign endpoints.
- **Walk-in email setting** — reference has a dedicated `walkin-email` setting +
  UI (default email used for walk-in bookings). New: fold into the generic
  settings KV + a Settings field.
- **Standalone customer "Services" browse page** — reference `/customer/services`;
  new build surfaces services inside the booking wizard and home teaser only.
- **Products bulk stock-tracking toggle** and **per-day business-hours status
  toggle** — reference has dedicated endpoints; new covers both via edit/bulk,
  so these are convenience-only.

---

## 3. Intentional divergences (not gaps)

- **Dual Paystack gateway load-balancing** (reference splits customer payments
  across two Paystack accounts by a configurable percentage, with allocation
  metrics and an admin UI). Deliberately **not ported**: in the multi-tenant
  model each salon connects **its own** Paystack account, so a platform-level
  two-account split doesn't apply. `/payments/gateway-metrics` and the allocation
  UI are therefore N/A.
- **Single global business** → **multi-tenant**. Everything is now tenant-scoped;
  global uniques became composite `(organization_id, …)`.
- **`prisma db push --accept-data-loss`** → **versioned Alembic migrations**.
- **Public/ungated money endpoints** in the reference (cancel+refund, POST
  /payments, gift-card redeem, upload) are **closed** in the new build.

---

## 4. New capabilities beyond the reference (added by the rebuild)

- **Multi-tenancy**: subdomain routing, row-level `organization_id` isolation
  (auto-injected + ownership checks), proven by isolation tests.
- **Self-serve signup + provisioning** (org + admin + seeded defaults).
- **Subscription billing**: plans, 30-day trial, two self-service 15-day
  extensions, status gating (402 when suspended/expired), billing webhook.
- **Per-tenant branding + runtime theming** (logo, primary colour).
- **Marketing landing page** (spa-owner acquisition) + floating WhatsApp/Instagram
  enquiry button.
- **Booking month calendar** with per-day indicators.
- **Security hardening**: CSRF (double-submit), rate limiting, tenant-scoped
  guards, amount validation, raw-body webhook HMAC, encrypted per-tenant secrets,
  no-leak error envelope, structured logging + Sentry hooks.
- **Legal**: Terms, Privacy, cookie banner.
- **Ops**: Dockerfiles, docker-compose (api/worker/web/db/redis/minio/Caddy
  wildcard TLS), CI gate (tests + typecheck/build) with staging, backup script.

---

## 5. Recommended build order to reach full reference parity

1. **Password reset** (P1) — the only core user-facing capability fully missing.
2. **Admin booking-operations UI** (P2) — unlock the assign / top-up / walk-in /
   charge / mark-paid endpoints that are built but unreachable from the UI.
3. **Invoice lifecycle + printable receipts** (P2) — if formal invoicing is
   required for the market.
4. **Stylist-assigned notification** + **walk-in email setting** + **customer
   services page** (P3) — polish.

Everything else is at parity, intentionally diverged, or already exceeds the
reference.
