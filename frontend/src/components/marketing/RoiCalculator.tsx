import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calculator,
  Check,
  Download,
  FileText,
  Printer,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { paths } from "@/router/paths";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

interface PlatformFeeModel {
  name: string;
  blendedRate: number;
  fixedAnnualSurcharge: number;
  feeLabel: string;
}

const PLATFORM_FEES: Record<string, PlatformFeeModel> = {
  fresha: {
    name: "Fresha",
    blendedRate: 0.095,
    fixedAnnualSurcharge: 1800,
    feeLabel: "20% new client commissions + processing markup & SMS fees",
  },
  booksy: {
    name: "Booksy",
    blendedRate: 0.085,
    fixedAnnualSurcharge: 1500,
    feeLabel: "$29.99/mo + $20/chair/mo + marketplace commissions",
  },
  mindbody: {
    name: "Mindbody",
    blendedRate: 0.105,
    fixedAnnualSurcharge: 2400,
    feeLabel: "$159–$699/mo subscription tiers + client marketplace cut",
  },
  vagaro: {
    name: "Vagaro",
    blendedRate: 0.08,
    fixedAnnualSurcharge: 1200,
    feeLabel: "$25–$85/mo + paid add-ons (forms, SMS packages, cards)",
  },
  square: {
    name: "Square Appointments",
    blendedRate: 0.075,
    fixedAnnualSurcharge: 900,
    feeLabel: "Processing fees + multi-staff subscription tiers",
  },
  phorest: {
    name: "Phorest",
    blendedRate: 0.09,
    fixedAnnualSurcharge: 2100,
    feeLabel: "Multi-year locked subscription contract + heavy SMS billing",
  },
  other: {
    name: "Other Marketplace Platform",
    blendedRate: 0.085,
    fixedAnnualSurcharge: 1800,
    feeLabel: "Average marketplace take rate, processing markup & seat fees",
  },
};

interface RoiCalculatorProps {
  defaultPlatform?: string;
  className?: string;
}

