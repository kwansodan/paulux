/**
 * Tenant awareness on the client. The backend authoritatively resolves the
 * tenant from the request Host; the SPA only needs the slug for display and to
 * know whether it's on the apex (marketing/signup) or a workspace subdomain.
 */
const BASE_DOMAIN = import.meta.env.VITE_BASE_DOMAIN ?? "lvh.me";

const RESERVED = new Set(["www", "app", "admin", "api", ""]);

export function currentTenantSlug(): string | null {
  const host = window.location.hostname; // no port
  if (host === BASE_DOMAIN) return null;
  const suffix = "." + BASE_DOMAIN;
  if (!host.endsWith(suffix)) return null;
  const label = host.slice(0, -suffix.length);
  if (label.includes(".") || RESERVED.has(label)) return null;
  return label;
}

export function isApex(): boolean {
  return currentTenantSlug() === null;
}
