import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface CatalogItem {
  id: string;
  name: string;
  price: string;
  currency: string;
}

function errMsg(err: unknown): string {
  return err instanceof AxiosError
    ? (err.response?.data?.error?.message ?? "Something went wrong")
    : "Something went wrong";
}

export default function GiftCardPurchasePage() {
  const [selected, setSelected] = useState<Map<string, "SERVICE" | "PRODUCT">>(new Map());
  const [sender, setSender] = useState({ name: "", email: "", phone: "" });
  const [recipient, setRecipient] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ code: string; totalAmount: string } | null>(null);

  const services = useQuery({
    queryKey: ["public-services"],
    queryFn: async () => (await api.get<{ data: CatalogItem[] }>("/api/services")).data.data,
  });
  const products = useQuery({
    queryKey: ["public-products"],
    queryFn: async () => (await api.get<{ data: CatalogItem[] }>("/api/products")).data.data,
  });

  const total = useMemo(() => {
    const all = [...(services.data ?? []), ...(products.data ?? [])];
    return all
      .filter((i) => selected.has(i.id))
      .reduce((sum, i) => sum + parseFloat(i.price), 0);
  }, [services.data, products.data, selected]);

  const purchase = useMutation({
    mutationFn: async () =>
      (await api.post("/api/gift-cards/purchase", {
        senderName: sender.name,
        senderEmail: sender.email,
        senderPhone: sender.phone,
        recipientName: recipient.name,
        recipientEmail: recipient.email || null,
        message: message || null,
        deliveryMethod: "EMAIL",
        items: [...selected.entries()].map(([id, itemType]) => ({ itemType, itemId: id })),
      })).data.data as { code: string; totalAmount: string; authorizationUrl: string },
    onSuccess: (d) => {
      setError(null);
      setResult(d);
      if (d.authorizationUrl) window.location.href = d.authorizationUrl;
    },
    onError: (err) => setError(errMsg(err)),
  });

  function toggle(id: string, type: "SERVICE" | "PRODUCT") {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(id)) next.delete(id); else next.set(id, type);
      return next;
    });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (selected.size === 0) { setError("Pick at least one item"); return; }
    purchase.mutate();
  }

  if (result) {
    return (
      <section className="mx-auto max-w-lg px-6 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Almost there…</CardTitle>
            <CardDescription>
              Card <span className="font-mono">{result.code}</span> · GHS {result.totalAmount}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Redirecting to payment. The card activates once payment is confirmed.</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  function ItemList({ items, type }: { items: CatalogItem[]; type: "SERVICE" | "PRODUCT" }) {
    return (
      <>
        {items.map((s) => (
          <label key={s.id}
                 className={`flex cursor-pointer items-center justify-between rounded-md border p-3 text-sm ${selected.has(s.id) ? "border-primary bg-accent" : ""}`}>
            <span className="flex items-center gap-3">
              <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggle(s.id, type)} />
              {s.name}
            </span>
            <span className="font-medium">{s.currency} {s.price}</span>
          </label>
        ))}
      </>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-semibold">Give the gift of self-care</h1>
      <p className="text-muted-foreground mb-6">Bundle services or products into a gift card.</p>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <Card>
          <CardHeader><CardTitle>1. What's inside</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-2">
            <ItemList items={services.data ?? []} type="SERVICE" />
            <ItemList items={products.data ?? []} type="PRODUCT" />
            {total > 0 && (
              <p className="mt-2 text-right text-sm">Total <strong>GHS {total.toFixed(2)}</strong></p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>2. From you, to them</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="gc-sname">Your name</Label>
              <Input id="gc-sname" value={sender.name}
                     onChange={(e) => setSender({ ...sender, name: e.target.value })} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="gc-semail">Your email</Label>
              <Input id="gc-semail" type="email" value={sender.email}
                     onChange={(e) => setSender({ ...sender, email: e.target.value })} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="gc-sphone">Your phone</Label>
              <Input id="gc-sphone" type="tel" value={sender.phone}
                     onChange={(e) => setSender({ ...sender, phone: e.target.value })} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="gc-rname">Recipient's name</Label>
              <Input id="gc-rname" value={recipient.name}
                     onChange={(e) => setRecipient({ ...recipient, name: e.target.value })} required />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="gc-remail">Recipient's email (for delivery)</Label>
              <Input id="gc-remail" type="email" value={recipient.email}
                     onChange={(e) => setRecipient({ ...recipient, email: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="gc-msg">Personal message (optional)</Label>
              <Input id="gc-msg" value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {error && <p className="text-destructive text-sm" role="alert">{error}</p>}
        <Button type="submit" size="lg" disabled={purchase.isPending}>
          {purchase.isPending ? "Processing…" : `Buy gift card${total > 0 ? ` — GHS ${total.toFixed(2)}` : ""}`}
        </Button>
      </form>
    </section>
  );
}
