import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { paths } from "@/router/paths";
import { Logo } from "@/components/brand/Logo";
import WhatsAppFloat from "@/components/marketing/WhatsAppFloat";
import StickyMobileBar from "@/components/marketing/StickyMobileBar";
import { currentTenantSlug } from "@/lib/tenant";
import { cn } from "@/lib/utils";

// Tenant customer site vs. apex marketing site have different nav.
const TENANT_NAV = [
  { to: paths.book, label: "Book" },
  { to: paths.giftCards, label: "Gift Cards" },
  { to: paths.bookingLookup, label: "My Booking" },
];

const APEX_NAV = [
  { to: paths.salonSoftware, label: "Features" },
  { to: paths.freshaAlternative, label: "Fresha Alternative" },
  { to: paths.roiCalculator, label: "ROI Calculator" },
  { to: paths.caseStudies, label: "Case Studies" },
  { to: paths.demo, label: "Live Demo" },
  { to: paths.standalone, label: "Get Quote", isCta: true },
];

export default function CustomerLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isTenant = currentTenantSlug() !== null;
  const NAV = isTenant ? TENANT_NAV : APEX_NAV;

  // Close the mobile menu whenever the route changes.
  const key = location.pathname;
  const platformWhatsapp = import.meta.env.VITE_PLATFORM_WHATSAPP || "";

  return (
    <div className="flex min-h-screen flex-col pb-16 sm:pb-0">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 py-4">
          <Link to={paths.home} aria-label="Paulux home" onClick={() => setOpen(false)}>
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 text-sm sm:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  cn(
                    "tracking-wide transition-colors text-sm font-medium",
                    "isCta" in n && n.isCta
                      ? "rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm"
                      : isActive
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
            <Link
              to={paths.login}
              className="text-muted-foreground hover:text-foreground text-xs tracking-luxe uppercase ml-2"
            >
              {isTenant ? "Staff" : "Staff Login"}
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
            className="border-t border-border/60 bg-background px-6 py-5 sm:hidden shadow-lg"
          >
            <div className="flex flex-col gap-2">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "rounded-xl px-4 py-3 text-sm transition-colors font-medium",
                      "isCta" in n && n.isCta
                        ? "bg-primary text-primary-foreground font-semibold text-center mt-2"
                        : isActive
                          ? "bg-secondary text-foreground font-semibold"
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
                className="text-muted-foreground hover:bg-secondary mt-2 rounded-xl px-4 py-2.5 text-xs tracking-luxe uppercase"
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

      <footer className="mt-20 border-t border-border/60 bg-secondary/20">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 text-left">
            <div className="space-y-3">
              <Logo />
              <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">
                Private, white-label salon & spa booking systems. Dedicated deployment on your own domain with 0% commissions.
              </p>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Software</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <Link to={paths.salonSoftware} className="hover:text-foreground">Salon Booking Features</Link>
                </li>
                <li>
                  <Link to={paths.freshaAlternative} className="hover:text-foreground">Fresha Alternative (0% Fees)</Link>
                </li>
                <li>
                  <Link to={paths.roiCalculator} className="hover:text-foreground">Savings Calculator</Link>
                </li>
                <li>
                  <Link to={paths.demo} className="hover:text-foreground">Interactive Demo</Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Solutions & Case Studies</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <Link to={paths.caseStudies} className="hover:text-foreground font-medium text-accent">All Industry Case Studies</Link>
                </li>
                <li>
                  <Link to="/case-studies/barbershops" className="hover:text-foreground">Barbershop Booking</Link>
                </li>
                <li>
                  <Link to="/case-studies/medspas-aesthetics" className="hover:text-foreground">MedSpa & Aesthetics</Link>
                </li>
                <li>
                  <Link to="/case-studies/tattoo-piercing" className="hover:text-foreground">Tattoo & Piercing</Link>
                </li>
                <li>
                  <Link to={paths.standalone} className="hover:text-foreground">Request Deployment Quote</Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Legal & Trust</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <Link to={paths.terms} className="hover:text-foreground">Terms of Service</Link>
                </li>
                <li>
                  <Link to={paths.privacy} className="hover:text-foreground">Privacy Policy</Link>
                </li>
                <li className="pt-2 text-muted-foreground/80">
                  © {new Date().getFullYear()} Paulux Software. All rights reserved.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating & Mobile Conversion Widgets on Apex */}
      {!isTenant && (
        <>
          <WhatsAppFloat phoneNumber={platformWhatsapp} />
          <StickyMobileBar phoneNumber={platformWhatsapp} />
        </>
      )}
    </div>
  );
}
