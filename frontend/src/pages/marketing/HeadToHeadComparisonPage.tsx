import { useParams, Link, Navigate } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SeoHead } from "@/components/seo/SeoHead";
import RoiCalculator from "@/components/marketing/RoiCalculator";
import { paths } from "@/router/paths";
import { HEAD_TO_HEAD_COMPARISONS, COMPETITORS } from "@/data/comparisons";
import CompetitorComparisonPage from "./CompetitorComparisonPage";

export default function HeadToHeadComparisonPage() {
  const { pair } = useParams<{ pair: string }>();
  const activePair = pair || "";

  // If the pair matches an individual competitor (e.g. /compare/fresha or /compare/booksy), render the competitor page directly!
  if (COMPETITORS[activePair]) {
    return <CompetitorComparisonPage forcedSlug={activePair} />;
  }

  const h2h = HEAD_TO_HEAD_COMPARISONS[activePair];

  if (!h2h) {
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
        "@id": `https://www.pauluxbooking.com/compare/${h2h.slug}#webpage`,
        "url": `https://www.pauluxbooking.com/compare/${h2h.slug}`,
        "name": `${h2h.title} | Paulux`,
        "description": h2h.description,
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
              "name": `${h2h.comp1} vs. ${h2h.comp2}`,
              "item": `https://www.pauluxbooking.com/compare/${h2h.slug}`
            }
          ]
        }
      },
      {
        "@type": "Table",
        "name": `${h2h.comp1} vs. ${h2h.comp2} Head-to-Head Comparison Table`,
        "description": `Comparison of pricing models, feature sets, and workflow capabilities between ${h2h.comp1}, ${h2h.comp2}, and Paulux.`,
        "about": `${h2h.comp1} vs ${h2h.comp2}`
      },
      {
        "@type": "FAQPage",
        "mainEntity": h2h.faqs.map((f) => ({
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
        title={`${h2h.title}`}
        description={h2h.description}
        keywords={`${h2h.comp1.toLowerCase()} vs ${h2h.comp2.toLowerCase()}, compare ${h2h.comp1.toLowerCase()} and ${h2h.comp2.toLowerCase()}, salon software comparison, alternative to ${h2h.comp1.toLowerCase()}`}
        canonicalPath={`/compare/${h2h.slug}`}
        schema={schema}
      />

      {/* Hero */}
      <section className="bg-brand-wash text-primary-foreground relative overflow-hidden py-24 md:py-32">
        <Container className="relative flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1.5 text-xs tracking-wider uppercase">
            <Scale className="size-4 text-accent" />
            <span>Head-to-Head Architectural Evaluation</span>
          </div>

          <h1 className="font-serif mt-6 max-w-4xl text-4xl font-medium leading-tight md:text-6xl">
            {h2h.comp1} <span className="italic text-accent">vs.</span> {h2h.comp2}
          </h1>

          {/* Definition-First Semantic Passage Block */}
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-accent/40 bg-accent/10 p-5 text-left backdrop-blur-sm shadow-sm">
            <h2 className="text-accent text-xs font-mono uppercase tracking-wider font-semibold">
              {h2h.definitionPassageTitle}
            </h2>
            <p className="text-primary-foreground/90 mt-1 text-sm sm:text-base leading-relaxed">
              {h2h.definitionPassageBody}
            </p>
          </div>

          <p className="text-primary-foreground/80 mt-5 max-w-2xl text-base md:text-lg">
            {h2h.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary font-semibold hover:bg-neutral-100 shadow-xl">
              <Link to={paths.standalone}>
                Explore The Independent Alternative <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to={paths.demo}>Explore Live Demo</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Executive Summary & The Third-Party Alternative */}
      <Container className="py-16">
        <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Evaluation Loop Context</p>
              <h2 className="font-serif mt-1 text-2xl md:text-3xl font-medium">
                The Battle Between {h2h.comp1} and {h2h.comp2}
              </h2>
              <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
                {h2h.summary}
              </p>
              <div className="mt-6 rounded-xl bg-secondary/40 p-4 border border-border/60">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">The Objective Verdict</p>
                <p className="text-xs md:text-sm text-foreground/90 mt-1.5 leading-relaxed font-medium">
                  {h2h.objectiveTakeaway}
                </p>
              </div>
            </div>

            <div className="w-full md:w-80 rounded-2xl border-2 border-primary/40 bg-primary/5 p-6 text-center shrink-0">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary uppercase tracking-wider">
                The Independent Third Way
              </span>
              <h3 className="font-serif text-2xl font-medium mt-3">Paulux Platform</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Skip the trade-offs of both incumbents. Deploy dedicated software on your custom domain with 0% commissions.
              </p>
              <div className="mt-4 pt-4 border-t border-border/60 text-left space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600" />
                  <span>0% Commission Forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600" />
                  <span>booking.yourbrand.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600" />
                  <span>Chemical Dispensary (ml/g)</span>
                </div>
              </div>
              <Button asChild size="sm" className="w-full mt-5">
                <Link to={paths.standalone}>Deploy Platform</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>

      {/* 3-Way Side-by-Side Comparison Matrix */}
      <Container className="py-12 md:py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Side-by-Side Breakdown</p>
          <h2 className="font-serif mt-2 text-3xl md:text-4xl font-medium">
            {h2h.comp1} vs. {h2h.comp2} vs. Paulux
          </h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base">
            See how the two incumbents compare on key operational terms, and how Paulux eliminates the compromises of both.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border/80 shadow-md">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-border/80 bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-4 font-semibold w-1/4">Key Capability</th>
                <th className="p-4 font-semibold text-foreground w-1/4">{h2h.comp1}</th>
                <th className="p-4 font-semibold text-foreground w-1/4">{h2h.comp2}</th>
                <th className="p-4 font-semibold text-primary font-bold w-1/4 bg-primary/5">Paulux Dedicated Platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {h2h.tableRows.map((row, i) => (
                <tr key={i} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-semibold text-foreground">{row.feature}</td>
                  <td className="p-4 text-muted-foreground">{row.comp1Val}</td>
                  <td className="p-4 text-muted-foreground">{row.comp2Val}</td>
                  <td className="p-4 font-medium text-foreground bg-primary/5 border-x border-primary/10">
                    <div className="flex items-start gap-1.5">
                      <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{row.pauluxVal}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>

      {/* ROI Commission Calculator */}
      <section className="bg-secondary/30 py-16 md:py-24 border-y border-border/60">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Real Financial Impact</p>
            <h2 className="font-serif mt-2 text-3xl md:text-4xl font-medium">
              Calculate What You Lose to Commissions Each Year
            </h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base">
              See the exact annual revenue your salon or studio retains when switching from {h2h.comp1} or {h2h.comp2} to Paulux.
            </p>
          </div>

          <RoiCalculator />
        </Container>
      </section>

      {/* FAQs */}
      <Container className="py-20 md:py-28 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-accent text-xs tracking-luxe uppercase font-semibold">In-Depth Answers</p>
          <h2 className="font-serif mt-2 text-3xl md:text-4xl font-medium">Head-to-Head FAQs</h2>
        </div>

        <div className="space-y-4">
          {h2h.faqs.map((faq) => (
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

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            to={paths.compareHub}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline uppercase tracking-wider"
          >
            <ArrowRight className="size-3.5 rotate-180" />
            <span>Explore All Software Comparisons</span>
          </Link>
        </div>
      </Container>
    </>
  );
}
