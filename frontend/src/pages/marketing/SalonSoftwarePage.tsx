import { Link } from "react-router-dom";
import {
  ArrowRight,
  CreditCard,
  FlaskConical,
  Globe,
  Scissors,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SeoHead } from "@/components/seo/SeoHead";
import FeatureShowcase from "@/components/marketing/FeatureShowcase";
import { paths } from "@/router/paths";

const TOP_PILLARS = [
  {
    icon: Shield,
    title: "Zero Booking Commissions (Keep 100%)",
    desc: "Every dollar your clients pay goes directly into your bank account. No marketplace tax, no 20% commission on new clients.",
  },
  {
    icon: FlaskConical,
    title: "Back-of-House Consumables Accounting",
    desc: "The only platform that tracks professional color dyes, bleaches, developer, and serums by exact milliliters (ml) and grams (g) for true net profit margins.",
  },
  {
    icon: Zap,
    title: "Automated 30/60/90-Day Win-Backs",
    desc: "Background automation monitors client return cycles, auto-sending personalized re-engagement incentives to lapsed clients and generating 5-star Google reviews.",
  },
  {
    icon: Scissors,
    title: "Dedicated Stylist Mobile Portal",
    desc: "Stylists get their own private /stylist roster to track daily appointments and client formula histories, with granular multi-stylist service splitting.",
  },
  {
    icon: CreditCard,
    title: "Deposit Enforcer & Fee Surcharging",
    desc: "Enforce fixed or percentage deposits to prevent no-shows, with automated dual gateway failover and optional fee surcharge pass-through.",
  },
  {
    icon: Globe,
    title: "Your Branded Domain & Private Database",
    desc: "Deploy on booking.yourbrand.com with your luxury lookbook. Your client lists and financial history remain 100% private to your business.",
  },
];

export default function SalonSoftwarePage() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Paulux Standalone Salon & Clinic Management Platform",
    "description": "Enterprise white-label salon booking, back-of-house chemical consumable accounting, and automated client retention platform deployed on your custom domain.",
    "brand": {
      "@type": "Brand",
      "name": "Paulux",
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "description": "Turnkey standalone deployment quote upon request.",
    },
  };

  return (
    <>
      <SeoHead
        title="Enterprise Salon Booking & Consumables Accounting Software | Paulux"
        description="The complete standalone salon & clinic platform: 0% commissions, back-of-house chemical consumable tracking (ml/g), automated 30/60/90-day win-backs, dedicated stylist portal, and custom domain deployment."
        keywords="salon booking software, salon chemical inventory, salon consumables tracking, backbar product accounting, salon win back sms automation, white label salon software, dedicated stylist portal, zero commission salon software"
        canonicalPath="/salon-booking-software"
        schema={pageSchema}
      />

      {/* Hero */}
      <section className="bg-brand-wash text-primary-foreground py-24 md:py-32 text-center">
        <Container className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="size-4 text-amber-300" />
            <span>Dedicated Salon & Clinic Infrastructure</span>
          </div>

          <h1 className="font-serif mt-6 max-w-4xl text-4xl font-medium leading-tight md:text-6xl">
            The Complete Enterprise Salon Platform <br />
            <span className="italic text-accent">Deployed on Your Own Domain</span>
          </h1>

          <p className="text-primary-foreground/80 mt-5 max-w-2xl text-base md:text-lg leading-relaxed">
            Stop losing 20% of your revenue to marketplaces and 15% of your margins to unmeasured color backbar waste.
            Paulux combines frictionless online booking, chemical material cost accounting, and automated client win-backs
            into one dedicated software stack.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary font-bold hover:bg-neutral-100 shadow-xl">
              <Link to={paths.standalone}>
                Request Turnkey Deployment <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to={paths.demo}>Explore Live Interactive Demo</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 6 High-Impact Commercial Pillars */}
      <Container className="py-20 md:py-28">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent text-xs tracking-luxe uppercase font-bold">Commercial Advantage</span>
          <h2 className="font-serif mt-2 text-3xl md:text-4xl font-medium text-foreground">
            Engineered for Serious Salon & MedSpa Operators
          </h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base">
            From the front-desk appointment wizard to dispensary chemical measurements and automated Google reviews.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {TOP_PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="group rounded-3xl border border-border/80 bg-card p-8 shadow-sm transition-all hover:border-accent/50 hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-serif mt-5 text-xl font-medium text-foreground">{p.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>

      {/* Full 12-Pillar Feature Deep Dive */}
      <FeatureShowcase />

      {/* Turnkey 48-Hour Onboarding Process */}
      <section className="bg-secondary/40 py-20 md:py-28 border-t border-border/60">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-accent text-xs tracking-luxe uppercase font-bold">White-Glove Migration</span>
            <h2 className="font-serif mt-2 text-3xl md:text-4xl font-medium text-foreground">
              Live on your domain in under 48 hours
            </h2>
            <p className="text-muted-foreground mt-3 text-sm">
              Our engineering team handles your entire migration, DNS configuration, and payment gateway onboarding.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl border border-border/80 bg-card p-7 shadow-sm">
              <span className="font-serif text-3xl font-bold text-accent">01</span>
              <h3 className="font-serif mt-3 text-xl font-medium text-foreground">Domain & Brand Provisioning</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                We connect your custom domain (booking.yourbrand.com), issue SSL security certificates, and apply your salon's brand styling and lookbook photography.
              </p>
            </div>
            <div className="rounded-3xl border border-border/80 bg-card p-7 shadow-sm">
              <span className="font-serif text-3xl font-bold text-accent">02</span>
              <h3 className="font-serif mt-3 text-xl font-medium text-foreground">Catalog & Client Migration</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                We import your treatment menus, stylist rosters, operating hours, and existing client history from Fresha, Phorest, Mindbody, or Excel spreadsheets.
              </p>
            </div>
            <div className="rounded-3xl border border-border/80 bg-card p-7 shadow-sm">
              <span className="font-serif text-3xl font-bold text-accent">03</span>
              <h3 className="font-serif mt-3 text-xl font-medium text-foreground">Payment Gateways & Go-Live</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                We connect your Paystack / Stripe merchant accounts with dual gateway failover, configure deposit rules, test calendar sync, and launch your private system.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Conversion Banner */}
      <section className="bg-brand-wash text-primary-foreground py-20 text-center">
        <Container className="flex flex-col items-center">
          <h2 className="font-serif text-3xl md:text-5xl font-medium max-w-2xl">
            Upgrade your salon to dedicated software
          </h2>
          <p className="text-primary-foreground/80 mt-4 max-w-xl text-base">
            Request a personalized consultation and turnkey deployment quote today.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary font-bold hover:bg-neutral-100 shadow-lg">
              <Link to={paths.standalone}>Request Deployment Quote <ArrowRight className="size-4 ml-1.5" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Link to={paths.demo}>Explore Live Demo</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
