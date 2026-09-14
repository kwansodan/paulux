import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Scale,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SeoHead } from "@/components/seo/SeoHead";
import { paths } from "@/router/paths";
import { COMPETITORS, HEAD_TO_HEAD_COMPARISONS } from "@/data/comparisons";

const CATEGORIES = [
  { id: "all", label: "All Software Platforms" },
  { id: "salons", label: "Hair Salons & Color Bars" },
  { id: "medspas", label: "MedSpas & Aesthetic Clinics" },
  { id: "barbers", label: "Barbershops & Studios" }
];

const MASTER_MATRIX = [
  {
    feature: "New Client Commission",
    category: "Economics",
    fresha: "20% Cut",
    booksy: "Up to 20%",
    mindbody: "0% (Sub only)",
    vagaro: "0% (Sub only)",
    square: "0% (Sub only)",
    phorest: "0% (Sub only)",
    paulux: "0% Always"
  },
  {
    feature: "Monthly Software Fee",
    category: "Economics",
    fresha: "Add-ons",
    booksy: "$30/mo + $20/chair",
    mindbody: "$159-$699+/mo",
    vagaro: "$30/mo + $10/user",
    square: "$0-$69/mo/loc",
    phorest: "$150-$350+/mo",
    paulux: "$0 Monthly Rent"
  },
  {
    feature: "Custom Domain Booking",
    category: "Branding",
    fresha: "Shared fresha.com",
    booksy: "Shared booksy.com",
    mindbody: "mindbodyonline.com",
    vagaro: "vagaro.com",
    square: "square.site",
    phorest: "Widget/App",
    paulux: "booking.yourbrand.com"
  },
  {
    feature: "Dispensary Tracking (ml/g)",
    category: "Clinical/Color",
    fresha: "No (Retail SKU)",
    booksy: "No (Retail SKU)",
    mindbody: "No (Retail SKU)",
    vagaro: "No (Retail SKU)",
    square: "No (Retail SKU)",
    phorest: "Requires 3rd-party",
    paulux: "Native ml/g + Ticket P&L"
  },
  {
    feature: "SMS Reminder Pricing",
    category: "Comms",
    fresha: "High per-text markup",
    booksy: "Credit bundles",
    mindbody: "High tier bundles",
    vagaro: "Credit bundles",
    square: "Marketing add-on",
    phorest: "High per-text fees",
    paulux: "Wholesale (0% markup)"
  },
  {
    feature: "Deposit Enforcer (No-Show)",
    category: "Revenue",
    fresha: "Optional fee",
    booksy: "Card holds",
    mindbody: "Complex add-on",
    vagaro: "Cancellation fee",
    square: "Card on file",
    phorest: "Card on file",
    paulux: "Dual-Gateway Enforcer"
  },
  {
    feature: "Client Cross-Selling Risk",
    category: "Privacy",
    fresha: "High (Rival salons)",
    booksy: "High (Rival barbers)",
    mindbody: "Marketplace feed",
    vagaro: "Directory deals",
    square: "Low",
    phorest: "Low",
    paulux: "Zero (Private database)"
  },
  {
    feature: "Hardware Freedom",
    category: "POS",
    fresha: "Locked Fresha reader",
    booksy: "Booksy reader",
    mindbody: "Locked terminals",
    vagaro: "Vagaro EMV",
    square: "Locked Square POS",
    phorest: "PhorestPay",
    paulux: "Open standard POS"
  }
];

