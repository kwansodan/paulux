import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SeoHead } from "@/components/seo/SeoHead";
import { CASE_STUDIES } from "@/data/caseStudies";
import { paths } from "@/router/paths";
import { useCurrency } from "@/context/CurrencyContext";

export default function IndustryCaseStudyPage() {
  const { localizeText } = useCurrency();
  const { slug } = useParams<{ slug: string }>();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const study = CASE_STUDIES.find((c) => c.slug === slug);

  if (!study) {
    return <Navigate to="/case-studies" replace />;
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": study.heroHeadline,
    "description": study.summary,
    "publisher": {
      "@type": "Organization",
      "name": "Paulux",
      "url": "https://www.pauluxbooking.com",
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.pauluxbooking.com/case-studies/${study.slug}`,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": study.faqs.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a,
      },
    })),
  };

  const combinedSchema = [articleSchema, faqSchema];

  const waMsg = encodeURIComponent(
    `Hi Paulux Team! I read your ${study.industry} case study (${study.businessName}). I'm interested in deploying a similar standalone booking system for my business.`
  );

  return (
    <>
      <SeoHead
        title={`${study.industry} Booking Software Case Study | ${study.businessName} | Paulux`}
        description={study.summary}
        keywords={`${study.industry.toLowerCase()} booking software, appointment scheduling for ${study.industry.toLowerCase()}, own domain booking, ${study.previousPlatform.toLowerCase()} alternative`}
        canonicalPath={`/case-studies/${study.slug}`}
        schema={combinedSchema}
      />

      {/* Breadcrumb Navigation */}
      <div className="border-b border-border/60 bg-secondary/30 py-3.5 text-xs text-muted-foreground">
        <Container className="flex items-center gap-2">
          <Link to={paths.home} className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/case-studies" className="hover:text-foreground">Case Studies</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{study.industry}</span>
        </Container>
      </div>

      {/* Hero Section */}
      <section className="bg-brand-wash text-primary-foreground py-20 md:py-28">
        <Container className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full bg-accent/20 px-3 py-1 font-semibold tracking-wider text-accent uppercase">
              {study.industry}
            </span>
            <span className="text-primary-foreground/70">?? {study.location}</span>
            <span className="text-primary-foreground/70">?? {study.teamSize}</span>
            <span className="text-primary-foreground/70">?? Migrated from {study.previousPlatform}</span>
          </div>

          <h1 className="font-serif mt-6 text-3xl font-medium leading-tight sm:text-4xl md:text-5xl">
            {localizeText(study.heroHeadline)}
          </h1>

          <p className="text-primary-foreground/80 mt-5 text-base md:text-lg leading-relaxed">
            {localizeText(study.summary)}
          </p>

          {/* Metric Dashboard */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-4 backdrop-blur-sm">
              <p className="text-xs text-primary-foreground/70">Commission</p>
              <p className="font-serif text-2xl font-bold text-white mt-1">{study.metrics.commissionSaved}</p>
              <p className="text-[10px] text-emerald-300 mt-0.5">Kept in-house</p>
            </div>
            <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-4 backdrop-blur-sm">
              <p className="text-xs text-primary-foreground/70">No-Shows</p>
              <p className="font-serif text-2xl font-bold text-white mt-1">-90%+</p>
              <p className="text-[10px] text-primary-foreground/70 mt-0.5">{study.metrics.noShowReduction}</p>
            </div>
            <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-4 backdrop-blur-sm">
              <p className="text-xs text-primary-foreground/70">Growth</p>
              <p className="font-serif text-2xl font-bold text-white mt-1">{study.metrics.revenueGrowth.split(" ")[0]}</p>
              <p className="text-[10px] text-primary-foreground/70 mt-0.5">Booking volume</p>
            </div>
            <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-4 backdrop-blur-sm">
              <p className="text-xs text-primary-foreground/70">Annual ROI</p>
              <p className="font-serif text-2xl font-bold text-emerald-300 mt-1">{localizeText(study.metrics.annualSavings).split(" ")[0]}</p>
              <p className="text-[10px] text-primary-foreground/70 mt-0.5">Retained profit</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Case Study Body */}
      <Container className="py-20 md:py-24 max-w-4xl">
        {/* Challenge vs Solution */}
        <div className="space-y-12">
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8 dark:bg-rose-950/10">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500">The Challenge</span>
            <h2 className="font-serif mt-2 text-2xl font-medium text-foreground">
              Why {study.previousPlatform} was hurting {study.businessName}
            </h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base leading-relaxed">
              {localizeText(study.challenge)}
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 dark:bg-emerald-950/10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">The Standalone Solution</span>
            <h2 className="font-serif mt-2 text-2xl font-medium text-foreground">
              Dedicated deployment on their own custom domain
            </h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base leading-relaxed">
              {localizeText(study.solution)}
            </p>
          </div>
        </div>

        {/* Key Features Implemented */}
        <div className="mt-16">
          <h2 className="font-serif text-2xl md:text-3xl font-medium">Key Features Implemented for {study.industry}</h2>
          <div className="mt-6 grid gap-3.5 sm:grid-cols-2">
            {study.keyFeaturesUsed.map((feat) => (
              <div key={feat} className="flex items-start gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
                <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="mt-16 rounded-3xl border border-accent/40 bg-accent/5 p-8 md:p-10 shadow-md">
          <p className="font-serif text-xl md:text-2xl italic leading-relaxed text-foreground">
            "{localizeText(study.testimonial.quote)}"
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground font-serif font-bold text-base">
              {study.testimonial.author[0]}
            </div>
            <div>
              <p className="font-serif font-medium text-base">{study.testimonial.author}</p>
              <p className="text-xs text-muted-foreground">{study.testimonial.role} · {study.businessName}</p>
            </div>
          </div>
        </div>

        {/* Industry FAQs */}
        <div className="mt-16">
          <h2 className="font-serif text-2xl md:text-3xl font-medium mb-6">Frequently Asked Questions for {study.industry}</h2>
          <div className="space-y-4">
            {study.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.q} className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between text-left font-medium text-base gap-4"
                  >
                    <span className="font-serif text-lg">{localizeText(faq.q)}</span>
                    {isOpen ? <ChevronUp className="size-5 shrink-0 text-accent" /> : <ChevronDown className="size-5 shrink-0 text-muted-foreground" />}
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground border-t border-border/60 pt-3">
                      {localizeText(faq.a)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA for this specific industry */}
        <div className="mt-16 rounded-3xl border border-border/80 bg-brand-wash text-primary-foreground p-8 md:p-12 text-center shadow-xl">
          <h2 className="font-serif text-3xl font-medium">Ready to deploy a custom booking system for your {study.industry.toLowerCase()}?</h2>
          <p className="text-primary-foreground/80 mt-3 text-sm md:text-base max-w-xl mx-auto">
            Get your own dedicated deployment with 0% commissions, custom domain, and automated calendar sync in under 48 hours.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary font-semibold hover:bg-neutral-100 shadow-md">
              <Link to={paths.standalone}>Request Deployment Quote <ArrowRight className="size-4 ml-1.5" /></Link>
            </Button>
            <a
              href={`https://wa.me/?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 bg-primary-foreground/10 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-foreground/20 transition-colors"
            >
              ?? WhatsApp About {study.industry}
            </a>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
            <Link to="/case-studies"><ArrowLeft className="size-4 mr-1.5" /> Back to all case studies</Link>
          </Button>
        </div>
      </Container>
    </>
  );
}

