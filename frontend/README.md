# Paulux Booking — Frontend (React SPA)

Decoupled single-page app that talks to the Flask API. React 19 · Vite 6 ·
TypeScript · Tailwind v4 · React Router 7 · TanStack Query.

## How it talks to the API
- Cookie-based auth: `axios` is configured with `withCredentials`, and a request
  interceptor echoes the `paulux_csrf` cookie in the `X-CSRF-Token` header
  (double-submit) for unsafe methods. See `src/lib/api.ts`.
- Tenant is implied by the subdomain: in dev the API is `http://<host>:5000`
  (same host, preserving the tenant subdomain); in prod it's same-origin `/api`.

## Layout
```
src/
  lib/        api (axios+csrf), tenant (subdomain), queryClient, utils
  auth/       AuthContext, guards (RequireAuth / RequirePermission), types
  components/ ui/ (ported shadcn kit)
  layouts/    AdminLayout (permission-filtered nav), CustomerLayout
  pages/      LoginPage, admin/, customer/, status pages
  router/     paths
  App.tsx     route table
```

## Dev
```bash
npm install
cp .env.example .env         # VITE_BASE_DOMAIN=lvh.me
npm run dev                  # http://localhost:5173 (or http://acme.lvh.me:5173)
```
Use `<tenant>.lvh.me:5173` to exercise a real tenant subdomain (needs the API
running with the matching org seeded).

## Checks
```bash
npm run typecheck
npm run build
```
