import { Link } from "react-router-dom";
import { ArrowRight, Check, HelpCircle, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/CurrencyContext";
import { paths } from "@/router/paths";
import { cn } from "@/lib/utils";

interface PricingSectionProps {
  className?: string;
  showTitle?: boolean;
}

export default function PricingSection({ className, showTitle = true }: PricingSectionProps) {
  const { currency, formatAmount } = useCurrency();

  // Baseline GHS amounts
  // GHS 500/mo = ~USD 32.25
  // GHS 3000 one-time = ~USD 193.50
  const isGHS = currency === "GHS";
  const monthlyDisplay = isGHS ? "GH₵ 500" : formatAmount(33);
  const setupDisplay = isGHS ? "Up to GH₵ 3,000" : `Up to ${formatAmount(195)}`;

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {showTitle && (
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold">
              Transparent Pricing / No Hidden Fees
            </span>
            <h2 className="font-serif mt-2 text-3xl md:text-4xl text-foreground font-medium">
              Simple, predictable pricing. Zero commission cuts.
            </h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base leading-relaxed">
              We never take a percentage of your haircuts, braids, facials, or treatments. You pay a transparent flat rate and keep 100% of every payment your clients make.
            </p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Card 1: Monthly Software Platform */}
          <div className="relative flex flex-col justify-between rounded-3xl border-2 border-primary/20 bg-card p-8 shadow-lg lg:col-span-7">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
                    Dedicated Software Platform
                  </span>
                  <h3 className="font-serif mt-3 text-2xl font-bold text-foreground">
                    Paulux Monthly Flat Plan
                  </h3>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="font-serif text-3xl md:text-4xl font-extrabold text-foreground">
                      {monthlyDisplay}
                    </span>
                    <span className="text-xs text-muted-foreground">/ month</span>
                  </div>
                  {isGHS && (
                    <span className="text-[11px] text-muted-foreground">500 Ghana Cedis flat</span>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground mt-3 text-xs md:text-sm leading-relaxed border-b border-border/60 pb-5">
                Everything required to run your salon, barbershop, or clinic smoothly with your own booking link and zero marketplace interference.
              </p>

              <div className="mt-6 space-y-3.5 text-xs md:text-sm text-foreground">
                <div className="flex items-start gap-3">
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">0% Booking Commission:</strong> Keep 100% of every appointment, deposit, and service ticket.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">Direct Paystack & Momo Payouts:</strong> Accept MTN Mobile Money, Telecel Cash, and Visa/Mastercard directly into your own account.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">Unlimited Staff & Chairs:</strong> Never pay per-chair penalties ($20/barber like Booksy). Add your whole team.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">Automated WhatsApp & SMS Reminders:</strong> Cut no-shows with automated confirmation messages sent directly to clients.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">Stylist Mobile Schedule:</strong> Each stylist logs in on their phone to see their chair schedule and personal tip totals.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">Private Client Database:</strong> Your customer phone numbers and formula cards remain 100% private. Competitors are never advertised.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/60">
              <Button asChild size="lg" className="w-full font-semibold shadow-sm">
                <Link to={paths.standalone}>
                  Get Started With Paulux <ArrowRight className="size-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Card 2: Turnkey Setup & White-Glove Migration */}
          <div className="flex flex-col justify-between rounded-3xl border border-border/80 bg-secondary/30 p-8 shadow-sm lg:col-span-5">
            <div>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                One-Time Deployment
              </span>
              <h3 className="font-serif mt-3 text-2xl font-bold text-foreground">
                Turnkey Setup & Migration
              </h3>

              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="font-serif text-3xl font-extrabold text-foreground">
                  {setupDisplay}
                </span>
                <span className="text-xs text-muted-foreground">one-time</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Flat onboarding fee based on salon size and data volume.
              </p>

              <p className="text-muted-foreground mt-4 text-xs leading-relaxed border-t border-border/60 pt-4">
                Our engineering team does all the heavy lifting so you and your team don't have to spend days retyping client records or service menus.
              </p>

              <div className="mt-5 space-y-3 text-xs text-muted-foreground">
                <div className="flex items-start gap-2.5">
                  <Zap className="size-3.5 text-accent shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">Custom Domain Setup:</strong> Live on booking.yourbrand.com with SSL security.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Zap className="size-3.5 text-accent shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">Full Data Migration:</strong> We export and clean your client phone book and formulas from Fresha, Booksy, or paper records.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Zap className="size-3.5 text-accent shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">Payment Gateway Integration:</strong> Connected directly to your Paystack or Stripe merchant account.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Zap className="size-3.5 text-accent shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">1-on-1 Staff Training:</strong> We train your receptionist and stylists so launch morning is 100% stress-free.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-card border border-border/80 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
                <span>Zero Salon Downtime Guarantee</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                Your current booking setup stays live until the moment of cutover. You never miss an appointment.
              </p>
            </div>
          </div>
        </div>

        {/* Honest Comparison Callout */}
        <div className="mt-12 rounded-2xl border border-border/80 bg-card p-6 md:p-8 text-center shadow-xs">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider mb-2">
            <HelpCircle className="size-4" />
            <span>Why This Beats Marketplace Apps</span>
          </div>
          <p className="text-sm md:text-base text-foreground font-medium max-w-2xl mx-auto">
            If your salon does GH₵ 25,000 / month, Fresha takes ~GH₵ 5,000 every month in commissions and markups. With Paulux, you pay a flat GH₵ 500 / month and keep the other GH₵ 4,500 in your pocket.
          </p>
        </div>
      </div>
    </section>
  );
}
