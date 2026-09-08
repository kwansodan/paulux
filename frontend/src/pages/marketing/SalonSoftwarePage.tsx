import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Check, Clock, CreditCard, Gift, Globe, Layers, Shield, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SeoHead } from "@/components/seo/SeoHead";
import FeatureShowcase from "@/components/marketing/FeatureShowcase";
import { paths } from "@/router/paths";

const PILLARS = [
  {
    icon: Globe,
    title: "Your Own Custom Domain",
    desc: "Run on booking.yourbrand.com or yoursalon.com. No platform URLs or marketplace noise in the way.",
  },
  {
    icon: Shield,
    title: "Zero Booking Commissions",
    desc: "Every dollar your clients pay goes straight into your bank account. No percentage cuts, ever.",
  },
  {
    icon: Users,
    title: "100% Private Client Data",
    desc: "Your client lists, phone numbers, treatment histories, and financials are stored in your own private database.",
  },
  {
    icon: Calendar,
    title: "Instant 2-Way Calendar Sync",
    desc: "Appointments synchronize automatically with Google Calendar so your stylists never double-book.",
  },
  {
    icon: CreditCard,
    title: "Flexible Payment Options",
    desc: "Enforce upfront deposits, full online prepayments, or manual payment tracking at the salon counter.",
  },
  {
    icon: Gift,
    title: "Gift Cards & Loyalty Promos",
    desc: "Sell digital gift cards that can be redeemed instantly during online checkout or in-salon appointments.",
  },
];

export default function SalonSoftwarePage() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Paulux White-Label Salon Booking System",
    "description": "Bespoke, white-label booking and management platform for luxury salons and spas deployed on your custom domain.",
    "brand": {
      "@type": "Brand",
      "name": "Paulux",
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "description": "Bespoke standalone deployment quote upon request.",
    },
  };

  return (
    <>
      <SeoHead
        title="White-Label Salon Booking Software on Your Custom Domain | Paulux"
        description="The premier standalone booking and management platform for luxury salons and spas. Custom domain deployment, zero commissions, and complete data privacy."
        keywords="white label salon booking software, bespoke salon management software, spa appointment scheduling software, luxury salon pos system, self hosted salon booking"
        canonicalPath="/salon-booking-software"
        schema={pageSchema}
      />

      {/* Hero */}
      <section className="bg-brand-wash text-primary-foreground py-24 md:py-32 text-center">
        <Container className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1.5 text-xs tracking-wider uppercase">
            <Sparkles className="size-4 text-amber-300" />
            <span>Dedicated Salon Infrastructure</span>
          </div>

          <h1 className="font-serif mt-6 max-w-4xl text-4xl font-medium leading-tight md:text-6xl">
            Bespoke Salon & Spa Software <br />
            <span className="italic text-accent">Deployed on Your Own Domain</span>
          </h1>

          <p className="text-primary-foreground/80 mt-5 max-w-2xl text-base md:text-lg">
            Stop relying on generic marketplace templates. Paulux gives your brand a dedicated, luxury booking experience with total independence and zero commissions.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary font-semibold hover:bg-neutral-100 shadow-xl">
              <Link to={paths.standalone}>
                Request Your Dedicated System <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to={paths.demo}>Explore Live Demo</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 6 Core Pillars */}
      <Container className="py-20 md:py-28">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Architected for Luxury Salons</p>
          <h2 className="font-serif mt-2 text-3xl md:text-4xl">Everything your salon needs to thrive</h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base">
            From the first client touchpoint to automated SMS reminders and counter checkout.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="group rounded-3xl border border-border/80 bg-card p-8 shadow-sm transition-all hover:border-accent/50 hover:shadow-lg"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <Icon className="size-6" />
                </div>
                <h3 className="font-serif mt-5 text-xl font-medium">{p.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </Container>

      {/* Feature Showcase Deep Dive */}
      <FeatureShowcase />

      {/* Turnkey Setup Process */}
      <section className="bg-secondary/40 py-20 md:py-28">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Effortless Onboarding</p>
            <h2 className="font-serif mt-2 text-3xl md:text-4xl">Live on your domain in 48 hours</h2>
            <p className="text-muted-foreground mt-3 text-sm">
              We handle the entire technical setup, migration, and domain DNS configuration.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
              <span className="font-serif text-3xl font-bold text-accent">01</span>
              <h3 className="font-serif mt-3 text-xl font-medium">Domain & Brand Prep</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                We connect your custom domain, configure SSL certificates, and apply your luxury color palette and typography.
              </p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
              <span className="font-serif text-3xl font-bold text-accent">02</span>
              <h3 className="font-serif mt-3 text-xl font-medium">Catalog & Staff Migration</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                We import your services, pricing, business hours, stylist rosters, and existing client lists.
              </p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
              <span className="font-serif text-3xl font-bold text-accent">03</span>
              <h3 className="font-serif mt-3 text-xl font-medium">Payment & Go-Live</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                We link your payment gateway (Paystack/Stripe) and test calendar syncing. You start accepting 100% commission-free bookings.
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
            <Button asChild size="lg" className="bg-white text-primary font-semibold hover:bg-neutral-100">
              <Link to={paths.standalone}>Request Deployment Quote <ArrowRight className="size-4 ml-1.5" /></Link>
            </Button>
            <a
              href="https://wa.me/?text=Hi%20Paulux!%20I%20would%20like%20to%20learn%20more%20about%20deploying%20Paulux%20for%20my%20salon."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10"
            >
              ?? WhatsApp Us
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
