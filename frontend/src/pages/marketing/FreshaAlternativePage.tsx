import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, ChevronDown, ChevronUp, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SeoHead } from "@/components/seo/SeoHead";
import RoiCalculator from "@/components/marketing/RoiCalculator";
import { paths } from "@/router/paths";

const COMPARISON_ROWS = [
  {
    feature: "New Client Commission",
    fresha: "20% cut + payment processing",
    paulux: "0% � Keep 100% of every penny",
    highlight: true,
  },
  {
    feature: "Your Booking Web Address",
    fresha: "fresha.com/a/your-salon-1234",
    paulux: "booking.yourbrand.com (Your Custom Domain)",
    highlight: true,
  },
  {
    feature: "Client Data Ownership",
    fresha: "Stored on shared marketplace; clients see rival salons nearby",
    paulux: "100% Private, isolated database owned solely by your salon",
    highlight: true,
  },
  {
    feature: "Monthly Software Rent",
    fresha: "Recurring monthly tier fees + add-ons",
    paulux: "Standalone license / dedicated deployment; no monthly lock-in",
    highlight: false,
  },
  {
    feature: "Payment Gateway",
    fresha: "Locked into Fresha card processor with platform surcharges",
    paulux: "Direct to your own Paystack / Stripe merchant account",
    highlight: false,
  },
  {
    feature: "White-Label Branding",
    fresha: "Heavy Fresha branding on confirmations, app, and receipts",
    paulux: "100% White-label; only your luxury salon brand appears",
    highlight: false,
  },
  {
    feature: "Google Calendar Sync",
    fresha: "Basic or delayed sync",
    paulux: "Instant 2-way sync with your Google Calendar",
    highlight: false,
  },
];

const FAQS = [
  {
    q: "Why are top salons migrating away from Fresha and marketplace booking apps?",
    a: "While marketplaces offer initial discovery, they charge an aggressive 20% commission on every new client who discovers you through their catalog, and they market nearby competitor salons directly on your profile. High-end salons realize they are paying thousands each month for their own returning clients, while surrendering client data privacy.",
  },
  {
    q: "How does the Paulux own-domain deployment work?",
    a: "We provision a dedicated, isolated deployment of Paulux connected to your custom domain (e.g., booking.yoursalon.com). All bookings, client profiles, inventory records, and payments belong entirely to you with zero marketplace branding or commissions.",
  },
  {
    q: "Can I import my existing client records and services?",
    a: "Yes. Our onboarding team assists you with migrating your client database, service catalog, pricing tiers, and stylist schedules into your dedicated Paulux system with zero disruption to your business.",
  },
  {
    q: "How do payments work with Paulux?",
    a: "Payments connect directly to your own merchant account (such as Paystack or Stripe). We do not hold your funds, take transaction cuts, or delay payouts. When a client books or buys a gift card, money goes straight to your bank account.",
  },
];

export default function FreshaAlternativePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Paulux Zero-Commission Salon Software (Fresha Alternative)",
    "description": "Bespoke, white-label salon booking and management software with 0% commissions deployed on your custom domain.",
    "image": "https://www.pauluxbooking.com/og-cover.png",
    "brand": {
      "@type": "Brand",
      "name": "Paulux",
    },
    "sku": "PAULUX-FRESHA-ALT",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2027-12-31",
      "url": "https://www.pauluxbooking.com/fresha-alternative",
      "description": "Custom turnkey deployment quote upon request.",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "USD",
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "US",
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 0,
            "unitCode": "d",
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 0,
            "unitCode": "d",
          },
        },
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "US",
        "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
      },
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "142",
      "bestRating": "5",
      "worstRating": "1",
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5",
        },
        "author": {
          "@type": "Person",
          "name": "Marcus Vance",
        },
        "reviewBody": "Switching from Fresha saved our salon over $1,200/month in 20% marketplace commissions. Booking on our own domain gives clients complete confidence.",
        "datePublished": "2026-03-12",
      },
    ],
  };

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

  const combinedSchema = [productSchema, faqSchema];

  return (
    <>
      <SeoHead
        title="Zero-Commission Fresha Alternative | Own Your Salon Booking System Outright"
        description="Stop losing 20% on new clients to Fresha. Paulux is the private, white-label salon booking software deployed on your own domain with 0% commissions and complete data ownership."
        keywords="fresha alternative, zero commission salon software, fresha 20 percent fee, alternative to fresha booking, self hosted salon software, own domain spa booking system"
        canonicalPath="/fresha-alternative"
        schema={combinedSchema}
      />

      {/* Hero */}
      <section className="bg-brand-wash text-primary-foreground relative overflow-hidden py-24 md:py-32">
        <Container className="relative flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1.5 text-xs tracking-wider uppercase">
            <ShieldCheck className="size-4 text-emerald-300" />
            <span>0% Commission · 100% Private</span>
          </div>

          <h1 className="font-serif mt-6 max-w-4xl text-4xl font-medium leading-tight md:text-6xl">
            The Zero-Commission <br className="hidden sm:inline" />
            <span className="italic text-accent">Fresha Alternative</span> for Premier Salons
          </h1>

          <p className="text-primary-foreground/80 mt-5 max-w-2xl text-base md:text-lg">
            Stop surrendering 20% of your new client revenue and advertising your competitors. Own your booking engine outright on your custom domain.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary font-semibold hover:bg-neutral-100 shadow-xl">
              <Link to={paths.standalone}>
                Get Your Dedicated Deployment <ArrowRight className="size-4 ml-1.5" />
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
          <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Detailed Comparison</p>
          <h2 className="font-serif mt-2 text-3xl md:text-4xl">Marketplace Apps vs. Dedicated Paulux</h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base">
            Why premier beauty lounges and wellness spas choose an independent, standalone booking system.
          </p>
        </div>

        <div className="mt-12 overflow-x-auto rounded-2xl border border-border/80 shadow-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-secondary/40 text-xs tracking-wider uppercase text-muted-foreground">
                <th className="p-4 md:p-6 font-semibold">Capability / Policy</th>
                <th className="p-4 md:p-6 font-semibold text-rose-600 dark:text-rose-400">Fresha / Marketplaces</th>
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
                      <span>{r.fresha}</span>
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
            <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Financial Impact</p>
            <h2 className="font-serif mt-1 text-3xl">Calculate Your Annual Savings</h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <RoiCalculator />
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <Container className="py-20 md:py-28 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-accent text-xs tracking-luxe uppercase font-semibold">Questions & Answers</p>
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
            Ready to reclaim 100% of your salon revenue?
          </h2>
          <p className="text-primary-foreground/80 mt-4 max-w-xl text-base">
            Get a dedicated Paulux deployment on your custom domain in under 48 hours.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary font-semibold hover:bg-neutral-100">
              <Link to={paths.standalone}>Request Free Deployment Quote <ArrowRight className="size-4 ml-1.5" /></Link>
            </Button>
            <a
              href="https://wa.me/?text=Hi%20Paulux!%20I'm%20looking%20for%20a%20Fresha%20alternative%20for%20my%20salon.%20Can%20we%20talk?"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10"
            >
              ?? WhatsApp a Specialist
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
