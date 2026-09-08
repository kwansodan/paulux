import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, ChevronDown, ChevronUp, FlaskConical, Gauge, LineChart, ShieldCheck, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SeoHead } from "@/components/seo/SeoHead";
import { paths } from "@/router/paths";

const FEATURES_BREAKDOWN = [
  {
    title: "Exact Milliliter & Gram Precision",
    desc: "Record bleach powder (g), developer oxidants (ml), gloss shades (ml), and bond rebuilders (ml) down to single increments per bowl.",
    icon: FlaskConical,
  },
  {
    title: "Service Ticket Cost Linking",
    desc: "Every color ticket dynamically links its formulation mixture to the appointment, calculating real-time material cost deductions.",
    icon: LineChart,
  },
  {
    title: "Historical Snapshot P&L Accounting",
    desc: "Lock in historical inventory purchase costs at the moment of checkout, ensuring your past profit-and-loss reports remain 100% accurate forever.",
    icon: ShieldCheck,
  },
  {
    title: "Department Cost Centers",
    desc: "Separate chemical usage across Color Bar, Aesthetics/Skincare, and Nail Backbar so department heads track their exact margin contribution.",
    icon: Gauge,
  },
];

const CHEMICAL_COMPARISON = [
  {
    feature: "Chemical Unit Tracking",
    generic: "Whole bottles / boxes only (cannot track half-used tubes or developer pumps)",
    paulux: "Granular milliliters (ml) and grams (g) with tare-weight deductions",
  },
  {
    feature: "Live Service Gross Margin",
    generic: "Blind estimates or separate manual spreadsheets",
    paulux: "Real-time ticket P&L: Service Price ($165) - Chemical Cost ($22.70) = Gross Margin ($142.30 / 86.2%)",
  },
  {
    feature: "Historical Formula Vault",
    generic: "Sticky notes or simple customer comments box",
    paulux: "Complete formula history saved to client CRM (e.g. Redken Shades EQ 09P 25ml + 09V 10ml + 35ml Processing Solution)",
  },
  {
    feature: "Low-Stock Reorder Thresholds",
    generic: "Staff notice when bottle is empty during service",
    paulux: "Automated threshold alerts based on projected bookings and remaining ml/g volume",
  },
];

const FAQS = [
  {
    q: "Why do hair salons lose $1,000+ every month in chemical dispensary waste?",
    a: "In traditional salons, stylists mix color bowls by eye without measuring developer-to-lightener ratios or logging excess product left in the bowl. Without milliliter and gram-level dispensary tracking, salon owners cannot accurately price long hair add-ons, identify product theft, or calculate true service profit margins.",
  },
  {
    q: "How does the Paulux Back-of-House Consumables ledger work?",
    a: "Stylists or dispensary assistants log the exact formulation mixed for a ticket (e.g., 35g Lightener + 70ml 20vol Developer + 15ml Olaplex No. 1). Paulux automatically calculates the precise material cost, deducts the volume from backbar inventory, and calculates your true realized gross margin.",
  },
  {
    q: "Can stylists see client historical color formulas on their phones?",
    a: "Yes. Through the independent /stylist mobile portal, stylists can quickly look up the exact formula, developer strength, processing time, and root-to-end tone formulas used during previous appointments, ensuring perfect color consistency every visit.",
  },
  {
    q: "Can we track non-hair backbar products like aesthetic peels or massage oils?",
    a: "Absolutely. The consumables engine supports multiple cost centers including Aesthetics (peels, serums, microdermabrasion tips), Lash & Brow (adhesive, tint ml), and Nail Care (cuticle oils, monomer ml, base gel grams).",
  },
  {
    q: "Does this integrate with front-desk appointment booking?",
    a: "Yes. Consumables accounting is natively embedded into the Paulux 12-pillar enterprise suite. Front-desk checkout, appointment booking, inventory POS, and financial analytics all share a synchronized real-time data layer.",
  },
];

