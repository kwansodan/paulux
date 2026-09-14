import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SeoHead } from "@/components/seo/SeoHead";
import MigrationAssessmentTool from "@/components/marketing/MigrationAssessmentTool";
import { paths } from "@/router/paths";

const MIGRATION_FAQS = [
  {
    q: "Will our salon experience any booking downtime during the migration?",
    a: "Absolutely zero. We operate in 'Dual-Run Parallel Mode'. Your current software (Fresha, Booksy, Mindbody, etc.) stays live taking client appointments right up until the cutover morning. Once we verify all client notes, gift cards, and stylist rosters in your private Paulux database, we switch the DNS domain record instantaneously.",
  },
  {
    q: "Can you migrate past chemical color formulas and dispensary notes?",
    a: "Yes. Our engineering team extracts historical color cards, developer ratios, processing times, and client allergy alerts. These are loaded directly into Paulux's dispensary module, giving stylists instant access on their mobile devices.",
  },
  {
    q: "What happens to active bookings, deposits, and unredeemed gift cards?",
    a: "All active future appointments are synced into your new Paulux calendar so no client is double-booked or forgotten. Unredeemed gift card balances and pre-paid packages are imported as account credits for seamless checkout at the front desk.",
  },
  {
    q: "How does our team export data from Fresha, Booksy, or Mindbody?",
    a: "Most platforms allow exporting client lists, appointments, and service menus under Account Settings > Reports > Export CSV. If you prefer white-glove service, our team can guide your salon manager on a 15-minute screen-share or handle standard export ingestion directly.",
  },
  {
    q: "Will our clients need to download a new app or create new accounts?",
    a: "No app download is required. Paulux operates as a progressive web app directly on your custom domain (booking.yourbrand.com). Clients book instantly in under 30 seconds without creating third-party marketplace passwords.",
  },
];

