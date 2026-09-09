import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Globe,
  Lock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SeoHead } from "@/components/seo/SeoHead";
import FeatureShowcase from "@/components/marketing/FeatureShowcase";
import RoiCalculator from "@/components/marketing/RoiCalculator";
import { CASE_STUDIES } from "@/data/caseStudies";
import { paths } from "@/router/paths";

const PAIN_POINTS = [
  {
    title: "Marketplace Tax (Fresha, Mindbody)",
    points: [
      "20% commission on every new client",
      "Your competitors are advertised right next to you",
      "Clients must create an account on their platform",
      "You rent your software and face perpetual price hikes",
    ],
    bad: true,
  },
  {
    title: "The Paulux Standalone Solution",
    points: [
      "0% commission � keep 100% of your earnings",
      "Runs on your custom domain (booking.yourbrand.com)",
      "Clients stay 100% loyal to your brand only",
      "You own your dedicated deployment and customer database",
    ],
    bad: false,
  },
];

const STEPS = [
  {
    n: "01",
    title: "Consultation & Domain Setup",
    body: "Tell us about your salon. We connect your custom domain and configure your SSL certificates.",
  },
  {
    n: "02",
    title: "Turnkey Data Migration",
    body: "We import your treatment menus, pricing, stylist schedules, and client lists with zero downtime.",
  },
  {
    n: "03",
    title: "Launch & Keep 100% Revenue",
    body: "Start taking appointments and gift card orders directly into your own bank account.",
  },
];

const FAQS = [
  {
    q: "How is Paulux different from SaaS platforms like Fresha, Mindbody, or Booksy?",
    a: "SaaS platforms place your salon inside a crowded marketplace, take up to 20% on new clients, and show competitor ads to your customers. Paulux is a standalone software deployment dedicated exclusively to your salon on your own custom domain (e.g. booking.yourbrand.com). There are 0% booking fees, no marketplace competitors, and you own your data 100%.",
  },
  {
    q: "How much does a standalone deployment cost?",
    a: "We offer tailored turnkey deployments based on your salon's team size and location count. Because there are zero recurring percentage commissions, our clients typically recoup their initial investment within 2 to 4 months compared to what they were paying in marketplace cuts.",
  },
  {
    q: "How long does setup take?",
    a: "Most standalone deployments go live within 48 hours. Our team handles the server provisioning, domain DNS connection, payment gateway integration, and service catalog import.",
  },
  {
    q: "What payment gateways are supported?",
    a: "We support direct integrations with Paystack, Stripe, and other major regional gateways. Payments go directly into your merchant account with zero intermediaries holding your funds.",
  },
  {
    q: "Can clients book from mobile phones easily?",
    a: "Yes! The customer booking wizard is engineered mobile-first. It loads instantly, works beautifully on iPhone and Android browsers with zero app download required, and offers Apple Pay, Google Pay, and card payments.",
  },
];

