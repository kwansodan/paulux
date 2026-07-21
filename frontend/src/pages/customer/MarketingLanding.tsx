import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarCheck,
  CreditCard,
  Gift,
  Palette,
  TrendingUp,
  Users,
  Check,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { api } from "@/lib/api";
import { paths } from "@/router/paths";

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

const FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: CalendarCheck, title: "Online booking", body: "A calm booking flow with live availability, deposits, and reschedules — on your own branded subdomain." },
  { icon: CreditCard, title: "Payments built in", body: "Take deposits and full payments with your own Paystack account. Manual cash & MoMo too." },
  { icon: Gift, title: "Gift cards", body: "Sell and redeem gift cards, with balances tracked automatically." },
  { icon: TrendingUp, title: "Reports", body: "See revenue, bookings, and your top services at a glance." },
  { icon: Users, title: "Staff & roles", body: "Invite your team with fine-grained, permission-gated access." },
  { icon: Palette, title: "Your brand", body: "Your logo, your colours, your subdomain — your customers never leave your world." },
];

const STEPS = [
  { n: 1, title: "Create your workspace", body: "Sign up in a minute and claim your address — yoursalon.paulux.app." },
  { n: 2, title: "Add your services", body: "Set services, hours, staff, and connect payments." },
  { n: 3, title: "Share your link", body: "Send clients to your page and start taking bookings." },
];

export default function MarketingLanding() {
  const plans = useQuery({
    queryKey: ["plans-public"],
    queryFn: async () => (await api.get<{ data: Plan[] }>("/api/billing/plans")).data.data,
  });

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-wash text-primary-foreground relative overflow-hidden">
        <Container className="relative flex flex-col items-center gap-7 py-28 text-center md:py-36">
          <span className="text-primary-foreground/70 text-xs tracking-luxe uppercase">
            The booking platform for luxury spas
          </span>
          <h1 className="font-serif max-w-3xl text-5xl leading-[1.05] font-medium md:text-6xl">
            Run a calmer, more beautiful spa business
          </h1>
          <p className="text-primary-foreground/80 max-w-xl text-lg">
            Paulux gives your salon its own branded booking home — appointments,
            payments, and gift cards, all in one elegant place.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild size="lg" className="bg-primary-foreground text-primary hover:brightness-95">
              <Link to={paths.signup}>Start free trial <ArrowRight className="size-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline"
                    className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to={paths.login}>Sign in</Link>
            </Button>
          </div>
          <p className="text-primary-foreground/50 text-xs tracking-wide">
            14-day free trial · no credit card required
          </p>
        </Container>
      </section>

      {/* Features */}
      <Container className="py-24">
        <div className="mb-12 text-center">
          <p className="text-accent text-xs tracking-luxe uppercase">Everything you need</p>
          <h2 className="font-serif mt-2 text-3xl">One home for your whole business</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-card flex flex-col gap-3 rounded-2xl border border-border/70 p-6 shadow-[var(--shadow-soft)]">
                <span className="bg-accent/10 text-accent flex size-11 items-center justify-center rounded-xl">
                  <Icon className="size-5" />
                </span>
                <h3 className="font-serif text-xl">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.body}</p>
              </div>
            );
          })}
        </div>
      </Container>

      {/* How it works */}
      <section className="bg-secondary/50 py-24">
        <Container>
          <div className="mb-12 text-center">
            <p className="text-accent text-xs tracking-luxe uppercase">How it works</p>
            <h2 className="font-serif mt-2 text-3xl">Live in three steps</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="flex flex-col items-center gap-3 text-center">
                <span className="bg-primary text-primary-foreground font-serif flex size-12 items-center justify-center rounded-full text-lg">
                  {s.n}
                </span>
                <h3 className="font-serif text-xl">{s.title}</h3>
                <p className="text-muted-foreground max-w-xs text-sm">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Pricing */}
      <Container className="py-24">
        <div className="mb-12 text-center">
          <p className="text-accent text-xs tracking-luxe uppercase">Pricing</p>
          <h2 className="font-serif mt-2 text-3xl">Simple plans that grow with you</h2>
        </div>
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
          {(plans.data ?? []).map((p, i) => (
            <div key={p.id}
                 className={`flex flex-col gap-4 rounded-2xl border p-6 ${i === 1 ? "border-accent shadow-[var(--shadow-lift)]" : "border-border/70 shadow-[var(--shadow-soft)]"}`}>
              {i === 1 && (
                <span className="bg-accent text-accent-foreground w-fit rounded-full px-3 py-0.5 text-xs">
                  Most popular
                </span>
              )}
              <div>
                <h3 className="font-serif text-2xl">{p.name}</h3>
                <p className="mt-1 text-3xl font-medium">
                  {p.price === 0 ? "Free" : `GHS ${p.price}`}
                  {p.price !== 0 && <span className="text-muted-foreground text-sm font-normal">/mo</span>}
                </p>
              </div>
              <ul className="flex flex-col gap-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="text-accent mt-0.5 size-4 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant={i === 1 ? "default" : "outline"} className="mt-auto">
                <Link to={paths.signup}>Start free trial</Link>
              </Button>
            </div>
          ))}
        </div>
      </Container>

      {/* Final CTA */}
      <section className="bg-brand-wash text-primary-foreground py-24">
        <Container className="text-center">
          <h2 className="font-serif mx-auto max-w-2xl text-4xl leading-tight">
            Give your spa the home it deserves
          </h2>
          <p className="text-primary-foreground/80 mx-auto mt-3 max-w-md">
            Set up in minutes. Your first two weeks are on us.
          </p>
          <Button asChild size="lg" className="bg-primary-foreground text-primary hover:brightness-95 mt-8">
            <Link to={paths.signup}>Create your workspace <ArrowRight className="size-4" /></Link>
          </Button>
        </Container>
      </section>
    </>
  );
}
