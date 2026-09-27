import { ArrowRight, Check, ExternalLink, MapPin, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PilotSpotlightProps {
  className?: string;
}

export default function PilotSpotlight({ className }: PilotSpotlightProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 md:p-10 shadow-lg",
        className
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        {/* Left Column: Real Story & Verification */}
        <div className="max-w-2xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
              <ShieldCheck className="size-3.5" />
              <span>Verified Pilot Partner</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground font-medium">
              <MapPin className="size-3 text-accent" />
              <span>Tesano, Accra, Ghana</span>
            </span>
          </div>

          <h3 className="font-serif text-2xl md:text-3xl font-medium text-foreground">
            Powering Polaris Beauty Lounge in Production
          </h3>

          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Before Paulux, Polaris Beauty Lounge was listed on Fresha—paying marketplace commissions on new client bookings and dealing with platform fees that did not fit local mobile money workflows in Accra.
          </p>

          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Today, Polaris operates with their own dedicated booking system. Clients in Accra book silk presses, braids, luxury pedicures, and nail sets directly on their phone and pay via <strong className="text-foreground">MTN Mobile Money, Telecel Cash, or Card</strong> through Paystack with <strong className="text-foreground">0% marketplace cuts</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs md:text-sm">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Check className="size-4 text-emerald-500 shrink-0" />
              <span>Direct MTN & Telecel Momo Payouts</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Check className="size-4 text-emerald-500 shrink-0" />
              <span>0% Commission on All Hair & Nails</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Check className="size-4 text-emerald-500 shrink-0" />
              <span>Automated WhatsApp Booking Reminders</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Check className="size-4 text-emerald-500 shrink-0" />
              <span>Client Phone Numbers Remain 100% Private</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <a
              href="https://instagram.com/polarisbeautylounge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-secondary/40 px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary hover:text-accent transition-colors"
            >
              <span>Visit @polarisbeautylounge on Instagram</span>
              <ExternalLink className="size-3" />
            </a>
            <Link
              to="/case-studies/polaris-beauty-salon"
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
            >
              <span>Read Full Pilot Case Study</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Quote Card */}
        <div className="flex flex-col justify-between rounded-2xl bg-secondary/30 border border-border/60 p-6 md:p-8 lg:max-w-sm w-full">
          <div>
            <div className="flex items-center gap-1 text-amber-500 mb-3">
              {"★".repeat(5)}
            </div>
            <p className="font-serif italic text-base text-foreground leading-relaxed">
              "Our clients in Accra want to book quickly and pay with Mobile Money. Having our own booking link without Fresha taking cuts or showing other salons was an immediate upgrade for Polaris."
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-border/60">
            <p className="font-semibold text-sm text-foreground">Management Team</p>
            <p className="text-xs text-muted-foreground">Polaris Beauty Lounge · 12 Brenya Ave, Tesano, Accra</p>
            <div className="mt-3">
              <Button asChild size="sm" variant="outline" className="w-full text-xs">
                <Link to="/standalone">Request Similar Deployment</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
