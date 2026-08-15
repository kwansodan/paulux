import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  Clock,
  CreditCard,
  MessageSquare,
  Palette,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { paths } from "@/router/paths";

/* ------------------------------------------------------------------ */
/* Editorial row                                                       */
/* ------------------------------------------------------------------ */

interface RowProps {
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  body: string;
  bullets: string[];
  vignette: ReactNode;
  reverse?: boolean;
}

function FeatureRow({ eyebrow, icon: Icon, title, body, bullets, vignette, reverse }: RowProps) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      {/* Copy — always first in the DOM so it leads on mobile */}
      <div className={reverse ? "md:order-2" : ""}>
        <span className="text-accent inline-flex items-center gap-2 text-xs tracking-luxe uppercase">
          <Icon className="size-4" /> {eyebrow}
        </span>
        <h3 className="font-serif mt-3 text-3xl leading-tight md:text-4xl">{title}</h3>
        <p className="text-muted-foreground mt-4 max-w-md">{body}</p>
        <ul className="mt-6 flex flex-col gap-3">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm">
              <span className="bg-accent/10 text-accent mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
                <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Vignette — decorative */}
      <div className={reverse ? "md:order-1" : ""} aria-hidden="true">
        {vignette}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Vignettes — in-brand CSS/SVG mock UI (no real assets)               */
/* ------------------------------------------------------------------ */

const cardBase =
  "bg-card border border-border/70 rounded-2xl shadow-[var(--shadow-lift)] transition-transform duration-300 hover:-translate-y-1";

