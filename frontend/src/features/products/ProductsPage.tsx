import { useState, type FormEvent } from "react";
import { AxiosError } from "axios";
import {
  useDeleteProduct,
  useProducts,
  useRecordStock,
  useSaveProduct,
  useToggleProduct,
  type Product,
  type StockMovementType,
} from "./api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CategoryManager from "@/features/services/CategoryManager";

interface FormState {
  id?: string;
  name: string;
  description: string;
  price: string;
  lowStockThreshold: string;
  trackStock: boolean;
  isActive: boolean;
}

const EMPTY: FormState = {
  name: "",
  description: "",
  price: "",
  lowStockThreshold: "5",
  trackStock: true,
  isActive: true,
};

function apiError(err: unknown): string {
  return err instanceof AxiosError
    ? (err.response?.data?.error?.message ?? "Request failed")
    : "Request failed";
}

function StockBadge({ p }: { p: Product }) {
  if (!p.trackStock) return <span className="text-muted-foreground">n/a</span>;
  const low = p.stockQuantity <= p.lowStockThreshold;
  const out = p.stockQuantity === 0;
  return (
    <Badge tone={out ? "danger" : low ? "pending" : "positive"}>
      {p.stockQuantity} {out ? "(out)" : low ? "(low)" : ""}
    </Badge>
  );
}

function StockControl({ product }: { product: Product }) {
  const record = useRecordStock();
  const [qty, setQty] = useState("1");
  const [type, setType] = useState<StockMovementType>("IN");
  return (
    <div className="flex items-center gap-1">
      <select
        aria-label="Movement type"
        className="border-input h-8 rounded-md border bg-transparent px-1 text-xs"
        value={type}
        onChange={(e) => setType(e.target.value as StockMovementType)}
      >
        <option value="IN">IN</option>
        <option value="OUT">OUT</option>
        <option value="ADJUSTMENT">SET</option>
      </select>
      <Input
        aria-label="Quantity"
        type="number"
        min={1}
        className="h-8 w-16 text-xs"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
      />
      <Button
        size="sm"
        variant="outline"
        disabled={record.isPending || !Number(qty)}
        onClick={() =>
          record.mutate({ id: product.id, type, quantity: Number(qty) })
        }
      >
        Apply
      </Button>
    </div>
  );
}

export default function ProductsPage() {
  const products = useProducts();
  const save = useSaveProduct();
  const toggle = useToggleProduct();
  const remove = useDeleteProduct();

  const [form, setForm] = useState<FormState | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setError(null);
    try {
      await save.mutateAsync({
        id: form.id,
        name: form.name,
        description: form.description || null,
        price: form.price,
        lowStockThreshold: Number(form.lowStockThreshold) || 0,
        trackStock: form.trackStock,
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
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-muted-foreground text-sm">
            Retail products and stock levels.
          </p>
        </div>
        <Button onClick={() => { setError(null); setForm({ ...EMPTY }); }}>
          New product
        </Button>
      </div>

      {form && (
        <Card>
          <CardHeader>
            <CardTitle>{form.id ? "Edit product" : "New product"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="prd-name">Name</Label>
                <Input
                  id="prd-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="prd-price">Price (GHS)</Label>
                <Input
                  id="prd-price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="prd-threshold">Low-stock threshold</Label>
                <Input
                  id="prd-threshold"
                  type="number"
                  min={0}
                  value={form.lowStockThreshold}
                  onChange={(e) =>
                    setForm({ ...form, lowStockThreshold: e.target.value })
                  }
                />
              </div>
              <div className="flex items-end gap-2 pb-1">
                <input
                  id="prd-track"
                  type="checkbox"
                  checked={form.trackStock}
                  onChange={(e) =>
                    setForm({ ...form, trackStock: e.target.checked })
                  }
                />
                <Label htmlFor="prd-track">Track stock</Label>
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="prd-desc">Description</Label>
                <Input
                  id="prd-desc"
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
          {products.isLoading ? (
            <p className="text-muted-foreground px-6 py-8 text-sm">Loading…</p>
          ) : products.isError ? (
            <p className="text-destructive px-6 py-8 text-sm">
              Could not load products — {apiError(products.error)}
            </p>
          ) : (products.data ?? []).length === 0 ? (
            <p className="text-muted-foreground px-6 py-8 text-sm">
              No products yet. Create your first one.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b text-left">
                    <th className="px-6 py-2 font-medium">Name</th>
                    <th className="px-4 py-2 font-medium">Price</th>
                    <th className="px-4 py-2 font-medium">Stock</th>
                    <th className="px-4 py-2 font-medium">Movement</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {(products.data ?? []).map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="px-6 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3">
                        {p.currency} {p.price}
                      </td>
                      <td className="px-4 py-3">
                        <StockBadge p={p} />
                      </td>
                      <td className="px-4 py-3">
                        {p.trackStock ? (
                          <StockControl product={p} />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={p.isActive ? "positive" : "muted"}>
                          {p.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setError(null);
                              setForm({
                                id: p.id,
                                name: p.name,
                                description: p.description ?? "",
                                price: p.price,
                                lowStockThreshold: String(p.lowStockThreshold),
                                trackStock: p.trackStock,
                                isActive: p.isActive,
                              });
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              toggle.mutate({ id: p.id, isActive: !p.isActive })
                            }
                          >
                            {p.isActive ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => {
                              if (confirm(`Delete "${p.name}"?`)) remove.mutate(p.id);
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
        title="Product categories"
        endpoint="/api/product-categories"
        queryKey="product-categories"
      />
    </div>
  );
}
