import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Check, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/ui/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: string;
  currency: string;
  minDepositFixed: string;
}

interface CreatedBooking {
  id: string;
  bookingReference: string;
  total: string;
  minDepositFixed: string | null;
}

function errMsg(err: unknown): string {
  return err instanceof AxiosError
    ? (err.response?.data?.error?.message ?? "Something went wrong")
    : "Something went wrong";
}

function StepLabel({ n, children }: { n: number; children: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="bg-primary text-primary-foreground font-serif flex size-8 items-center justify-center rounded-full text-sm">
        {n}
      </span>
      <h2 className="font-serif text-2xl">{children}</h2>
    </div>
  );
}

export default function BookPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [promo, setPromo] = useState("");
  const [promoMsg, setPromoMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedBooking | null>(null);
  const [payMsg, setPayMsg] = useState<string | null>(null);

  const services = useQuery({
    queryKey: ["public-services"],
    queryFn: async () => (await api.get<{ data: Service[] }>("/api/services")).data.data,
  });

  const slots = useQuery({
    queryKey: ["availability", date],
    enabled: !!date,
    queryFn: async () =>
      (await api.get<{ data: { slots: string[] } }>(`/api/bookings/availability?date=${date}`))
        .data.data.slots,
  });

  const subtotal = useMemo(
    () =>
      (services.data ?? [])
        .filter((s) => selected.has(s.id))
        .reduce((sum, s) => sum + parseFloat(s.price), 0),
    [services.data, selected],
  );

  const checkPromo = useMutation({
    mutationFn: async () =>
      (await api.post("/api/promo-codes/validate", { code: promo, amount: subtotal.toFixed(2) }))
        .data.data as { discountAmount: string },
    onSuccess: (d) => setPromoMsg(`Code applied — you save GHS ${d.discountAmount}`),
    onError: (err) => setPromoMsg(errMsg(err)),
  });

  const book = useMutation({
    mutationFn: async () =>
      (await api.post("/api/bookings/public", {
        clientName: name,
        clientEmail: email,
        clientPhone: phone,
        bookingDate: date,
        bookingTime: time,
        services: [...selected].map((id) => ({ serviceId: id })),
        ...(promo ? { promoCode: promo } : {}),
        termsAccepted: true,
      })).data.data as CreatedBooking,
    onSuccess: (b) => { setError(null); setCreated(b); },
    onError: (err) => setError(errMsg(err)),
  });

  const pay = useMutation({
    mutationFn: async (purpose: "DEPOSIT" | "BALANCE") =>
      (await api.post("/api/payments/initialize", {
        bookingReference: created!.bookingReference, purpose,
      })).data.data as { authorizationUrl: string },
    onSuccess: (d) => { window.location.href = d.authorizationUrl; },
    onError: (err) => setPayMsg(errMsg(err)),
  });

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (selected.size === 0) { setError("Pick at least one service"); return; }
    if (!date || !time) { setError("Pick a date and time"); return; }
    book.mutate();
  }

  if (created) {
    return (
      <Container className="max-w-lg py-20">
        <Card className="text-center">
          <CardHeader className="items-center">
            <span className="bg-sage text-sage-foreground mb-2 flex size-14 items-center justify-center rounded-full">
              <Check className="size-7" />
            </span>
            <CardTitle className="text-2xl">Booking received</CardTitle>
            <CardDescription>
              Reference <span className="text-foreground font-mono font-medium">{created.bookingReference}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5">
            <p className="text-sm">
              Total <strong>GHS {created.total}</strong>
              {created.minDepositFixed && parseFloat(created.minDepositFixed) > 0 && (
                <> · deposit <strong>GHS {created.minDepositFixed}</strong></>
              )}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {created.minDepositFixed && parseFloat(created.minDepositFixed) > 0 && (
                <Button onClick={() => pay.mutate("DEPOSIT")} disabled={pay.isPending}>
                  Pay deposit
                </Button>
              )}
              <Button variant="outline" onClick={() => pay.mutate("BALANCE")} disabled={pay.isPending}>
                Pay full amount
              </Button>
            </div>
            {payMsg && <p className="text-destructive text-sm">{payMsg}</p>}
            <p className="text-muted-foreground text-xs">
              You can also pay at the salon — keep your reference handy.
            </p>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="max-w-5xl py-16">
      <div className="mb-10 text-center">
        <p className="text-accent text-xs tracking-luxe uppercase">Reserve your moment</p>
        <h1 className="font-serif mt-2 text-4xl">Book an appointment</h1>
      </div>

      <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="flex flex-col gap-10">
          {/* Step 1 — services */}
          <section>
            <StepLabel n={1}>Choose your treatments</StepLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              {services.isLoading && <p className="text-muted-foreground text-sm">Loading…</p>}
              {(services.data ?? []).map((s) => {
                const on = selected.has(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggle(s.id)}
                    className={cn(
                      "flex flex-col gap-1 rounded-2xl border p-4 text-left transition-all",
                      on
                        ? "border-accent bg-accent/8 shadow-[var(--shadow-soft)]"
                        : "border-border/70 bg-card hover:border-accent/40",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-serif text-lg">{s.name}</span>
                      <span className={cn("flex size-5 items-center justify-center rounded-full border", on ? "border-accent bg-accent text-white" : "border-border")}>
                        {on && <Check className="size-3.5" />}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {s.durationMinutes} min · {s.currency} {s.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Step 2 — time */}
          <section>
            <StepLabel n={2}>Pick a time</StepLabel>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 sm:max-w-xs">
                <Label htmlFor="bk-date">Date</Label>
                <Input id="bk-date" type="date" value={date}
                       onChange={(e) => { setDate(e.target.value); setTime(""); }} required />
              </div>
              {date && (
                slots.isLoading ? (
                  <p className="text-muted-foreground text-sm">Checking availability…</p>
                ) : (slots.data ?? []).length === 0 ? (
                  <p className="text-destructive text-sm">No slots available on this date.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(slots.data ?? []).map((sl) => (
                      <button
                        key={sl}
                        type="button"
                        onClick={() => setTime(sl)}
                        className={cn(
                          "rounded-full border px-4 py-1.5 text-sm transition-colors",
                          time === sl
                            ? "border-accent bg-accent text-white"
                            : "border-border/70 hover:border-accent/50 hover:bg-accent/5",
                        )}
                      >
                        {sl}
                      </button>
                    ))}
                  </div>
                )
              )}
            </div>
          </section>

          {/* Step 3 — details */}
          <section>
            <StepLabel n={3}>Your details</StepLabel>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="bk-name">Full name</Label>
                <Input id="bk-name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="bk-phone">Phone</Label>
                <Input id="bk-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="bk-email">Email</Label>
                <Input id="bk-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
          </section>
        </div>

        {/* Summary rail */}
        <Card className="lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="text-accent size-4" /> Your booking
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            {selected.size === 0 ? (
              <p className="text-muted-foreground">No treatments selected yet.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {(services.data ?? []).filter((s) => selected.has(s.id)).map((s) => (
                  <li key={s.id} className="flex justify-between gap-3">
                    <span>{s.name}</span>
                    <span className="text-muted-foreground">{s.currency} {s.price}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-end gap-2">
              <div className="flex flex-1 flex-col gap-1.5">
                <Label htmlFor="bk-promo" className="text-xs">Promo code</Label>
                <Input id="bk-promo" className="h-9" value={promo}
                       onChange={(e) => { setPromo(e.target.value); setPromoMsg(null); }} />
              </div>
              <Button type="button" variant="outline" size="sm"
                      disabled={!promo || subtotal === 0 || checkPromo.isPending}
                      onClick={() => checkPromo.mutate()}>
                Apply
              </Button>
            </div>
            {promoMsg && <p className="text-xs">{promoMsg}</p>}

            <div className="border-border/60 flex justify-between border-t pt-3 text-base">
              <span className="font-medium">Subtotal</span>
              <span className="font-serif text-lg">GHS {subtotal.toFixed(2)}</span>
            </div>

            {(date || time) && (
              <p className="text-muted-foreground text-xs">
                {date} {time && `at ${time}`}
              </p>
            )}
            {error && <p className="text-destructive text-sm" role="alert">{error}</p>}
            <Button type="submit" size="lg" disabled={book.isPending} className="mt-1 w-full">
              {book.isPending ? "Booking…" : "Confirm booking"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </Container>
  );
}
