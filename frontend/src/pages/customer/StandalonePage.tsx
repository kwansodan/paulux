import { useState, useEffect, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AxiosError } from "axios";
import {
  ArrowLeft,
  Check,
  FileText,
  MessageCircle,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { api, ensureCsrf } from "@/lib/api";
import { openChatwoot } from "@/components/marketing/ChatwootWidget";
import { useAdmin } from "@/context/AdminContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/ui/container";
import { SeoHead } from "@/components/seo/SeoHead";
import { paths } from "@/router/paths";

function errMsg(err: unknown): string {
  return err instanceof AxiosError
    ? (err.response?.data?.error?.message ?? "Something went wrong")
    : "Something went wrong";
}

const PERKS = [
  "Your own domain — booking.yourbrand.com or yoursalon.com",
  "0% commission fees on all bookings, packages, and gift cards",
  "A dedicated, private PostgreSQL database for your customer records",
  "Direct payment integration with your merchant account (Paystack, Stripe)",
  "Automated SMS & Email appointment confirmations & reminders",
  "Turnkey setup with hands-on onboarding from our engineering team",
];

export default function StandalonePage() {
  const [searchParams] = useSearchParams();
  const { formatAmount } = useCurrency();
  const { addLead } = useAdmin();

  // URL query params from ROI Calculator or Migration Assessment
  const paramRevenue = searchParams.get("revenue");
  const paramBookings = searchParams.get("bookings");
  const paramTicket = searchParams.get("ticket");
  const paramPlatform = searchParams.get("platform");
  const paramSavings = searchParams.get("savings");
  const paramTeamSize = searchParams.get("teamSize");
  const paramTurnaround = searchParams.get("turnaround");
  const paramAssets = searchParams.get("assets");
  const paramSource = searchParams.get("source");

  const hasRoiProposal = Boolean(paramSavings || (paramSource === "roi-calculator" && paramPlatform));
  const hasMigrationPlan = Boolean(paramSource === "migration-assessment" || paramAssets);

  const [form, setForm] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    city: "",
    teamSize: paramTeamSize || "",
    message: "",
  });

  // Pre-fill message with structured proposal details once on load
  useEffect(() => {
    if (hasRoiProposal || hasMigrationPlan) {
      const parts: string[] = [];
      if (hasRoiProposal) {
        parts.push(`[ROI Proposal Attached: Switching from ${paramPlatform || "Marketplace"}]`);
        if (paramBookings && paramTicket) {
          parts.push(`- Volume: ~${paramBookings} bookings/mo at $${paramTicket} average ticket (Gross: ~$${paramRevenue}/mo)`);
        }
        if (paramSavings) {
          parts.push(`- Projected Annual Savings: ~$${Number(paramSavings).toLocaleString()}/year`);
        }
      }
      if (hasMigrationPlan) {
        parts.push(`[Zero-Downtime Migration Details]`);
        if (paramPlatform) parts.push(`- Current System: ${paramPlatform}`);
        if (paramTurnaround) parts.push(`- Target Turnaround: ${paramTurnaround}`);
        if (paramAssets) parts.push(`- Assets to Migrate: ${paramAssets}`);
      }
      setForm((f) => ({
        ...f,
        message: f.message ? f.message : parts.join("\n"),
        teamSize: f.teamSize ? f.teamSize : (paramTeamSize || ""),
      }));
    }
  }, [hasRoiProposal, hasMigrationPlan, paramPlatform, paramSavings, paramBookings, paramTicket, paramRevenue, paramTurnaround, paramAssets, paramTeamSize]);

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const leadSource = hasMigrationPlan
      ? "Migration Assessment Wizard"
      : hasRoiProposal
      ? "ROI Proposal Calculator"
      : "Standalone Quote Intake";

    const estimatedSavingsVal = paramSavings ? Number(paramSavings) : 1500;

    try {
      // Always capture lead in Admin CRM
      addLead({
        name: form.name,
        businessName: form.businessName,
        email: form.email,
        phone: form.phone || "Not provided",
        city: form.city || "Not provided",
        teamSize: form.teamSize ? `${form.teamSize} staff` : "1-5 staff",
        message: form.message || undefined,
        status: "new",
        estimatedValue: estimatedSavingsVal,
        source: leadSource,
      });

      // Best effort forward to backend API if active
      try {
        await ensureCsrf();
        await api.post("/api/leads", {
          name: form.name,
          businessName: form.businessName,
          email: form.email,
          phone: form.phone || undefined,
          city: form.city || undefined,
          teamSize: form.teamSize ? Number(form.teamSize) : undefined,
          message: form.message || undefined,
        });
      } catch {
        // Backend API offline or static deployment mode: local Admin CRM stores lead safely
      }

      setDone(true);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  const waLeadMsg = encodeURIComponent(
    `Hi Paulux Team! I'm ${form.name || "a salon owner"} from ${form.businessName || "my salon"}. ${
      hasRoiProposal && paramSavings
        ? `I have an ROI Proposal saving ~${formatAmount(Number(paramSavings))}/yr from ${paramPlatform || "our booking software"}.`
        : hasMigrationPlan
        ? `I completed the Migration Assessment to switch from ${paramPlatform || "our current platform"} with zero downtime.`
        : "I want to get a quote for a standalone booking system on my own domain."
    }`
  );

  if (done) {
    return (
      <Container className="flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <SeoHead
          title="Deployment Proposal Registered | Paulux Standalone Software"
          description="Your deployment and migration request has been received. Our solutions engineers are preparing your custom configuration."
          canonicalPath="/standalone"
        />
        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-6 flex size-16 items-center justify-center rounded-3xl shadow-sm">
          <Check className="size-8" />
        </span>
        <h1 className="font-serif text-3xl md:text-4xl">
          {hasRoiProposal || hasMigrationPlan
            ? "Your Migration Proposal Has Been Assigned"
            : "Thank You — We're Preparing Your Quote"}
        </h1>
        <p className="text-muted-foreground mt-3 max-w-lg text-sm md:text-base leading-relaxed">
          Your details for <strong>{form.businessName}</strong>
          {paramPlatform ? ` (switching from ${paramPlatform})` : ""} have been handed to a dedicated solutions engineer.
          {paramSavings && (
            <> We have attached your projected annual savings of <strong className="text-foreground">{formatAmount(Number(paramSavings))}/year</strong> to your file.</>
          )} We will reach out to <strong>{form.email}</strong> shortly.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => {
              const opened = openChatwoot();
              if (!opened) window.open(`https://wa.me/?text=${waLeadMsg}`, "_blank", "noopener,noreferrer");
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-all"
          >
            <MessageSquare className="size-4" />
            <span>Open Live Chat</span>
          </button>
          <a
            href={`https://wa.me/?text=${waLeadMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#20bd5a] transition-all"
          >
            <MessageCircle className="size-4 fill-white text-transparent" />
            <span>WhatsApp Us Now</span>
          </a>
          <Button asChild variant="outline">
            <Link to={paths.home}>
              <ArrowLeft className="size-4 mr-1.5" /> Back Home
            </Link>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <>
      <SeoHead
        title="Request Standalone Salon Software Deployment | Paulux"
        description="Deploy Paulux on your own domain with 0% commissions and complete client data privacy. Fill in your salon details for a fast turnkey deployment quote."
        keywords="standalone salon software quote, own domain booking setup, bespoke spa software deployment, white label salon platform inquiry"
        canonicalPath="/standalone"
      />

      <Container className="grid gap-12 py-16 lg:grid-cols-12 lg:py-24 lg:items-start">
        {/* Pitch Column */}
        <div className="flex flex-col justify-center lg:col-span-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-accent uppercase w-fit">
            <Sparkles className="size-3" />
            <span>Dedicated Turnkey Setup</span>
          </div>
          <h1 className="font-serif mt-3 text-4xl leading-tight md:text-5xl">
            Run Paulux on your own domain
          </h1>
          <p className="text-muted-foreground mt-4 max-w-lg text-base leading-relaxed">
            Eliminate commission fees and marketplace noise. Tell us about your salon and we will provision a dedicated, white-label deployment on your custom domain in under 48 hours.
          </p>

          <ul className="mt-8 flex flex-col gap-3.5 border-t border-border/80 pt-6">
            {PERKS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm">
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full">
                  <Check className="size-3.5" />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-2xl border border-border/70 bg-secondary/30 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">Need Instant Answers?</p>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              Want to speak with a solutions specialist right now? Start a live chat or message us directly on WhatsApp.
            </p>
            <div className="mt-3.5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const opened = openChatwoot();
                  if (!opened) window.open(`https://wa.me/?text=${waLeadMsg}`, "_blank", "noopener,noreferrer");
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
              >
                <MessageSquare className="size-3.5" />
                <span>Start Live Chat</span>
              </button>
              <a
                href={`https://wa.me/?text=${waLeadMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3.5 py-2 text-xs font-semibold text-[#25D366] hover:bg-secondary transition-all"
              >
                <MessageCircle className="size-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Lead Capture Form Column */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xl md:p-8 lg:col-span-6">
          {/* Active Proposal / Migration Plan Context Banner */}
          {hasRoiProposal && (
            <div className="mb-6 rounded-2xl border border-accent/40 bg-accent/10 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wide">
                <TrendingUp className="size-4" />
                <span>ROI Migration Proposal Attached</span>
              </div>
              <p className="mt-1 text-xs text-foreground leading-relaxed">
                Projected to recover{" "}
                <strong className="text-accent font-semibold">
                  ~{paramSavings ? formatAmount(Number(paramSavings)) : "$18,000+"}/year
                </strong>{" "}
                by eliminating commissions and subscription tiers from {paramPlatform || "your existing platform"}.
              </p>
            </div>
          )}

          {hasMigrationPlan && !hasRoiProposal && (
            <div className="mb-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                <ShieldCheck className="size-4" />
                <span>Zero-Downtime Migration Assessment Attached</span>
              </div>
              <p className="mt-1 text-xs text-foreground leading-relaxed">
                Targeting a seamless <strong>{paramTurnaround || "24–48 hour"}</strong> cutover from {paramPlatform || "your current software"} with 0 missed bookings.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-medium">Request Deployment Quote</h2>
              <p className="text-muted-foreground mt-1 text-xs">
                We review each request and provide a detailed timeline and turnkey setup quote.
              </p>
            </div>
            {(hasRoiProposal || hasMigrationPlan) && (
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-semibold text-accent">
                <FileText className="size-3" />
                <span>Custom Proposal</span>
              </span>
            )}
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-destructive/10 p-3 text-xs font-medium text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs">Your Name *</Label>
                <Input
                  id="name"
                  required
                  placeholder="e.g. Sophia Laurent"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="biz" className="text-xs">Salon / Spa Name *</Label>
                <Input
                  id="biz"
                  required
                  placeholder="e.g. Maison de Beauté"
                  value={form.businessName}
                  onChange={(e) => set("businessName", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">Business Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="sophia@salon.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs">Phone / WhatsApp Number</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="city" className="text-xs">City & Country</Label>
                <Input
                  id="city"
                  placeholder="e.g. London, UK or Accra, GH"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="team" className="text-xs">Stylist / Team Size</Label>
                <Input
                  id="team"
                  type="text"
                  placeholder="e.g. 6 staff"
                  value={form.teamSize}
                  onChange={(e) => set("teamSize", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="msg" className="text-xs">
                Current Booking Software, Migration Notes & Specific Needs
              </Label>
              <textarea
                id="msg"
                rows={4}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs leading-relaxed shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-sans"
                placeholder="e.g. Currently on Fresha, looking to eliminate 20% fees and deploy on booking.mybrand.com."
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
              />
            </div>

            <Button type="submit" disabled={busy} size="lg" className="mt-2 w-full font-semibold">
              {busy ? "Submitting..." : hasRoiProposal ? "Submit With Proposal Attached" : "Submit Quote Request"}
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground mt-1">
              <RefreshCw className="size-3 text-emerald-500" />
              <span>Zero salon downtime guarantee on all software migrations.</span>
            </div>
          </form>
        </div>
      </Container>
    </>
  );
}
