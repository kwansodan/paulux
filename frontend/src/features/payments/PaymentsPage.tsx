import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";

interface Payment {
  id: string;
  bookingReference: string | null;
  provider: "PAYSTACK" | "MANUAL" | "GIFT_CARD";
  providerRef: string;
  amount: string;
  currency: string;
  status: "PENDING" | "PAID" | "PARTIAL" | "REFUNDED" | "FAILED";
  reason: string | null;
  manualMethod: string | null;
  createdAt: string;
}

function errMsg(err: unknown): string {
  return err instanceof AxiosError
    ? (err.response?.data?.error?.message ?? "Request failed")
    : "Request failed";
}

export default function PaymentsPage() {
  const qc = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const payments = useQuery({
    queryKey: ["payments"],
    queryFn: async () =>
      (await api.get<{ data: Payment[] }>("/api/payments")).data.data,
  });

  const refund = useMutation({
    mutationFn: async (input: { id: string; reason?: string }) =>
      api.post(`/api/payments/${input.id}/refund`, { reason: input.reason }),
    onSuccess: () => {
      setError(null);
      void qc.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (err) => setError(errMsg(err)),
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Payments</h1>
        <p className="text-muted-foreground text-sm">
          Gateway, manual, and gift-card payments. Refunds are explicit and audited.
        </p>
      </div>

      {error && <p className="text-destructive text-sm" role="alert">{error}</p>}

      <Card>
        <CardContent className="px-0">
          {payments.isLoading ? (
            <p className="text-muted-foreground px-6 py-8 text-sm">Loading…</p>
          ) : (payments.data ?? []).length === 0 ? (
            <p className="text-muted-foreground px-6 py-8 text-sm">No payments yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b text-left">
                    <th className="px-6 py-2 font-medium">Reference</th>
                    <th className="px-4 py-2 font-medium">Booking</th>
                    <th className="px-4 py-2 font-medium">Provider</th>
                    <th className="px-4 py-2 font-medium">Amount</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium">Date</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {(payments.data ?? []).map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="px-6 py-3 font-mono text-xs">{p.providerRef}</td>
                      <td className="px-4 py-3 font-mono text-xs">{p.bookingReference ?? "—"}</td>
                      <td className="px-4 py-3">
                        {p.provider}
                        {p.manualMethod ? ` (${p.manualMethod})` : ""}
                      </td>
                      <td className="px-4 py-3">
                        {p.currency} {p.amount}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge value={p.status} />
                        {p.reason && (
                          <div className="text-muted-foreground mt-0.5 max-w-48 truncate text-xs" title={p.reason}>
                            {p.reason}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs">
                        {new Date(p.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {p.status === "PAID" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            disabled={refund.isPending}
                            onClick={() => {
                              const reason = prompt("Refund reason (optional)") ?? undefined;
                              if (confirm(`Refund ${p.currency} ${p.amount}?`)) {
                                refund.mutate({ id: p.id, reason });
                              }
                            }}
                          >
                            Refund
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
