import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/auth/AuthContext";
import { StatTile } from "@/components/ui/stat-tile";

interface Metrics {
  bookingsToday: number;
  pendingBookings: number;
  revenueToday: string;
  lowStockProducts: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const metrics = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () =>
      (await api.get<{ data: Metrics }>("/api/dashboard/metrics")).data.data,
  });

  const loading = metrics.isLoading;
  const m = metrics.data;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-accent text-xs tracking-luxe uppercase">Overview</p>
        <h1 className="font-serif mt-1 text-3xl">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Welcome back, {user?.username}.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Bookings today" value={m?.bookingsToday ?? "—"} loading={loading} />
        <StatTile label="Pending bookings" value={m?.pendingBookings ?? "—"} loading={loading} />
        <StatTile
          label="Revenue today"
          value={m ? `GHS ${m.revenueToday}` : "—"}
          loading={loading}
        />
        <StatTile
          label="Low stock"
          value={m?.lowStockProducts ?? "—"}
          loading={loading}
          hint={(m?.lowStockProducts ?? 0) > 0 ? "Needs attention" : undefined}
        />
      </div>
    </div>
  );
}
