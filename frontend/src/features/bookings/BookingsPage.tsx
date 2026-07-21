import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { BookingCalendar } from "./BookingCalendar";

interface Booking {
  id: string;
  bookingReference: string;
  clientName: string;
  clientPhone: string;
  bookingDate: string;
  bookingTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  paymentStatus: string;
  total: string;
  services: { name: string | null; quantity: number }[];
}

function errMsg(err: unknown): string {
  return err instanceof AxiosError
    ? (err.response?.data?.error?.message ?? "Request failed")
    : "Request failed";
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function BookingsPage() {
  const qc = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const searching = search.trim().length > 0;

  const bookings = useQuery({
    queryKey: ["bookings", searching ? { search } : { date: selectedDate }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searching) params.set("search", search.trim());
      else params.set("date", selectedDate);
      return (await api.get<{ data: Booking[] }>(`/api/bookings?${params.toString()}`)).data.data;
    },
  });

  const transition = useMutation({
    mutationFn: async (input: { id: string; status: string; cancelReason?: string }) => {
      const { id, ...body } = input;
      return api.patch(`/api/bookings/${id}/status`, body);
    },
    onSuccess: () => {
      setError(null);
      void qc.invalidateQueries({ queryKey: ["bookings"] });
      void qc.invalidateQueries({ queryKey: ["bookings-calendar"] });
    },
    onError: (err) => setError(errMsg(err)),
  });

  function actionsFor(b: Booking) {
    const acts: { label: string; status: string; confirm?: boolean }[] = [];
    if (b.status === "PENDING") {
      acts.push({ label: "Confirm", status: "CONFIRMED" });
      acts.push({ label: "Cancel", status: "CANCELLED", confirm: true });
    } else if (b.status === "CONFIRMED") {
      acts.push({ label: "Complete", status: "COMPLETED" });
      acts.push({ label: "Cancel", status: "CANCELLED", confirm: true });
    }
    return acts;
  }

  const rows = bookings.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Bookings</h1>
        <p className="text-muted-foreground text-sm">Appointments and walk-ins.</p>
      </div>

      {error && <p className="text-destructive text-sm" role="alert">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-[22rem_1fr] lg:items-start">
        {/* Left — calendar */}
        <Card>
          <CardContent className="pt-6">
            <BookingCalendar
              selectedDate={selectedDate}
              onSelect={(d) => { setSearch(""); setSelectedDate(d); }}
            />
          </CardContent>
        </Card>

        {/* Right — day list / search results */}
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
            <CardTitle className="text-base">
              {searching ? "Search results" : new Date(selectedDate + "T00:00:00").toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            </CardTitle>
            <Input
              placeholder="Search all bookings…"
              className="h-9 max-w-52"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </CardHeader>
          <CardContent className="px-0">
            {bookings.isLoading ? (
              <p className="text-muted-foreground px-6 py-8 text-sm">Loading…</p>
            ) : rows.length === 0 ? (
              <p className="text-muted-foreground px-6 py-10 text-center text-sm">
                {searching ? "No matching bookings." : "No bookings on this day."}
              </p>
            ) : (
              <ul className="divide-border/70 divide-y">
                {rows.map((b) => (
                  <li key={b.id} className="flex flex-wrap items-center gap-3 px-6 py-4">
                    <div className="w-14 shrink-0 text-center">
                      <div className="font-serif text-lg leading-none">{b.bookingTime}</div>
                      {searching && (
                        <div className="text-muted-foreground text-[10px]">{b.bookingDate}</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">{b.clientName}</div>
                      <div className="text-muted-foreground truncate text-xs">
                        {b.services.map((s) => s.name).filter(Boolean).join(", ") || "—"} · GHS {b.total}
                      </div>
                      <div className="mt-1 flex gap-1.5">
                        <StatusBadge value={b.status} />
                        <StatusBadge value={b.paymentStatus} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {actionsFor(b).map((a) => (
                        <Button
                          key={a.status}
                          size="sm"
                          variant={a.status === "CANCELLED" ? "ghost" : "outline"}
                          className={a.status === "CANCELLED" ? "text-destructive" : ""}
                          disabled={transition.isPending}
                          onClick={() => {
                            if (a.confirm) {
                              const reason = prompt("Cancellation reason (optional)") ?? undefined;
                              if (reason === undefined && !confirm("Cancel this booking?")) return;
                              transition.mutate({ id: b.id, status: a.status, cancelReason: reason });
                            } else {
                              transition.mutate({ id: b.id, status: a.status });
                            }
                          }}
                        >
                          {a.label}
                        </Button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
