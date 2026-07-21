/**
 * Axios instance for the Flask API.
 *
 * - `withCredentials` so the httpOnly session cookie (scoped to the base domain)
 *   rides along on every request across tenant subdomains.
 * - A request interceptor echoes the `paulux_csrf` cookie back in the
 *   `X-CSRF-Token` header (double-submit) for unsafe methods.
 * - In dev the API lives on port 5000 of the *same host* so the tenant subdomain
 *   is preserved. In production the API may be same-origin (reverse proxy) or on
 *   its own host (VITE_API_BASE_URL, e.g. https://api.example.com) — in the
 *   latter case the API's Host carries no tenant, so we state it explicitly in
 *   the `X-Tenant-Slug` header. The backend prefers Host and falls back to this.
 */
import axios from "axios";

import { currentTenantSlug } from "./tenant";

function resolveBaseURL(): string {
  const explicit = import.meta.env.VITE_API_BASE_URL;
  if (explicit) return explicit;
  if (import.meta.env.DEV) {
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }
  return ""; // same-origin
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp("(^|; )" + name + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[2]) : null;
}

export const api = axios.create({
  baseURL: resolveBaseURL(),
  withCredentials: true,
  timeout: 15_000,
});

const UNSAFE = new Set(["post", "put", "patch", "delete"]);

api.interceptors.request.use((config) => {
  config.headers = config.headers ?? {};
  if (config.method && UNSAFE.has(config.method.toLowerCase())) {
    const csrf = readCookie("paulux_csrf");
    if (csrf) {
      config.headers["X-CSRF-Token"] = csrf;
    }
  }
  // Harmless when the API is same-origin (Host already names the tenant).
  const slug = currentTenantSlug();
  if (slug) {
    config.headers["X-Tenant-Slug"] = slug;
  }
  return config;
});

/** Ensure a CSRF cookie exists before performing unsafe requests (e.g. login).
 * Resilient: a failure here (backend down) must not wedge callers. */
export async function ensureCsrf(): Promise<void> {
  if (readCookie("paulux_csrf")) return;
  try {
    await api.get("/api/auth/csrf");
  } catch {
    /* backend unreachable — login attempt will surface the real error */
  }
}
