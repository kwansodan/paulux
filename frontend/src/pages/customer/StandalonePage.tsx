import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { ArrowLeft, Check, Globe } from "lucide-react";
import { api, ensureCsrf } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/ui/container";
import { paths } from "@/router/paths";

function errMsg(err: unknown): string {
  return err instanceof AxiosError
    ? (err.response?.data?.error?.message ?? "Something went wrong")
    : "Something went wrong";
}

const PERKS = [
  "Your own domain — yourbrand.com, not a shared subdomain",
  "A dedicated, isolated deployment",
  "Your branding end to end",
  "Hands-on onboarding from our team",
];

export default function StandalonePage() {
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    city: "",
    teamSize: "",
    message: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await ensureCsrf();
      await api.post("/api/leads", {
        name: form.name,
        businessName: form.businessName,
        email: form.email,
        phone: form.phone || undefined,
        city: form.city || undefined,
        teamSize: form.teamSize ? Number(form.teamSize) : undefined,
        message: form.message || undefined,
      });
      setDone(true);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <Container className="flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <span className="bg-accent/10 text-accent mb-6 flex size-14 items-center justify-center rounded-2xl">
          <Check className="size-7" />
        </span>
        <h1 className="font-serif text-3xl">Thanks — we'll be in touch</h1>
        <p className="text-muted-foreground mt-3 max-w-md">
          Your enquiry has reached our team. We'll reach out to {form.email} to
          talk through your own-domain setup.
        </p>
        <Button asChild variant="outline" className="mt-8">
          <Link to={paths.home}>
            <ArrowLeft className="size-4" /> Back home
          </Link>
        </Button>
      </Container>
    );
  }

  return (
    <Container className="grid gap-12 py-16 lg:grid-cols-2 lg:py-24">
      {/* Pitch */}
      <div className="flex flex-col justify-center">
        <p className="text-accent text-xs tracking-luxe uppercase">Standalone</p>
        <h1 className="font-serif mt-2 text-4xl leading-tight md:text-5xl">
          Run Paulux on your own domain
        </h1>
        <p className="text-muted-foreground mt-4 max-w-md">
          Prefer a fully independent home instead of a shared subdomain? Tell us
          about your business and we'll set you up with a dedicated deployment on
          your own domain.
        </p>
        <ul className="mt-8 flex flex-col gap-3">
          {PERKS.map((p) => (
            <li key={p} className="flex items-start gap-3 text-sm">
              <Globe className="text-accent mt-0.5 size-4 shrink-0" /> {p}
            </li>
          ))}
        </ul>
      </div>

      {/* Form */}
      <div className="bg-card rounded-2xl border border-border/70 p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <h2 className="font-serif text-2xl">Request access</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          No payment now — this starts a conversation.
        </p>
        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="sa-name">Your name</Label>
            <Input id="sa-name" value={form.name}
                   onChange={(e) => set("name", e.target.value)} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="sa-biz">Business name</Label>
            <Input id="sa-biz" value={form.businessName}
                   onChange={(e) => set("businessName", e.target.value)} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="sa-email">Email</Label>
            <Input id="sa-email" type="email" value={form.email}
                   onChange={(e) => set("email", e.target.value)} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="sa-phone">Phone <span className="text-muted-foreground">(optional)</span></Label>
              <Input id="sa-phone" value={form.phone}
                     onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="sa-city">City <span className="text-muted-foreground">(optional)</span></Label>
              <Input id="sa-city" value={form.city}
                     onChange={(e) => set("city", e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="sa-team">Team size <span className="text-muted-foreground">(optional)</span></Label>
            <Input id="sa-team" type="number" min={1} value={form.teamSize}
                   onChange={(e) => set("teamSize", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="sa-msg">Anything else? <span className="text-muted-foreground">(optional)</span></Label>
            <textarea
              id="sa-msg"
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              rows={4}
              className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-xl border bg-transparent px-3 py-2 text-sm shadow-[var(--shadow-soft)] focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          {error && <p className="text-destructive text-sm" role="alert">{error}</p>}
          <Button type="submit" size="lg" disabled={busy} className="mt-2">
            {busy ? "Sending…" : "Request access"}
          </Button>
        </form>
      </div>
    </Container>
  );
}
