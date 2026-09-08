import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

interface WhatsAppFloatProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export default function WhatsAppFloat({
  phoneNumber = "",
  defaultMessage = "Hi! I'm interested in deploying a standalone Paulux booking system on my own domain. Could you share details and pricing?",
}: WhatsAppFloatProps) {
  const [openTooltip, setOpenTooltip] = useState(true);

  // If a phone number is provided, clean it, otherwise use apex wa.me
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
  const targetUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMessage)}`
    : `https://wa.me/?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <aside aria-label="Direct WhatsApp Contact" className="fixed bottom-20 right-4 z-40 sm:bottom-6 sm:right-6 flex flex-col items-end gap-2">
      {openTooltip && (
        <div className="relative hidden max-w-xs animate-in fade-in slide-in-from-bottom-2 rounded-2xl border border-border/80 bg-card p-4 shadow-xl sm:block">
          <button
            onClick={() => setOpenTooltip(false)}
            aria-label="Dismiss message"
            className="text-muted-foreground hover:text-foreground absolute right-2.5 top-2.5 rounded-full p-1"
          >
            <X className="size-3.5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500"></span>
            </span>
            <p className="text-xs font-semibold">Solutions Specialist Online</p>
          </div>
          <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
            Have questions about pricing, setup, or migrating from Fresha/Mindbody? Chat with us directly.
          </p>
        </div>
      )}

      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Paulux Team on WhatsApp"
        className="group relative flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg transition-all hover:scale-105 hover:bg-[#20bd5a] hover:shadow-2xl active:scale-95"
      >
        <MessageCircle className="size-5 fill-white text-transparent" />
        <span className="text-xs font-bold tracking-wide">WhatsApp Us</span>
        <span className="absolute -top-1 -right-1 flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-200 opacity-75"></span>
          <span className="relative inline-flex size-3 rounded-full bg-emerald-400 border-2 border-white"></span>
        </span>
      </a>
    </aside>
  );
}
