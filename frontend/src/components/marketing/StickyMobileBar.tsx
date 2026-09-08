import { Link } from "react-router-dom";
import { MessageCircle, Zap } from "lucide-react";
import { paths } from "@/router/paths";

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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-2.5 border-t border-border/80 bg-background/95 px-4 py-2.5 backdrop-blur-md sm:hidden">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-2.5 text-xs font-semibold text-white shadow-sm active:opacity-90"
      >
        <MessageCircle className="size-4 fill-white text-transparent" />
        <span>WhatsApp</span>
      </a>

      <Link
        to={paths.standalone}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-sm active:opacity-90"
      >
        <Zap className="size-4" />
        <span>Get Free Quote</span>
      </Link>
    </div>
  );
}
