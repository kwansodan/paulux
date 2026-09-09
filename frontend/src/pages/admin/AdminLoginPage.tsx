import { useState, type FormEvent } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/context/AdminContext";
import { paths } from "@/router/paths";

export default function AdminLoginPage() {
  const { login, isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect
  if (isAuthenticated) {
    return <Navigate to={paths.admin} replace />;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const success = login(password);
      if (success) {
        navigate(paths.admin, { replace: true });
      } else {
        setError("Invalid admin master key. Default access key is 'paulux2026!'.");
        setLoading(false);
      }
    }, 400);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1b101d] via-[#241528] to-[#120815] flex flex-col items-center justify-center p-6 text-foreground">
      <div className="w-full max-w-md space-y-6 animate-in fade-in zoom-in duration-300">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link to={paths.home} className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-accent uppercase mb-2 hover:opacity-80 transition-opacity">
            <Sparkles className="size-3.5" />
            <span>Paulux Enterprise</span>
          </Link>
          <div className="size-14 rounded-2xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center mx-auto shadow-lg">
            <Lock className="size-6" />
          </div>
          <h1 className="font-serif text-3xl font-medium text-white tracking-tight">
            Sales & Marketing Portal
          </h1>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Authorized administrator access for managing inbound salon quotes, customer CRM, and campaign performance.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-border/80 bg-card/90 p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Master Access Key</span>
                <span className="text-[10px] text-accent lowercase">default: paulux2026!</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter administrator password..."
                  required
                  autoFocus
                  className="w-full rounded-xl border border-border/80 bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent pr-11 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive font-medium">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 h-11 bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90 transition-all cursor-pointer"
            >
              {loading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <span className="flex items-center gap-1.5">
                  Unlock Command Center <ArrowRight className="size-4 ml-1" />
                </span>
              )}
            </Button>
          </form>

          <div className="border-t border-border/60 pt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-400" /> End-to-End Isolated
            </span>
            <Link to={paths.home} className="text-accent hover:underline">
              ← Return to Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