export default function MarketingLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Paulux Salon Booking Software",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "image": "https://www.pauluxbooking.com/og-cover.png",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2027-12-31",
      "url": "https://www.pauluxbooking.com",
      "description": "Custom standalone deployment quote",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "142",
      "bestRating": "5",
      "worstRating": "1",
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5",
        },
        "author": {
          "@type": "Person",
          "name": "Marcus Vance",
        },
        "reviewBody": "Migrated our 8-chair barbershop from Booksy to Paulux. Saved over $1,200 in monthly fees and walk-ins are up 35%.",
        "datePublished": "2026-03-15",
      },
    ],
  };

  return (
    <>
      <SeoHead
        title="Paulux | Own Your Salon Booking System Outright on Your Own Domain"
        description="Stop paying 20% marketplace commissions. Paulux delivers private, white-label salon booking software deployed on your custom domain with 0% fees and 100% private data."
        keywords="salon booking software, bespoke spa management software, white label salon software, fresha alternative, zero commission booking, private salon software"
        canonicalPath="/"
        schema={homeSchema}
      />

      {/* Hero */}
      <section className="bg-brand-wash text-primary-foreground relative overflow-hidden py-24 md:py-36">
        <Container className="relative flex flex-col items-center gap-7 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs tracking-wider uppercase backdrop-blur-sm">
            <Sparkles className="size-3.5 text-amber-300" />
            <span>Dedicated White-Label Infrastructure</span>
          </div>

          <h1 className="font-serif max-w-4xl text-4xl font-medium leading-[1.08] sm:text-5xl md:text-6xl">
            Stop Paying 20% Commissions. <br />
            <span className="italic text-accent">Own Your Appointment Booking System</span> Outright.
          </h1>

          <p className="text-primary-foreground/80 max-w-2xl text-base sm:text-lg">
            Paulux provisions a dedicated booking platform running on your custom domain for appointment-based businesses — barbershops, aesthetic clinics, salons, tattoo studios, massage therapists, and wellness centers. Keep 100% of your earnings.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button asChild size="lg" className="bg-white text-primary font-semibold hover:bg-neutral-100 shadow-xl">
              <Link to={paths.standalone}>
                Get Your Dedicated System <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to={paths.demo}>Explore Live Demo</Link>
            </Button>
            <a
              href="https://wa.me/?text=Hi%20Paulux%20Team!%20I'm%20interested%20in%20a%20standalone%20booking%20system%20for%20my%20salon."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[#25D366]/40 bg-[#25D366]/15 px-5 py-3 text-sm font-semibold text-white hover:bg-[#25D366]/30 transition-colors"
            >
              ?? Chat on WhatsApp
            </a>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 border-t border-primary-foreground/15 pt-8 text-xs text-primary-foreground/70">
            <div className="flex items-center gap-1.5">
              <Check className="size-4 text-emerald-400" />
              <span>0% Booking Cuts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="size-4 text-emerald-400" />
              <span>Your Own Custom Domain</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="size-4 text-emerald-400" />
              <span>100% Private Database</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="size-4 text-emerald-400" />
              <span>48-Hour Turnkey Deployment</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Pain vs Solution (The SaaS Tax) */}
      <Container className="py-20 md:py-28">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-accent text-xs tracking-luxe uppercase font-semibold">The Industry Shift</p>
          <h2 className="font-serif mt-2 text-3xl md:text-4xl">Why luxury salons are leaving marketplace apps</h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base">
            High-end salons shouldn't surrender client relationships or lose thousands every month to rental software.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {PAIN_POINTS.map((card) => (
            <div
              key={card.title}
              className={`rounded-3xl border p-8 shadow-sm ${
                card.bad
                  ? "border-rose-500/20 bg-rose-500/5 dark:bg-rose-950/10"
                  : "border-accent/40 bg-accent/5 dark:bg-accent/10 shadow-md"
              }`}
            >
              <h3 className={`font-serif text-xl font-medium ${card.bad ? "text-rose-600 dark:text-rose-400" : "text-primary dark:text-accent"}`}>
                {card.title}
              </h3>
              <ul className="mt-6 space-y-3.5">
                {card.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-3 text-sm">
                    {card.bad ? (
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-500 text-xs font-bold mt-0.5">?</span>
                    ) : (
                      <Check className="size-5 shrink-0 text-emerald-500 mt-0.5" />
                    )}
                    <span className={card.bad ? "text-muted-foreground" : "font-medium text-foreground"}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent/10">
            <Link to={paths.freshaAlternative}>Read the Full Fresha vs Paulux Comparison <ArrowRight className="size-4 ml-1.5" /></Link>
          </Button>
        </div>
      </Container>

      {/* Industries & Case Studies Showcase */}
      <section className="bg-secondary/40 py-20 md:py-28 border-y border-border/60">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold tracking-wider text-accent uppercase">
              <Sparkles className="size-3" />
              <span>Multi-Industry Architecture</span>
            </div>
            <h2 className="font-serif mt-3 text-3xl md:text-4xl">
              Powering every business that takes appointments
            </h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base">
              Whether you manage a 7-chair barbershop, a clinical aesthetic practice, or private training studio, Paulux adapts to your exact booking workflow.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CASE_STUDIES.slice(0, 6).map((study) => (
              <div
                key={study.slug}
                className="group flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-all hover:border-accent/60 hover:shadow-lg"
              >
                <div>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-[11px] font-semibold tracking-wider text-accent uppercase">
                    {study.industry}
                  </span>
                  <h3 className="font-serif mt-3 text-lg font-medium text-foreground group-hover:text-accent transition-colors">
                    {study.businessName}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-xs leading-relaxed line-clamp-2">
                    {study.tagline}
                  </p>
                  <div className="mt-4 rounded-xl bg-secondary/60 p-3 text-xs">
                    <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {study.metrics.annualSavings}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border/60">
                  <Link
                    to={`/case-studies/${study.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
                  >
                    <span>Read Case Study</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground font-semibold">
              <Link to={paths.caseStudies}>
                View All Case Studies & Industry Solutions <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Embedded ROI Calculator */}
      <section className="bg-secondary/20 py-20 md:py-28">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Interactive Calculator</p>
            <h2 className="font-serif mt-2 text-3xl md:text-4xl">Calculate your exact annual savings</h2>
            <p className="text-muted-foreground mt-3 text-sm">
              Adjust your salon's monthly appointments and average service ticket to see how much money you reclaim.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <RoiCalculator />
          </div>
        </Container>
      </section>

      {/* Feature Showcase Deep Dive */}
      <FeatureShowcase />

      {/* 3-Step Deployment Process */}
      <section className="bg-secondary/50 py-20 md:py-28">
        <Container>
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Turnkey Deployment</p>
            <h2 className="font-serif mt-2 text-3xl md:text-4xl">Live on your domain in three steps</h2>
            <p className="text-muted-foreground mt-3 text-sm">
              We handle the entire technical orchestration so you can focus on your clients.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="flex flex-col items-center gap-4 rounded-2xl border border-border/70 bg-card p-8 text-center shadow-sm">
                <span className="font-serif flex size-14 items-center justify-center rounded-2xl bg-accent/10 text-accent font-bold text-xl">
                  {s.n}
                </span>
                <h3 className="font-serif text-xl font-medium">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <Container className="py-20 md:py-28 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Got Questions?</p>
          <h2 className="font-serif mt-2 text-3xl md:text-4xl">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-border/80 bg-card p-5 transition-colors shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between text-left font-medium text-base gap-4"
                >
                  <span className="font-serif text-lg">{faq.q}</span>
                  {isOpen ? <ChevronUp className="size-5 shrink-0 text-accent" /> : <ChevronDown className="size-5 shrink-0 text-muted-foreground" />}
                </button>
                {isOpen && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground border-t border-border/60 pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Container>

      {/* Final High-Converting Banner */}
      <section className="bg-brand-wash text-primary-foreground py-20 md:py-28 text-center">
        <Container className="flex flex-col items-center">
          <h2 className="font-serif text-3xl md:text-5xl font-medium max-w-2xl leading-tight">
            Ready to stop paying commissions and own your software?
          </h2>
          <p className="text-primary-foreground/80 mt-4 max-w-xl text-base">
            Get your dedicated Paulux deployment on your custom domain in under 48 hours.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary font-semibold hover:bg-neutral-100 shadow-xl">
              <Link to={paths.standalone}>Request Deployment Quote <ArrowRight className="size-4 ml-1.5" /></Link>
            </Button>
            <a
              href="https://wa.me/?text=Hi%20Paulux!%20I'd%20like%20to%20get%20a%20quote%20for%20a%20standalone%20booking%20system%20for%20my%20salon."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
            >
              ?? WhatsApp Us Now
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
