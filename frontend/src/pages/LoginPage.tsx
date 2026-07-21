import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useAuth } from "@/auth/AuthContext";
import { paths } from "@/router/paths";
import { currentTenantSlug } from "@/lib/tenant";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const slug = currentTenantSlug();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      const from =
        (location.state as { from?: { pathname: string } } | null)?.from
          ?.pathname ?? paths.dashboard;
      navigate(from, { replace: true });
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.error?.message ?? "Login failed"
          : "Login failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="bg-brand-wash text-primary-foreground relative hidden flex-col justify-between p-12 lg:flex">
        <Logo className="text-primary-foreground" />
        <div>
          <h1 className="font-serif max-w-sm text-4xl leading-tight">
            Calm, care, and a seamless booking experience.
          </h1>
          <p className="text-primary-foreground/70 mt-4 max-w-sm text-sm">
            Sign in to manage bookings, payments, and your workspace.
          </p>
        </div>
        <p className="text-primary-foreground/50 text-xs tracking-luxe uppercase">
          Paulux · Luxury wellness
        </p>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <p className="text-accent text-xs tracking-luxe uppercase">
            {slug ? `${slug} workspace` : "Sign in"}
          </p>
          <h2 className="font-serif mt-2 text-3xl">Welcome back</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Enter your details to continue.
          </p>

          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to={paths.forgotPassword}
                  className="text-muted-foreground hover:text-accent text-xs"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-destructive text-sm" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" size="lg" disabled={submitting} className="mt-2">
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
