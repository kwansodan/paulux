import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SeoHead } from "@/components/seo/SeoHead";
import { CASE_STUDIES } from "@/data/caseStudies";
import { paths } from "@/router/paths";
import { useCurrency } from "@/context/CurrencyContext";

export default function CaseStudiesHubPage() {
  const { localizeText } = useCurrency();

  const hubSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Paulux Appointment Booking Case Studies & Industry Solutions",
    "description": "Real-world case studies showing how barbershops, medspas, hair salons, tattoo studios, and appointment-based businesses save thousands by owning their software on their own domain.",
    "url": "https://www.pauluxbooking.com/case-studies",
  };

  return (
    <>
      <SeoHead
        title="Appointment Booking Software Case Studies | Barbers, MedSpas, Salons & Studios"
        description="See how barbershops, aesthetic clinics, hair studios, tattoo artists, massage therapists, and pet groomers eliminated marketplace commissions and automated appointments with Paulux."
        keywords="salon booking case study, barbershop software case study, medspa appointment software, tattoo studio booking system, white label booking software industries"
        canonicalPath="/case-studies"
        schema={hubSchema}
      />

      {/* Hero */}
      <section className="bg-brand-wash text-primary-foreground py-24 md:py-32 text-center">
        <Container className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1.5 text-xs tracking-wider uppercase">
            <Sparkles className="size-3.5 text-amber-300" />
            <span>Proven Business Impact</span>
          </div>

          <h1 className="font-serif mt-6 max-w-4xl text-4xl font-medium leading-tight md:text-6xl">
            Engineered for Every <br className="hidden sm:inline" />
            <span className="italic text-accent">Appointment-Based Business</span>
          </h1>

          <p className="text-primary-foreground/80 mt-5 max-w-2xl text-base md:text-lg">
            From high-turnover barbershops and clinical medspas to private coaching and tattoo studios â€” see how businesses eliminated 20% marketplace commissions and took total control of their client relationships.
          </p>

          {/* Aggregate Metrics Bar */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl w-full text-left">
            <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-5 backdrop-blur-sm">
              <span className="font-serif text-2xl md:text-3xl font-bold text-white">{localizeText("$240k+")}</span>
              <p className="text-xs text-primary-foreground/75 mt-1">Commissions Saved</p>
            </div>
            <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-5 backdrop-blur-sm">
              <span className="font-serif text-2xl md:text-3xl font-bold text-emerald-400">97.8%</span>
              <p className="text-xs text-primary-foreground/75 mt-1">Show-Up Attendance</p>
            </div>
            <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-5 backdrop-blur-sm">
              <span className="font-serif text-2xl md:text-3xl font-bold text-white">48 Hours</span>
              <p className="text-xs text-primary-foreground/75 mt-1">Turnkey Setup Time</p>
            </div>
            <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-5 backdrop-blur-sm">
              <span className="font-serif text-2xl md:text-3xl font-bold text-amber-300">0%</span>
              <p className="text-xs text-primary-foreground/75 mt-1">Platform Booking Tax</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Case Studies Grid */}
      <Container className="py-20 md:py-28">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Real Results</p>
          <h2 className="font-serif mt-2 text-3xl md:text-4xl">Explore case studies by business type</h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base">
            Click any industry below to see the exact workflow, metrics, and technical setup.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {CASE_STUDIES.map((study) => (
            <div
              key={study.slug}
              className="group flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-7 shadow-sm transition-all hover:border-accent/60 hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold tracking-wider text-accent uppercase">
                    {study.industry}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">{study.location}</span>
                </div>

                <h3 className="font-serif mt-4 text-xl font-medium group-hover:text-accent transition-colors">
                  {study.businessName}
                </h3>
                <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                  {localizeText(study.summary)}
                </p>

                {/* Key Metric Callout */}
                <div className="mt-5 rounded-2xl bg-secondary/40 p-3.5">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <TrendingUp className="size-3.5 text-emerald-500" />
                    <span>Key Outcome:</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {localizeText(study.metrics.annualSavings)}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60">
                <Button asChild variant="outline" className="w-full justify-between text-xs font-semibold group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent">
                  <Link to={`/case-studies/${study.slug}`}>
                    <span>Read Full Case Study</span>
                    <ArrowRight className="size-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Business Inquiries */}
        <div className="mt-16 rounded-3xl border border-border/80 bg-secondary/30 p-8 md:p-12 text-center max-w-4xl mx-auto shadow-sm">
          <h3 className="font-serif text-2xl md:text-3xl font-medium">Don't see your exact business model?</h3>
          <p className="text-muted-foreground mt-3 text-sm max-w-xl mx-auto">
            If your business relies on booking client appointments, managing staff schedules, and collecting payments, Paulux can be configured for your exact workflow.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-primary text-primary-foreground font-semibold">
              <Link to={paths.standalone}>Request Custom Configuration Quote <ArrowRight className="size-4 ml-1.5" /></Link>
            </Button>
            <a
              href="https://wa.me/?text=Hi%20Paulux!%20I%20have%20an%20appointment-based%20business%20and%20want%20to%20see%20if%20Paulux%20is%20a%20fit."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-secondary transition-colors"
            >
              ?? WhatsApp a Specialist
            </a>
          </div>
        </div>
      </Container>
    </>
  );
}

