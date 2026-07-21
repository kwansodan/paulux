import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  capacity?: number;
}

function errMsg(err: unknown): string {
  return err instanceof AxiosError
    ? (err.response?.data?.error?.message ?? "Request failed")
    : "Request failed";
}

/** Reusable category CRUD for both service and product categories. */
export default function CategoryManager({
  title,
  endpoint,
  queryKey,
  withCapacity = false,
}: {
  title: string;
  endpoint: string;
  queryKey: string;
  withCapacity?: boolean;
}) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const categories = useQuery({
    queryKey: [queryKey],
    queryFn: async () => (await api.get<{ data: Category[] }>(endpoint)).data.data,
  });

  const create = useMutation({
    mutationFn: async () =>
      api.post(endpoint, withCapacity ? { name, capacity: 1 } : { name }),
    onSuccess: () => { setError(null); setName(""); void qc.invalidateQueries({ queryKey: [queryKey] }); },
    onError: (err) => setError(errMsg(err)),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`${endpoint}/${id}`),
    onSuccess: () => void qc.invalidateQueries({ queryKey: [queryKey] }),
    onError: (err) => setError(errMsg(err)),
  });

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {(categories.data ?? []).map((c) => (
            <span key={c.id} className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
              {c.name}
              <button className="text-muted-foreground hover:text-destructive"
                      onClick={() => { if (confirm(`Delete "${c.name}"?`)) remove.mutate(c.id); }}>
                ×
              </button>
            </span>
          ))}
          {(categories.data ?? []).length === 0 && (
            <span className="text-muted-foreground text-sm">No categories yet.</span>
          )}
        </div>
        <form className="flex items-end gap-2"
              onSubmit={(e: FormEvent) => { e.preventDefault(); create.mutate(); }}>
          <Input aria-label="New category" placeholder="New category name"
                 value={name} onChange={(e) => setName(e.target.value)} required className="max-w-xs" />
          <Button type="submit" disabled={create.isPending}>Add</Button>
        </form>
        {error && <p className="text-destructive text-sm">{error}</p>}
      </CardContent>
    </Card>
  );
}
