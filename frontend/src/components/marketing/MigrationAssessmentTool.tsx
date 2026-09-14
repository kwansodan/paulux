import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Database,
  FileSpreadsheet,
  Gift,
  HelpCircle,
  Package,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { paths } from "@/router/paths";
import { cn } from "@/lib/utils";

export interface MigrationAsset {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  recommended?: boolean;
}

const ASSET_OPTIONS: MigrationAsset[] = [
  {
    id: "clients",
    name: "Client Records & Contact Histories",
    description: "Phone numbers, emails, birthdays, and complete appointment notes",
    icon: Users,
    recommended: true,
  },
  {
    id: "menu",
    name: "Service Menu & Tiered Pricing",
    description: "All categories, duration times, addon options, and service variations",
    icon: FileSpreadsheet,
    recommended: true,
  },
  {
    id: "formulas",
    name: "Color Formulas & Dispensary Notes",
    description: "Bowl-by-bowl color recipes, developer ratios, and historical notes",
    icon: Sparkles,
    recommended: true,
  },
  {
    id: "stylists",
    name: "Stylist Rosters & Commission Rules",
    description: "Staff profiles, working schedules, tiers, and split structures",
    icon: Calendar,
    recommended: true,
  },
  {
    id: "appointments",
    name: "Future Bookings & Calendar Holds",
    description: "Upcoming scheduled appointments across all stylists and stations",
    icon: Clock,
  },
  {
    id: "giftcards",
    name: "Gift Cards & Package Balances",
    description: "Unredeemed voucher credits and pre-paid package allowances",
    icon: Gift,
  },
  {
    id: "inventory",
    name: "Retail Products & Backbar Inventory",
    description: "SKUs, barcode numbers, supplier costs, and retail prices",
    icon: Package,
  },
];

interface PlatformProfile {
  id: string;
  name: string;
  exportEase: "Instant CSV" | "Standard Export" | "Automated Ingestion";
  baseDowntimeRisk: string;
  keyWin: string;
  migrationInsight: string;
}

const PLATFORMS: Record<string, PlatformProfile> = {
  fresha: {
    id: "fresha",
    name: "Fresha",
    exportEase: "Standard Export",
    baseDowntimeRisk: "0% Downtime with dual-run sync",
    keyWin: "Eliminates 20% commission on all new clients and prevents competitors from advertising next to your salon.",
    migrationInsight: "Fresha allows exporting client lists, sales, and service menus directly to CSV. Our team maps your client notes directly into private PostgreSQL fields.",
  },
  booksy: {
    id: "booksy",
    name: "Booksy",
    exportEase: "Instant CSV",
    baseDowntimeRisk: "0% Downtime with dual-run sync",
    keyWin: "Eliminates $20/chair/month software bloat and unlocks the 15-second walk-in front-desk kiosk mode.",
    migrationInsight: "Booksy exports clients and appointments smoothly. We retain all historical client visit records and stylist commission splits.",
  },
  mindbody: {
    id: "mindbody",
    name: "Mindbody",
    exportEase: "Standard Export",
    baseDowntimeRisk: "0% Downtime with dual-run sync",
    keyWin: "Saves $159–$699/month in subscription tiers and replaces clunky legacy interfaces with blazing fast mobile booking.",
    migrationInsight: "Mindbody report exports are standardized. We handle bulk client CSV ingestion and service menu structure translation in under 48 hours.",
  },
  vagaro: {
    id: "vagaro",
    name: "Vagaro",
    exportEase: "Standard Export",
    baseDowntimeRisk: "0% Downtime with dual-run sync",
    keyWin: "Removes costly add-on nickel-and-diming (forms, SMS packages, client cards included out of the box).",
    migrationInsight: "Vagaro client files and service categories map 1:1 into Paulux. Form responses and color notes are preserved in customer profiles.",
  },
  "square-appointments": {
    id: "square-appointments",
    name: "Square Appointments",
    exportEase: "Instant CSV",
    baseDowntimeRisk: "0% Downtime with dual-run sync",
    keyWin: "Adds dedicated chemical dispensary (ml/g) tracking and native custom-domain luxury branding.",
    migrationInsight: "Square customer directories export natively via Square Dashboard. We preserve customer cards and loyalty tags seamlessly.",
  },
  phorest: {
    id: "phorest",
    name: "Phorest",
    exportEase: "Standard Export",
    baseDowntimeRisk: "0% Downtime with dual-run sync",
    keyWin: "Freedom from multi-year contracts, locked proprietary hardware, and mandatory software tier escalations.",
    migrationInsight: "Our engineers extract Phorest client spreadsheets and formulation histories, transferring them to your dedicated web and mobile application.",
  },
  other: {
    id: "other",
    name: "Other Platform or Spreadsheets",
    exportEase: "Automated Ingestion",
    baseDowntimeRisk: "0% Downtime with dual-run sync",
    keyWin: "Full turnkey engineering deployment with custom domain, private database, and zero commission cuts.",
    migrationInsight: "Send us your CSVs, Excel files, or legacy software reports. Our team cleans, normalizes, and migrates your dataset with zero manual effort on your part.",
  },
};

