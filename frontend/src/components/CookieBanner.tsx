import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { paths } from "@/router/paths";

const KEY = "paulux_cookie_consent";

/**
 * Minimal, honest cookie notice. Paulux only sets strictly-necessary cookies
 * (session + CSRF), so this is an acknowledgement rather than a consent gate —
 * nothing is blocked pending a choice.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!localStorage.getItem(KEY));
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="bg-card mx-auto flex max-w-3xl flex-col items-center gap-3 rounded-2xl border border-border/70 p-4 shadow-[var(--shadow-lift)] sm:flex-row">
        <p className="text-muted-foreground flex-1 text-sm">
          We use only strictly-necessary cookies to keep you signed in and secure
          your session. See our{" "}
          <Link to={paths.privacy} className="text-accent underline">
            Privacy Policy
          </Link>
          .
        </p>
        <Button
          size="sm"
          onClick={() => {
            localStorage.setItem(KEY, "1");
            setVisible(false);
          }}
        >
          Got it
        </Button>
      </div>
    </div>
  );
}
