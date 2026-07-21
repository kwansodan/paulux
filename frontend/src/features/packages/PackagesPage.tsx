import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { useServices } from "@/features/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Pkg {
  id: string;
  name: string;
  price: string;
  currency: string;
  isActive: boolean;
  services: { id: string; name: string }[];
}

function errMsg(err: unknown): string {
  return err instanceof AxiosError
    ? (err.response?.data?.error?.message ?? "Request failed")
    : "Request failed";
}

export default function PackagesPage() {
  const qc = useQueryClient();
  const services = useServices();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [serviceIds, setServiceIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const packages = useQuery({
    queryKey: ["packages"],
    queryFn: async () => (await api.get<{ data: Pkg[] }>("/api/packages")).data.data,
  });

  const invalidate = () => void qc.invalidateQueries({ queryKey: ["packages"] });

  const create = useMutation({
    mutationFn: async () =>
      api.post("/api/packages", {
        name, price, serviceIds: [...serviceIds], isActive: true,
      }),
    onSuccess: () => {
      setError(null); setShowForm(false);
      setName(""); setPrice(""); setServiceIds(new Set());
      invalidate();
    },
    onError: (err) => setError(errMsg(err)),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/api/packages/${id}`),
    onSuccess: invalidate,
    onError: (err) => setError(errMsg(err)),
  });

  function toggle(id: string) {
    setServiceIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (serviceIds.size === 0) { setError("Select at least one service"); return; }
    create.mutate();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Packages</h1>
          <p className="text-muted-foreground text-sm">Bundle services at a set price.</p>
        </div>
        <Button onClick={() => { setError(null); setShowForm(true); }}>New package</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>New package</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="pk-name">Name</Label>
                  <Input id="pk-name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="pk-price">Price (GHS)</Label>
                  <Input id="pk-price" type="number" min={0} step="0.01"
                         value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Included services</Label>
                <div className="flex flex-col gap-1">
                  {(services.data ?? []).map((s) => (
                    <label key={s.id} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={serviceIds.has(s.id)} onChange={() => toggle(s.id)} />
                      {s.name} — {s.currency} {s.price}
                    </label>
                  ))}
                </div>
              </div>
              {error && <p className="text-destructive text-sm" role="alert">{error}</p>}
              <div className="flex gap-2">
                <Button type="submit" disabled={create.isPending}>Save</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!showForm && error && <p className="text-destructive text-sm" role="alert">{error}</p>}

      <Card>
        <CardContent className="px-0">
          {packages.isLoading ? (
            <p className="text-muted-foreground px-6 py-8 text-sm">Loading…</p>
          ) : (packages.data ?? []).length === 0 ? (
            <p className="text-muted-foreground px-6 py-8 text-sm">No packages yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b text-left">
                  <th className="px-6 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 font-medium">Services</th>
                  <th className="px-4 py-2 font-medium">Price</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {(packages.data ?? []).map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="px-6 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3">{p.services.map((s) => s.name).join(", ")}</td>
                    <td className="px-4 py-3">{p.currency} {p.price}</td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="ghost" className="text-destructive"
                              onClick={() => { if (confirm(`Delete ${p.name}?`)) remove.mutate(p.id); }}>
                        Delete
                      </Button>
                    </td>
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