const FAQS = [
  {
    q: "Does Paulux charge commissions on new clients?",
    a: "No. Paulux operates on a 0% booking commission model. Unlike marketplaces that take 20% of your new client revenue, all payments process directly into your Stripe or Paystack merchant account. You keep 100% of every ticket, deposit, and gift card transaction with zero marketplace fees."
  },
  {
    q: "Can Paulux run on my own custom domain?",
    a: "Yes. Every Paulux deployment connects directly to your custom domain (e.g., booking.yourbrand.com) with automated SSL security. Your clients book directly with your brand, eliminating third-party app downloads and preventing competitor salons from advertising on your booking profile."
  },
  {
    q: "How does Paulux handle deposit collection and chargebacks?",
    a: "Paulux includes a native Deposit Enforcer requiring clients to authorize full or partial upfront deposits at checkout. Funds route directly to your merchant gateway with automated 3D Secure fraud protection, minimizing chargeback risks and eliminating no-shows on high-ticket appointment slots."
  },
  {
    q: "When is a marketplace app like Fresha or Booksy better than Paulux?",
    a: "Marketplaces make sense for solo technicians with zero clients and no marketing budget, where a 20% acquisition cut is acceptable. Once a salon has an established brand, surrendering 20% commissions and letting competitor salons advertise on your booking profile becomes extremely costly."
  },
  {
    q: "What makes Paulux chemical dispensary tracking unique compared to other platforms?",
    a: "Legacy salon software only tracks unopened retail product boxes. Paulux integrates a precision chemical dispensary ledger that weighs hair color, bleach powder, and developers down to exact milliliters and grams per bowl, automatically calculating real-time gross margin profit on every completed client ticket."
  }
];

