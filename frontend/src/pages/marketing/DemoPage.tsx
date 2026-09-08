import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Check, CreditCard, Eye, LayoutDashboard, Smartphone, User, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SeoHead } from "@/components/seo/SeoHead";
import { paths } from "@/router/paths";

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<"client" | "admin">("client");

  return (
    <>
      <SeoHead
        title="Interactive Live Demo | Paulux Standalone Salon Booking Software"
        description="Experience the Paulux salon booking platform live. Preview the luxury customer appointment wizard and the powerful salon manager admin dashboard."
        keywords="salon software demo, live booking software preview, spa appointment system demo, white label salon dashboard"
        canonicalPath="/demo"
      />

      {/* Hero */}
      <section className="bg-brand-wash text-primary-foreground py-20 md:py-28 text-center">
        <Container className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1.5 text-xs tracking-wider uppercase">
            <Eye className="size-4 text-amber-300" />
            <span>Interactive Product Tour</span>
          </div>

          <h1 className="font-serif mt-6 max-w-3xl text-4xl font-medium leading-tight md:text-5xl">
            See Paulux in Action
          </h1>

          <p className="text-primary-foreground/80 mt-4 max-w-xl text-base md:text-lg">
            Experience both sides of the system: the seamless customer booking flow and the comprehensive manager dashboard.
          </p>

          {/* Tab Switcher */}
          <div className="mt-10 inline-flex rounded-2xl bg-white/10 p-1.5 backdrop-blur-md">
            <button
              onClick={() => setActiveTab("client")}
              className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${
                activeTab === "client"
                  ? "bg-white text-primary shadow-md"
                  : "text-primary-foreground/80 hover:text-white"
              }`}
            >
              <Smartphone className="size-4" />
              <span>1. Customer Booking Flow</span>
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${
                activeTab === "admin"
                  ? "bg-white text-primary shadow-md"
                  : "text-primary-foreground/80 hover:text-white"
              }`}
            >
              <LayoutDashboard className="size-4" />
              <span>2. Salon Owner Dashboard</span>
            </button>
          </div>
        </Container>
      </section>

      {/* Interactive Tour Content */}
      <Container className="py-16 md:py-24">
        {activeTab === "client" ? (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-accent text-xs tracking-luxe uppercase font-semibold">Client Experience</span>
              <h2 className="font-serif mt-1 text-3xl">Effortless 4-Step Booking Wizard</h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Designed to convert website visitors into confirmed appointments in under 60 seconds with upfront deposits.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                <span className="text-xs font-bold text-accent tracking-wider uppercase">Step 1</span>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Scissors className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-medium">Select Services</h3>
                    <p className="text-xs text-muted-foreground">Category tabs & add-ons</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                  Clients browse treatments with durations and prices. Multi-service selection allows booking hair + manicure together.
                </p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                <span className="text-xs font-bold text-accent tracking-wider uppercase">Step 2</span>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Calendar className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-medium">Date & Time</h3>
                    <p className="text-xs text-muted-foreground">Real-time availability</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                  Calculates opening hours, blocked dates, and stylist schedules to prevent double bookings.
                </p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                <span className="text-xs font-bold text-accent tracking-wider uppercase">Step 3</span>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <User className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-medium">Client Details</h3>
                    <p className="text-xs text-muted-foreground">Contact & notes</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                  Captures name, email, phone number, promo codes, and special treatment requests seamlessly.
                </p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                <span className="text-xs font-bold text-accent tracking-wider uppercase">Step 4</span>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <CreditCard className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-medium">Deposit / Pay</h3>
                    <p className="text-xs text-muted-foreground">Direct merchant payment</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                  Collects card payments via Paystack/Stripe. Dispatches instant SMS and email confirmations with booking reference.
                </p>
              </div>
            </div>

            {/* Visual Mock Showcase */}
            <div className="overflow-hidden rounded-3xl border border-border/80 bg-secondary/30 p-6 md:p-10 shadow-lg">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="font-serif text-2xl font-medium">Test Drive the Customer Experience</h3>
                  <p className="text-muted-foreground mt-1 text-sm max-w-md">
                    You can try the actual customer booking wizard right now to see the speed and luxury feel.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button asChild className="bg-primary text-primary-foreground font-semibold">
                    <Link to={paths.book}>Launch Booking Wizard <ArrowRight className="size-4 ml-1" /></Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-accent text-xs tracking-luxe uppercase font-semibold">Manager Dashboard</span>
              <h2 className="font-serif mt-1 text-3xl">Comprehensive Salon Command Center</h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Track appointments, assign stylists, monitor stock movements, and review revenue reports with ease.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                <h3 className="font-serif text-lg font-medium">Appointment Operations</h3>
                <ul className="mt-4 space-y-2 text-xs text-muted-foreground leading-relaxed">
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-500 shrink-0" />
                    <span>Calendar grid with per-day appointment counts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-500 shrink-0" />
                    <span>One-click status transitions (Confirm, Complete, Cancel)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-500 shrink-0" />
                    <span>Assign specific stylists to appointments</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                <h3 className="font-serif text-lg font-medium">Catalog & Inventory</h3>
                <ul className="mt-4 space-y-2 text-xs text-muted-foreground leading-relaxed">
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-500 shrink-0" />
                    <span>Services, categories, and luxury package bundles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-500 shrink-0" />
                    <span>Row-locked atomic stock adjustments for retail products</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-500 shrink-0" />
                    <span>Automatic low-stock alerts to manager email</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                <h3 className="font-serif text-lg font-medium">Revenue & Loyalty</h3>
                <ul className="mt-4 space-y-2 text-xs text-muted-foreground leading-relaxed">
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-500 shrink-0" />
                    <span>Date-range revenue aggregation & top service analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-500 shrink-0" />
                    <span>Digital gift card issuance, balances, and redemption</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-500 shrink-0" />
                    <span>Promo code engine with usage limits & date expirations</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-8 text-center max-w-2xl mx-auto shadow-md">
              <h3 className="font-serif text-2xl font-medium">Schedule a Guided Admin Walkthrough</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Want a personalized 15-minute tour of the admin dashboard configured for your salon?
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-primary text-primary-foreground font-semibold">
                  <Link to={paths.standalone}>Book a Live Demo Call <ArrowRight className="size-4 ml-1" /></Link>
                </Button>
                <a
                  href="https://wa.me/?text=Hi%20Paulux!%20I'd%20like%20to%20schedule%20a%20guided%20demo%20of%20the%20salon%20admin%20dashboard."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-secondary transition-colors"
                >
                  ?? WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
