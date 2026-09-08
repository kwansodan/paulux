import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, ChevronDown, ChevronUp, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SeoHead } from "@/components/seo/SeoHead";
import RoiCalculator from "@/components/marketing/RoiCalculator";
import { paths } from "@/router/paths";

const COMPARISON_ROWS = [
  {
    feature: "Monthly Software Subscription",
    mindbody: "$159 to $699+ per month depending on tier and add-ons",
    paulux: "Flat dedicated deployment quote; zero recurring subscription creep",
    highlight: true,
  },
  {
    feature: "Client Data Privacy & Database",
    mindbody: "Shared corporate database; aggregates your patient records",
    paulux: "100% Private, isolated database owned solely by your clinic",
    highlight: true,
  },
  {
    feature: "Clinical Deposit Enforcer",
    mindbody: "Basic card holds requiring complex merchant add-ons",
    paulux: "Native full or partial deposit requirement on high-ticket slots",
    highlight: false,
  },
  {
    feature: "Booking Web Address",
    mindbody: "mindbodyonline.com/classic/your-spa-id",
    paulux: "booking.yourmedspa.com (Your Custom Domain)",
    highlight: true,
  },
  {
    feature: "Prep & Aftercare Delivery",
    mindbody: "Requires third-party automated email plugins",
    paulux: "Native service prep and post-treatment aftercare links in SMS",
    highlight: false,
  },
  {
    feature: "Technical & Allergy Notes",
    mindbody: "Generic text notes buried under multiple tabs",
    paulux: "Instant scalp, allergy, and clinical formula flags in CRM",
    highlight: false,
  },
  {
    feature: "Payment Gateway",
    mindbody: "Mandatory locked proprietary processing with interchange surcharges",
    paulux: "Direct to your own Paystack / Stripe merchant account with 0% Paulux cut",
    highlight: false,
  },
];

const FAQS = [
  {
    q: "Why are MedSpas and aesthetic clinics leaving Mindbody for Paulux?",
    a: "Mindbody charges some of the highest recurring subscription fees in the industry ($159 to $699+ every single month) while locking clinics into proprietary merchant processors and complicated feature bloat. High-end aesthetic clinics and medspas choose Paulux because it runs on their own custom domain, protects patient data privacy with 100% database isolation, and eliminates monthly software rent.",
  },
  {
    q: "How does Paulux protect 60-90 minute treatment slots from no-shows?",
    a: "For medspas, an empty 90-minute Botox or laser appointment is a $400+ loss. Paulux features a native Deposit Enforcer that requires clients to authorize a fixed or full deposit before their slot is reserved. Deposits transfer directly to your bank account with dual Paystack/Stripe failover protection.",
  },
  {
    q: "Are patient notes, formulas, and allergy warnings protected?",
    a: "Yes. Every client record in Paulux has dedicated technical formula and health advisory fields. Estheticians and injectors can record units injected, skin sensitivity flags, and historical contraindications that appear prominently whenever the client checks in.",
  },
  {
    q: "Can we send pre-treatment instructions and post-care guides?",
    a: "Yes. Paulux CMS allows you to attach custom pre-treatment preparation tips (e.g. discontinue retinoids 48h prior) and post-care guides directly to confirmation emails and calendar invites.",
  },
  {
    q: "Can we migrate our existing patient base and service menus?",
    a: "Yes. Our team handles the entire technical migration from Mindbody, importing all client contacts, VIP tags, service durations, and practitioner calendars with zero downtime.",
  },
];

export default function MindbodyAlternativePage() {
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
        title="Modern Mindbody Alternative for MedSpas & Aesthetic Clinics | Paulux"
        description="Escape Mindbody's $500+/mo fees and complex bloat. Paulux provides a luxury, white-label booking and clinical deposit system deployed on your own custom domain."
        keywords="mindbody alternative, mindbody alternative medspa, aesthetic clinic booking software, medspa scheduling system, luxury spa software, clinical deposit booking"
        canonicalPath="/mindbody-alternative"
        schema={faqSchema}
      />

      {/* Hero */}
      <section className="bg-brand-wash text-primary-foreground relative overflow-hidden py-24 md:py-32">
        <Container className="relative flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1.5 text-xs tracking-wider uppercase">
            <Sparkles className="size-4 text-emerald-300" />
            <span>Built for MedSpas, Laser & Aesthetic Clinics</span>
          </div>

          <h1 className="font-serif mt-6 max-w-4xl text-4xl font-medium leading-tight md:text-6xl">
            The Modern <br className="hidden sm:inline" />
            <span className="italic text-accent">Mindbody Alternative</span> for MedSpas
          </h1>

          <p className="text-primary-foreground/80 mt-5 max-w-2xl text-base md:text-lg">
            Stop paying $200–$700/month in software rent for bloated legacy software. Deliver a luxury, high-converting booking experience on your custom domain.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary font-semibold hover:bg-neutral-100 shadow-xl">
              <Link to={paths.standalone}>
                Request Turnkey Deployment <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to={paths.demo}>Explore Live Demo</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Side-by-Side Comparison */}
      <Container className="py-20 md:py-28">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Feature & Value Comparison</p>
          <h2 className="font-serif mt-2 text-3xl md:text-4xl">Mindbody vs. Paulux Dedicated Platform</h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base">
            Compare why boutique medical spas and wellness clinics prefer an agile, private system without recurring tier penalties.
          </p>
        </div>

        <div className="mt-12 overflow-x-auto rounded-2xl border border-border/80 shadow-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-secondary/40 text-xs tracking-wider uppercase text-muted-foreground">
                <th className="p-4 md:p-6 font-semibold">Requirement</th>
                <th className="p-4 md:p-6 font-semibold text-rose-600 dark:text-rose-400">Mindbody</th>
                <th className="p-4 md:p-6 font-semibold text-primary dark:text-accent bg-accent/5">Paulux Standalone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-sm">
              {COMPARISON_ROWS.map((r) => (
                <tr key={r.feature} className={r.highlight ? "bg-accent/5 font-medium" : ""}>
                  <td className="p-4 md:p-6 font-medium text-foreground">{r.feature}</td>
                  <td className="p-4 md:p-6 text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <X className="size-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{r.mindbody}</span>
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

      {/* Embedded ROI Calculator */}
      <section className="bg-secondary/30 py-20">
        <Container>
          <div className="text-center mb-10">
            <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Overhead Reduction</p>
            <h2 className="font-serif mt-1 text-3xl">Calculate Your Annual Clinic Savings</h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <RoiCalculator />
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <Container className="py-20 md:py-28 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Clinic Questions</p>
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

      {/* Final Call to Action */}
      <section className="bg-brand-wash text-primary-foreground py-20 text-center">
        <Container className="flex flex-col items-center">
          <h2 className="font-serif text-3xl md:text-5xl font-medium max-w-2xl">
            Upgrade your clinic to a private, luxury booking platform
          </h2>
          <p className="text-primary-foreground/80 mt-4 max-w-xl text-base">
            Dedicated deployment on your custom domain with 0% commissions, deposit enforcer, and complete patient database privacy.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary font-semibold hover:bg-neutral-100">
              <Link to={paths.standalone}>Request Clinic Deployment Quote <ArrowRight className="size-4 ml-1.5" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/case-studies/medspas-aesthetics">View MedSpa Case Study</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
