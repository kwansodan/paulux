import { useParams, Link, Navigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Scale,
  Sparkles,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SeoHead } from "@/components/seo/SeoHead";
import RoiCalculator from "@/components/marketing/RoiCalculator";
import MigrationAssessmentTool from "@/components/marketing/MigrationAssessmentTool";
import { paths } from "@/router/paths";
import { COMPETITORS } from "@/data/comparisons";

interface CompetitorPageProps {
  forcedSlug?: string;
}

export default function CompetitorComparisonPage({ forcedSlug }: CompetitorPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const activeSlug = forcedSlug || slug || "";
  const comp = COMPETITORS[activeSlug];

  if (!comp) {
    return <Navigate to={paths.compareHub} replace />;
  }

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Paulux",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web, iOS, Android",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "description": "0% booking commission, flat turnkey deployment"
        },
        "featureList": [
          "White-label custom domain booking",
          "Chemical dispensary ml/g tracking",
          "15-second walk-in check-in mode",
          "No marketplace transaction cuts"
        ]
      },
      {
        "@type": "WebPage",
        "@id": `https://www.pauluxbooking.com/versus/${comp.slug}#webpage`,
        "url": `https://www.pauluxbooking.com/versus/${comp.slug}`,
        "name": `${comp.name} Alternative: Detailed 2026 Comparison | Paulux`,
        "description": `Detailed comparison between ${comp.name} and Paulux. Discover 0% commissions, custom domain booking, and backbar chemical dispensary tracking (ml/g).`,
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.pauluxbooking.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Compare Platforms",
              "item": "https://www.pauluxbooking.com/compare"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": `${comp.name} Alternative`,
              "item": `https://www.pauluxbooking.com/versus/${comp.slug}`
            }
          ]
        }
      },
      {
        "@type": "Table",
        "name": `${comp.name} vs. Paulux Granular Comparison Table`,
        "description": `Side-by-side comparison of daily workflows, fee models, and backbar accounting between ${comp.name} and Paulux.`,
        "about": `${comp.name} Comparison`
      },
      {
        "@type": "FAQPage",
        "mainEntity": comp.faqs.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      }
    ]
  };

  return (
    <>
      <SeoHead
        title={`${comp.name} Alternative: The Modern Zero-Commission Platform | Paulux`}
        description={`Thinking of switching from ${comp.name}? Compare fee structures, custom domain booking, backbar chemical dispensary tracking (ml/g), and data privacy side-by-side.`}
        keywords={`${comp.slug} alternative, ${comp.name.toLowerCase()} competitor, switch from ${comp.name.toLowerCase()}, ${comp.name.toLowerCase()} comparison, zero commission salon software`}
        canonicalPath={`/versus/${comp.slug}`}
        schema={schema}
      />

      {/* Hero */}
      <section className="bg-brand-wash text-primary-foreground relative overflow-hidden py-24 md:py-32">
        <Container className="relative flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1.5 text-xs tracking-wider uppercase">
            <Scale className="size-4 text-accent" />
            <span>{comp.badge} Analysis</span>
          </div>

          <h1 className="font-serif mt-6 max-w-4xl text-4xl font-medium leading-tight md:text-6xl">
            The Dedicated <span className="italic text-accent">{comp.name} Alternative</span> for Premier Studios
          </h1>

          {/* Definition-First Semantic Passage Block */}
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-accent/40 bg-accent/10 p-5 text-left backdrop-blur-sm shadow-sm">
            <h2 className="text-accent text-xs font-mono uppercase tracking-wider font-semibold">
              {comp.definitionPassageTitle}
            </h2>
            <p className="text-primary-foreground/90 mt-1 text-sm sm:text-base leading-relaxed">
              {comp.definitionPassageBody}
            </p>
          </div>

          <p className="text-primary-foreground/80 mt-5 max-w-2xl text-base md:text-lg">
            {comp.heroSubheadline}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary font-semibold hover:bg-neutral-100 shadow-xl">
              <Link to={paths.standalone}>
                Deploy Dedicated Platform <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to={paths.demo}>Explore Live Demo</Link>
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-6 text-xs text-primary-foreground/70">
            <span className="flex items-center gap-1.5">
              <Check className="size-4 text-accent" /> 0% Marketplace Commissions
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-4 text-accent" /> Custom Domain (booking.yourbrand.com)
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-4 text-accent" /> 100% Client Data Privacy
            </span>
          </div>
        </Container>
      </section>

      {/* Objective Framing: When Competitor is Better vs. When Paulux is Better */}
      <Container className="py-16">
        <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-10 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Balanced & Transparent Review</p>
            <h2 className="font-serif mt-1 text-2xl md:text-3xl font-medium">Objective Architectural Evaluation</h2>
            <p className="text-muted-foreground text-xs md:text-sm mt-2">
              Every software tool has legitimate trade-offs. We believe in total clarity on when {comp.name} is the right fit versus when Paulux is superior.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Competitor Case */}
            <div className="rounded-xl border border-border/60 bg-secondary/30 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>When {comp.name} is the Right Choice</span>
                </div>
                <p className="mt-3 text-sm text-foreground/90 leading-relaxed italic">
                  "{comp.objectiveEvaluation.competitorBestFor}"
                </p>
                <div className="mt-5 space-y-2 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground/80 uppercase text-[11px]">Primary Advantages:</p>
                  <ul className="space-y-1.5">
                    {comp.objectiveEvaluation.competitorStrengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Paulux Case */}
            <div className="rounded-xl border-2 border-primary/40 bg-primary/5 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  <Sparkles className="size-4" />
                  <span>When Paulux is the Superior Choice</span>
                </div>
                <p className="mt-3 text-sm text-foreground leading-relaxed font-medium">
                  "{comp.objectiveEvaluation.pauluxBestFor}"
                </p>
                <div className="mt-5 space-y-2 text-xs text-foreground/80">
                  <p className="font-semibold text-primary uppercase text-[11px]">Key Differentiators:</p>
                  <ul className="space-y-1.5">
                    {comp.objectiveEvaluation.pauluxStrengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-2 text-foreground/90">
                        <Check className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Granular Feature Parity Sections */}
      <Container className="py-12 md:py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Side-by-Side Analysis</p>
          <h2 className="font-serif mt-2 text-3xl md:text-4xl font-medium">
            {comp.name} vs. Paulux: Granular Feature Parity
          </h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base">
            Inspect every practical daily workflow: backbar chemical dispensary (ml/g), SMS pricing, multi-staff payout splits, and hardware independence.
          </p>
        </div>

        <div className="space-y-10">
          {comp.categories.map((cat, catIdx) => (
            <div key={catIdx} className="overflow-hidden rounded-2xl border border-border/80 shadow-md">
              <div className="bg-secondary/60 px-6 py-4 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-serif text-lg font-medium text-foreground">{cat.category}</h3>
                  <p className="text-xs text-muted-foreground">{cat.description}</p>
                </div>
                <span className="text-[11px] font-semibold text-accent uppercase tracking-wider">
                  Category {catIdx + 1} of {comp.categories.length}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-secondary/20 text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="p-4 font-semibold w-1/3">Capability</th>
                      <th className="p-4 font-semibold text-primary font-bold w-1/3 bg-primary/5">Paulux Dedicated Platform</th>
                      <th className="p-4 font-semibold text-muted-foreground w-1/3">{comp.name}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {cat.features.map((feat, fIdx) => (
                      <tr
                        key={fIdx}
                        className={`transition-colors ${
                          feat.highlight ? "bg-primary/[0.02] hover:bg-primary/[0.05]" : "hover:bg-secondary/20"
                        }`}
                      >
                        <td className="p-4 align-top">
                          <p className="font-semibold text-foreground">{feat.name}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{feat.description}</p>
                        </td>
                        <td className="p-4 align-top font-medium text-foreground bg-primary/5 border-x border-primary/10">
                          <div className="flex items-start gap-2">
                            <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat.paulux}</span>
                          </div>
                        </td>
                        <td className="p-4 align-top text-muted-foreground">
                          <div className="flex items-start gap-2">
                            <X className="size-4 text-rose-500 shrink-0 mt-0.5" />
                            <span>{feat.competitor}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* ROI Commission Calculator */}
      <section className="bg-secondary/30 py-16 md:py-24 border-y border-border/60">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Interactive Calculator</p>
            <h2 className="font-serif mt-2 text-3xl md:text-4xl font-medium">
              Calculate Your Annual Savings vs. {comp.name}
            </h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base">
              Slide your monthly revenue and team size to reveal how much you recover every year with a 0% commission dedicated deployment.
            </p>
          </div>

          <RoiCalculator defaultPlatform={comp.slug} />
        </Container>
      </section>

      {/* Interactive Zero-Downtime Migration Assessment */}
      <section className="py-16 md:py-24 border-b border-border/60 bg-background">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Zero-Downtime Migration</p>
            <h2 className="font-serif mt-2 text-3xl md:text-4xl font-medium">
              Switch from {comp.name} to Paulux in Under 48 Hours
            </h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base">
              Select your salon team size and data assets. Our white-glove migration team handles client CSV imports, formula records, and schedule transitions without a single second of salon downtime.
            </p>
          </div>

          <MigrationAssessmentTool defaultPlatform={comp.slug} />
        </Container>
      </section>

      {/* Rich FAQs */}
      <Container className="py-20 md:py-28 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Migration & Technical FAQs</p>
          <h2 className="font-serif mt-2 text-3xl md:text-4xl font-medium">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {comp.faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-border/80 bg-background overflow-hidden open:border-accent/50 transition-colors shadow-sm"
            >
              <summary className="cursor-pointer list-none p-6 flex items-center justify-between gap-4 font-serif text-lg font-medium text-foreground hover:bg-secondary/20 transition-colors">
                <h3 className="font-serif text-lg font-medium text-foreground">{faq.q}</h3>
                <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180 group-open:text-accent" />
              </summary>
              <p className="px-6 pb-6 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                {faq.a}
              </p>
            </details>
          ))}
        </div>

        {/* Cross-Link Back to Hub */}
        <div className="mt-12 text-center">
          <Link
            to={paths.compareHub}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline uppercase tracking-wider"
          >
            <ArrowRight className="size-3.5 rotate-180" />
            <span>Back to All Software Comparisons</span>
          </Link>
        </div>

        {/* Final CTA */}
        <div className="mt-16 rounded-2xl bg-brand-wash p-8 md:p-12 text-center text-primary-foreground shadow-xl">
          <h3 className="font-serif text-2xl md:text-3xl font-medium">Ready to Migrate from {comp.name}?</h3>
          <p className="text-primary-foreground/80 mt-3 text-sm md:text-base max-w-xl mx-auto">
            Our engineering team migrates your clients, formulas, service tiers, and stylist schedules with zero disruption.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary font-semibold hover:bg-neutral-100">
              <Link to={paths.standalone}>
                Request Migration Quote <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to={paths.demo}>Explore Live Demo</Link>
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
