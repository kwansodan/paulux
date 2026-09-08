import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  Crown,
  Eye,
  FileSpreadsheet,
  FlaskConical,
  LayoutDashboard,
  MessageSquare,
  Scissors,
  Smartphone,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SeoHead } from "@/components/seo/SeoHead";
import { paths } from "@/router/paths";
import { openChatwoot } from "@/components/marketing/ChatwootWidget";

type DemoTab = "booking" | "operations" | "consumables" | "stylist" | "retention";

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<DemoTab>("booking");

  return (
    <>
      <SeoHead
        title="Interactive Platform Demo | Paulux Standalone Salon & Clinic Software"
        description="Experience the complete Paulux salon software suite: 4-step client booking wizard, front-desk coordination, back-of-house chemical consumable tracking, stylist mobile portal, and automated client win-backs."
        keywords="salon software demo, salon chemical inventory preview, stylist mobile portal demo, front desk salon calendar, medspa software interactive tour"
        canonicalPath="/demo"
      />

      {/* Hero */}
      <section className="bg-brand-wash text-primary-foreground py-20 md:py-28 text-center">
        <Container className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase">
            <Eye className="size-4 text-amber-300" />
            <span>Interactive Platform Showcase</span>
          </div>

          <h1 className="font-serif mt-6 max-w-3xl text-4xl font-medium leading-tight md:text-5xl">
            See the Entire Paulux Engine in Action
          </h1>

          <p className="text-primary-foreground/80 mt-4 max-w-2xl text-base md:text-lg leading-relaxed">
            Test-drive the customer booking experience, back-of-house chemical cost tracking,
            stylist mobile rosters, and automated retention systems.
          </p>

          {/* Tab Switcher */}
          <div className="mt-10 flex flex-wrap justify-center gap-2 rounded-2xl bg-white/10 p-2 backdrop-blur-md max-w-4xl">
            <button
              onClick={() => setActiveTab("booking")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "booking"
                  ? "bg-white text-primary shadow-md"
                  : "text-primary-foreground/80 hover:text-white"
              }`}
            >
              <Smartphone className="size-4" />
              <span>1. Booking Wizard</span>
            </button>

            <button
              onClick={() => setActiveTab("operations")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "operations"
                  ? "bg-white text-primary shadow-md"
                  : "text-primary-foreground/80 hover:text-white"
              }`}
            >
              <LayoutDashboard className="size-4" />
              <span>2. Front-Desk Hub</span>
            </button>

            <button
              onClick={() => setActiveTab("consumables")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "consumables"
                  ? "bg-white text-primary shadow-md"
                  : "text-primary-foreground/80 hover:text-white"
              }`}
            >
              <FlaskConical className="size-4 text-purple-600 dark:text-purple-300" />
              <span>3. Consumables & Lab</span>
            </button>

            <button
              onClick={() => setActiveTab("stylist")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "stylist"
                  ? "bg-white text-primary shadow-md"
                  : "text-primary-foreground/80 hover:text-white"
              }`}
            >
              <Scissors className="size-4" />
              <span>4. Stylist Portal</span>
            </button>

            <button
              onClick={() => setActiveTab("retention")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "retention"
                  ? "bg-white text-primary shadow-md"
                  : "text-primary-foreground/80 hover:text-white"
              }`}
            >
              <Zap className="size-4 text-amber-300" />
              <span>5. Win-Back Engine</span>
            </button>
          </div>
        </Container>
      </section>

      {/* Interactive Tour Content */}
      <Container className="py-16 md:py-24">
        {/* Tab 1: Booking Wizard */}
        {activeTab === "booking" && (
          <div className="space-y-12 animate-in fade-in duration-300">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-accent text-xs tracking-luxe uppercase font-semibold">Pillar 01 · Client Experience</span>
              <h2 className="font-serif mt-1 text-3xl md:text-4xl font-medium text-foreground">
                Mobile-First 4-Step Booking Wizard
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Converts visitors into paid, confirmed bookings in under 60 seconds with smart device memory and upfront deposits.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
                <span className="text-xs font-bold text-accent tracking-wider uppercase">Step 1</span>
                <h3 className="font-serif font-medium text-lg mt-2">Smart Auto-Fill</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Repeat clients' names, emails, and phone numbers populate instantly via device local memory. Zero redundant typing.
                </p>
                <div className="mt-4 rounded-xl bg-emerald-500/10 p-2.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ 82% Faster Repeat Checkouts
                </div>
              </div>

              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
                <span className="text-xs font-bold text-accent tracking-wider uppercase">Step 2</span>
                <h3 className="font-serif font-medium text-lg mt-2">Services & Bundles</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Live category filter tabs, treatment descriptions, durations, and multi-service cart bundling with take-home products.
                </p>
                <div className="mt-4 rounded-xl bg-accent/10 p-2.5 text-[11px] text-accent font-medium">
                  ✓ Sticky Cart Drawer Included
                </div>
              </div>

              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
                <span className="text-xs font-bold text-accent tracking-wider uppercase">Step 3</span>
                <h3 className="font-serif font-medium text-lg mt-2">Live 7-Day Calendar</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Dynamically generates available slots adapting to salon operating hours, chair capacity, and individual stylist availability.
                </p>
                <div className="mt-4 rounded-xl bg-secondary p-2.5 text-[11px] text-foreground font-medium">
                  ✓ Real-Time Capacity Locks
                </div>
              </div>

              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
                <span className="text-xs font-bold text-accent tracking-wider uppercase">Step 4</span>
                <h3 className="font-serif font-medium text-lg mt-2">Deposit & Invites</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Instant deposit collection via Paystack/Stripe. Generates universal .ics invites for Apple Calendar, Google Calendar, and Outlook.
                </p>
                <div className="mt-4 rounded-xl bg-purple-500/10 p-2.5 text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                  ✓ 1-Click Universal .ics Invites
                </div>
              </div>
            </div>

            {/* Visual Cart Drawer Preview */}
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-8 md:p-12 shadow-sm">
              <div className="grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-6 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">Self-Service Reschedule Portal</span>
                  <h3 className="font-serif text-2xl md:text-3xl font-medium">No phone calls, no front-desk friction</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Clients receive a branded confirmation email and SMS containing a secure link to manage their appointment.
                    They can reschedule their time or add notes directly from their phone, obeying your custom cancellation windows.
                  </p>
                  <Button asChild size="lg" className="bg-primary text-primary-foreground font-semibold">
                    <Link to={paths.standalone}>Request Deployment Quote <ArrowRight className="size-4 ml-1.5" /></Link>
                  </Button>
                </div>

                <div className="md:col-span-6 rounded-2xl border border-border/80 bg-card p-6 shadow-md space-y-3">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <span className="font-serif font-bold text-sm">Appointment #2041</span>
                    <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full text-xs font-semibold">Confirmed · Deposit Paid</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="font-medium text-foreground">Signature Foil Balayage + Hydration Mask</p>
                    <p className="text-muted-foreground">Thursday, Nov 12 at 11:30 AM (120 mins) · Stylist: Maya R.</p>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-border/60 text-xs">
                    <span className="text-muted-foreground">Self-Service Actions:</span>
                    <div className="flex gap-2">
                      <span className="bg-secondary px-2.5 py-1 rounded-lg font-medium cursor-pointer hover:bg-border">Reschedule</span>
                      <span className="bg-accent/10 text-accent px-2.5 py-1 rounded-lg font-medium cursor-pointer">Add to Calendar (.ics)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Front-Desk Hub */}
        {activeTab === "operations" && (
          <div className="space-y-12 animate-in fade-in duration-300">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-accent text-xs tracking-luxe uppercase font-semibold">Pillar 03 · Floor Operations</span>
              <h2 className="font-serif mt-1 text-3xl md:text-4xl font-medium text-foreground">
                Front-Desk Hub & 15-Second Walk-In Mode
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Prevent scheduling bottlenecks, eliminate double bookings, and check in walk-ins in seconds.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-3">
                <span className="bg-accent/10 text-accent p-2 rounded-xl inline-flex"><Zap className="size-4" /></span>
                <h3 className="font-serif font-medium text-lg">15-Second Fast Walk-In</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Receptionists enter client name and phone; the system auto-creates a customer profile, assigns an open chair, and records cash or card in seconds.
                </p>
              </div>

              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-3">
                <span className="bg-accent/10 text-accent p-2 rounded-xl inline-flex"><Users className="size-4" /></span>
                <h3 className="font-serif font-medium text-lg">Chair Capacity Enforcement</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Set salon station limits (e.g. 6 chairs max). Once 6 concurrent clients are booked across stylists, that hourly window locks automatically.
                </p>
              </div>

              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-3">
                <span className="bg-accent/10 text-accent p-2 rounded-xl inline-flex"><Clock className="size-4" /></span>
                <h3 className="font-serif font-medium text-lg">Timestamped Audit Trail</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every status change (Pending → Confirmed → Completed → Cancelled) logs user ID, timestamp, and cancellation reasons for complete accountability.
                </p>
              </div>
            </div>

            {/* Front Desk Live Audit Trail Simulation */}
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h4 className="font-serif font-medium text-lg">Floor Coordination Audit Stream</h4>
                <span className="text-xs font-mono text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full font-bold">
                  ● Real-Time Sync
                </span>
              </div>
              <div className="grid gap-2 text-xs font-mono">
                <div className="flex items-center justify-between rounded-xl bg-card p-3 border border-border/60">
                  <span>[11:04:12] Walk-In Added: Liam O'Connor (Beard Sculpt & Cut)</span>
                  <span className="text-accent font-semibold">Front Desk Dave · Chair #3</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-card p-3 border border-border/60">
                  <span>[10:55:00] Slot Locked: 2:00 PM (Chair Capacity 6/6 Reached)</span>
                  <span className="text-muted-foreground">Automated Capacity Engine</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-card p-3 border border-border/60">
                  <span>[10:48:32] Booking #1092 Rescheduled from 1:00 PM to 4:30 PM</span>
                  <span className="text-emerald-600">Client Self-Service Portal</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Consumables & Lab (The Enterprise Differentiator) */}
        {activeTab === "consumables" && (
          <div className="space-y-12 animate-in fade-in duration-300">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-purple-600 dark:text-purple-400 text-xs tracking-luxe uppercase font-bold">
                Pillar 08 · The Enterprise Differentiator
              </span>
              <h2 className="font-serif mt-1 text-3xl md:text-4xl font-medium text-foreground">
                Back-of-House Consumables & Chemical Cost Accounting
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Measure professional hair color, bleaches, developer, and serums by exact milliliters (ml) and grams (g) to protect your real profit margins.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-purple-500/30 bg-purple-500/5 p-6 shadow-sm space-y-3">
                <span className="bg-purple-500/15 text-purple-600 p-2 rounded-xl inline-flex"><FlaskConical className="size-4" /></span>
                <h3 className="font-serif font-medium text-lg">Precise ml & Gram Dispensation</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Track exact grams of color tubes and milliliters of developer used per appointment. Stop losing $1,500/month to over-mixing and waste.
                </p>
              </div>

              <div className="rounded-3xl border border-purple-500/30 bg-purple-500/5 p-6 shadow-sm space-y-3">
                <span className="bg-purple-500/15 text-purple-600 p-2 rounded-xl inline-flex"><LayoutDashboard className="size-4" /></span>
                <h3 className="font-serif font-medium text-lg">Department Cost Centers</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Allocate material usage directly to specific operational cost centers: Hair Lab, Nail Bar, MedSpa Aesthetics, or Barbershop.
                </p>
              </div>

              <div className="rounded-3xl border border-purple-500/30 bg-purple-500/5 p-6 shadow-sm space-y-3">
                <span className="bg-purple-500/15 text-purple-600 p-2 rounded-xl inline-flex"><FileSpreadsheet className="size-4" /></span>
                <h3 className="font-serif font-medium text-lg">Historical Snapshot Accounting</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Locks in unit product costs at the exact moment of issuance, giving salon owners 100% accurate net profit reports per service rendered.
                </p>
              </div>
            </div>

            {/* Interactive Chemical Dispensary Ledger */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 md:p-8 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                <div>
                  <h4 className="font-serif font-medium text-lg text-foreground">Live Chemical Dispensary Ledger</h4>
                  <p className="text-xs text-muted-foreground">Session: Balayage Treatment · Station #4 · Stylist: Maya</p>
                </div>
                <span className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold font-mono">
                  Gross Margin: 89.2% ($160.50 Net Profit)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground">
                      <th className="py-2.5 font-semibold">Material / Product</th>
                      <th className="py-2.5 font-semibold">Category</th>
                      <th className="py-2.5 font-semibold text-right">Quantity</th>
                      <th className="py-2.5 font-semibold text-right">Unit Cost</th>
                      <th className="py-2.5 font-semibold text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    <tr>
                      <td className="py-3 font-sans font-medium text-foreground">Schwarzkopf Igora Royal 8-1</td>
                      <td className="py-3 font-sans text-muted-foreground">Permanent Color</td>
                      <td className="py-3 text-right text-foreground">40 grams</td>
                      <td className="py-3 text-right text-muted-foreground">$0.22/g</td>
                      <td className="py-3 text-right font-bold text-accent">$8.80</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-sans font-medium text-foreground">Igora Royal 30-Vol Developer</td>
                      <td className="py-3 font-sans text-muted-foreground">Developer</td>
                      <td className="py-3 text-right text-foreground">80 ml</td>
                      <td className="py-3 text-right text-muted-foreground">$0.04/ml</td>
                      <td className="py-3 text-right font-bold text-accent">$3.20</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-sans font-medium text-foreground">K18 Molecular Hair Mist</td>
                      <td className="py-3 font-sans text-muted-foreground">Bond Builder</td>
                      <td className="py-3 text-right text-foreground">5 ml</td>
                      <td className="py-3 text-right text-muted-foreground">$1.50/ml</td>
                      <td className="py-3 text-right font-bold text-accent">$7.50</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-border/80 font-semibold font-sans text-xs">
                      <td colSpan={4} className="py-3 text-right">Total Material Cost for Session:</td>
                      <td className="py-3 text-right font-mono font-bold text-accent">$19.50</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Stylist Portal */}
        {activeTab === "stylist" && (
          <div className="space-y-12 animate-in fade-in duration-300">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-accent text-xs tracking-luxe uppercase font-semibold">Pillar 04 · Staff Empowerment</span>
              <h2 className="font-serif mt-1 text-3xl md:text-4xl font-medium text-foreground">
                Dedicated Stylist Mobile Portal (/stylist)
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Empower your team with their own mobile logins to view daily rosters, commission earnings, and chemical formula records.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-3">
                <span className="bg-accent/10 text-accent p-2 rounded-xl inline-flex"><Smartphone className="size-4" /></span>
                <h3 className="font-serif font-medium text-lg">Personalized Daily Roster</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Stylists log in on their phones to see exactly who is arriving, when, and what services are requested, without viewing salon financials.
                </p>
              </div>

              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-3">
                <span className="bg-accent/10 text-accent p-2 rounded-xl inline-flex"><Scissors className="size-4" /></span>
                <h3 className="font-serif font-medium text-lg">Granular Multi-Stylist Split</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Assign Stylist A to Hair Color and Stylist B to Blowout/Manicure within the same booking. Commission and tips split cleanly.
                </p>
              </div>

              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-3">
                <span className="bg-accent/10 text-accent p-2 rounded-xl inline-flex"><Sparkles className="size-4" /></span>
                <h3 className="font-serif font-medium text-lg">Technical Formula Notes</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Colorists record exact dye codes, developer ratios, and processing times directly to client profiles for consistent touch-ups every visit.
                </p>
              </div>
            </div>

            {/* Stylist Screen Mockup */}
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-6 md:p-8 max-w-xl mx-auto space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-full bg-accent text-accent-foreground font-bold flex items-center justify-center text-xs">
                    CT
                  </div>
                  <div>
                    <h4 className="font-serif font-medium text-sm">Chloe Thorne</h4>
                    <p className="text-[11px] text-muted-foreground">Stylist Dashboard · Active Shift</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600">$420 Today</span>
              </div>

              <div className="space-y-2">
                <div className="rounded-2xl border border-border/70 bg-card p-3.5 space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span>1:00 PM – Jessica Miller</span>
                    <span className="text-accent font-mono">$180.00</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Service: Full Balayage + Gloss</p>
                  <p className="text-[11px] font-mono bg-secondary/60 p-2 rounded-lg text-foreground">
                    Note: Prefers cool ash tones. Formula: 9P (20g) + 9V (20g) on damp hair.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-card p-3.5 space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span>3:30 PM – Amanda Cole</span>
                    <span className="text-accent font-mono">$65.00</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Service: Blowout & Style (Split with Sarah on Color)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Automated Win-Back & Retention */}
        {activeTab === "retention" && (
          <div className="space-y-12 animate-in fade-in duration-300">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-amber-600 dark:text-amber-400 text-xs tracking-luxe uppercase font-bold">
                Pillars 09 & 10 · Autonomous Growth
              </span>
              <h2 className="font-serif mt-1 text-3xl md:text-4xl font-medium text-foreground">
                Automated 30/60/90-Day Win-Backs & 5-Star Reviews
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Reactivate lapsed clients automatically and boost your local Google Maps ranking on autopilot.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-6 shadow-sm space-y-3">
                <span className="bg-amber-500/15 text-amber-600 p-2 rounded-xl inline-flex"><Zap className="size-4" /></span>
                <h3 className="font-serif font-medium text-lg">30/60/90-Day Win-Backs</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Inngest background workers track client visit intervals. If a client exceeds 60 days without booking, an automated re-engagement text fires.
                </p>
              </div>

              <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6 shadow-sm space-y-3">
                <span className="bg-emerald-500/15 text-emerald-600 p-2 rounded-xl inline-flex"><Star className="size-4" /></span>
                <h3 className="font-serif font-medium text-lg">Google Review 5-Star Booster</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Dispatches an automated review invite 90 minutes after service completion with a direct link to your Google Business Profile.
                </p>
              </div>

              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-3">
                <span className="bg-accent/10 text-accent p-2 rounded-xl inline-flex"><Crown className="size-4" /></span>
                <h3 className="font-serif font-medium text-lg">VIP Client LTV Tracking</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Searchable client database tracks cumulative lifetime spend, attendance reliability, and automatically tags high-ticket VIP clients.
                </p>
              </div>
            </div>

            {/* Retention Flow Visual */}
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-6 md:p-10 space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <h4 className="font-serif text-2xl font-medium">How Autonomous Retention Works</h4>
                <p className="text-xs text-muted-foreground mt-1">Zero staff labor. Runs 24/7 in the background.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-xs">
                <div className="rounded-2xl border border-border/70 bg-card p-4 space-y-2">
                  <span className="font-bold text-accent uppercase text-[10px] tracking-wider">Trigger: Day 60</span>
                  <h5 className="font-semibold text-foreground">Client Absent for 8 Weeks</h5>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    System spots that Sarah hasn't scheduled her routine trim.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-card p-4 space-y-2">
                  <span className="font-bold text-accent uppercase text-[10px] tracking-wider">Action: SMS Dispatched</span>
                  <h5 className="font-semibold text-foreground">Personalized Win-Back Offer</h5>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Sends SMS: "We miss you, Sarah! Enjoy $15 off your refresh this week. [1-Click Link]"
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-card p-4 space-y-2">
                  <span className="font-bold text-emerald-600 uppercase text-[10px] tracking-wider">Result: Rebooked</span>
                  <h5 className="font-semibold text-emerald-600">Paid Deposit Received</h5>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Sarah taps link, selects Friday slot, and pays deposit without calling salon.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Conversion Bar */}
        <div className="mt-16 rounded-3xl bg-brand-wash p-8 md:p-12 text-center text-primary-foreground flex flex-col items-center">
          <h3 className="font-serif text-2xl md:text-4xl font-medium max-w-2xl">
            Want to see these features configured for your specific salon or clinic?
          </h3>
          <p className="text-primary-foreground/80 mt-3 max-w-lg text-sm md:text-base">
            Request a turnkey quote or chat live with a solutions engineer right now.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary font-bold hover:bg-neutral-100 shadow-lg">
              <Link to={paths.standalone}>
                Request Turnkey Deployment Quote <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
            <button
              type="button"
              onClick={() => openChatwoot()}
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <MessageSquare className="size-4" />
              <span>Start Live Chat</span>
            </button>
          </div>
        </div>
      </Container>
    </>
  );
}