interface MigrationAssessmentToolProps {
  defaultPlatform?: string;
  className?: string;
}

export default function MigrationAssessmentTool({
  defaultPlatform = "fresha",
  className,
}: MigrationAssessmentToolProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>(
    PLATFORMS[defaultPlatform] ? defaultPlatform : "fresha"
  );
  const [teamSize, setTeamSize] = useState<string>("4-10");
  const [selectedAssets, setSelectedAssets] = useState<string[]>([
    "clients",
    "menu",
    "formulas",
    "stylists",
    "appointments",
  ]);

  const activePlatform = PLATFORMS[selectedPlatform] || PLATFORMS.fresha;

  function toggleAsset(id: string) {
    setSelectedAssets((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  // Turnaround calculation based on team size & asset complexity
  const isLarge = teamSize === "11-25" || teamSize === "25+";
  const turnaround = isLarge ? "24 – 48 Hours" : "Under 24 Hours";

  // Standalone link params
  const standaloneUrl = `${paths.standalone}?platform=${encodeURIComponent(
    activePlatform.name
  )}&teamSize=${encodeURIComponent(teamSize)}&turnaround=${encodeURIComponent(
    turnaround
  )}&assets=${encodeURIComponent(selectedAssets.join(","))}&source=migration-assessment`;

  const waMigrationMsg = encodeURIComponent(
    `Hi Paulux Engineering! I ran your Migration Assessment for switching from ${activePlatform.name}. We have ${teamSize} staff and want to migrate: ${selectedAssets.join(
      ", "
    )}. Please confirm our turnaround time and zero-downtime deployment plan!`
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-xl md:p-10",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold tracking-wider text-accent uppercase">
            <RefreshCw className="size-3.5" />
            <span>Zero-Downtime Migration Engine</span>
          </div>
          <h3 className="font-serif mt-2 text-2xl font-medium tracking-tight md:text-3xl">
            Interactive Migration Assessment
          </h3>
          <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
            See how seamlessly your salon can switch to a dedicated Paulux deployment. We migrate your clients, formulas, schedules, and past history without a single second of salon downtime.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs text-emerald-700 dark:text-emerald-300 self-start md:self-auto">
          <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="font-medium">100% Zero Missed Appointments Guarantee</span>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Input Configuration Column */}
        <div className="space-y-6 lg:col-span-7">
          {/* Step 1: Select Current Platform */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <span>1. Select Current Platform</span>
              <HelpCircle className="size-3.5 text-muted-foreground/70" />
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {Object.values(PLATFORMS).map((p) => {
                const isSelected = selectedPlatform === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlatform(p.id)}
                    className={cn(
                      "flex flex-col items-start justify-between rounded-xl border p-3 text-left transition-all text-xs",
                      isSelected
                        ? "border-accent bg-accent/10 shadow-sm ring-1 ring-accent"
                        : "border-border/70 bg-secondary/30 hover:border-border hover:bg-secondary/60 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="font-semibold text-foreground">{p.name}</span>
                    <span className="mt-1 text-[10px] text-muted-foreground">
                      {p.exportEase}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Team Size */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              2. Salon Scale & Stylist Roster
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "1 – 3 Stylists", value: "1-3", sub: "Solo / Boutique" },
                { label: "4 – 10 Stylists", value: "4-10", sub: "Established Salon" },
                { label: "11 – 25 Stylists", value: "11-25", sub: "High-Volume Hub" },
                { label: "25+ Stylists", value: "25+", sub: "Multi-Location" },
              ].map((tier) => (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() => setTeamSize(tier.value)}
                  className={cn(
                    "flex flex-col rounded-xl border p-3 text-left transition-all text-xs",
                    teamSize === tier.value
                      ? "border-accent bg-accent/10 shadow-sm ring-1 ring-accent"
                      : "border-border/70 bg-secondary/30 hover:border-border hover:bg-secondary/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="font-semibold text-foreground">{tier.label}</span>
                  <span className="text-[10px] text-muted-foreground">{tier.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Select Assets to Migrate */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                3. Choose Data Assets to Migrate
              </label>
              <button
                type="button"
                onClick={() =>
                  setSelectedAssets(
                    selectedAssets.length === ASSET_OPTIONS.length
                      ? ["clients", "menu"]
                      : ASSET_OPTIONS.map((a) => a.id)
                  )
                }
                className="text-xs text-accent hover:underline"
              >
                {selectedAssets.length === ASSET_OPTIONS.length ? "Reset Selection" : "Select All Assets"}
              </button>
            </div>

            <div className="space-y-2">
              {ASSET_OPTIONS.map((asset) => {
                const isChecked = selectedAssets.includes(asset.id);
                const Icon = asset.icon;
                return (
                  <div
                    key={asset.id}
                    onClick={() => toggleAsset(asset.id)}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all",
                      isChecked
                        ? "border-accent/40 bg-accent/5 shadow-xs"
                        : "border-border/60 bg-secondary/15 opacity-70 hover:opacity-100"
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border text-xs transition-colors",
                        isChecked
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-muted-foreground/40 bg-background"
                      )}
                    >
                      {isChecked && <Check className="size-3.5 stroke-[3]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Icon className="size-3.5 text-accent shrink-0" />
                        <span className="text-xs font-semibold text-foreground">
                          {asset.name}
                        </span>
                        {asset.recommended && (
                          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[9px] font-medium text-accent">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {asset.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Diagnosis & Action Blueprint Column */}
        <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-primary via-primary/95 to-[#1c0f1e] p-6 text-primary-foreground shadow-2xl lg:col-span-5 lg:p-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-0.5 text-xs text-primary-foreground/90">
              <Zap className="size-3 text-amber-300" />
              <span>Migration Diagnosis & Roadmap</span>
            </div>

            {/* Turnaround Badge */}
            <div className="mt-5 rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 p-4">
              <p className="text-[10px] uppercase tracking-wider text-primary-foreground/75">
                Estimated Engineering Turnaround
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold tracking-tight text-white">
                  {turnaround}
                </span>
                <span className="text-xs text-emerald-300 font-medium">
                  • 0 Salon Downtime
                </span>
              </div>
              <p className="text-[11px] text-primary-foreground/80 mt-1">
                Your current {activePlatform.name} system stays live and taking bookings while we configure your private database.
              </p>
            </div>

            {/* Platform Specific Win */}
            <div className="mt-4 space-y-2">
              <p className="text-[10px] uppercase tracking-wider text-primary-foreground/70">
                Immediate Upgrade vs. {activePlatform.name}
              </p>
              <p className="text-xs font-medium text-white/95 leading-relaxed bg-black/20 rounded-xl p-3 border border-white/10">
                ✨ {activePlatform.keyWin}
              </p>
            </div>

            {/* 4-Step Technical Migration Blueprint */}
            <div className="mt-6 border-t border-primary-foreground/15 pt-5 space-y-3 text-xs text-primary-foreground/90">
              <p className="text-[10px] uppercase tracking-wider text-primary-foreground/70 font-semibold">
                White-Glove Engineering Roadmap
              </p>

              <div className="flex items-start gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold">
                  1
                </span>
                <div>
                  <span className="font-semibold text-white">Export & Sanitize:</span>{" "}
                  <span className="text-primary-foreground/80 text-[11px]">
                    {activePlatform.migrationInsight}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold">
                  2
                </span>
                <div>
                  <span className="font-semibold text-white">Private DB Provisioning:</span>{" "}
                  <span className="text-primary-foreground/80 text-[11px]">
                    Dedicated PostgreSQL instance deployed under booking.yourbrand.com.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold">
                  3
                </span>
                <div>
                  <span className="font-semibold text-white">Dual-Run Parallel Mode:</span>{" "}
                  <span className="text-primary-foreground/80 text-[11px]">
                    Verify client balances, stylist logins, and formula histories with your managers.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold">
                  4
                </span>
                <div>
                  <span className="font-semibold text-white">DNS Cutover & Launch:</span>{" "}
                  <span className="text-primary-foreground/80 text-[11px]">
                    Instant transition with zero booking collisions and 0% platform commission.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 space-y-3">
            <Button
              asChild
              size="lg"
              className="w-full bg-white text-primary font-semibold hover:bg-neutral-100 shadow-md"
            >
              <Link to={standaloneUrl}>
                Lock In Zero-Downtime Migration <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
            <a
              href={`https://wa.me/?text=${waMigrationMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary-foreground/30 px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
            >
              <Database className="size-3.5 text-accent" />
              <span>Discuss Migration With Lead Engineer</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
