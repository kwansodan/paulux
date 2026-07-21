import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Promo {
  id: string;
  code: string;
  description: string | null;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: string;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  minBookingAmount: string | null;
}

function errMsg(err: unknown): string {
  return err instanceof AxiosError
    ? (err.response?.data?.error?.message ?? "Request failed")
    : "Request failed";
}

export default function PromoCodesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [type, setType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [value, setValue] = useState("");
  const [maxUses, setMaxUses] = useState("");

  const promos = useQuery({
    queryKey: ["promo-codes"],
    queryFn: async () => (await api.get<{ data: Promo[] }>("/api/promo-codes")).data.data,
  });

  const invalidate = () => void qc.invalidateQueries({ queryKey: ["promo-codes"] });

  const create = useMutation({
    mutationFn: async () =>
      api.post("/api/promo-codes", {
        code,
        discountType: type,
        discountValue: value,
        maxUses: maxUses ? Number(maxUses) : null,
      }),
    onSuccess: () => {
      setError(null);
      setShowForm(false);
      setCode(""); setValue(""); setMaxUses("");
      invalidate();
    },
    onError: (err) => setError(errMsg(err)),
  });

  const update = useMutation({
    mutationFn: async (p: Promo) =>
      api.put(`/api/promo-codes/${p.id}`, {
        code: p.code,
        description: p.description,
        discountType: p.discountType,
        discountValue: p.discountValue,
        maxUses: p.maxUses,
        expiresAt: p.expiresAt,
        isActive: !p.isActive,
        minBookingAmount: p.minBookingAmount,
      }),
    onSuccess: invalidate,
    onError: (err) => setError(errMsg(err)),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/api/promo-codes/${id}`),
    onSuccess: invalidate,
    onError: (err) => setError(errMsg(err)),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    create.mutate();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Promo Codes</h1>
          <p className="text-muted-foreground text-sm">Discount codes for bookings.</p>
        </div>
        <Button onClick={() => { setError(null); setShowForm(true); }}>New promo code</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>New promo code</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="pc-code">Code</Label>
                <Input id="pc-code" value={code} onChange={(e) => setCode(e.target.value)} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="pc-type">Type</Label>
                <select
                  id="pc-type"
                  className="border-input h-9 rounded-md border bg-transparent px-3 text-sm"
                  value={type}
                  onChange={(e) => setType(e.target.value as typeof type)}
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed (GHS)</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="pc-value">Value</Label>
                <Input id="pc-value" type="number" min={0} step="0.01"
                       value={value} onChange={(e) => setValue(e.target.value)} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="pc-max">Max uses (blank = unlimited)</Label>
                <Input id="pc-max" type="number" min={1}
                       value={maxUses} onChange={(e) => setMaxUses(e.target.value)} />
              </div>
              {error && <p className="text-destructive text-sm sm:col-span-2" role="alert">{error}</p>}
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit" disabled={create.isPending}>Create</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!showForm && error && <p className="text-destructive text-sm" role="alert">{error}</p>}

      <Card>
        <CardContent className="px-0">
          {promos.isLoading ? (
            <p className="text-muted-foreground px-6 py-8 text-sm">Loading…</p>
          ) : (promos.data ?? []).length === 0 ? (
            <p className="text-muted-foreground px-6 py-8 text-sm">No promo codes yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b text-left">
                    <th className="px-6 py-2 font-medium">Code</th>
                    <th className="px-4 py-2 font-medium">Discount</th>
                    <th className="px-4 py-2 font-medium">Usage</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {(promos.data ?? []).map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="px-6 py-3 font-mono font-medium">{p.code}</td>
                      <td className="px-4 py-3">
                        {p.discountType === "PERCENTAGE"
                          ? `${p.discountValue}%`
                          : `GHS ${p.discountValue}`}
                      </td>
                      <td className="px-4 py-3">
                        {p.usedCount}{p.maxUses ? ` / ${p.maxUses}` : ""}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={p.isActive ? "positive" : "muted"}>
                          {p.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => update.mutate(p)}>
                            {p.isActive ? "Deactivate" : "Activate"}
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive"
                                  onClick={() => { if (confirm(`Delete ${p.code}?`)) remove.mutate(p.id); }}>
                            Delete
                          </Button>
                        </div>
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
