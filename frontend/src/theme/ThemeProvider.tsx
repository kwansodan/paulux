import { useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { currentTenantSlug } from "@/lib/tenant";

interface OrgBranding {
  name: string;
  logoUrl: string | null;
  primaryColor: string | null;
}

/** Mix a hex color toward white/black by `amt` (0..1) for hover/active shades. */
function shade(hex: string, amt: number): string {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return hex;
  const to = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  const ch = [1, 2, 3].map((i) => {
    const c = parseInt(m[i], 16);
    return Math.round(c + (to - c) * p).toString(16).padStart(2, "0");
  });
  return `#${ch.join("")}`;
}

/**
 * Applies the default Paulux theme, and — for a tenant subdomain — overrides
 * `--primary` (and a derived hover) at runtime from the org's brand color, so
 * every workspace can carry its own accent. Falls back to the Paulux palette.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const slug = currentTenantSlug();
  const org = useQuery({
    queryKey: ["org-branding"],
    enabled: !!slug,
    staleTime: 5 * 60_000,
    queryFn: async () =>
      (await api.get<{ data: OrgBranding }>("/api/organization")).data.data,
  });

  useEffect(() => {
    const root = document.documentElement;
    const color = org.data?.primaryColor;
    if (color && /^#?[a-f\d]{6}$/i.test(color.trim())) {
      const hex = color.startsWith("#") ? color : `#${color}`;
      root.style.setProperty("--primary", hex);
      root.style.setProperty("--brand", hex);
      root.style.setProperty("--ring", hex);
      root.style.setProperty("--accent", shade(hex, 0.12));
    } else {
      root.style.removeProperty("--primary");
      root.style.removeProperty("--brand");
      root.style.removeProperty("--ring");
      root.style.removeProperty("--accent");
    }
  }, [org.data?.primaryColor]);

  return <>{children}</>;
}
