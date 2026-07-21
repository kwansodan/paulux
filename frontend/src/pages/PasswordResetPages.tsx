import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AxiosError } from "axios";
import { api, ensureCsrf } from "@/lib/api";
import { paths } from "@/router/paths";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function errMsg(err: unknown): string {
  return err instanceof AxiosError
    ? (err.response?.data?.error?.message ?? "Something went wrong")
    : "Something went wrong";
}

function Shell({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8"><Logo /></div>
        <p className="text-accent text-xs tracking-luxe uppercase">{eyebrow}</p>
        <h2 className="font-serif mt-2 text-3xl">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await ensureCsrf();
      await api.post("/api/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <Shell eyebrow="Check your inbox" title="Reset link sent">
        <p className="text-muted-foreground mt-4 text-sm">
          If an account exists for <strong>{email}</strong>, we've sent a link to
          reset your password. It expires in 30 minutes.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to={paths.login}>Back to sign in</Link>
        </Button>
      </Shell>
    );
  }

  return (
    <Shell eyebrow="Password" title="Reset your password">
      <p className="text-muted-foreground mt-1 text-sm">
        Enter your email and we'll send you a reset link.
      </p>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="fp-email">Email</Label>
          <Input id="fp-email" type="email" value={email}
                 onChange={(e) => setEmail(e.target.value)} required />
        </div>
        {error && <p className="text-destructive text-sm" role="alert">{error}</p>}
        <Button type="submit" size="lg" disabled={busy} className="mt-2">
          {busy ? "Sending…" : "Send reset link"}
        </Button>
        <Link to={paths.login} className="text-muted-foreground hover:text-accent text-center text-sm">
          Back to sign in
        </Link>
      </form>
    </Shell>
  );
}

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setBusy(true);
    try {
      await ensureCsrf();
      await api.post("/api/auth/reset-password", { token, password });
      navigate(paths.login, { replace: true, state: { reset: true } });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  if (!token) {
    return (
      <Shell eyebrow="Password" title="Invalid link">
        <p className="text-muted-foreground mt-4 text-sm">
          This reset link is missing its token. Request a new one.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to={paths.forgotPassword}>Request a new link</Link>
        </Button>
      </Shell>
    );
  }

  return (
    <Shell eyebrow="Password" title="Choose a new password">
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="rp-pass">New password</Label>
          <Input id="rp-pass" type="password" minLength={8} value={password}
                 onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="rp-confirm">Confirm password</Label>
          <Input id="rp-confirm" type="password" minLength={8} value={confirm}
                 onChange={(e) => setConfirm(e.target.value)} required />
        </div>
        {error && <p className="text-destructive text-sm" role="alert">{error}</p>}
        <Button type="submit" size="lg" disabled={busy} className="mt-2">
          {busy ? "Saving…" : "Reset password"}
        </Button>
      </form>
    </Shell>
  );
}
