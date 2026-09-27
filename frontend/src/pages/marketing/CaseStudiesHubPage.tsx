import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Check, Instagram, MapPin, MessageCircle, RefreshCw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SeoHead } from "@/components/seo/SeoHead";
import { CASE_STUDIES } from "@/data/caseStudies";
import { paths } from "@/router/paths";
import { useCurrency } from "@/context/CurrencyContext";

export default function CaseStudiesHubPage() {
  const { localizeText } = useCurrency();
  const polaris = CASE_STUDIES[0];

  const hubSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Paulux Verified Pilot Case Study: Polaris Beauty Lounge",
    "description": "How Polaris Beauty Lounge in Tesano, Accra replaced Fresha with Paulux to eliminate 20% marketplace commissions and take direct Mobile Money deposits on their own domain.",
    "url": "https://www.pauluxbooking.com/case-studies",
  };

  return (
    <>
      <SeoHead
        title="Verified Pilot Salon Case Study | Polaris Beauty Lounge | Paulux"
        description="Discover how Polaris Beauty Lounge in Tesano, Accra deployed Paulux on their own domain, eliminated 20% Fresha marketplace commissions, and automated Mobile Money deposits."
        keywords="polaris beauty lounge case study, salon booking case study accra, fresha alternative ghana, standalone salon software pilot"
        canonicalPath="/case-studies"
        schema={hubSchema}
      />

      {/* Hero */}
      <section className="bg-brand-wash text-primary-foreground py-20 md:py-28 text-center">
        <Container className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1.5 text-xs tracking-wider uppercase">
            <BadgeCheck className="size-3.5 text-emerald-400" />
            <span>Verified Pilot Salon Case Study</span>
          </div>

          <h1 className="font-serif mt-6 max-w-4xl text-4xl font-medium leading-tight md:text-6xl">
            Real Proof from Our <br className="hidden sm:inline" />
            <span className="italic text-accent">Flagship Pilot Salon</span>
          </h1>

          <p className="text-primary-foreground/80 mt-5 max-w-2xl text-base md:text-lg">
            See how Polaris Beauty Lounge in Tesano, Accra replaced Fresha with their own dedicated booking engine to eliminate 20% marketplace commissions, take direct Mobile Money deposits, and own their customer relationships.
          </p>

          {/* Metric Highlights Bar */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl w-full text-left">
            <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-5 backdrop-blur-sm">
              <span className="font-serif text-2xl md:text-3xl font-bold text-emerald-400">0%</span>
              <p className="text-xs text-primary-foreground/75 mt-1">Marketplace Commissions</p>
            </div>
            <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-5 backdrop-blur-sm">
              <span className="font-serif text-2xl md:text-3xl font-bold text-white">MoMo & Card</span>
              <p className="text-xs text-primary-foreground/75 mt-1">Direct Paystack Settlements</p>
            </div>
            <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-5 backdrop-blur-sm">
              <span className="font-serif text-2xl md:text-3xl font-bold text-white">Own Domain</span>
              <p className="text-xs text-primary-foreground/75 mt-1">Zero Competitor Ads</p>
            </div>
            <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-5 backdrop-blur-sm">
              <span className="font-serif text-2xl md:text-3xl font-bold text-amber-300">100%</span>
              <p className="text-xs text-primary-foreground/75 mt-1">Private Client Database</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Flagship Case Study Presentation */}
      <Container className="py-20 md:py-24 max-w-5xl">
        <div className="rounded-3xl border border-border/80 bg-card p-8 md:p-12 shadow-xl">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-accent/15 px-3.5 py-1 text-xs font-semibold text-accent uppercase tracking-wider">
              {polaris.industry}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
              <BadgeCheck className="size-3.5" />
              Verified Pilot Deployment
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5 text-accent" />
              {polaris.location}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <RefreshCw className="size-3.5 text-accent" />
              Migrated from {polaris.previousPlatform}
            </span>
          </div>

          {/* Business Title and Headline */}
          <h2 className="font-serif mt-6 text-3xl md:text-4xl font-medium text-foreground">
            {polaris.businessName}
          </h2>
          <p className="text-accent text-sm md:text-base font-medium mt-1">
            {polaris.tagline}
          </p>

          <p className="text-muted-foreground mt-4 text-sm md:text-base leading-relaxed">
            {localizeText(polaris.summary)}
          </p>

          {/* Real Challenge vs Solution Comparison */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 dark:bg-rose-950/10">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500">The Problem with Fresha</span>
              <p className="text-muted-foreground mt-2 text-xs md:text-sm leading-relaxed">
                {localizeText(polaris.challenge)}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 dark:bg-emerald-950/10">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">The Paulux Deployment</span>
              <p className="text-muted-foreground mt-2 text-xs md:text-sm leading-relaxed">
                {localizeText(polaris.solution)}
              </p>
            </div>
          </div>

          {/* Key Implemented Capabilities */}
          <div className="mt-8 space-y-3">
            <h3 className="font-serif text-lg font-medium text-foreground">
              What Polaris Runs on Paulux:
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {polaris.keyFeaturesUsed.map((feat) => (
                <div key={feat} className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-secondary/30 p-3 text-xs">
                  <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="font-medium text-foreground">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="mt-10 rounded-2xl border border-accent/30 bg-accent/5 p-6 md:p-8">
            <div className="flex items-center gap-1 text-amber-500 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="font-serif text-lg md:text-xl italic text-foreground leading-relaxed">
              "{localizeText(polaris.testimonial.quote)}"
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-accent/20 pt-4 text-xs">
              <div>
                <p className="font-semibold text-foreground">{polaris.testimonial.author}</p>
                <p className="text-muted-foreground">{polaris.testimonial.role}</p>
              </div>
              {polaris.instagram && (
                <a
                  href={polaris.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/10 px-3 py-1 font-semibold text-pink-600 dark:text-pink-400 hover:bg-pink-500/20 transition-colors"
                >
                  <Instagram className="size-3.5" />
                  <span>Verify on Instagram @polarisbeautylounge</span>
                </a>
              )}
            </div>
          </div>

          {/* CTA Actions */}
          <div className="mt-10 flex flex-wrap items-center gap-4 pt-6 border-t border-border/70">
            <Button asChild size="lg" className="font-semibold">
              <Link to={`/case-studies/${polaris.slug}`}>
                <span>Read Detailed Case Study & Workflow</span>
                <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
            {polaris.instagram && (
              <a
                href={polaris.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-secondary transition-colors"
              >
                <Instagram className="size-4 text-pink-500" />
                <span>Visit @polarisbeautylounge</span>
              </a>
            )}
          </div>
        </div>

        {/* Next Pilot / Custom Salon Invitation */}
        <div className="mt-16 rounded-3xl border border-border/80 bg-brand-wash text-primary-foreground p-8 md:p-12 text-center shadow-xl">
          <h3 className="font-serif text-2xl md:text-3xl font-medium">
            Want to be our next salon deployment?
          </h3>
          <p className="text-primary-foreground/80 mt-3 text-sm md:text-base max-w-xl mx-auto">
            We handle everything: custom domain setup, treatment menu upload, staff onboarding, and Mobile Money / card gateway connection in 48 hours. Flat GH₵ 500 / month with 0% commissions.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary font-semibold hover:bg-neutral-100 shadow-md">
              <Link to={paths.standalone}>Request Deployment Quote <ArrowRight className="size-4 ml-1.5" /></Link>
            </Button>
            <a
              href="https://wa.me/?text=Hi%20Paulux!%20I%20saw%20your%20Polaris%20Beauty%20Lounge%20pilot%20and%20want%20to%20deploy%20Paulux%20for%20my%20salon."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 bg-primary-foreground/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-foreground/20 transition-colors"
            >
              <MessageCircle className="size-4" />
              <span>WhatsApp Us Directly</span>
            </a>
          </div>
        </div>
      </Container>
    </>
  );
}
