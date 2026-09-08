import { Link } from "react-router-dom";
import { MessageSquare, MessageCircle, Zap } from "lucide-react";
import { paths } from "@/router/paths";
import { openChatwoot } from "./ChatwootWidget";

interface StickyMobileBarProps {
  phoneNumber?: string;
}

export default function StickyMobileBar({ phoneNumber = "" }: StickyMobileBarProps) {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
  const defaultMsg = encodeURIComponent(
    "Hi Paulux! I am interested in getting a standalone booking system for my salon. Could you share pricing and details?"
  );
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${defaultMsg}`
    : `https://wa.me/?text=${defaultMsg}`;

  function handleLiveChat() {
    const opened = openChatwoot();
    if (!opened && waUrl) {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-2 border-t border-border/80 bg-background/95 px-3 py-2.5 backdrop-blur-md sm:hidden">
      <button
        type="button"
        onClick={handleLiveChat}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-secondary py-2.5 text-xs font-semibold text-foreground shadow-sm active:opacity-90 transition-colors"
      >
        <MessageSquare className="size-4 text-accent" />
        <span>Live Chat</span>
      </button>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm active:opacity-90"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="size-4 fill-white text-transparent" />
      </a>

      <Link
        to={paths.standalone}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-sm active:opacity-90"
      >
        <Zap className="size-4" />
        <span>Get Quote</span>
      </Link>
    </div>
  );
}