export default function RoiCalculator({
  defaultPlatform = "fresha",
  className,
}: RoiCalculatorProps) {
  const { formatAmount } = useCurrency();
  const [selectedPlatform, setSelectedPlatform] = useState<string>(
    PLATFORM_FEES[defaultPlatform] ? defaultPlatform : "fresha"
  );
  const [monthlyBookings, setMonthlyBookings] = useState<number>(450);
  const [avgTicket, setAvgTicket] = useState<number>(85);
  const [showProposalModal, setShowProposalModal] = useState<boolean>(false);

  const activeModel = PLATFORM_FEES[selectedPlatform] || PLATFORM_FEES.fresha;

  const monthlyGross = monthlyBookings * avgTicket;
  const annualGross = monthlyGross * 12;

  // Platform-specific fee calculation
  const annualFeesLost = Math.round(
    annualGross * activeModel.blendedRate + activeModel.fixedAnnualSurcharge
  );
  const monthlyFeesLost = Math.round(annualFeesLost / 12);
  const threeYearSavings = annualFeesLost * 3;

  const standaloneProposalUrl = `${paths.standalone}?revenue=${monthlyGross}&bookings=${monthlyBookings}&ticket=${avgTicket}&platform=${encodeURIComponent(
    activeModel.name
  )}&savings=${annualFeesLost}&source=roi-calculator`;

  const waMessage = encodeURIComponent(
    `Hi Paulux Team! I ran your ROI Calculator for ${activeModel.name}. My salon does ~${monthlyBookings} bookings/mo at ${formatAmount(
      avgTicket
    )} avg ticket (Gross: ${formatAmount(
      monthlyGross
    )}/mo). We are projected to recover ~${formatAmount(
      annualFeesLost
    )}/yr with a 0% commission standalone deployment. Let's talk!`
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-xl md:p-10",
        className
      )}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold tracking-wider text-accent uppercase">
            <Calculator className="size-3.5" />
            <span>Commission Bleed & Proposal Engine</span>
          </div>
          <h3 className="font-serif mt-2 text-2xl font-medium tracking-tight md:text-3xl">
            See how much you lose to marketplace platforms
          </h3>
          <p className="text-muted-foreground mt-1 text-sm max-w-xl">
            Third-party platforms charge 20% on new clients, monthly subscription tiers, and payment processing markups. Select your software to see your net retained capital.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowProposalModal(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-semibold text-accent hover:bg-accent/20 transition-colors self-start md:self-auto shadow-xs"
        >
          <FileText className="size-3.5" />
          <span>View 1-Page Proposal</span>
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-center">
        {/* Sliders & Controls Area */}
        <div className="space-y-6 lg:col-span-7">
          {/* Platform Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Current Booking Platform
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(PLATFORM_FEES).map(([key, item]) => {
                const isSelected = selectedPlatform === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedPlatform(key)}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-left transition-all text-xs font-medium",
                      isSelected
                        ? "border-accent bg-accent/10 text-accent font-semibold shadow-xs ring-1 ring-accent"
                        : "border-border/70 bg-secondary/30 hover:border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-muted-foreground italic">
              Applied model: {activeModel.feeLabel}
            </p>
          </div>

          <div className="space-y-3 rounded-2xl bg-secondary/40 p-5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Estimated Monthly Appointments</label>
              <span className="font-mono text-lg font-bold text-accent">
                {monthlyBookings.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="2500"
              step="25"
              value={monthlyBookings}
              onChange={(e) => setMonthlyBookings(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>50 bookings</span>
              <span>1,250</span>
              <span>2,500+</span>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl bg-secondary/40 p-5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Average Service Ticket Price</label>
              <span className="font-mono text-lg font-bold text-accent">
                {formatAmount(avgTicket)}
              </span>
            </div>
            <input
              type="range"
              min="25"
              max="350"
              step="5"
              value={avgTicket}
              onChange={(e) => setAvgTicket(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatAmount(25)} (Express)</span>
              <span>{formatAmount(150)} (Signature)</span>
              <span>{formatAmount(350)}+ (Luxury Package)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl border border-border/60 p-4">
              <p className="text-xs text-muted-foreground">Monthly Gross Revenue</p>
              <p className="font-serif mt-1 text-xl font-medium">{formatAmount(monthlyGross)}</p>
            </div>
            <div className="rounded-xl border border-border/60 p-4">
              <p className="text-xs text-muted-foreground">Annual Gross Revenue</p>
              <p className="font-serif mt-1 text-xl font-medium">{formatAmount(annualGross)}</p>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-primary via-primary/95 to-[#1a0e1c] p-6 text-primary-foreground shadow-2xl lg:col-span-5 lg:p-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-0.5 text-xs text-primary-foreground/90">
              <Sparkles className="size-3 text-amber-300" />
              <span>Projected Annual Savings</span>
            </div>
            <p className="text-primary-foreground/75 mt-4 text-xs tracking-wide uppercase">
              Annual Fees Lost to {activeModel.name}
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-serif text-4xl font-semibold tracking-tight text-white md:text-5xl">
                {formatAmount(annualFeesLost)}
              </span>
              <span className="text-xs text-primary-foreground/70">/ year</span>
            </div>
            <p className="text-xs text-primary-foreground/60 mt-1">
              (That is roughly{" "}
              <span className="font-semibold text-white">
                {formatAmount(monthlyFeesLost)}/mo
              </span>{" "}
              you surrender to software intermediaries)
            </p>

            <div className="mt-4 rounded-xl border border-primary-foreground/15 bg-black/20 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-primary-foreground/80">3-Year Retained Capital:</span>
                <span className="font-bold text-amber-300">
                  {formatAmount(threeYearSavings)}
                </span>
              </div>
            </div>

            <ul className="mt-6 space-y-2.5 border-t border-primary-foreground/15 pt-5 text-xs text-primary-foreground/85">
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>0% Commission</strong> on all bookings & walk-ins
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>100% of client payments</strong> go straight to your account
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Dedicated deployment</strong> on your own domain
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-8 space-y-3">
            <Button
              asChild
              size="lg"
              className="w-full bg-white text-primary font-semibold hover:bg-neutral-100 shadow-md"
            >
              <Link to={standaloneProposalUrl}>
                Convert to Migration Proposal <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
            <button
              type="button"
              onClick={() => setShowProposalModal(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary-foreground/30 px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
            >
              <FileText className="size-3.5" />
              <span>Instant 1-Page Proposal Breakdown</span>
            </button>
            <a
              href={`https://wa.me/?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary-foreground/20 px-4 py-2 text-xs font-medium text-primary-foreground/80 hover:bg-primary-foreground/10 transition-colors"
            >
              <span>💬 WhatsApp Us This Calculation</span>
            </a>
          </div>
        </div>
      </div>

      {/* 1-Page Proposal Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-background p-6 shadow-2xl md:p-8">
            <button
              type="button"
              onClick={() => setShowProposalModal(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <X className="size-5" />
            </button>

            {/* Proposal Printable Container */}
            <div id="proposal-printable" className="space-y-6">
              <div className="border-b border-border/80 pb-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold tracking-wider text-accent uppercase">
                    <ShieldCheck className="size-3.5" />
                    <span>Paulux Turnkey Proposal</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    REF: PLX-PROP-{new Date().getFullYear()}-{Math.floor(1000 + Math.random() * 9000)}
                  </span>
                </div>
                <h3 className="font-serif mt-3 text-2xl font-bold md:text-3xl text-foreground">
                  Migration & Retained Capital Proposal
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Prepared for salon operators transitioning from {activeModel.name} to a 0% commission dedicated deployment.
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-border/70 bg-secondary/30 p-3">
                  <p className="text-[10px] uppercase text-muted-foreground">Monthly Bookings</p>
                  <p className="font-serif text-lg font-semibold text-foreground mt-0.5">
                    {monthlyBookings.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl border border-border/70 bg-secondary/30 p-3">
                  <p className="text-[10px] uppercase text-muted-foreground">Average Ticket</p>
                  <p className="font-serif text-lg font-semibold text-foreground mt-0.5">
                    {formatAmount(avgTicket)}
                  </p>
                </div>
                <div className="rounded-xl border border-border/70 bg-secondary/30 p-3">
                  <p className="text-[10px] uppercase text-muted-foreground">Monthly Revenue</p>
                  <p className="font-serif text-lg font-semibold text-accent mt-0.5">
                    {formatAmount(monthlyGross)}
                  </p>
                </div>
                <div className="rounded-xl border border-border/70 bg-secondary/30 p-3">
                  <p className="text-[10px] uppercase text-muted-foreground">Annual Revenue</p>
                  <p className="font-serif text-lg font-semibold text-accent mt-0.5">
                    {formatAmount(annualGross)}
                  </p>
                </div>
              </div>

              {/* Financial Comparison Summary */}
              <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wide">
                  <TrendingUp className="size-4" />
                  <span>Financial Impact Summary</span>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Current Surrender to {activeModel.name}:
                    </p>
                    <p className="font-serif text-2xl font-bold text-destructive">
                      {formatAmount(annualFeesLost)} / year
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      ({formatAmount(monthlyFeesLost)}/mo from commissions, subscriptions & processing markups)
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Net Retained with Paulux Dedicated Architecture:
                    </p>
                    <p className="font-serif text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      +{formatAmount(annualFeesLost)} / year
                    </p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                      3-Year Compounded Savings: {formatAmount(threeYearSavings)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Turnkey Inclusions */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Included in Turnkey Migration
                </p>
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-500 shrink-0" />
                    <span>Dedicated deployment on your own domain</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-500 shrink-0" />
                    <span>0% commission on all client bookings & packages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-500 shrink-0" />
                    <span>Full client CSV & formulation notes migration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-500 shrink-0" />
                    <span>Chemical dispensary ml/g backbar tracking</span>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="border-t border-border/80 pt-4 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  <Printer className="size-3.5" />
                  <span>Print / Save as PDF</span>
                </button>

                <div className="flex items-center gap-2">
                  <Button
                    asChild
                    size="sm"
                    className="font-semibold shadow-sm"
                  >
                    <Link
                      to={standaloneProposalUrl}
                      onClick={() => setShowProposalModal(false)}
                    >
                      <Download className="size-3.5 mr-1" />
                      Attach Proposal & Get Quote
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
