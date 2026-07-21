import { useState, type FormEvent } from "react";
import { AxiosError } from "axios";
import {
  useDeleteService,
  useSaveCategory,
  useSaveService,
  useServiceCategories,
  useServices,
  useToggleService,
  type Service,
} from "./api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CategoryManager from "./CategoryManager";

interface FormState {
  id?: string;
  name: string;
  description: string;
  durationMinutes: string;
  price: string;
  minDepositFixed: string;
  categoryId: string;
  isActive: boolean;
}

const EMPTY: FormState = {
  name: "",
  description: "",
  durationMinutes: "60",
  price: "",
  minDepositFixed: "0",
  categoryId: "",
  isActive: true,
};

function apiError(err: unknown): string {
  return err instanceof AxiosError
    ? (err.response?.data?.error?.message ?? "Request failed")
    : "Request failed";
}

export default function ServicesPage() {
  const services = useServices();
  const categories = useServiceCategories();
  const save = useSaveService();
  const saveCategory = useSaveCategory();
  const toggle = useToggleService();
  const remove = useDeleteService();

  // Inline "new category" state (used from within the service form).
  const [newCat, setNewCat] = useState<string | null>(null); // null = closed
  const [catError, setCatError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState | null>(null);
  const [error, setError] = useState<string | null>(null);

  function startEdit(s: Service) {
    setError(null);
    setForm({
      id: s.id,
      name: s.name,
      description: s.description ?? "",
      durationMinutes: String(s.durationMinutes),
      price: s.price,
      minDepositFixed: s.minDepositFixed,
      categoryId: s.categoryId ?? "",
      isActive: s.isActive,
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setError(null);
    try {
      await save.mutateAsync({
        id: form.id,
        name: form.name,
        description: form.description || null,
        durationMinutes: Number(form.durationMinutes),
        price: form.price,
        minDepositFixed: form.minDepositFixed || "0",
        categoryId: form.categoryId || null,
        isActive: form.isActive,
      });
      setForm(null);
    } catch (err) {
      setError(apiError(err));
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Services</h1>
          <p className="text-muted-foreground text-sm">
            Your bookable service catalog.
          </p>
        </div>
        <Button onClick={() => { setError(null); setForm({ ...EMPTY }); }}>
          New service
        </Button>
      </div>

      {form && (
        <Card>
          <CardHeader>
            <CardTitle>{form.id ? "Edit service" : "New service"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="svc-name">Name</Label>
                <Input
                  id="svc-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="svc-cat">Category</Label>
                {newCat === null ? (
                  <div className="flex items-center gap-2">
                    <select
                      id="svc-cat"
                      className="border-input h-11 flex-1 rounded-xl border bg-transparent px-3 text-sm"
                      value={form.categoryId}
                      onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    >
                      <option value="">No category</option>
                      {(categories.data ?? []).map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => { setCatError(null); setNewCat(""); }}
                    >
                      + New
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <Input
                        aria-label="New category name"
                        className="h-11 flex-1"
                        placeholder="New category name"
                        value={newCat}
                        autoFocus
                        onChange={(e) => setNewCat(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        disabled={!newCat.trim() || saveCategory.isPending}
                        onClick={async () => {
                          setCatError(null);
                          try {
                            const created = await saveCategory.mutateAsync({
                              name: newCat.trim(), capacity: 1,
                            });
                            // Select the new category on the in-progress form.
                            setForm({ ...form, categoryId: created.id });
                            setNewCat(null);
                          } catch (err) {
                            setCatError(apiError(err));
                          }
                        }}
                      >
                        Add
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setNewCat(null)}>
                        Cancel
                      </Button>
                    </div>
                    {catError && <p className="text-destructive text-xs">{catError}</p>}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="svc-duration">Duration (minutes)</Label>
                <Input
                  id="svc-duration"
                  type="number"
                  min={1}
                  value={form.durationMinutes}
                  onChange={(e) =>
                    setForm({ ...form, durationMinutes: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="svc-price">Price (GHS)</Label>
                <Input
                  id="svc-price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="svc-deposit">Minimum deposit (GHS)</Label>
                <Input
                  id="svc-deposit"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.minDepositFixed}
                  onChange={(e) =>
                    setForm({ ...form, minDepositFixed: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="svc-desc">Description</Label>
                <Input
                  id="svc-desc"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              {error && (
                <p className="text-destructive text-sm sm:col-span-2" role="alert">
                  {error}
                </p>
              )}
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit" disabled={save.isPending}>
                  {save.isPending ? "Saving…" : "Save"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setForm(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="px-0">
          {services.isLoading ? (
            <p className="text-muted-foreground px-6 py-8 text-sm">Loading…</p>
          ) : services.isError ? (
            <p className="text-destructive px-6 py-8 text-sm">
              Could not load services — {apiError(services.error)}
            </p>
          ) : (services.data ?? []).length === 0 ? (
            <p className="text-muted-foreground px-6 py-8 text-sm">
              No services yet. Create your first one.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b text-left">
                    <th className="px-6 py-2 font-medium">Name</th>
                    <th className="px-4 py-2 font-medium">Category</th>
                    <th className="px-4 py-2 font-medium">Duration</th>
                    <th className="px-4 py-2 font-medium">Price</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {(services.data ?? []).map((s) => (
                    <tr key={s.id} className="border-b last:border-0">
                      <td className="px-6 py-3 font-medium">{s.name}</td>
                      <td className="px-4 py-3">{s.category?.name ?? "—"}</td>
                      <td className="px-4 py-3">{s.durationMinutes} min</td>
                      <td className="px-4 py-3">
                        {s.currency} {s.price}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={s.isActive ? "positive" : "muted"}>
                          {s.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => startEdit(s)}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              toggle.mutate({ id: s.id, isActive: !s.isActive })
                            }
                          >
                            {s.isActive ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => {
                              if (confirm(`Delete "${s.name}"?`)) remove.mutate(s.id);
                            }}
                          >
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

      <CategoryManager
        title="Service categories"
        endpoint="/api/service-categories"
        queryKey="service-categories"
        withCapacity
      />
    </div>
  );
}
