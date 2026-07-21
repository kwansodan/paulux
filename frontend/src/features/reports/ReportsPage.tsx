import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Summary {
  from: string;
  to: string;
  totalRevenue: string;
  bookingsCount: number;
  dailyRevenue: { date: string; amount: string }[];
  topServices: { name: string; count: number }[];
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export default function ReportsPage() {
  const [from, setFrom] = useState(daysAgo(29));
  const [to, setTo] = useState(daysAgo(0));

  const report = useQuery({
    queryKey: ["reports-summary", from, to],
    queryFn: async () =>
      (await api.get<{ data: Summary }>(`/api/reports/summary?from=${from}&to=${to}`))
        .data.data,
  });

  const maxAmount = Math.max(
    1,
    ...(report.data?.dailyRevenue ?? []).map((d) => parseFloat(d.amount)),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-muted-foreground text-sm">Revenue and booking trends.</p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="rp-from">From</Label>
          <Input id="rp-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="rp-to">To</Label>
          <Input id="rp-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>Total revenue</CardDescription>
            <CardTitle className="text-3xl">
              {report.isLoading ? "…" : `GHS ${report.data?.totalRevenue ?? "0.00"}`}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Bookings in range</CardDescription>
            <CardTitle className="text-3xl">
              {report.isLoading ? "…" : (report.data?.bookingsCount ?? 0)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Daily revenue</CardTitle></CardHeader>
        <CardContent>
          {(report.data?.dailyRevenue ?? []).length === 0 ? (
            <p className="text-muted-foreground text-sm">No paid revenue in this range.</p>
          ) : (
            <div className="flex h-40 items-end gap-1">
              {(report.data?.dailyRevenue ?? []).map((d) => (
                <div key={d.date} className="flex flex-1 flex-col items-center gap-1" title={`${d.date}: GHS ${d.amount}`}>
                  <div
                    className="bg-primary w-full rounded-t"
                    style={{ height: `${(parseFloat(d.amount) / maxAmount) * 100}%`, minHeight: "2px" }}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Top services</CardTitle></CardHeader>
        <CardContent>
          {(report.data?.topServices ?? []).length === 0 ? (
            <p className="text-muted-foreground text-sm">No bookings in this range.</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {(report.data?.topServices ?? []).map((s) => (
                  <tr key={s.name} className="border-b last:border-0">
                    <td className="py-2 font-medium">{s.name}</td>
                    <td className="py-2 text-right">{s.count} booked</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
