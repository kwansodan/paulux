import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { paths } from "@/router/paths";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type State = "verifying" | "paid" | "pending" | "failed";

/**
 * Paystack redirects here after checkout with ?reference=... (and ?trxref=...).
 * We verify server-side — the webhook is the source of truth, but verifying on
 * return gives the customer immediate confirmation.
 */
export default function PayCallbackPage() {
  const [params] = useSearchParams();
  const reference = params.get("reference") ?? params.get("trxref");
  const [state, setState] = useState<State>("verifying");
  const [detail, setDetail] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) {
      setState("failed");
      setDetail("Missing payment reference.");
      return;
    }
    (async () => {
      try {
        const { data } = await api.get(`/api/payments/verify/${reference}`);
        const status = data.data?.bookingPaymentStatus ?? data.data?.payment?.status;
        setState(status === "PAID" || status === "PARTIAL" ? "paid" : "pending");
      } catch (err) {
        // A gift-card purchase uses a different verify endpoint; try that.
        try {
          await api.get(`/api/gift-cards/verify/${reference}`);
          setState("paid");
        } catch {
          setState("failed");
          setDetail("We couldn't confirm this payment. If you were charged, contact the salon with your reference.");
        }
        void err;
      }
    })();
  }, [reference]);

  const copy: Record<State, { title: string; desc: string }> = {
    verifying: { title: "Confirming payment…", desc: "One moment." },
    paid: { title: "Payment confirmed 🎉", desc: "Thank you! You'll receive a confirmation shortly." },
    pending: { title: "Payment received", desc: "We're finalizing your booking. This can take a moment." },
    failed: { title: "Payment not confirmed", desc: detail ?? "Something went wrong." },
  };

  return (
    <section className="mx-auto max-w-lg px-6 py-16">
      <Card>
        <CardHeader>
          <CardTitle>{copy[state].title}</CardTitle>
          <CardDescription>{copy[state].desc}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {reference && (
            <p className="text-muted-foreground text-sm">
              Reference <span className="font-mono">{reference}</span>
            </p>
          )}
          <Button asChild variant="outline" className="w-fit">
            <Link to={paths.home}>Back to home</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
