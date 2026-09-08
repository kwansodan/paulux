import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  Crown,
  Database,
  FileSpreadsheet,
  FlaskConical,
  Gift,
  Globe,
  Layers,
  MessageSquare,
  Package,
  RotateCcw,
  Scissors,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  UserCheck,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { paths } from "@/router/paths";

/* ------------------------------------------------------------------ */
/* Editorial Row Component                                             */
/* ------------------------------------------------------------------ */

interface RowProps {
  badge: string;
  badgeIcon: LucideIcon;
  title: string;
  subtitle: string;
  body: string;
  bullets: { title: string; desc: string }[];
  vignette: ReactNode;
  reverse?: boolean;
}

function FeatureRow({
  badge,
  badgeIcon: BadgeIcon,
  title,
  subtitle,
  body,
  bullets,
  vignette,
  reverse,
}: RowProps) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      {/* Copy */}
      <div className={reverse ? "md:order-2" : ""}>
        <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-accent uppercase">
          <BadgeIcon className="size-3.5" />
          <span>{badge}</span>
        </div>
        <h3 className="font-serif mt-3 text-3xl font-medium leading-tight md:text-4xl text-foreground">
          {title}
        </h3>
        <p className="text-accent text-sm font-medium mt-1">{subtitle}</p>
        <p className="text-muted-foreground mt-3 text-sm md:text-base leading-relaxed">{body}</p>

        <ul className="mt-6 flex flex-col gap-3.5 border-t border-border/70 pt-5">
          {bullets.map((b) => (
            <li key={b.title} className="flex items-start gap-3 text-sm">
              <span className="bg-accent/10 text-accent mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
                <CheckCircle2 className="size-3.5" />
              </span>
              <div>
                <strong className="text-foreground">{b.title}:</strong>{" "}
                <span className="text-muted-foreground">{b.desc}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Mock Visual Vignette */}
      <div className={reverse ? "md:order-1" : ""} aria-hidden="true">
        {vignette}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mock Vignettes — Styled UI Previews                                 */
/* ------------------------------------------------------------------ */

const cardBase =
  "bg-card border border-border/80 rounded-3xl shadow-[var(--shadow-lift)] transition-transform duration-300 hover:-translate-y-1";

/** 1. Booking Engine & Sticky Cart Vignette */
function BookingEngineVignette() {
  return (
    <div className={`${cardBase} mx-auto max-w-md p-6 space-y-4`}>
      {/* Step Progress Tracker */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3 text-xs">
        <span className="font-bold text-accent">1. Details ✓</span>
        <span className="font-bold text-accent">2. Services ✓</span>
        <span className="font-bold text-foreground bg-secondary px-2 py-0.5 rounded-md">3. Calendar</span>
        <span className="text-muted-foreground">4. Payment</span>
      </div>

      {/* Smart Autofill Pill */}
      <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 px-3.5 py-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
        <span className="flex items-center gap-1.5">
          <Sparkles className="size-3.5" /> Device Memory: Auto-filled for Elena R.
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider">Saved</span>
      </div>

      {/* Booking Slot Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Friday, October 24</span>
          <span>Chair Capacity: 3/4 Available</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
          <div className="border border-border/70 text-muted-foreground line-through p-2.5 text-center rounded-xl bg-secondary/50">10:00 AM</div>
          <div className="bg-primary text-primary-foreground p-2.5 text-center rounded-xl shadow-sm">11:30 AM</div>
          <div className="border border-border p-2.5 text-center rounded-xl hover:border-accent">02:00 PM</div>
        </div>
      </div>

      {/* Sticky Mobile Cart Drawer Simulation */}
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-1.5"><ShoppingBag className="size-3.5 text-accent" /> Bundled Cart (2 Items)</span>
          <span className="text-accent font-mono">$165.00</span>
        </div>
        <div className="text-[11px] text-muted-foreground flex justify-between">
          <span>• Balayage Color & Cut</span>
          <span>$140.00</span>
        </div>
        <div className="text-[11px] text-muted-foreground flex justify-between">
          <span>• Take-Home Keratin Serum (Retail)</span>
          <span>$25.00</span>
        </div>
        <div className="border-t border-accent/20 pt-2 flex items-center justify-between text-xs font-medium">
          <span className="text-muted-foreground">Deposit Required (Hold Slot):</span>
          <span className="font-bold text-foreground">$50.00</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
        <span className="flex items-center gap-1"><CalendarCheck className="size-3 text-emerald-500" /> Universal .ics Calendar Invite Included</span>
      </div>
    </div>
  );
}

/** 2. Consumables & Chemical Material Accounting Vignette (The Big Differentiator) */
function ConsumablesVignette() {
  return (
    <div className={`${cardBase} mx-auto max-w-md p-6 space-y-4`}>
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 p-2 rounded-xl">
            <FlaskConical className="size-4" />
          </span>
          <div>
            <h4 className="font-serif font-medium text-sm">Back-of-House Dispensation</h4>
            <p className="text-[11px] text-muted-foreground">Hair Color Lab · Station #3</p>
          </div>
        </div>
        <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
          Cost Logged
        </span>
      </div>

      {/* Itemized Materials by ml and grams */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between rounded-xl bg-secondary/40 p-2.5">
          <div>
            <p className="font-semibold text-foreground">Wella Illumina 7/81 Blonde</p>
            <p className="text-[10px] text-muted-foreground">Unit: $0.18 / g · Batch #B-409</p>
          </div>
          <div className="text-right">
            <span className="font-mono font-bold text-foreground">45 grams</span>
            <p className="text-[10px] text-accent">$8.10 cost</p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-secondary/40 p-2.5">
          <div>
            <p className="font-semibold text-foreground">Welloxon 20-Vol Developer</p>
            <p className="text-[10px] text-muted-foreground">Unit: $0.04 / ml · Large Backbar</p>
          </div>
          <div className="text-right">
            <span className="font-mono font-bold text-foreground">60 ml</span>
            <p className="text-[10px] text-accent">$2.40 cost</p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-secondary/40 p-2.5">
          <div>
            <p className="font-semibold text-foreground">Olaplex No. 1 Bond Multiplier</p>
            <p className="text-[10px] text-muted-foreground">Unit: $0.85 / ml · Dispensary</p>
          </div>
          <div className="text-right">
            <span className="font-mono font-bold text-foreground">7.5 ml</span>
            <p className="text-[10px] text-accent">$6.38 cost</p>
          </div>
        </div>
      </div>

      {/* Cost Snapshot Summary */}
      <div className="rounded-2xl border border-border/80 bg-secondary/20 p-3 flex items-center justify-between text-xs">
        <div>
          <span className="text-muted-foreground block text-[10px] uppercase tracking-wider font-semibold">Service Price: $180.00</span>
          <span className="font-semibold text-foreground">Total Material Cost: $16.88</span>
        </div>
        <div className="text-right">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-sm">90.6% Net Margin</span>
          <span className="text-[10px] text-muted-foreground block">Locked Snapshot</span>
        </div>
      </div>
    </div>
  );
}

/** 3. Automated Retention & 5-Star Booster Vignette */
function AutomationVignette() {
  return (
    <div className={`${cardBase} mx-auto max-w-md p-6 space-y-4`}>
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
          <Zap className="size-3.5" /> Automated Retention Engine
        </span>
        <span className="text-[11px] text-muted-foreground">Runs 24/7</span>
      </div>

      {/* 60-Day Win-Back Trigger */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-amber-700 dark:text-amber-300">60-Day Win-Back SMS Triggered</span>
          <span className="text-[10px] text-muted-foreground">Auto-Sent</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed bg-card/80 p-2.5 rounded-xl border border-border/60 font-sans">
          "Hi Sophia! It's been 8 weeks since your last balayage at Maison. We reserved $20 off your refresh this week: [1-Click Rebook Link]"
        </p>
        <div className="flex items-center justify-between text-[11px] text-amber-700 dark:text-amber-300 font-medium pt-1">
          <span>Client: Sophia M. ($940 LTV)</span>
          <span className="font-bold">Converted in 18 mins</span>
        </div>
      </div>

      {/* Google Review Booster */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
            <Star className="size-3.5 fill-amber-400 text-amber-400" /> Google 5-Star Review Booster
          </span>
          <span className="text-[10px] text-emerald-600 font-bold">+48 Reviews This Month</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Sent 90 mins post-appointment. Prompts happy clients directly to your Google Business Profile with 1 click.
        </p>
      </div>
    </div>
  );
}

/** 4. Stylist Mobile Portal & Granular Multi-Assignment Vignette */
function StylistPortalVignette() {
  return (
    <div className={`${cardBase} mx-auto max-w-md p-6 space-y-4`}>
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent text-xs">
            MR
          </div>
          <div>
            <p className="font-medium text-xs text-foreground">Maya R. · Senior Colorist</p>
            <p className="text-[10px] text-muted-foreground">Stylist Mobile Portal (/stylist)</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
          $380 Commission Today
        </span>
      </div>

      {/* Multi-Stylist Assignment breakdown */}
      <div className="rounded-2xl border border-border/80 bg-secondary/30 p-3 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-foreground">Appointment #1082 · 2 Stylists Split</span>
          <span className="text-accent">$260 Total</span>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between rounded-lg bg-card p-2 border border-border/60">
            <span className="font-medium text-foreground">1. Full Foil Highlight</span>
            <span className="text-accent font-semibold">Maya R. (Assigned)</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-card p-2 border border-border/60">
            <span className="font-medium text-foreground">2. Luxury Gel Manicure</span>
            <span className="text-muted-foreground">Chloe T. (Assigned)</span>
          </div>
        </div>
      </div>

      {/* Technical Formula CRM Quick Note */}
      <div className="rounded-2xl border border-border/70 bg-card p-3 text-xs space-y-1">
        <div className="flex items-center justify-between font-semibold text-foreground">
          <span>Client Technical Note (Elena R.)</span>
          <span className="bg-destructive/10 text-destructive text-[10px] px-1.5 py-0.5 rounded font-bold">Allergy: Ammonia</span>
        </div>
        <p className="text-[11px] text-muted-foreground font-mono bg-secondary/50 p-2 rounded-lg">
          Formula: Redken Shades EQ 09V (30g) + 09P (15g) + Processing Solution (45ml). Process 20m.
        </p>
      </div>
    </div>
  );
}

/** 5. Front Desk Walk-In & Audit Trail Vignette */
function FrontDeskCalendarVignette() {
  return (
    <div className={`${cardBase} mx-auto max-w-md p-6 space-y-4`}>
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-accent" />
          <h4 className="font-serif font-medium text-sm">Front-Desk Coordination Hub</h4>
        </div>
        <span className="bg-accent text-accent-foreground px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1">
          <Zap className="size-3" /> 15s Walk-In Mode
        </span>
      </div>

      {/* Fast Walk-In Check In simulation */}
      <div className="rounded-2xl bg-secondary/40 p-3 space-y-2 text-xs">
        <div className="flex items-center justify-between font-semibold">
          <span>Walk-In Check-In</span>
          <span className="text-emerald-600 font-bold">Auto-Profile Created</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-card p-2 rounded-lg border border-border/60">Client: Marcus Vance</div>
          <div className="bg-card p-2 rounded-lg border border-border/60">Service: Signature Fade</div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
          <span>Payment: Cash Recorded ($45.00)</span>
          <span>Status: Chair #2 Assigned</span>
        </div>
      </div>

      {/* Audit Trail Log */}
      <div className="space-y-1.5 text-xs">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Real-Time Audit Trail</p>
        <div className="space-y-1 text-[11px] font-mono text-muted-foreground">
          <div className="flex justify-between border-b border-border/40 py-1">
            <span>[10:42 AM] Walk-In Added</span>
            <span className="text-foreground">Receptionist Dave</span>
          </div>
          <div className="flex justify-between border-b border-border/40 py-1">
            <span>[10:30 AM] Rescheduled to 3 PM</span>
            <span className="text-emerald-600">Client Self-Service</span>
          </div>
          <div className="flex justify-between py-1">
            <span>[09:15 AM] $50 Deposit Paid</span>
            <span className="text-accent">Paystack Webhook</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 6. Financial Analytics & Fee Surcharge Pass-Through Vignette */
function FinancialAnalyticsVignette() {
  return (
    <div className={`${cardBase} mx-auto max-w-md p-6 space-y-4`}>
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <h4 className="font-serif font-medium text-sm">Executive Financial Dashboard</h4>
          <p className="text-[11px] text-muted-foreground">Real-Time Cash Flow Breakdown</p>
        </div>
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
          <FileSpreadsheet className="size-3" /> Export CSV
        </Button>
      </div>

      {/* Realized Revenue vs Future Deposits */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-2xl border border-border/80 bg-secondary/30 p-3">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Realized Today</span>
          <span className="font-serif text-2xl font-bold text-foreground mt-1 block">$2,840.00</span>
          <span className="text-[10px] text-emerald-600 font-semibold">18 Completed Appts</span>
        </div>
        <div className="rounded-2xl border border-border/80 bg-secondary/30 p-3">
          <span className="text-[10px] uppercase font-bold text-accent tracking-wider block">Pre-Paid Deposits</span>
          <span className="font-serif text-2xl font-bold text-accent mt-1 block">$1,450.00</span>
          <span className="text-[10px] text-muted-foreground">For Next 7 Days</span>
        </div>
      </div>

      {/* Surcharge Convenience Fee Shield */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-1 text-xs">
        <div className="flex items-center justify-between font-bold text-emerald-700 dark:text-emerald-300">
          <span className="flex items-center gap-1.5"><ShieldCheck className="size-3.5" /> Processing Surcharge Pass-Through</span>
          <span>Active</span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Online payment gateway fees (1.95%) passed transparently to checkout convenience fee. You keep 100% of service prices.
        </p>
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
        <span>Payment Mix: 68% Card · 22% MoMo · 10% Cash</span>
        <span className="font-semibold text-foreground">Dual Gateway Failover: Ready</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The 12 Comprehensive Pillars Matrix Data                           */
/* ------------------------------------------------------------------ */

const ALL_12_PILLARS = [
  {
    num: "01",
    icon: ShoppingBag,
    title: "Online Booking Engine",
    category: "Client Experience",
    points: [
      "Mobile-first 4-step booking wizard with category tabs & search",
      "Smart device memory auto-fills repeat clients' details",
      "7-column calendar grid with live chair & capacity slot generation",
      "Sticky mobile cart drawer for bundling services + take-home retail",
      "Universal .ics calendar invites (Apple, Google, Outlook)",
      "Self-service client reschedule portal with live status badges",
    ],
  },
  {
    num: "02",
    icon: ShieldCheck,
    title: "Deposit Enforcer & Shield",
    category: "Revenue Protection",
    points: [
      "Flexible deposit modes: 100% full payment or fixed GHS/USD deposit",
      "Service & package overrides for high-ticket or VIP treatments",
      "Dual Paystack integration with automated failover & webhook checks",
      "Convenience fee surcharge pass-through (never eat gateway fees)",
      "Manual front-desk payment tracking: Cash, POS, MoMo, Bank Transfer",
    ],
  },
  {
    num: "03",
    icon: Calendar,
    title: "Front-Desk Operations",
    category: "Salon Operations",
    points: [
      "Interactive multi-view calendar (Day, Week, Room, Capacity views)",
      "Real-time chair & room capacity limit enforcement (zero double bookings)",
      "Fast 15-second walk-in booking mode with auto-client profiling",
      "Custom blackout dates & holiday locks for salon closures",
      "Full timestamped audit trail tracking every edit & cancellation reason",
    ],
  },
  {
    num: "04",
    icon: Users,
    title: "Dedicated Stylist Portal",
    category: "Team Management",
    points: [
      "Independent mobile portal (/stylist) with private daily rosters",
      "Granular multi-stylist assignment per service in the same booking",
      "Role-Based Access Control: Super Admin, Admin, Stylist, Front-Desk",
      "1-click credential generator & clipboard copy for fast onboarding",
      "Safe staff deactivation preserving historical financial logs",
    ],
  },
  {
    num: "05",
    icon: Gift,
    title: "Digital Gift Cards Engine",
    category: "Cash Injections",
    points: [
      "Public digital gift card storefront (/gift-cards) with branded card builder",
      "Instant recipient delivery via Email, SMS, or Both with custom message",
      "Partial redemption: remaining balances auto-deduct over multiple visits",
      "Instant real-time balance lookup for clients and front-desk staff",
      "Package gifting for full bundles or monetary amounts",
    ],
  },
  {
    num: "06",
    icon: Tag,
    title: "Promo Codes & Campaigns",
    category: "Promotions",
    points: [
      "Percentage discounts (e.g. 20% off) or fixed amount vouchers",
      "Usage controls: maximum redemptions, expiry dates, minimum order totals",
      "Campaign revenue attribution tracking per promo code",
      "Targeted slow-day promos to boost off-peak appointment volume",
    ],
  },
  {
    num: "07",
    icon: Package,
    title: "Retail POS & Inventory",
    category: "Retail Sales",
    points: [
      "Complete retail catalog with SKU numbers, cost prices, and retail pricing",
      "Automated stock movement ledger: Stock-In, Stock-Out, returns, adjustments",
      "Auto-deducts inventory when clients buy products or book take-home bundles",
      "Configurable low-stock alert badges and reorder notifications",
    ],
  },
  {
    num: "08",
    icon: FlaskConical,
    title: "Back-of-House Consumables",
    category: "Enterprise Differentiator",
    points: [
      "Tracks professional backbar supplies (dyes, bleaches, acrylics, developer)",
      "Precise measurement by milliliters (ml), grams (g), bottles, or pieces",
      "Department cost centers (Hair Dept, Nail Bar, Barbershop, MedSpa)",
      "Historical snapshot cost accounting locks exact unit cost at dispensation",
      "100% accurate net profit and loss reporting per service rendered",
    ],
  },
  {
    num: "09",
    icon: Zap,
    title: "Automated Messaging & Win-Back",
    category: "Automated Growth",
    points: [
      "Instant multi-channel SMS & Email booking confirmations",
      "Multi-tier reminder schedule (24h before & 2h before) with deduplication",
      "Automated 30, 60, and 90-day win-back engine for lapsed clients",
      "Google Review 5-star booster with 1-click review link post-appointment",
    ],
  },
  {
    num: "10",
    icon: Crown,
    title: "Client CRM & Formula Records",
    category: "Client Relationship",
    points: [
      "Searchable client visit history, preferences, and total lifetime spend (LTV)",
      "VIP client tagging for priority treatment and high-spender perks",
      "Technical chemical formula notes: exact dye ratios, developer volumes, tones",
      "Allergy, medical, and scalp sensitivity flags with high-visibility warnings",
    ],
  },
  {
    num: "11",
    icon: BarChart3,
    title: "Executive Financial Analytics",
    category: "Business Intelligence",
    points: [
      "Real-time KPI dashboard: Realized Revenue vs Pre-Collected Deposits",
      "Payment breakdown by Online Card, Mobile Money, POS, and Cash",
      "Completed, Pending, No-Show, and Cancellation ratio analysis",
      "1-click CSV/Excel export for accountants, payroll, and tax audits",
    ],
  },
  {
    num: "12",
    icon: Globe,
    title: "White-Label Branding & CMS",
    category: "Brand Sovereignty",
    points: [
      "Dedicated deployment on your custom domain (booking.yourbrand.com)",
      "Dynamic hero showcase with curated photos, video sliders, and lookbooks",
      "SEO-optimized service CMS with FAQs, prep advice, and aftercare guides",
      "Custom salon hours, cancellation terms, and deposit policies",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Main FeatureShowcase Component                                      */
/* ------------------------------------------------------------------ */

export default function FeatureShowcase() {
  return (
    <div className="space-y-28 py-20 md:py-28">
      {/* Introduction Header */}
      <Container className="text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-accent uppercase">
          <Sparkles className="size-3.5" />
          <span>The Full Enterprise Architecture</span>
        </div>
        <h2 className="font-serif mt-4 text-3xl md:text-5xl font-medium leading-tight text-foreground">
          Built for Salons, MedSpas & High-Volume Appointment Studios
        </h2>
        <p className="text-muted-foreground mt-4 text-base md:text-lg leading-relaxed">
          Paulux goes far beyond basic calendar widgets. It delivers an all-in-one commercial engine
          combining frictionless customer booking, backbar consumable accounting, automated win-backs,
          and complete operational independence.
        </p>
      </Container>

      {/* 6 Editorial Deep-Dives */}
      <Container className="flex flex-col gap-28">
        {/* Module 1: Online Booking Engine & No-Show Shield */}
        <FeatureRow
          badge="Pillars 01 & 02 · Booking & Checkout"
          badgeIcon={ShoppingBag}
          title="Frictionless Booking with Guaranteed Upfront Deposits"
          subtitle="Designed to turn website visitors into paid, confirmed appointments 24/7."
          body="Eliminate lost revenue from no-shows and endless phone tag. Your clients book through an intuitive, mobile-first 4-step wizard that saves their details, calculates required deposits, and allows bundling take-home products in a slide-up cart drawer."
          bullets={[
            { title: "Smart Device Memory", desc: "Auto-fills repeat clients' details so they never retype contact info." },
            { title: "Sticky Mobile Cart Drawer", desc: "Bundle multiple service packages and take-home retail in one seamless checkout." },
            { title: "Flexible Deposit Enforcer", desc: "Charge 100% upfront or fixed deposits (e.g. $50) with automated dual gateway failover." },
            { title: "Surcharge Pass-Through", desc: "Option to pass online payment processing fees directly to checkout, saving you thousands." },
            { title: "Universal .ics Invites", desc: "1-click add to Apple Calendar, Google Calendar, or Outlook with self-service rescheduling." },
          ]}
          vignette={<BookingEngineVignette />}
        />

        {/* Module 2: Consumables & Chemical Cost Accounting (The Enterprise Differentiator) */}
        <FeatureRow
          reverse
          badge="Pillar 08 · The Enterprise Differentiator"
          badgeIcon={FlaskConical}
          title="Back-of-House Consumables & Material Cost Accounting"
          subtitle="The only salon software that calculates your real net profit on chemical treatments."
          body="Most salon tools only count retail bottles on shelves. Paulux tracks professional backbar supplies—hair color tubes, bleaches, developer lotions, acrylic powders, and facial serums—down to the exact milliliter (ml) and gram (g)."
          bullets={[
            { title: "Precise ml & gram Tracking", desc: "Measure exact product used per station instead of guessing bottle depletion." },
            { title: "Department Cost Centers", desc: "Issue materials directly to specific divisions (Hair Lab, Nail Bar, MedSpa, Barbershop)." },
            { title: "Historical Snapshot Accounting", desc: "Locks in unit product cost at dispensation for 100% accurate P&L per service." },
            { title: "Consumable Low-Stock Alerts", desc: "Get warned before critical dyes, developers, or treatment vials run out on busy weekends." },
          ]}
          vignette={<ConsumablesVignette />}
        />

        {/* Module 3: Automated Retention & Google Review Booster */}
        <FeatureRow
          badge="Pillars 09 & 10 · Background Automation & CRM"
          badgeIcon={Zap}
          title="Automated 30/60/90-Day Win-Backs & 5-Star Reviews"
          subtitle="Generate recurring revenue on autopilot while dominating local Google Maps search."
          body="Keep chairs filled without lifting a finger. Our background automation monitors client visit frequencies, automatically dispatching personalized re-engagement incentives to lapsed clients while turning happy customers into 5-star Google reviews."
          bullets={[
            { title: "Automated Win-Back Engine", desc: "Detects clients absent for 30, 60, or 90 days and texts targeted incentives." },
            { title: "Google 5-Star Review Booster", desc: "Dispatches direct 1-click review links post-appointment to climb local SEO rankings." },
            { title: "Technical Formula Notes", desc: "Store exact hair color formulas, developer volumes, and toner ratios for flawless re-touching." },
            { title: "Allergy & Scalp Warnings", desc: "High-visibility alerts flag client scalp sensitivities, allergies, and chemical precautions." },
          ]}
          vignette={<AutomationVignette />}
        />

        {/* Module 4: Front-Desk Coordination & 15-Second Walk-Ins */}
        <FeatureRow
          reverse
          badge="Pillar 03 · Floor Operations"
          badgeIcon={Calendar}
          title="Front-Desk Hub with 15-Second Fast Walk-In Mode"
          subtitle="Empower receptionists and floor managers to coordinate a packed salon in real time."
          body="Say goodbye to paper clipboards and scheduling confusion. The interactive multi-view calendar enforces strict chair and room capacity limits to prevent double-booking, while our specialized walk-in mode checks in new clients in under 15 seconds."
          bullets={[
            { title: "Real-Time Capacity Locks", desc: "Automatically locks time slots once maximum concurrent chair capacity is reached." },
            { title: "15-Second Fast Walk-In Mode", desc: "Quickly checks in walk-ins with auto-created customer profiles on the fly." },
            { title: "Blackout Dates & Closures", desc: "Lock out whole days or specific hours for renovations, staff training, or private VIP events." },
            { title: "Timestamped Audit Trail", desc: "Records every booking modification, status change, and cancellation reason for full accountability." },
          ]}
          vignette={<FrontDeskCalendarVignette />}
        />

        {/* Module 5: Stylist Mobile Portal & Multi-Staff Split */}
        <FeatureRow
          badge="Pillar 04 · Team Management"
          badgeIcon={Scissors}
          title="Dedicated Stylist Mobile Portal & Multi-Staff Assignments"
          subtitle="Eliminate scheduling disputes and assign multiple stylists to single appointments."
          body="Give your stylists their own dedicated mobile dashboard (/stylist) to view their daily schedules, client formula notes, and commission tallies. Split multi-service appointments seamlessly across different specialists without messy paperwork."
          bullets={[
            { title: "Dedicated Stylist Portal (/stylist)", desc: "Staff view their personalized daily appointment roster, timings, and formula histories." },
            { title: "Granular Multi-Stylist Split", desc: "Assign Stylist A to Hair Color and Stylist B to Blowout/Nails in a single customer visit." },
            { title: "Role-Based Permissions (RBAC)", desc: "Strict access matrices for Super Admins, Managers, Stylists, and Front-Desk staff." },
            { title: "Safe Staff Deactivation", desc: "Archive departing stylists while preserving all historical financial records and audits." },
          ]}
          vignette={<StylistPortalVignette />}
        />

        {/* Module 6: Executive Financial Analytics & Retail POS */}
        <FeatureRow
          reverse
          badge="Pillars 07, 11 & 12 · Financial Intelligence"
          badgeIcon={BarChart3}
          title="Executive Financial Analytics & Retail POS Management"
          subtitle="Bird's-eye clarity over realized revenue, pre-paid deposits, and retail movement."
          body="Know your true cash flow at all times. Separate today's realized revenue from pre-collected future deposits, track retail product inventory across restocks and sales, and export accountant-ready reports with a single click."
          bullets={[
            { title: "Realized vs Future Deposits", desc: "Separate earned revenue from pre-collected booking deposits for clean accounting." },
            { title: "Retail Inventory POS Ledger", desc: "Tracks SKU movements, sales, restocks, and returns with low-stock warnings." },
            { title: "1-Click CSV / Excel Export", desc: "Instant downloads for bookkeepers, payroll runs, and tax audits." },
            { title: "100% White-Label on Your Domain", desc: "Run your entire business under your own URL with custom lookbooks and branding." },
          ]}
          vignette={<FinancialAnalyticsVignette />}
        />
      </Container>

      {/* Complete 12-Pillar Feature Matrix Grid */}
      <section className="bg-secondary/40 py-24 border-y border-border/60">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent text-xs font-bold tracking-luxe uppercase">Complete Platform Specification</span>
            <h3 className="font-serif mt-2 text-3xl md:text-4xl font-medium text-foreground">
              All 12 Modules Included in Every Standalone Deployment
            </h3>
            <p className="text-muted-foreground mt-3 text-sm md:text-base">
              No hidden add-ons, no locked tiers, and zero third-party commissions. You own the entire operational stack outright.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_12_PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.num}
                  className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-all hover:border-accent/50 hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="bg-accent/10 text-accent p-2.5 rounded-2xl">
                        <Icon className="size-5" />
                      </span>
                      <span className="font-mono text-xs font-bold text-muted-foreground/60">{p.num}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-accent tracking-wider mt-4 block">
                      {p.category}
                    </span>
                    <h4 className="font-serif text-xl font-medium text-foreground mt-1">
                      {p.title}
                    </h4>
                    <ul className="mt-4 space-y-2 border-t border-border/60 pt-4">
                      {p.points.map((pt) => (
                        <li key={pt} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to Action Bar */}
          <div className="mt-16 rounded-3xl bg-brand-wash p-8 md:p-12 text-center text-primary-foreground flex flex-col items-center">
            <h4 className="font-serif text-2xl md:text-4xl font-medium max-w-2xl">
              Ready to deploy this complete operational stack on your own domain?
            </h4>
            <p className="text-primary-foreground/80 mt-3 max-w-xl text-sm md:text-base">
              Turnkey 48-hour onboarding. We migrate your existing client database, services, and staff rosters.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-primary font-bold hover:bg-neutral-100 shadow-lg">
                <Link to={paths.standalone}>
                  Request Turnkey Deployment Quote <ArrowRight className="size-4 ml-1.5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Link to={paths.demo}>Test Live Interactive Demo</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
