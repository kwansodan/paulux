import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";

interface GiftCard {
  id: string;
  code: string;
  senderName: string;
  recipientName: string;
  totalAmount: string;
  balance: string;
  currency: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

function errMsg(err: unknown): string {
  return err instanceof AxiosError
    ? (err.response?.data?.error?.message ?? "Request failed")
    : "Request failed";
}

export default function GiftCardsPage() {
  const qc = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [redeemCode, setRedeemCode] = useState("");
  const [redeemBooking, setRedeemBooking] = useState("");
  const [redeemResult, setRedeemResult] = useState<string | null>(null);

  const cards = useQuery({
    queryKey: ["gift-cards"],
    queryFn: async () => (await api.get<{ data: GiftCard[] }>("/api/gift-cards")).data.data,
  });

  const redeem = useMutation({
    mutationFn: async () =>
      (await api.post("/api/gift-cards/redeem", {
        code: redeemCode.trim(),
        bookingId: redeemBooking.trim(),
      })).data.data as { amountApplied: string; remainingBalance: string; bookingPaymentStatus: string },
    onSuccess: (data) => {
      setError(null);
      setRedeemResult(
        `Applied GHS ${data.amountApplied} — card balance GHS ${data.remainingBalance}, booking now ${data.bookingPaymentStatus}`,
      );
      setRedeemCode(""); setRedeemBooking("");
      void qc.invalidateQueries({ queryKey: ["gift-cards"] });
    },
    onError: (err) => { setRedeemResult(null); setError(errMsg(err)); },
  });

  const cancel = useMutation({
    mutationFn: async (id: string) => api.post(`/api/gift-cards/${id}/cancel`, {}),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["gift-cards"] }),
    onError: (err) => setError(errMsg(err)),
  });

  function onRedeem(e: FormEvent) {
    e.preventDefault();
    redeem.mutate();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Gift Cards</h1>
        <p className="text-muted-foreground text-sm">Orders, balances, and redemption.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Redeem a card against a booking</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={onRedeem} className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="gc-code">Card code</Label>
              <Input id="gc-code" placeholder="GFT-XXXXXXXX" value={redeemCode}
                     onChange={(e) => setRedeemCode(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="gc-booking">Booking ID</Label>
              <Input id="gc-booking" className="w-80" placeholder="booking uuid" value={redeemBooking}
                     onChange={(e) => setRedeemBooking(e.target.value)} required />
            </div>
            <Button type="submit" disabled={redeem.isPending}>
              {redeem.isPending ? "Redeeming…" : "Redeem"}
            </Button>
          </form>
          {redeemResult && <p className="text-sage-foreground mt-3 text-sm">{redeemResult}</p>}
          {error && <p className="text-destructive mt-3 text-sm" role="alert">{error}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-0">
          {cards.isLoading ? (
            <p className="text-muted-foreground px-6 py-8 text-sm">Loading…</p>
          ) : (cards.data ?? []).length === 0 ? (
            <p className="text-muted-foreground px-6 py-8 text-sm">No gift cards yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b text-left">
                    <th className="px-6 py-2 font-medium">Code</th>
                    <th className="px-4 py-2 font-medium">From → To</th>
                    <th className="px-4 py-2 font-medium">Value</th>
                    <th className="px-4 py-2 font-medium">Balance</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {(cards.data ?? []).map((g) => (
                    <tr key={g.id} className="border-b last:border-0">
                      <td className="px-6 py-3 font-mono font-medium">{g.code}</td>
                      <td className="px-4 py-3">{g.senderName} → {g.recipientName}</td>
                      <td className="px-4 py-3">{g.currency} {g.totalAmount}</td>
                      <td className="px-4 py-3">{g.currency} {g.balance}</td>
                      <td className="px-4 py-3">
                        <StatusBadge value={g.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        {!["REDEEMED", "CANCELLED"].includes(g.status) && (
                          <Button size="sm" variant="ghost" className="text-destructive"
                                  onClick={() => { if (confirm(`Cancel ${g.code}?`)) cancel.mutate(g.id); }}>
                            Cancel
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
