import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface Hour {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isOpen: boolean;
  maxConcurrentBookings: number;
}

interface Org {
  name: string;
  logoUrl: string | null;
  primaryColor: string | null;
  paystackPublicKey: string | null;
  paymentsConfigured: boolean;
}

function errMsg(err: unknown): string {
  return err instanceof AxiosError
    ? (err.response?.data?.error?.message ?? "Request failed")
    : "Request failed";
}

function BrandingSection() {
  const qc = useQueryClient();
  const org = useQuery({
    queryKey: ["organization"],
    queryFn: async () => (await api.get<{ data: Org }>("/api/organization")).data.data,
  });
  const [name, setName] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (org.data) {
      setName(org.data.name);
      setPublicKey(org.data.paystackPublicKey ?? "");
    }
  }, [org.data]);

  const save = useMutation({
    mutationFn: async () =>
      api.put("/api/organization", {
        name,
        paystackPublicKey: publicKey || null,
        ...(secretKey ? { paystackSecretKey: secretKey } : {}),
      }),
    onSuccess: () => {
      setMsg("Saved.");
      setSecretKey("");
      void qc.invalidateQueries({ queryKey: ["organization"] });
    },
    onError: (err) => setMsg(errMsg(err)),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business & payments</CardTitle>
        <CardDescription>
          Your business name and Paystack keys.{" "}
          {org.data?.paymentsConfigured ? "Payments are configured." : "Payments not configured yet."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(e: FormEvent) => { e.preventDefault(); save.mutate(); }}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="st-name">Business name</Label>
            <Input id="st-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="st-pk">Paystack public key</Label>
            <Input id="st-pk" value={publicKey} onChange={(e) => setPublicKey(e.target.value)} placeholder="pk_live_…" />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="st-sk">Paystack secret key (write-only)</Label>
            <Input id="st-sk" type="password" value={secretKey}
                   onChange={(e) => setSecretKey(e.target.value)}
                   placeholder="sk_live_… (leave blank to keep current)" />
          </div>
          {msg && <p className="text-sm sm:col-span-2">{msg}</p>}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={save.isPending}>Save</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function HoursSection() {
  const [hours, setHours] = useState<Hour[]>(
    DAYS.map((_, d) => ({
      dayOfWeek: d, startTime: "09:00", endTime: "18:00",
      isOpen: d !== 0, maxConcurrentBookings: 4,
    })),
  );
  const [msg, setMsg] = useState<string | null>(null);

  const existing = useQuery({
    queryKey: ["business-hours"],
    queryFn: async () => (await api.get<{ data: Hour[] }>("/api/business-hours")).data.data,
  });

  useEffect(() => {
    if (existing.data && existing.data.length > 0) {
      setHours((prev) =>
        prev.map((h) => existing.data.find((e) => e.dayOfWeek === h.dayOfWeek) ?? h),
      );
    }
  }, [existing.data]);

  const save = useMutation({
    mutationFn: async () => api.put("/api/business-hours", { hours }),
    onSuccess: () => setMsg("Hours saved."),
    onError: (err) => setMsg(errMsg(err)),
  });

  function patch(d: number, changes: Partial<Hour>) {
    setHours((prev) => prev.map((h) => (h.dayOfWeek === d ? { ...h, ...changes } : h)));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business hours</CardTitle>
        <CardDescription>When customers can book.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {hours.map((h) => (
          <div key={h.dayOfWeek} className="flex flex-wrap items-center gap-3 text-sm">
            <label className="flex w-28 items-center gap-2">
              <input type="checkbox" checked={h.isOpen}
                     onChange={(e) => patch(h.dayOfWeek, { isOpen: e.target.checked })} />
              {DAYS[h.dayOfWeek]}
            </label>
            <Input aria-label={`${DAYS[h.dayOfWeek]} opens`} type="time" className="w-28"
                   value={h.startTime} disabled={!h.isOpen}
                   onChange={(e) => patch(h.dayOfWeek, { startTime: e.target.value })} />
            <span className="text-muted-foreground">to</span>
            <Input aria-label={`${DAYS[h.dayOfWeek]} closes`} type="time" className="w-28"
                   value={h.endTime} disabled={!h.isOpen}
                   onChange={(e) => patch(h.dayOfWeek, { endTime: e.target.value })} />
          </div>
        ))}
        {msg && <p className="text-sm">{msg}</p>}
        <div className="mt-2">
          <Button onClick={() => save.mutate()} disabled={save.isPending}>Save hours</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MethodsSection() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const methods = useQuery({
    queryKey: ["manual-methods"],
    queryFn: async () =>
      (await api.get<{ data: { id: string; name: string; isActive: boolean }[] }>(
        "/api/payments/manual-methods",
      )).data.data,
  });
  const create = useMutation({
    mutationFn: async () => api.post("/api/payments/manual-methods", { name }),
    onSuccess: () => {
      setMsg(null); setName("");
      void qc.invalidateQueries({ queryKey: ["manual-methods"] });
    },
    onError: (err) => setMsg(errMsg(err)),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual payment methods</CardTitle>
        <CardDescription>Cash, MoMo transfer, POS — for walk-in payments.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {(methods.data ?? []).map((m) => (
            <span key={m.id} className="rounded-full border px-3 py-1 text-sm">{m.name}</span>
          ))}
          {(methods.data ?? []).length === 0 && (
            <span className="text-muted-foreground text-sm">None yet.</span>
          )}
        </div>
        <form
          className="flex items-end gap-2"
          onSubmit={(e: FormEvent) => { e.preventDefault(); create.mutate(); }}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="mm-name">New method</Label>
            <Input id="mm-name" value={name} onChange={(e) => setName(e.target.value)}
                   placeholder="e.g. Cash" required />
          </div>
          <Button type="submit" disabled={create.isPending}>Add</Button>
        </form>
        {msg && <p className="text-destructive text-sm">{msg}</p>}
      </CardContent>
    </Card>
  );
}

function StaffSection() {
  const qc = useQueryClient();
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const staff = useQuery({
    queryKey: ["staff"],
    queryFn: async () =>
      (await api.get<{ data: { id: string; username: string; email: string; role: string; customRoleName: string | null }[] }>(
        "/api/staff",
      )).data.data,
  });
  const create = useMutation({
    mutationFn: async () => api.post("/api/staff", { ...form, role: "STAFF" }),
    onSuccess: () => {
      setMsg(null);
      setForm({ username: "", email: "", password: "" });
      void qc.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (err) => setMsg(errMsg(err)),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff</CardTitle>
        <CardDescription>Team members with dashboard access.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <table className="w-full text-sm">
          <tbody>
            {(staff.data ?? []).map((u) => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="py-2 font-medium">{u.username}</td>
                <td className="text-muted-foreground py-2">{u.email}</td>
                <td className="py-2">{u.customRoleName ?? u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <form
          className="grid gap-3 sm:grid-cols-3"
          onSubmit={(e: FormEvent) => { e.preventDefault(); create.mutate(); }}
        >
          <Input aria-label="Username" placeholder="Username" value={form.username}
                 onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <Input aria-label="Email" type="email" placeholder="Email" value={form.email}
                 onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <div className="flex gap-2">
            <Input aria-label="Password" type="password" placeholder="Password (8+ chars)"
                   value={form.password} minLength={8}
                   onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <Button type="submit" disabled={create.isPending}>Add</Button>
          </div>
        </form>
        {msg && <p className="text-destructive text-sm">{msg}</p>}
      </CardContent>
    </Card>
  );
}

function LookbookSection() {
  const qc = useQueryClient();
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const images = useQuery({
    queryKey: ["style-images"],
    queryFn: async () =>
      (await api.get<{ data: { id: string; url: string; caption: string | null; isActive: boolean }[] }>(
        "/api/style-images",
      )).data.data,
  });
  const create = useMutation({
    mutationFn: async () => api.post("/api/style-images", { url, caption: caption || null, isActive: true }),
    onSuccess: () => { setMsg(null); setUrl(""); setCaption(""); void qc.invalidateQueries({ queryKey: ["style-images"] }); },
    onError: (err) => setMsg(errMsg(err)),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/api/style-images/${id}`),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["style-images"] }),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lookbook</CardTitle>
        <CardDescription>Gallery images shown on your public site.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          {(images.data ?? []).map((img) => (
            <div key={img.id} className="relative">
              <img src={img.url} alt={img.caption ?? ""}
                   className="h-24 w-24 rounded-md border object-cover" />
              <button className="bg-destructive absolute -right-2 -top-2 h-5 w-5 rounded-full text-xs text-white"
                      onClick={() => remove.mutate(img.id)} aria-label="Remove image">×</button>
            </div>
          ))}
          {(images.data ?? []).length === 0 && (
            <span className="text-muted-foreground text-sm">No images yet.</span>
          )}
        </div>
        <form className="grid gap-3 sm:grid-cols-2"
              onSubmit={(e: FormEvent) => { e.preventDefault(); create.mutate(); }}>
          <Input aria-label="Image URL" placeholder="Image URL" value={url}
                 onChange={(e) => setUrl(e.target.value)} required />
          <div className="flex gap-2">
            <Input aria-label="Caption" placeholder="Caption (optional)" value={caption}
                   onChange={(e) => setCaption(e.target.value)} />
            <Button type="submit" disabled={create.isPending}>Add</Button>
          </div>
        </form>
        {msg && <p className="text-destructive text-sm">{msg}</p>}
      </CardContent>
    </Card>
  );
}

interface Subscription {
  plan: string;
  planName: string;
  status: string;
  trialDaysLeft: number | null;
  trialExpired: boolean;
  trialExtensionsRemaining: number;
  canExtendTrial: boolean;
}
interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

function BillingSection() {
  const qc = useQueryClient();
  const [msg, setMsg] = useState<string | null>(null);
  const sub = useQuery({
    queryKey: ["subscription"],
    queryFn: async () =>
      (await api.get<{ data: Subscription }>("/api/billing/subscription")).data.data,
  });
  const plans = useQuery({
    queryKey: ["plans"],
    queryFn: async () => (await api.get<{ data: Plan[] }>("/api/billing/plans")).data.data,
  });
  const checkout = useMutation({
    mutationFn: async (plan: string) =>
      (await api.post("/api/billing/checkout", { plan })).data.data as {
        checkoutUrl: string | null; activated: boolean;
      },
    onSuccess: (d) => {
      if (d.activated) {
        setMsg("Plan activated.");
        void qc.invalidateQueries({ queryKey: ["subscription"] });
      } else if (d.checkoutUrl) {
        setMsg("Redirecting to secure checkout…");
        window.location.href = d.checkoutUrl;
      }
    },
    onError: (err) => setMsg(errMsg(err)),
  });
  const extend = useMutation({
    mutationFn: async () =>
      (await api.post("/api/billing/extend-trial", {})).data.data as Subscription,
    onSuccess: (d) => {
      setMsg(`Trial extended — ${d.trialDaysLeft} days left, ${d.trialExtensionsRemaining} extension(s) remaining.`);
      void qc.invalidateQueries({ queryKey: ["subscription"] });
    },
    onError: (err) => setMsg(errMsg(err)),
  });

  const current = sub.data;
  const onTrial = current?.status === "TRIAL";
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>
          {current
            ? `${current.planName} · ${current.status}` +
              (current.trialDaysLeft != null ? ` · ${current.trialDaysLeft} trial days left` : "")
            : "Manage your plan."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {onTrial && (
          <div className="border-border/70 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
            <div className="text-sm">
              <p className="font-medium">
                {current!.trialExpired
                  ? "Your free trial has ended"
                  : `${current!.trialDaysLeft} days left in your free trial`}
              </p>
              <p className="text-muted-foreground text-xs">
                {current!.trialExtensionsRemaining > 0
                  ? `You can extend by 15 days (${current!.trialExtensionsRemaining} extension${current!.trialExtensionsRemaining === 1 ? "" : "s"} left).`
                  : "No trial extensions left — choose a plan to continue."}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={!current!.canExtendTrial || extend.isPending}
              onClick={() => extend.mutate()}
            >
              Extend 15 days
            </Button>
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-3">
          {(plans.data ?? []).map((p) => {
            const isCurrent = current?.plan === p.id;
            return (
              <div key={p.id}
                   className={`flex flex-col gap-2 rounded-xl border p-4 ${isCurrent ? "border-accent bg-accent/5" : "border-border/70"}`}>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-lg">{p.name}</span>
                  <span className="text-sm">{p.price === 0 ? "Free" : `GHS ${p.price}/mo`}</span>
                </div>
                <ul className="text-muted-foreground flex flex-col gap-1 text-xs">
                  {p.features.slice(0, 4).map((f) => <li key={f}>· {f}</li>)}
                </ul>
                <Button
                  size="sm"
                  variant={isCurrent ? "outline" : "default"}
                  disabled={isCurrent || checkout.isPending}
                  onClick={() => checkout.mutate(p.id)}
                  className="mt-auto"
                >
                  {isCurrent ? "Current plan" : p.price === 0 ? "Choose" : "Upgrade"}
                </Button>
              </div>
            );
          })}
        </div>
        {msg && <p className="text-sm">{msg}</p>}
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground text-sm">Workspace configuration.</p>
      </div>
      <BillingSection />
      <BrandingSection />
      <HoursSection />
      <MethodsSection />
      <LookbookSection />
      <StaffSection />
    </div>
  );
}
