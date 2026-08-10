import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { paths } from "@/router/paths";
import { Logo } from "@/components/brand/Logo";
import { FloatingContact } from "@/components/FloatingContact";
import { currentTenantSlug } from "@/lib/tenant";
import { cn } from "@/lib/utils";

// Tenant customer site vs. apex marketing site have different nav.
const TENANT_NAV = [
  { to: paths.book, label: "Book" },
  { to: paths.giftCards, label: "Gift Cards" },
  { to: paths.bookingLookup, label: "My Booking" },
];
const APEX_NAV = [
  { to: paths.standalone, label: "Own domain" },
  { to: paths.signup, label: "Sign up" },
];

export default function CustomerLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isTenant = currentTenantSlug() !== null;
  const NAV = isTenant ? TENANT_NAV : APEX_NAV;

  // Close the mobile menu whenever the route changes.
  const key = location.pathname;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 py-4">
          <Link to={paths.home} aria-label="Paulux home" onClick={() => setOpen(false)}>
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 text-sm sm:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  cn(
                    "tracking-wide transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
            <Link
              to={paths.login}
              className="text-muted-foreground hover:text-foreground text-xs tracking-luxe uppercase"
            >
              {isTenant ? "Staff" : "Sign in"}
            </Link>
          </nav>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="text-foreground hover:bg-secondary flex size-10 items-center justify-center rounded-full transition-colors sm:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile menu panel */}
        {open && (
          <nav
            key={key}
            className="border-t border-border/60 bg-background px-6 py-4 sm:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "rounded-xl px-3 py-2.5 text-sm transition-colors",
                      isActive
                        ? "bg-secondary text-foreground font-medium"
                        : "text-muted-foreground hover:bg-secondary",
                    )
                  }
                >
                  {n.label}
                </NavLink>
              ))}
              <Link
                to={paths.login}
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:bg-secondary mt-1 rounded-xl px-3 py-2.5 text-xs tracking-luxe uppercase"
              >
                Staff login
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-20 border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-12 text-center">
          <Logo />
          <p className="text-muted-foreground max-w-md text-sm">
            Relaxation, care, and luxury wellness — a seamless booking experience.
          </p>
          <div className="text-muted-foreground/70 flex items-center gap-4 text-xs tracking-wide">
            <Link to={paths.terms} className="hover:text-foreground">Terms</Link>
            <Link to={paths.privacy} className="hover:text-foreground">Privacy</Link>
            <span>© {new Date().getFullYear()} Paulux</span>
          </div>
        </div>
      </footer>

      {/* Apex-only enquiry button (self-gates on tenant subdomains) */}
      <FloatingContact />
    </div>
  );
}