export default function MigrationPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Paulux Salon Software Migration Service",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web, iOS, Android",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "description": "0% commission dedicated deployment with white-glove database migration",
        },
        "featureList": [
          "Zero-downtime database migration",
          "Client CSV and visit history ingestion",
          "Color formula and dispensary transfer",
          "Future appointment sync",
        ],
      },
      {
        "@type": "WebPage",
        "@id": "https://www.pauluxbooking.com/migrate#webpage",
        "url": "https://www.pauluxbooking.com/migrate",
        "name": "Switch to Paulux Salon Software | Zero-Downtime Migration",
        "description": "Switch from Fresha, Booksy, Mindbody, or Vagaro with zero salon downtime. We migrate your clients, past appointments, and color dispensary formulas in under 48 hours.",
      },
      {
        "@type": "FAQPage",
        "mainEntity": MIGRATION_FAQS.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a,
          },
        })),
      },
      {
        "@type": "HowTo",
        "name": "How to Migrate from Legacy Salon Software to Paulux",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Export & Sanitize",
            "text": "Export customer records, service menus, and schedules to CSV, which our ingestion pipeline normalizes.",
          },
          {
            "@type": "HowToStep",
            "name": "Private DB Provisioning",
            "text": "We deploy a dedicated PostgreSQL instance mapped to your custom domain.",
          },
          {
            "@type": "HowToStep",
            "name": "Dual-Run Verification",
            "text": "Keep your legacy software active while managers verify client records and stylist schedules.",
          },
          {
            "@type": "HowToStep",
            "name": "Instant DNS Cutover",
            "text": "Switch live booking to your custom domain with 0% commissions and zero missed appointments.",
          },
        ],
      },
    ],
  };

  return (
    <>
      <SeoHead
        title="Switch to Paulux Salon Software | Zero-Downtime Turnkey Migration"
        description="Switch from Fresha, Booksy, Mindbody, or Vagaro with zero salon downtime. We migrate your clients, appointments, and color dispensary formulas in under 48 hours."
        keywords="switch salon software, migrate from fresha, switch from booksy, mindbody migration service, zero downtime salon software transfer, salon database migration"
        canonicalPath="/migrate"
        schema={schema}
      />

      {/* Hero Section */}
      <section className="bg-brand-wash text-primary-foreground py-20 md:py-28 text-center relative overflow-hidden">
        <Container className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary-foreground uppercase backdrop-blur-xs">
            <RefreshCw className="size-3.5 text-amber-300" />
            <span>Turnkey Zero-Downtime Migration</span>
          </div>

          <h1 className="font-serif mt-4 text-4xl font-medium tracking-tight md:text-6xl max-w-3xl leading-tight">
            Switch to Paulux With Zero Salon Downtime
          </h1>

          <p className="text-primary-foreground/80 mt-4 max-w-2xl text-base md:text-lg leading-relaxed">
            Never lose a client record, chemical color recipe, or future appointment. Our engineering team executes complete database migrations from Fresha, Booksy, Mindbody, or Vagaro in under 48 hours.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-primary-foreground/90 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-4 text-emerald-400" /> 0% Booking Commissions
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-4 text-emerald-400" /> Dedicated PostgreSQL Database
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-4 text-emerald-400" /> Custom Domain Deployment
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-4 text-emerald-400" /> Chemical Dispensary (ml/g) Included
            </span>
          </div>
        </Container>
      </section>

      {/* Interactive Assessment Tool */}
      <Container className="py-16 md:py-24 max-w-5xl -mt-10 relative z-20">
        <MigrationAssessmentTool />
      </Container>

      {/* 4-Step Technical Architecture */}
      <section className="py-16 md:py-24 bg-secondary/30 border-y border-border/60">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-accent text-xs tracking-luxe uppercase font-semibold">
              The Engineering Process
            </p>
            <h2 className="font-serif mt-2 text-3xl md:text-4xl font-medium">
              How We Migrate Your Salon Without Missing a Booking
            </h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base">
              You never have to manually re-type client notes or service menus. Here is how our engineering team handles the heavy lifting:
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
              <div className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent font-serif font-bold text-lg">
                1
              </div>
              <h3 className="font-serif mt-4 text-lg font-semibold">Data Extraction</h3>
              <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                Export your client lists, past visits, and service menus from Fresha, Booksy, or Mindbody. Our parsers clean and normalize your data.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
              <div className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent font-serif font-bold text-lg">
                2
              </div>
              <h3 className="font-serif mt-4 text-lg font-semibold">Private DB Setup</h3>
              <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                We provision an isolated, secure PostgreSQL database and configure your custom domain (e.g. booking.yoursalon.com).
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
              <div className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent font-serif font-bold text-lg">
                3
              </div>
              <h3 className="font-serif mt-4 text-lg font-semibold">Parallel Testing</h3>
              <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                Your existing software stays live taking bookings. Your managers review staff logins, color notes, and future appointment sync.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
              <div className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent font-serif font-bold text-lg">
                4
              </div>
              <h3 className="font-serif mt-4 text-lg font-semibold">Instant Cutover</h3>
              <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                We switch your booking links to your custom domain. Clients experience instant booking with 0% commissions taken.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Migration FAQs */}
      <Container className="py-20 md:py-28 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-accent text-xs tracking-luxe uppercase font-semibold">
            Common Questions
          </p>
          <h2 className="font-serif mt-2 text-3xl md:text-4xl font-medium">
            Frequently Asked Migration Questions
          </h2>
        </div>

        <div className="space-y-4">
          {MIGRATION_FAQS.map((faq) => (
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

        {/* CTA Banner */}
        <div className="mt-16 rounded-3xl bg-brand-wash p-8 md:p-12 text-center text-primary-foreground shadow-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs text-primary-foreground/90">
            <ShieldCheck className="size-3 text-amber-300" />
            <span>48-Hour Turnkey Guarantee</span>
          </div>
          <h3 className="font-serif mt-3 text-2xl md:text-4xl font-medium">
            Ready to Take Full Ownership of Your Salon?
          </h3>
          <p className="text-primary-foreground/80 mt-3 text-sm md:text-base max-w-xl mx-auto">
            Get your dedicated Paulux deployment provisioned on your custom domain with 0% commission fees and complete client privacy.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary font-semibold hover:bg-neutral-100 shadow-md"
            >
              <Link to={paths.standalone}>
                Request Migration Deployment <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to={paths.demo}>Explore Live Demo</Link>
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
