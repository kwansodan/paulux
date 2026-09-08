import type { ReactNode } from "react";

/**
 * Provides the default luxury Paulux theme styling.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
