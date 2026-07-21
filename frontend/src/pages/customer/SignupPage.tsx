import { useState, type FormEvent } from "react";
import { AxiosError } from "axios";
import { api, ensureCsrf } from "@/lib/api";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function errMsg(err: unknown): string {
  return err instanceof AxiosError
    ? (err.response?.data?.error?.message ?? "Sign up failed")
    : "Sign up failed";
}

export default function SignupPage() {
  const [orgName, setOrgName] = useState("");
  const [slug, setSlug] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [slugState, setSlugState] = useState<"idle" | "checking" | "ok" | "taken">("idle");
  const [busy, setBusy] = useState(false);

  const baseDomain = import.meta.env.VITE_BASE_DOMAIN ?? "lvh.me";

  async function onSlugBlur() {
    const s = slug.trim().toLowerCase();
    if (s.length < 3) return;
    setSlugState("checking");
    try {
      const { data } = await api.get(`/api/signup/slug-available?slug=${encodeURIComponent(s)}`);
      setSlugState(data.data.available ? "ok" : "taken");
    } catch {
      setSlugState("idle");
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await ensureCsrf();
      const { data } = await api.post("/api/signup", {
        orgName, slug: slug.trim().toLowerCase(),
        adminUsername: username, adminEmail: email, adminPassword: password,
      });
      const host = data.data.workspaceHost as string;
      const port = window.location.port ? `:${window.location.port}` : "";
      // Send them to their new workspace login.
      window.location.href = `${window.location.protocol}//${host}${port}/login`;
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="bg-brand-wash text-primary-foreground relative hidden flex-col justify-between p-12 lg:flex">
        <Logo className="text-primary-foreground" />
        <div>
          <h1 className="font-serif max-w-sm text-4xl leading-tight">
            Launch your salon's booking home in minutes.
          </h1>
          <p className="text-primary-foreground/70 mt-4 max-w-sm text-sm">
            Your own branded subdomain, online booking, payments, and gift cards.
            14-day free trial — no card required.
          </p>
        </div>
        <p className="text-primary-foreground/50 text-xs tracking-luxe uppercase">
          Paulux · Luxury wellness
        </p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden"><Logo /></div>
          <p className="text-accent text-xs tracking-luxe uppercase">Get started</p>
          <h2 className="font-serif mt-2 text-3xl">Create your workspace</h2>

          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="su-org">Business name</Label>
              <Input id="su-org" value={orgName} onChange={(e) => setOrgName(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="su-slug">Workspace address</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="su-slug"
                  value={slug}
                  onChange={(e) => { setSlug(e.target.value); setSlugState("idle"); }}
                  onBlur={onSlugBlur}
                  placeholder="your-salon"
                  required
                />
                <span className="text-muted-foreground text-sm whitespace-nowrap">.{baseDomain}</span>
              </div>
              {slugState === "checking" && <p className="text-muted-foreground text-xs">Checking…</p>}
              {slugState === "ok" && <p className="text-xs text-[color:var(--sage-foreground)]">Available ✓</p>}
              {slugState === "taken" && <p className="text-destructive text-xs">Already taken</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="su-user">Your name</Label>
              <Input id="su-user" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="su-email">Email</Label>
              <Input id="su-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="su-pass">Password</Label>
              <Input id="su-pass" type="password" minLength={8} value={password}
                     onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-destructive text-sm" role="alert">{error}</p>}
            <Button type="submit" size="lg" disabled={busy || slugState === "taken"} className="mt-2">
              {busy ? "Creating…" : "Create workspace"}
            </Button>
            <p className="text-muted-foreground text-center text-xs">
              14-day free trial · no credit card required
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