export default function CompareHubPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const competitorList = useMemo(() => Object.values(COMPETITORS), []);
  const headToHeadList = useMemo(() => Object.values(HEAD_TO_HEAD_COMPARISONS), []);

  const filteredCompetitors = useMemo(() => {
    return competitorList.filter((comp) => {
      const matchesSearch =
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.vertical.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedFilter === "all") return true;
      if (selectedFilter === "salons") {
        return ["fresha", "vagaro", "phorest"].includes(comp.slug);
      }
      if (selectedFilter === "medspas") {
        return ["mindbody", "vagaro", "phorest"].includes(comp.slug);
      }
      if (selectedFilter === "barbers") {
        return ["booksy", "square-appointments"].includes(comp.slug);
      }
      return true;
    });
  }, [competitorList, selectedFilter, searchQuery]);

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
        "@id": "https://www.pauluxbooking.com/compare#webpage",
        "url": "https://www.pauluxbooking.com/compare",
        "name": "Salon & Clinic Booking Software Comparison Hub (2026) | Paulux",
        "description": "Comprehensive side-by-side comparison of salon and clinic booking platforms: Fresha, Booksy, Mindbody, Vagaro, Square Appointments, and Phorest vs. Paulux.",
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
            }
          ]
        }
      },
      {
        "@type": "Table",
        "about": "Salon Booking Software Comparison Matrix",
        "name": "Salon Software Feature Parity & Pricing Comparison",
        "description": "Comparison of commission rates, custom domain availability, ml/g chemical tracking, and hardware compatibility across top salon platforms."
      },
      {
        "@type": "FAQPage",
        "mainEntity": FAQS.map((f) => ({
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
        title="Salon & Clinic Booking Software Comparison Hub (2026) | Paulux"
        description="Compare Fresha, Booksy, Mindbody, Vagaro, Square, and Phorest against Paulux. Discover granular feature parity in chemical dispensary tracking (ml/g), SMS pricing, and zero-commission custom domain booking."
        keywords="salon booking software comparison, compare salon software, fresha vs booksy, mindbody alternative, vagaro competitors, phorest alternative, square appointments salon, salon chemical inventory software"
        canonicalPath="/compare"
        schema={schema}
      />

      {/* Hero Header */}
      <section className="bg-brand-wash text-primary-foreground relative overflow-hidden py-20 md:py-28">
        <Container className="relative flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1.5 text-xs tracking-wider uppercase">
            <Scale className="size-4 text-accent" />
            <span>Independent Platform Evaluation Hub</span>
          </div>

          <h1 className="font-serif mt-6 max-w-4xl text-4xl font-medium leading-tight md:text-6xl">
            The Definitive Salon & Clinic <br className="hidden sm:inline" />
            <span className="italic text-accent">Booking Software Comparison</span>
          </h1>

          {/* Definition-First Semantic Passage Block */}
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-accent/40 bg-accent/10 p-5 text-left backdrop-blur-sm shadow-sm">
            <h2 className="text-accent text-xs font-mono uppercase tracking-wider font-semibold">
              What is Paulux?
            </h2>
            <p className="text-primary-foreground/90 mt-1 text-sm sm:text-base leading-relaxed">
              Paulux is a self-hosted, white-label salon booking software deployed on an independent custom domain, designed to replace commission-based platforms like Fresha and Booksy with a 0% transaction-fee architecture.
            </p>
          </div>

          <p className="text-primary-foreground/80 mt-5 max-w-2xl text-base md:text-lg">
            Evaluate marketplace commission cuts, monthly fee creep, and back-of-house daily workflows across all major beauty, wellness, and grooming booking platforms.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary font-semibold hover:bg-neutral-100 shadow-xl">
              <Link to={paths.standalone}>
                Deploy Private Platform <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to={paths.roiCalculator}>Calculate Commission Losses</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Quick Filter & Search Bar */}
      <Container className="py-10 -mt-8 relative z-10">
        <div className="rounded-2xl border border-border/80 bg-background/95 backdrop-blur-md p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                  selectedFilter === cat.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search competitor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-secondary/30 pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </Container>

      {/* Competitor Teardown Grid */}
      <Container className="py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Individual Teardowns</p>
            <h2 className="font-serif mt-1 text-3xl font-medium">Detailed Platform Comparisons</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Select a platform to inspect granular feature parity, daily workflows, and fee structures.
            </p>
          </div>
          <span className="text-xs text-muted-foreground mt-2 md:mt-0">
            Showing {filteredCompetitors.length} platforms
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCompetitors.map((comp) => (
            <div
              key={comp.slug}
              className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {comp.badge}
                  </span>
                  <span className="text-xs font-medium text-accent">{comp.vertical}</span>
                </div>

                <h3 className="font-serif mt-4 text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {comp.name}
                </h3>
                <p className="text-muted-foreground text-xs mt-1 font-medium italic">{comp.tagline}</p>

                <div className="mt-4 rounded-xl bg-secondary/40 p-3 border border-border/40">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Primary Fee Model</p>
                  <p className="text-xs font-medium text-foreground mt-0.5">{comp.primaryFeeModel}</p>
                </div>

                {/* Granular highlights */}
                <div className="mt-4 space-y-2 text-xs">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Paulux Advantage</p>
                  <ul className="space-y-1.5 text-muted-foreground">
                    {comp.objectiveEvaluation.pauluxStrengths.slice(0, 2).map((st, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-foreground/90">
                        <Check className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60">
                <Button asChild variant="outline" className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                  <Link to={`/versus/${comp.slug}`}>
                    <span>Full {comp.name} Teardown</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Head-to-Head Comparison Guides */}
      <section className="bg-secondary/30 py-16 md:py-24 border-y border-border/60">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Competitor vs. Competitor</p>
            <h2 className="font-serif mt-2 text-3xl md:text-4xl font-medium">Head-to-Head Evaluations</h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base">
              Comparing two mainstream platforms? Understand the structural trade-offs of both incumbents and discover why high-volume studios choose Paulux as the independent third-party alternative.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {headToHeadList.map((h2h) => (
              <div
                key={h2h.slug}
                className="rounded-2xl border border-border/80 bg-background p-6 md:p-8 shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
                    <Scale className="size-4" />
                    <span>Evaluation Loop</span>
                  </div>
                  <h3 className="font-serif mt-3 text-2xl font-medium">{h2h.title}</h3>
                  <p className="text-muted-foreground text-xs md:text-sm mt-2 leading-relaxed">
                    {h2h.summary}
                  </p>

                  <div className="mt-6 rounded-xl bg-secondary/40 p-4 border border-border/60">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Key Takeaway</p>
                    <p className="text-xs text-foreground/90 mt-1 leading-relaxed">{h2h.objectiveTakeaway}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60">
                  <Button asChild variant="outline" className="w-full justify-between">
                    <Link to={`/compare/${h2h.slug}`}>
                      <span>View {h2h.comp1} vs. {h2h.comp2} Matrix</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Comprehensive Master Comparison Table */}
      <Container className="py-20 md:py-28">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Granular Feature Parity</p>
          <h2 className="font-serif mt-2 text-3xl md:text-4xl font-medium">Cross-Platform Capabilities Matrix</h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base">
            From backbar chemical tracking to hardware freedom and true client data ownership.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border/80 shadow-md">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-border/80 bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-4 font-semibold min-w-[160px]">Feature</th>
                <th className="p-4 font-semibold text-primary font-bold min-w-[170px] bg-primary/5">Paulux</th>
                <th className="p-4 font-semibold min-w-[120px]">Fresha</th>
                <th className="p-4 font-semibold min-w-[120px]">Booksy</th>
                <th className="p-4 font-semibold min-w-[120px]">Mindbody</th>
                <th className="p-4 font-semibold min-w-[120px]">Vagaro</th>
                <th className="p-4 font-semibold min-w-[120px]">Square</th>
                <th className="p-4 font-semibold min-w-[120px]">Phorest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {MASTER_MATRIX.map((row, i) => (
                <tr key={i} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium text-foreground">
                    <div>{row.feature}</div>
                    <span className="text-[10px] text-muted-foreground uppercase">{row.category}</span>
                  </td>
                  <td className="p-4 font-semibold text-primary bg-primary/5 border-x border-primary/10">
                    <div className="flex items-center gap-1.5">
                      <Check className="size-4 text-emerald-600 shrink-0" />
                      <span>{row.paulux}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{row.fresha}</td>
                  <td className="p-4 text-muted-foreground">{row.booksy}</td>
                  <td className="p-4 text-muted-foreground">{row.mindbody}</td>
                  <td className="p-4 text-muted-foreground">{row.vagaro}</td>
                  <td className="p-4 text-muted-foreground">{row.square}</td>
                  <td className="p-4 text-muted-foreground">{row.phorest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>

      {/* Objective Decision Framework */}
      <section className="bg-secondary/20 py-16 md:py-24 border-t border-border/60">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Balanced & Transparent</p>
            <h2 className="font-serif mt-2 text-3xl font-medium">Which Platform Is Truly Right for You?</h2>
            <p className="text-muted-foreground mt-3 text-sm">
              We believe in honest software recommendations. Here is who each platform serves best:
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {competitorList.map((comp) => (
              <div key={comp.slug} className="rounded-xl border border-border/70 bg-background p-5 text-left">
                <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <span className="text-accent font-serif text-base">{comp.name}</span>
                  <span className="text-[10px] text-muted-foreground font-normal">Best Scenario</span>
                </h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {comp.objectiveEvaluation.competitorBestFor}
                </p>
              </div>
            ))}
            <div className="rounded-xl border-2 border-primary bg-primary/5 p-5 text-left shadow-sm">
              <h4 className="font-semibold text-primary text-sm flex items-center gap-2">
                <span className="text-primary font-serif text-base">Paulux</span>
                <span className="text-[10px] text-primary font-semibold uppercase tracking-wider">The Standard</span>
              </h4>
              <p className="text-xs text-foreground/90 mt-2 leading-relaxed">
                Established, high-performing salons, medspas, and premier barbershops generating consistent revenue who demand 0% commissions, custom domain prestige, patient/client data isolation, and gram/milliliter chemical dispensary accounting.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQs */}
      <Container className="py-20 md:py-28 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Common Questions</p>
          <h2 className="font-serif mt-2 text-3xl md:text-4xl font-medium">Platform Comparison FAQs</h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq) => (
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

        {/* Bottom CTA Box */}
        <div className="mt-16 rounded-2xl bg-brand-wash p-8 md:p-12 text-center text-primary-foreground shadow-xl">
          <h3 className="font-serif text-2xl md:text-3xl font-medium">Ready to Own Your Platform Outright?</h3>
          <p className="text-primary-foreground/80 mt-3 text-sm md:text-base max-w-xl mx-auto">
            Get a tailored deployment quote for your salon, aesthetic clinic, or barbershop. Zero commissions, custom domain, and white-glove migration included.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary font-semibold hover:bg-neutral-100">
              <Link to={paths.standalone}>
                Request Deployment Quote <ArrowRight className="size-4 ml-1.5" />
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
