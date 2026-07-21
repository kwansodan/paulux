import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BookingView {
  bookingReference: string;
  clientName: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
  paymentStatus: string;
  total: string;
  minDepositFixed: string | null;
  services: { name: string | null; priceAtBooking: string; quantity: number }[];
}

function errMsg(err: unknown): string {
  return err instanceof AxiosError
    ? (err.response?.data?.error?.message ?? "Not found")
    : "Not found";
}

export default function BookingLookupPage() {
  const [ref, setRef] = useState("");
  const [booking, setBooking] = useState<BookingView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [newTime, setNewTime] = useState("");
  const [rescheduling, setRescheduling] = useState(false);

  const lookup = useMutation({
    mutationFn: async () =>
      (await api.get<{ data: BookingView }>(`/api/bookings/public/${ref.trim()}`)).data.data,
    onSuccess: (b) => { setError(null); setBooking(b); setRescheduling(false); },
    onError: (err) => { setBooking(null); setError(errMsg(err)); },
  });

  const loadSlots = useMutation({
    mutationFn: async (date: string) =>
      (await api.get<{ data: { slots: string[] } }>(`/api/bookings/availability?date=${date}`))
        .data.data.slots,
    onSuccess: (s) => setSlots(s),
  });

  const reschedule = useMutation({
    mutationFn: async () =>
      (await api.post(`/api/bookings/public/${ref.trim()}/reschedule`, {
        bookingDate: newDate, bookingTime: newTime,
      })).data.data as BookingView,
    onSuccess: (b) => { setBooking(b); setRescheduling(false); setError(null); },
    onError: (err) => setError(errMsg(err)),
  });

  function onLookup(e: FormEvent) {
    e.preventDefault();
    lookup.mutate();
  }

  return (
    <section className="mx-auto max-w-lg px-6 py-12">
      <h1 className="mb-2 text-3xl font-semibold">Find your booking</h1>
      <p className="text-muted-foreground mb-6">Enter your booking reference to view or reschedule.</p>

      <form onSubmit={onLookup} className="mb-6 flex items-end gap-2">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="lk-ref">Booking reference</Label>
          <Input id="lk-ref" placeholder="BK-XXXXXXXX" value={ref}
                 onChange={(e) => setRef(e.target.value)} required />
        </div>
        <Button type="submit" disabled={lookup.isPending}>Find</Button>
      </form>

      {error && <p className="text-destructive mb-4 text-sm" role="alert">{error}</p>}

      {booking && (
        <Card>
          <CardHeader>
            <CardTitle>{booking.bookingReference}</CardTitle>
            <CardDescription>
              {booking.status} · Payment {booking.paymentStatus}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <p>
              <strong>{booking.clientName}</strong> — {booking.bookingDate} at {booking.bookingTime}
            </p>
            <ul className="text-muted-foreground list-inside list-disc">
              {booking.services.map((s, i) => (
                <li key={i}>{s.name} × {s.quantity} — GHS {s.priceAtBooking}</li>
              ))}
            </ul>
            <p>Total <strong>GHS {booking.total}</strong></p>

            {!rescheduling ? (
              <Button variant="outline" className="w-fit"
                      onClick={() => { setRescheduling(true); setNewDate(""); setNewTime(""); setSlots([]); }}
                      disabled={["CANCELLED", "COMPLETED"].includes(booking.status)}>
                Reschedule
              </Button>
            ) : (
              <div className="flex flex-col gap-3 rounded-md border p-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="lk-date">New date</Label>
                  <Input id="lk-date" type="date" value={newDate}
                         onChange={(e) => { setNewDate(e.target.value); setNewTime(""); loadSlots.mutate(e.target.value); }} />
                </div>
                {newDate && (
                  <div className="flex flex-wrap gap-2">
                    {slots.length === 0 ? (
                      <span className="text-muted-foreground text-sm">No slots on this date.</span>
                    ) : slots.map((s) => (
                      <button key={s} type="button" onClick={() => setNewTime(s)}
                              className={`rounded-md border px-3 py-1 text-sm ${newTime === s ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button disabled={!newDate || !newTime || reschedule.isPending}
                          onClick={() => reschedule.mutate()}>
                    Confirm reschedule
                  </Button>
                  <Button variant="outline" onClick={() => setRescheduling(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </section>
  );
}