function BookingVignette() {
  const slots = [
    { t: "09:00", state: "booked" },
    { t: "10:30", state: "pick" },
    { t: "12:00", state: "open" },
    { t: "14:00", state: "open" },
  ];
  return (
    <div className={`${cardBase} mx-auto max-w-sm p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-xs tracking-luxe uppercase">Thursday</p>
          <p className="font-serif text-2xl">24 April</p>
        </div>
        <span className="bg-[color:var(--sage)] text-[color:var(--sage-foreground)] rounded-full px-3 py-1 text-xs font-medium">
          Confirmed
        </span>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2">
        {slots.map((s) => (
          <div
            key={s.t}
            className={
              s.state === "pick"
                ? "bg-accent text-accent-foreground rounded-lg py-2 text-center text-xs font-medium"
                : s.state === "booked"
                  ? "bg-secondary text-muted-foreground/70 rounded-lg py-2 text-center text-xs line-through"
                  : "border-border/70 text-foreground rounded-lg border py-2 text-center text-xs"
            }
          >
            {s.t}
          </div>
        ))}
      </div>
      <div className="border-border/60 mt-5 flex items-center justify-between border-t pt-4">
        <span className="text-muted-foreground text-sm">Deposit to hold</span>
        <span className="bg-accent/10 text-accent rounded-full px-3 py-1 text-sm font-medium">GHS 50</span>
      </div>
    </div>
  );
}

function PaymentVignette() {
  return (
    <div className={`${cardBase} mx-auto max-w-sm p-6`}>
      <div className="flex items-center justify-between">
        <p className="font-serif text-xl">Receipt</p>
        <span className="text-muted-foreground text-xs tracking-wide">INV-000123</span>
      </div>
      <div className="mt-4 flex flex-col gap-2 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Silk Press</span><span>GHS 200.00</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Deposit paid</span><span className="text-accent">− GHS 50.00</span></div>
      </div>
      <div className="border-border/60 mt-4 flex items-center justify-between border-t pt-4">
        <span className="font-medium">Balance</span>
        <span className="font-serif text-2xl">GHS 150.00</span>
      </div>
      <div className="mt-5 flex items-center gap-2">
        <span className="bg-[color:var(--sage)] text-[color:var(--sage-foreground)] rounded-full px-3 py-1 text-xs font-medium">Paid · Paystack</span>
        <span className="border-border/70 text-muted-foreground rounded-full border px-3 py-1 text-xs">Cash · MoMo</span>
      </div>
    </div>
  );
}

function GrowVignette() {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4">
      {/* Gift card */}
      <div className={`${cardBase} overflow-hidden p-0`}>
        <div className="bg-brand-wash text-primary-foreground flex items-center justify-between p-5">
          <div>
            <p className="text-primary-foreground/60 text-xs tracking-luxe uppercase">Gift card</p>
            <p className="mt-1 font-mono text-lg tracking-widest">GFT-7Q2K</p>
          </div>
          <div className="text-right">
            <p className="text-primary-foreground/60 text-xs">Balance</p>
            <p className="font-serif text-2xl">GHS 120</p>
          </div>
        </div>
      </div>
      {/* Promo + package */}
      <div className="flex flex-wrap gap-3">
        <span className="bg-accent/10 text-accent rounded-full px-4 py-2 text-sm font-medium">WELCOME10 · −10%</span>
        <span className="border-border/70 text-foreground rounded-full border px-4 py-2 text-sm">Bridal package</span>
      </div>
    </div>
  );
}

function BrandVignette() {
  return (
    <div className={`${cardBase} mx-auto max-w-sm overflow-hidden p-0`}>
      {/* Browser chrome */}
      <div className="border-border/60 flex items-center gap-2 border-b px-4 py-3">
        <span className="size-2.5 rounded-full bg-[color:var(--destructive)]/60" />
        <span className="size-2.5 rounded-full bg-[color:var(--accent)]/40" />
        <span className="size-2.5 rounded-full bg-[color:var(--sage)]" />
        <div className="bg-secondary text-muted-foreground ml-3 flex-1 truncate rounded-md px-3 py-1 text-xs">
          yourbrand.com
        </div>
      </div>
      {/* Body */}
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <span className="bg-brand text-brand-foreground font-serif flex size-12 items-center justify-center rounded-full text-lg">
          B
        </span>
        <p className="font-serif text-xl">Your salon, your world</p>
        <div className="flex gap-2">
          <span className="size-6 rounded-full bg-[color:var(--brand)]" />
          <span className="size-6 rounded-full bg-[color:var(--accent)]" />
          <span className="size-6 rounded-full bg-[color:var(--sage)]" />
          <span className="size-6 rounded-full bg-[color:var(--orchid)]" />
        </div>
        <span className="bg-accent text-accent-foreground rounded-full px-5 py-2 text-sm font-medium">Book now</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Compact grid — the rest                                             */
/* ------------------------------------------------------------------ */

const MORE: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Users, title: "Team & roles", body: "Invite staff and grant fine-grained, permission-gated access — everyone sees exactly what they should." },
  { icon: Clock, title: "Hours & availability", body: "Set business hours, block out dates, and cap concurrent bookings so your calendar never overfills." },
  { icon: BarChart3, title: "Reports", body: "See revenue, bookings, and your top services at a glance — know what's working." },
  { icon: MessageSquare, title: "Email & SMS reminders", body: "Automatic confirmations and reminders by email and SMS keep clients showing up." },
];

/* ------------------------------------------------------------------ */
/* Showcase                                                            */
/* ------------------------------------------------------------------ */

export default function FeatureShowcase() {
  return (
    <>
      <Container className="py-24">
        <div className="mb-16 text-center">
          <p className="text-accent text-xs tracking-luxe uppercase">Everything you need</p>
          <h2 className="font-serif mt-2 text-3xl md:text-4xl">One home for your whole business</h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-lg">
            From the first booking to the final receipt — appointments, payments,
            and everything in between, running the way a beautiful salon should.
          </p>
        </div>

        <div className="flex flex-col gap-24">
          <FeatureRow
            eyebrow="Booking"
            icon={CalendarCheck}
            title="Booking that runs itself"
            body="Clients book in a calm, branded flow with live availability. Hold slots with a deposit, let them reschedule themselves, and drop in walk-ins — all on one clear calendar."
            bullets={["Live availability & capacity limits", "Deposits to reduce no-shows", "Self-service reschedule & walk-ins"]}
            vignette={<BookingVignette />}
          />
          <FeatureRow
            reverse
            eyebrow="Payments"
            icon={CreditCard}
            title="Get paid, effortlessly"
            body="Take deposits and balances online through your own Paystack account, or record cash and mobile money by hand. Every payment issues a numbered receipt automatically, and refunds are one click."
            bullets={["Paystack, cash & mobile money", "Automatic invoices & receipts", "Deposits, balances & refunds"]}
            vignette={<PaymentVignette />}
          />
          <FeatureRow
            eyebrow="Grow revenue"
            icon={Sparkles}
            title="Grow every visit"
            body="Sell and redeem gift cards with balances tracked for you, run promo codes, bundle services into packages, and move retail products with inventory that stays in sync."
            bullets={["Gift cards — buy, redeem, track balance", "Promo codes & service packages", "Retail products with live inventory"]}
            vignette={<GrowVignette />}
          />
          <FeatureRow
            reverse
            eyebrow="Your brand"
            icon={Palette}
            title="Unmistakably yours"
            body="Your own domain, your logo and colours, and a lookbook to show off your best work. Clients never leave your world — there's no platform branding in the way."
            bullets={["Your own domain, fully branded", "Your logo, colours & lookbook", "No shared subdomain, no clutter"]}
            vignette={<BrandVignette />}
          />
        </div>
      </Container>

      {/* Everything else */}
      <section className="bg-secondary/50 py-24">
        <Container>
          <div className="mb-12 text-center">
            <p className="text-accent text-xs tracking-luxe uppercase">And the details</p>
            <h2 className="font-serif mt-2 text-3xl">Everything else to run the day</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MORE.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-card flex flex-col gap-3 rounded-2xl border border-border/70 p-6 shadow-[var(--shadow-soft)] transition-transform duration-300 hover:-translate-y-1"
                >
                  <span className="bg-accent/10 text-accent flex size-11 items-center justify-center rounded-xl">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="font-serif text-lg">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.body}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-14 text-center">
            <Button asChild size="lg">
              <Link to={paths.standalone}>Request access <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