export default function DispensarySoftwarePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a,
      },
    })),
  };

  return (
    <>
      <SeoHead
        title="Salon Chemical Dispensary & Backbar Inventory Software (ml/g) | Paulux"
        description="Stop losing profit at the color bar. Track professional hair dye, lighteners, and developer down to exact grams and milliliters with real-time service gross margin P&L accounting."
        keywords="salon chemical inventory management, hair salon color dispensary app, salon backbar inventory tracking, hair color grams milliliters inventory tracker, salon cost per service chemical tracking"
        canonicalPath="/salon-chemical-dispensary-software"
        schema={faqSchema}
      />

      {/* Hero */}
      <section className="bg-brand-wash text-primary-foreground relative overflow-hidden py-24 md:py-32">
        <Container className="relative flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1.5 text-xs tracking-wider uppercase">
            <FlaskConical className="size-4 text-emerald-300" />
            <span>The Enterprise Moat: Back-of-House Consumables</span>
          </div>

          <h1 className="font-serif mt-6 max-w-4xl text-4xl font-medium leading-tight md:text-6xl">
            Salon Chemical Dispensary & <br className="hidden sm:inline" />
            <span className="italic text-accent">Consumables Accounting</span> Software
          </h1>

          <p className="text-primary-foreground/80 mt-5 max-w-2xl text-base md:text-lg">
            Stop guessing your color margins. Track bleaches, toners, developer, and backbar treatments down to the exact milliliter (ml) and gram (g) on every appointment ticket.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary font-semibold hover:bg-neutral-100 shadow-xl">
              <Link to={paths.standalone}>
                Deploy Dedicated Dispensary System <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to={paths.demo}>Explore Live Demo</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Key Feature Cards */}
      <Container className="py-20 md:py-28">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Precision Accounting</p>
          <h2 className="font-serif mt-2 text-3xl md:text-4xl">Eliminate Dispensary Waste & Protect Gross Margin</h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base">
            How Paulux transforms your color dispensary from an unmonitored expense into a predictable profit center.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES_BREAKDOWN.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.title} className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-foreground">{feat.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed mt-2">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </Container>

      {/* Live Dispensary Ledger Showcase Mock */}
      <section className="bg-secondary/30 py-20">
        <Container>
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Real-Time P&L</p>
            <h2 className="font-serif mt-1 text-3xl">Dynamic Service Gross Margin Breakdown</h2>
            <p className="text-muted-foreground text-sm mt-2">
              See what an appointment ticket actually earns once backbar chemical deductions are accounted for.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-2xl border border-border/80 bg-card p-6 shadow-lg">
            <div className="flex flex-wrap items-center justify-between border-b border-border/60 pb-4 gap-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-accent">Appointment Ticket #7419</p>
                <h4 className="font-serif text-xl font-medium mt-0.5">Balayage Refresh + Olaplex Bond Reconstruction</h4>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground">Ticket Revenue</span>
                <p className="font-mono text-xl font-semibold text-emerald-600 dark:text-emerald-400">$165.00</p>
              </div>
            </div>

            {/* Formulation Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Chemical Consumable Item</th>
                    <th className="pb-3 font-semibold">Measured Volume</th>
                    <th className="pb-3 font-semibold">Unit Cost</th>
                    <th className="pb-3 font-semibold text-right">Deducted Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  <tr>
                    <td className="py-3 font-sans text-foreground font-medium">Wella Blondor Multi-Blonde Lightener</td>
                    <td className="py-3 text-muted-foreground">35.0 grams</td>
                    <td className="py-3 text-muted-foreground">$0.18 / g</td>
                    <td className="py-3 text-right text-rose-500">-$6.30</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-sans text-foreground font-medium">Wella Welloxon Perfect 20 Vol (6%) Developer</td>
                    <td className="py-3 text-muted-foreground">70.0 ml</td>
                    <td className="py-3 text-muted-foreground">$0.04 / ml</td>
                    <td className="py-3 text-right text-rose-500">-$2.80</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-sans text-foreground font-medium">Redken Shades EQ Gloss (09V + 09P)</td>
                    <td className="py-3 text-muted-foreground">40.0 ml</td>
                    <td className="py-3 text-muted-foreground">$0.21 / ml</td>
                    <td className="py-3 text-right text-rose-500">-$8.40</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-sans text-foreground font-medium">Olaplex No. 1 Bond Multiplier</td>
                    <td className="py-3 text-muted-foreground">7.5 ml</td>
                    <td className="py-3 text-muted-foreground">$0.69 / ml</td>
                    <td className="py-3 text-right text-rose-500">-$5.20</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bottom calculation bar */}
            <div className="mt-6 rounded-xl bg-secondary/50 p-4 flex flex-wrap items-center justify-between gap-4 border border-border/60">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-xs text-muted-foreground">Total Chemical Cost</span>
                  <p className="font-mono text-base font-semibold text-rose-500">-$22.70</p>
                </div>
                <div className="h-8 w-px bg-border/80" />
                <div>
                  <span className="text-xs text-muted-foreground">Realized Gross Margin</span>
                  <p className="font-mono text-base font-semibold text-emerald-600 dark:text-emerald-400">$142.30</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Sparkles className="size-3.5" />
                <span>86.2% Net Service Margin Locked</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Comparison Grid */}
      <Container className="py-20 md:py-28">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Competitive Edge</p>
          <h2 className="font-serif mt-2 text-3xl md:text-4xl">Generic Salon Software vs. Paulux Dispensary Accounting</h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border/80 shadow-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-secondary/40 text-xs tracking-wider uppercase text-muted-foreground">
                <th className="p-4 md:p-6 font-semibold">Capability</th>
                <th className="p-4 md:p-6 font-semibold text-rose-600 dark:text-rose-400">Generic Systems</th>
                <th className="p-4 md:p-6 font-semibold text-primary dark:text-accent bg-accent/5">Paulux Standalone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-sm">
              {CHEMICAL_COMPARISON.map((r) => (
                <tr key={r.feature}>
                  <td className="p-4 md:p-6 font-medium text-foreground">{r.feature}</td>
                  <td className="p-4 md:p-6 text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <X className="size-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{r.generic}</span>
                    </div>
                  </td>
                  <td className="p-4 md:p-6 text-foreground bg-accent/5">
                    <div className="flex items-start gap-2">
                      <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="font-semibold text-accent">{r.paulux}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>

      {/* FAQs */}
      <Container className="py-20 md:py-28 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Knowledge Base</p>
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

      {/* CTA */}
      <section className="bg-brand-wash text-primary-foreground py-20 text-center">
        <Container className="flex flex-col items-center">
          <h2 className="font-serif text-3xl md:text-5xl font-medium max-w-2xl">
            Plug the chemical leaks in your color bar
          </h2>
          <p className="text-primary-foreground/80 mt-4 max-w-xl text-base">
            Get your own dedicated Paulux deployment with exact ml/g chemical dispensary accounting and 0% booking commissions.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary font-semibold hover:bg-neutral-100">
              <Link to={paths.standalone}>Request Dispensary Deployment Quote <ArrowRight className="size-4 ml-1.5" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to={paths.demo}>Test Live Demo</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
