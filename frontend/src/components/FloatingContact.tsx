import { useState } from "react";
import { Instagram, MessageCircle, Plus, X } from "lucide-react";
import { currentTenantSlug } from "@/lib/tenant";
import { cn } from "@/lib/utils";

/**
 * Floating "enquire" button for the apex marketing site. Expands to click-to-open
 * WhatsApp + Instagram deep links for the Paulux platform itself. Values come from
 * build-time env; the button renders nothing if neither is configured, or on a
 * tenant subdomain (this is for platform enquiries, not tenant customers).
 */
export function FloatingContact() {
  const [open, setOpen] = useState(false);

  const whatsapp = import.meta.env.VITE_PLATFORM_WHATSAPP?.replace(/\D/g, "");
  const instagram = import.meta.env.VITE_PLATFORM_INSTAGRAM?.replace(/^@/, "");

  // Apex only, and only when at least one channel is set.
  if (currentTenantSlug() !== null || (!whatsapp && !instagram)) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex flex-col items-end gap-2">
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hi Paulux, I'd like to know more about the platform.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-lift)] transition-transform hover:scale-105"
            >
              <MessageCircle className="size-4" /> WhatsApp
            </a>
          )}
          {instagram && (
            <a
              href={`https://instagram.com/${instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] px-4 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-lift)] transition-transform hover:scale-105"
            >
              <Instagram className="size-4" /> Instagram
            </a>
          )}
        </div>
      )}
      <button
        type="button"
        aria-label={open ? "Close contact options" : "Enquire about Paulux"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex size-14 items-center justify-center rounded-full shadow-[var(--shadow-lift)] transition-transform hover:scale-105",
          open ? "bg-secondary text-foreground" : "bg-primary text-primary-foreground",
        )}
      >
        {open ? <X className="size-6" /> : <Plus className="size-6" />}
      </button>
    </div>
  );
}
