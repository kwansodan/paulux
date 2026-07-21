import { Link, NavLink, Outlet } from "react-router-dom";
import {
  CalendarDays,
  CreditCard,
  Gift,
  LayoutDashboard,
  Package,
  Scissors,
  Settings,
  ShoppingBag,
  Tag,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { hasPermission } from "@/auth/types";
import { paths } from "@/router/paths";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV: { to: string; label: string; permission: string; icon: LucideIcon }[] = [
  { to: paths.dashboard, label: "Dashboard", permission: "dashboard.view", icon: LayoutDashboard },
  { to: paths.bookings, label: "Bookings", permission: "bookings.view", icon: CalendarDays },
  { to: paths.payments, label: "Payments", permission: "payments.view", icon: CreditCard },
  { to: paths.services, label: "Services", permission: "services.view", icon: Scissors },
  { to: paths.packages, label: "Packages", permission: "services.view", icon: Package },
  { to: paths.products, label: "Products", permission: "products.view", icon: ShoppingBag },
  { to: paths.promoCodes, label: "Promo Codes", permission: "promo_codes.view", icon: Tag },
  { to: paths.giftCardOrders, label: "Gift Cards", permission: "gift_cards.view", icon: Gift },
  { to: paths.reports, label: "Reports", permission: "reports.view", icon: TrendingUp },
  { to: paths.settings, label: "Settings", permission: "settings.view", icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const items = NAV.filter((n) => hasPermission(user, n.permission));

  return (
    <div className="flex min-h-screen bg-secondary/40">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border/60 bg-card lg:flex">
        <div className="px-6 py-6">
          <Link to={paths.dashboard} aria-label="Paulux">
            <Logo />
          </Link>
          <p className="text-muted-foreground mt-1 pl-9 text-[11px] tracking-luxe uppercase">
            Workspace
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-3">
          {items.map((n) => {
            const Icon = n.icon;
            return (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === paths.dashboard}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )
                }
              >
                <Icon className="size-4" />
                {n.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t border-border/60 p-4">
          <p className="text-foreground truncate text-sm font-medium">{user?.username}</p>
          <p className="text-muted-foreground truncate text-xs">{user?.email}</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-2 lg:hidden">
            <Logo markClassName="size-6" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-muted-foreground hidden text-sm sm:block">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={() => void logout()}>
              Sign out
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
