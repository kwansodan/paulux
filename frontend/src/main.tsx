import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/auth/AuthContext";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { CookieBanner } from "@/components/CookieBanner";
import { queryClient } from "@/lib/queryClient";
import App from "./App";

// Self-hosted variable fonts (no external CDN — CSP/Docker safe)
import "@fontsource-variable/fraunces";
import "@fontsource-variable/manrope";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <App />
            <CookieBanner />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
