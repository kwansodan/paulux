import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, ChevronDown, ChevronUp, Scissors, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SeoHead } from "@/components/seo/SeoHead";
import RoiCalculator from "@/components/marketing/RoiCalculator";
import { paths } from "@/router/paths";
import { useCurrency } from "@/context/CurrencyContext";

const COMPARISON_ROWS = [
  {
    feature: "Marketplace Commission",
    booksy: "Up to 20% on new client discovery via marketplace",
    paulux: "0% — Keep 100% of your earnings forever",
    highlight: true,
  },
  {
    feature: "Monthly Base & Staff Fees",
    booksy: "$29.99/mo base + $20/mo per additional barber chair",
    paulux: "Flat dedicated deployment quote; zero per-staff penalties",
    highlight: true,
  },
  {
    feature: "Booking Web Address",
    booksy: "booksy.com/en-us/your-barbershop-id",
    paulux: "booking.yourbarbershop.com (Your Custom Domain)",
    highlight: true,
  },
  {
    feature: "Walk-In Fast Check-In",
    booksy: "Multi-click process designed for pre-bookings",
    paulux: "15-second rapid walk-in chair assignment mode",
    highlight: false,
  },
  {
    feature: "Staff & Barber Portal",
    booksy: "Shared app interface with Booksy branding",
    paulux: "Independent /stylist mobile portal with individual chair access",
    highlight: false,
  },
  {
    feature: "No-Show & Deposit Protection",
    booksy: "Optional fee with high processing charges",
    paulux: "Mandatory deposit enforcer with dual Paystack/Stripe failover",
    highlight: false,
  },
  {
    feature: "Client Data Privacy",
    booksy: "Booksy owns client list and markets competing barbers nearby",
    paulux: "100% Private, isolated database with full client export rights",
    highlight: true,
  },
];

const FAQS = [
  {
    q: "Why are barbershops and studios switching from Booksy to Paulux?",
    a: "Booksy charges monthly subscription fees ($29.99/mo plus $20/mo per extra staff member) in addition to taking commission on marketplace bookings. Even worse, Booksy's app actively promotes competing barbershops in your neighborhood to your own clients. Paulux provides a standalone booking engine hosted on your own custom domain with 0% commissions and complete client data privacy.",
  },
  {
    q: "Can each barber or booth renter manage their own schedule?",
    a: "Yes. Paulux includes an independent mobile staff portal (/stylist). Each barber gets secure access to their own daily appointments, chair availability, client formula notes, and daily revenue totals without accessing sensitive shop-wide financial accounting.",
  },
  {
    q: "How does the 15-second walk-in check-in work?",
    a: "Barbershops handle heavy walk-in foot traffic. Paulux features a specialized 15-second front-desk walk-in mode that allows desk staff or barbers to select a service, tap the available barber chair, collect payment, and lock the chair in seconds without filling out extensive questionnaires.",
  },
  {
    q: "Can I collect upfront deposits to eliminate no-shows?",
    a: "Absolutely. You can enforce a fixed (e.g. $15) or full deposit on high-demand time slots (like Friday afternoons and Saturday mornings). Deposits process directly into your own merchant account (Paystack or Stripe) with automated SMS confirmation and calendar sync.",
  },
  {
    q: "Can I migrate my existing clients and services from Booksy?",
    a: "Yes. Simply export your client list from Booksy, and our white-glove onboarding team will import all contacts, historical notes, services, and barber schedules directly into your dedicated Paulux deployment within 48 hours.",
  },
];

export default function BooksyAlternativePage() {
  const { localizeText } = useCurrency();
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
        title="Zero-Commission Booksy Alternative for Barbers & Studios | Paulux"
        description="Ditch Booksy's monthly staff fees and marketplace commissions. Paulux delivers white-label booking on your custom domain with 15-second walk-in check-in, deposit protection, and 0% fees."
        keywords="booksy alternative, booksy alternative for barbers, zero commission barber software, booksy competitors, custom domain barbershop booking, barber chair rental software"
        canonicalPath="/booksy-alternative"
        schema={faqSchema}
      />

      {/* Hero */}
      <section className="bg-brand-wash text-primary-foreground relative overflow-hidden py-24 md:py-32">
        <Container className="relative flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1.5 text-xs tracking-wider uppercase">
            <Scissors className="size-4 text-emerald-300" />
            <span>Built for Premier Barbershops & Studios</span>
          </div>

          <h1 className="font-serif mt-6 max-w-4xl text-4xl font-medium leading-tight md:text-6xl">
            The Zero-Commission <br className="hidden sm:inline" />
            <span className="italic text-accent">Booksy Alternative</span> for Barbershops
          </h1>

          <p className="text-primary-foreground/80 mt-5 max-w-2xl text-base md:text-lg">
            Stop paying per-chair fees and surrendering your client list to a marketplace that advertises your competitors. Own your booking engine on your custom domain.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary font-semibold hover:bg-neutral-100 shadow-xl">
              <Link to={paths.standalone}>
                Deploy Your Custom System <ArrowRight className="size-4 ml-1.5" />
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
          <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Side-by-Side Analysis</p>
          <h2 className="font-serif mt-2 text-3xl md:text-4xl">Booksy Marketplace vs. Paulux Dedicated Platform</h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base">
            See why independent barbershops, grooming lounges, and studios are switching to a private, branded system.
          </p>
        </div>

        <div className="mt-12 overflow-x-auto rounded-2xl border border-border/80 shadow-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-secondary/40 text-xs tracking-wider uppercase text-muted-foreground">
                <th className="p-4 md:p-6 font-semibold">Capability</th>
                <th className="p-4 md:p-6 font-semibold text-rose-600 dark:text-rose-400">Booksy</th>
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
                      <span>{localizeText(r.booksy)}</span>
                    </div>
                  </td>
                  <td className="p-4 md:p-6 text-foreground bg-accent/5">
                    <div className="flex items-start gap-2">
                      <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="font-semibold text-accent">{localizeText(r.paulux)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>

      {/* ROI Calculator Section */}
      <Container className="py-12 md:py-20 max-w-5xl">
        <div className="mb-10 text-center">
          <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Live Impact Calculator</p>
          <h2 className="font-serif mt-2 text-3xl md:text-4xl">Calculate your shop's annual marketplace bleed</h2>
        </div>
        <RoiCalculator />
      </Container>

      {/* FAQ Section */}
      <section className="bg-secondary/30 py-20">
        <Container className="max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mt-2 text-sm">Everything you need to know about ditching Booksy.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
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
        </Container>
      </section>

      {/* Final Call to Action */}
      <section className="bg-brand-wash text-primary-foreground py-20 text-center">
        <Container className="flex flex-col items-center">
          <h2 className="font-serif text-3xl md:text-5xl font-medium max-w-2xl">
            Take full control of your barbershop's bookings
          </h2>
          <p className="text-primary-foreground/80 mt-4 max-w-xl text-base">
            Turnkey deployment on your custom domain in under 48 hours with 0% commissions and unlimited barber staff accounts.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary font-semibold hover:bg-neutral-100">
              <Link to={paths.standalone}>Request Deployment Quote <ArrowRight className="size-4 ml-1.5" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/case-studies/barbershops">View Barbershop Case Study</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
