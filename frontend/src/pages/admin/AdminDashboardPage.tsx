import { useState, useMemo, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Copy,
  Download,
  Globe,
  LogOut,
  Mail,
  MessageCircle,
  MessageSquare,
  Plus,
  Search,
  Send,
  Trash2,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin, type LeadStatus } from "@/context/AdminContext";
import { useCurrency } from "@/context/CurrencyContext";
import CurrencySelector from "@/components/marketing/CurrencySelector";
import { paths } from "@/router/paths";

type AdminTab = "leads" | "marketing" | "proposals";

const STATUS_LABELS: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: "New Inbound", color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30" },
  contacted: { label: "Contacted", color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" },
  demo_scheduled: { label: "Demo Scheduled", color: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30" },
  proposal_sent: { label: "Proposal Sent", color: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30" },
  won: { label: "Closed / Won", color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" },
  lost: { label: "Archived / Lost", color: "bg-neutral-500/15 text-neutral-500 border-neutral-500/30" },
};

export default function AdminDashboardPage() {
  const { leads, updateLeadStatus, addLeadNote, addLead, deleteLead, exportLeadsCsv, logout } = useAdmin();
  const { formatAmount, symbol } = useCurrency();
  const [activeTab, setActiveTab] = useState<AdminTab>("leads");

  // Leads Filter & Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeNoteLeadId, setActiveNoteLeadId] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

  // New Lead Form State
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadBusiness, setNewLeadBusiness] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadCity, setNewLeadCity] = useState("");
  const [newLeadTeamSize, setNewLeadTeamSize] = useState("3-5 staff");
  const [newLeadSoftware, setNewLeadSoftware] = useState("Fresha");
  const [newLeadValue, setNewLeadValue] = useState(1500);

  // UTM Generator State
  const [utmPath, setUtmPath] = useState("/");
  const [utmSource, setUtmSource] = useState("instagram");
  const [utmMedium, setUtmMedium] = useState("bio");
  const [utmCampaign, setUtmCampaign] = useState("salon_owners_launch");
  const [copiedLink, setCopiedLink] = useState(false);

  // Proposal Builder State
  const [proposalClient, setProposalClient] = useState("Marcus Vance");
  const [proposalBusiness, setProposalBusiness] = useState("The Noble Barber Co.");
  const [includeDispensary, setIncludeDispensary] = useState(true);
  const [includeMigration, setIncludeMigration] = useState(true);
  const [includeWalkIn, setIncludeWalkIn] = useState(true);
  const [proposalFee, setProposalFee] = useState(1400);
  const [copiedProposal, setCopiedProposal] = useState(false);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        lead.name.toLowerCase().includes(q) ||
        lead.businessName.toLowerCase().includes(q) ||
        lead.city.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        (lead.currentSoftware && lead.currentSoftware.toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  }, [leads, statusFilter, searchQuery]);

  // High level KPIs
  const totalLeads = leads.length;
  const newLeadsCount = leads.filter((l) => l.status === "new").length;
  const pipelineValue = leads
    .filter((l) => l.status !== "lost")
    .reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
  const wonValue = leads
    .filter((l) => l.status === "won")
    .reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
  const winRate = totalLeads > 0 ? Math.round((leads.filter((l) => l.status === "won").length / totalLeads) * 100) : 0;

  // Competitor breakdown
  const competitorStats = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      const sw = l.currentSoftware || "Other";
      counts[sw] = (counts[sw] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [leads]);

  function handleAddLeadSubmit(e: FormEvent) {
    e.preventDefault();
    if (!newLeadName || !newLeadBusiness) return;

    addLead({
      name: newLeadName,
      businessName: newLeadBusiness,
      email: newLeadEmail,
      phone: newLeadPhone,
      city: newLeadCity,
      teamSize: newLeadTeamSize,
      currentSoftware: newLeadSoftware,
      estimatedValue: Number(newLeadValue) || 1200,
      status: "new",
      source: "Manual Admin Entry",
    });

    // Reset
    setNewLeadName("");
    setNewLeadBusiness("");
    setNewLeadEmail("");
    setNewLeadPhone("");
    setNewLeadCity("");
    setShowAddLeadModal(false);
  }

  function handleAddNote(leadId: string) {
    if (!newNoteText.trim()) return;
    addLeadNote(leadId, newNoteText);
    setNewNoteText("");
  }

  // Generate UTM link
  const generatedUtmUrl = `https://www.pauluxbooking.com${utmPath}?utm_source=${encodeURIComponent(utmSource)}&utm_medium=${encodeURIComponent(utmMedium)}&utm_campaign=${encodeURIComponent(utmCampaign)}`;

  function copyUtmLink() {
    navigator.clipboard.writeText(generatedUtmUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  // Generate formatted proposal
  const generatedProposalText = `✨ *PAULUX ENTERPRISE STANDALONE DEPLOYMENT PROPOSAL* ✨

*Prepared For:* ${proposalClient} (${proposalBusiness})
*Target Domain:* booking.${proposalBusiness.toLowerCase().replace(/[^a-z0-9]/g, "")}.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 *INCLUDED TURNKEY PLATFORM MODULES:*
✓ 100% Dedicated Custom Domain Deployment
✓ 0% Commission on all client appointments & walk-ins
✓ 100% Private Isolated Customer Database
✓ Automated 2-Way Google Calendar Sync
${includeWalkIn ? "✓ 15-Second Front-Desk Walk-In Mode & Chair Queue" : ""}
${includeDispensary ? "✓ Chemical Dispensary & Consumables Accounting (ml/g tracking)" : ""}
${includeMigration ? "✓ Full White-Glove Client & Service Migration from current software" : ""}
✓ Automated 30/60/90-Day Retention SMS & Review Booster

💰 *DEPLOYMENT QUOTE:* ${formatAmount(proposalFee)} (One-time Setup)
*Ongoing Monthly Software Fee:* $0 / month (0% commissions forever)

Ready to proceed? We can deploy your live staging environment within 48 hours. Let us know and we'll send the onboarding checklist!`;

  function copyProposal() {
    navigator.clipboard.writeText(generatedProposalText);
    setCopiedProposal(true);
    setTimeout(() => setCopiedProposal(false), 2000);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to={paths.home} className="flex items-center gap-2 font-serif text-lg font-bold text-foreground">
              <span className="size-8 rounded-xl bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm">
                P
              </span>
              <span>Paulux Admin</span>
            </Link>
            <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-bold text-accent uppercase tracking-wider hidden sm:inline">
              Command Center
            </span>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            <CurrencySelector />
            <Link
              to={paths.home}
              className="hidden sm:inline-flex text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Public Site ↗
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="gap-1.5 text-xs border-border/70 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
            >
              <LogOut className="size-3.5" />
              <span>Log Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8 space-y-8">
        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Inbound Leads</span>
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                {newLeadsCount} New
              </span>
            </div>
            <p className="font-serif text-3xl font-bold mt-2">{totalLeads}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Total salon quote inquiries</p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Active Pipeline</span>
              <TrendingUp className="size-4 text-accent" />
            </div>
            <p className="font-serif text-3xl font-bold mt-2 text-accent">{formatAmount(pipelineValue)}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Weighted setup quotes</p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Closed / Won</span>
              <CheckCircle2 className="size-4 text-emerald-500" />
            </div>
            <p className="font-serif text-3xl font-bold mt-2 text-emerald-600 dark:text-emerald-400">
              {formatAmount(wonValue)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">Realized deployment revenue</p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Deal Close Rate</span>
              <BarChart3 className="size-4 text-purple-500" />
            </div>
            <p className="font-serif text-3xl font-bold mt-2">{winRate}%</p>
            <p className="text-[11px] text-muted-foreground mt-1">Lead to deployment conversion</p>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-border/70 gap-2 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("leads")}
            className={`pb-3 px-3 flex items-center gap-2 transition-colors border-b-2 -mb-px ${
              activeTab === "leads"
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="size-4" />
            <span>Sales Leads & CRM ({leads.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("marketing")}
            className={`pb-3 px-3 flex items-center gap-2 transition-colors border-b-2 -mb-px ${
              activeTab === "marketing"
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="size-4" />
            <span>Marketing & Campaigns</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("proposals")}
            className={`pb-3 px-3 flex items-center gap-2 transition-colors border-b-2 -mb-px ${
              activeTab === "proposals"
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Send className="size-4" />
            <span>Quote & Proposal Drafter</span>
          </button>
        </div>

        {/* TAB 1: LEADS & CRM PIPELINE */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search salon, owner, city, phone..."
                    className="w-full rounded-xl border border-border/80 bg-secondary/40 pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowAddLeadModal(true)}
                  size="sm"
                  className="bg-primary text-primary-foreground text-xs gap-1.5 shadow-sm"
                >
                  <Plus className="size-4" /> Add Lead
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportLeadsCsv}
                  className="text-xs gap-1.5 border-border/80"
                >
                  <Download className="size-3.5" /> Export CSV
                </Button>
              </div>
            </div>

            {/* Status Tabs Filter */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                  statusFilter === "all"
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
                }`}
              >
                All ({leads.length})
              </button>
              {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((st) => {
                const count = leads.filter((l) => l.status === st).length;
                const isSelected = statusFilter === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                      isSelected
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {STATUS_LABELS[st].label} ({count})
                  </button>
                );
              })}
            </div>

            {/* Leads List */}
            <div className="space-y-4">
              {filteredLeads.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground space-y-2">
                  <Users className="size-8 mx-auto text-muted-foreground/50" />
                  <p className="text-sm font-medium">No leads match your filter criteria.</p>
                  <p className="text-xs">Try clearing the search or status filter.</p>
                </div>
              ) : (
                filteredLeads.map((lead) => {
                  const isNoteOpen = activeNoteLeadId === lead.id;
                  const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
                  const waOutreachMsg = encodeURIComponent(
                    `Hi ${lead.name}! This is the Paulux team following up on your standalone booking system inquiry for ${lead.businessName}. Do you have 5 minutes to chat about your setup requirements?`
                  );
                  const waLink = cleanPhone ? `https://wa.me/${cleanPhone}?text=${waOutreachMsg}` : null;

                  return (
                    <div
                      key={lead.id}
                      className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:border-accent/40 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="font-serif text-lg font-semibold text-foreground">
                              {lead.businessName}
                            </h3>
                            <span
                              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                                STATUS_LABELS[lead.status].color
                              }`}
                            >
                              {STATUS_LABELS[lead.status].label}
                            </span>
                            {lead.currentSoftware && (
                              <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                                from {lead.currentSoftware}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Contact: <strong className="text-foreground">{lead.name}</strong> · {lead.city} · Team: {lead.teamSize}
                          </p>
                        </div>

                        {/* Pipeline Stage Quick Changer */}
                        <div className="flex items-center gap-2">
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                            className="rounded-lg border border-border/80 bg-secondary/50 px-2.5 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                          >
                            {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
                              <option key={s} value={s}>
                                Stage: {STATUS_LABELS[s].label}
                              </option>
                            ))}
                          </select>
                          <span className="font-mono text-sm font-bold text-accent">
                            {formatAmount(lead.estimatedValue)}
                          </span>
                        </div>
                      </div>

                      {/* Lead Message Inquiry */}
                      {lead.message && (
                        <div className="rounded-xl bg-secondary/30 p-3 text-xs text-muted-foreground leading-relaxed">
                          <strong className="text-foreground block text-[11px] uppercase tracking-wider mb-0.5">
                            Client Note / Requirements:
                          </strong>
                          "{lead.message}"
                        </div>
                      )}

                      {/* Quick Contact & Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3 text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          {waLink && (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366]/25 px-3 py-1.5 font-semibold transition-colors"
                            >
                              <MessageCircle className="size-3.5" />
                              <span>WhatsApp Lead</span>
                            </a>
                          )}
                          <a
                            href={`mailto:${lead.email}?subject=Paulux%20Standalone%20Deployment%20for%20${encodeURIComponent(lead.businessName)}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-secondary/50 hover:bg-secondary px-3 py-1.5 font-medium transition-colors"
                          >
                            <Mail className="size-3.5" />
                            <span>Email ({lead.email})</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => setActiveNoteLeadId(isNoteOpen ? null : lead.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-secondary/50 hover:bg-secondary px-3 py-1.5 font-medium transition-colors"
                          >
                            <MessageSquare className="size-3.5" />
                            <span>Notes ({lead.notes?.length || 0})</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span>Source: {lead.source}</span>
                          <span>·</span>
                          <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete lead "${lead.businessName}"?`)) {
                                deleteLead(lead.id);
                              }
                            }}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                            title="Delete Lead"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Expandable Notes Drawer */}
                      {isNoteOpen && (
                        <div className="rounded-xl border border-border/60 bg-secondary/20 p-4 space-y-3 animate-in fade-in duration-200">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Internal Follow-up Notes
                          </p>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newNoteText}
                              onChange={(e) => setNewNoteText(e.target.value)}
                              placeholder="Add follow-up note (e.g. Call scheduled, needs Paystack)..."
                              className="flex-1 rounded-lg border border-border/80 bg-card px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddNote(lead.id);
                                }
                              }}
                            />
                            <Button size="sm" onClick={() => handleAddNote(lead.id)} className="text-xs h-8">
                              Add
                            </Button>
                          </div>

                          <div className="space-y-1.5 text-xs">
                            {lead.notes?.map((n) => (
                              <div key={n.id} className="rounded-lg bg-card p-2 border border-border/50 text-xs">
                                <p className="text-foreground">{n.text}</p>
                                <span className="text-[10px] text-muted-foreground block mt-1">
                                  {new Date(n.createdAt).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MARKETING & COMPETITOR ANALYTICS */}
        {activeTab === "marketing" && (
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left: Competitor Displacement Stats */}
            <div className="lg:col-span-6 space-y-6">
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-5 text-accent" />
                  <h3 className="font-serif text-lg font-semibold">Competitor Displacement Tracker</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Where inbound salon leads are currently migrating from. Use this data to prioritize marketing copy.
                </p>

                <div className="space-y-3 pt-2">
                  {competitorStats.map(([software, count]) => {
                    const percentage = Math.round((count / (leads.length || 1)) * 100);
                    return (
                      <div key={software} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span>Migrating from {software}</span>
                          <span className="font-bold text-accent">{count} salons ({percentage}%)</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Published SEO Landing Page Hub */}
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="size-5 text-emerald-500" />
                  <h3 className="font-serif text-lg font-semibold">Live High-Converting SEO Entry Points</h3>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/40">
                    <span className="font-medium">/booksy-alternative</span>
                    <a href="/booksy-alternative" target="_blank" className="text-accent hover:underline">View Page ↗</a>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/40">
                    <span className="font-medium">/mindbody-alternative</span>
                    <a href="/mindbody-alternative" target="_blank" className="text-accent hover:underline">View Page ↗</a>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/40">
                    <span className="font-medium">/fresha-alternative</span>
                    <a href="/fresha-alternative" target="_blank" className="text-accent hover:underline">View Page ↗</a>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/40">
                    <span className="font-medium">/salon-chemical-dispensary-software</span>
                    <a href="/salon-chemical-dispensary-software" target="_blank" className="text-accent hover:underline">View Page ↗</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: UTM Campaign Link Generator */}
            <div className="lg:col-span-6 space-y-6">
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="size-5 text-amber-500" />
                  <h3 className="font-serif text-lg font-semibold">UTM Campaign Link Builder</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Generate trackable URLs for Instagram Bio, WhatsApp broadcast messages, Reddit replies, or influencer shoutouts.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-medium text-muted-foreground block mb-1">Target Page</label>
                    <select
                      value={utmPath}
                      onChange={(e) => setUtmPath(e.target.value)}
                      className="w-full rounded-xl border border-border/80 bg-secondary/50 p-2.5 text-xs text-foreground focus:ring-1 focus:ring-accent"
                    >
                      <option value="/">Homepage (Main Landing)</option>
                      <option value="/booksy-alternative">Booksy Alternative (Barbers)</option>
                      <option value="/mindbody-alternative">Mindbody Alternative (MedSpas)</option>
                      <option value="/fresha-alternative">Fresha Alternative (Hair Salons)</option>
                      <option value="/standalone">Get Quote Intake</option>
                      <option value="/roi-calculator">ROI Savings Calculator</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-medium text-muted-foreground block mb-1">Campaign Source (utm_source)</label>
                      <input
                        type="text"
                        value={utmSource}
                        onChange={(e) => setUtmSource(e.target.value)}
                        placeholder="instagram, whatsapp, reddit"
                        className="w-full rounded-xl border border-border/80 bg-secondary/50 p-2.5 text-xs text-foreground focus:ring-1 focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-muted-foreground block mb-1">Medium (utm_medium)</label>
                      <input
                        type="text"
                        value={utmMedium}
                        onChange={(e) => setUtmMedium(e.target.value)}
                        placeholder="bio, dm, story, post"
                        className="w-full rounded-xl border border-border/80 bg-secondary/50 p-2.5 text-xs text-foreground focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-medium text-muted-foreground block mb-1">Campaign Name (utm_campaign)</label>
                    <input
                      type="text"
                      value={utmCampaign}
                      onChange={(e) => setUtmCampaign(e.target.value)}
                      placeholder="e.g. accra_barbers, london_medspas"
                      className="w-full rounded-xl border border-border/80 bg-secondary/50 p-2.5 text-xs text-foreground focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div className="rounded-xl border border-border bg-secondary/40 p-3 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-accent block">
                      Generated Trackable URL:
                    </span>
                    <p className="font-mono text-xs break-all text-foreground select-all bg-card p-2 rounded border border-border/50">
                      {generatedUtmUrl}
                    </p>
                    <Button onClick={copyUtmLink} size="sm" className="w-full text-xs gap-1.5">
                      <Copy className="size-3.5" />
                      <span>{copiedLink ? "✓ Copied to Clipboard!" : "Copy Campaign Link"}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROPOSAL & QUOTE DRAFTER */}
        {activeTab === "proposals" && (
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Send className="size-5 text-accent" />
                  <h3 className="font-serif text-lg font-semibold">Quote Parameters</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Customize deployment modules and generate a WhatsApp-ready proposal message.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-medium text-muted-foreground block mb-1">Owner / Contact Name</label>
                    <input
                      type="text"
                      value={proposalClient}
                      onChange={(e) => setProposalClient(e.target.value)}
                      className="w-full rounded-xl border border-border/80 bg-secondary/50 p-2.5 text-xs text-foreground focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-muted-foreground block mb-1">Salon / Business Name</label>
                    <input
                      type="text"
                      value={proposalBusiness}
                      onChange={(e) => setProposalBusiness(e.target.value)}
                      className="w-full rounded-xl border border-border/80 bg-secondary/50 p-2.5 text-xs text-foreground focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-muted-foreground block mb-1">Deployment Fee ({symbol})</label>
                    <input
                      type="number"
                      value={proposalFee}
                      onChange={(e) => setProposalFee(Number(e.target.value))}
                      className="w-full rounded-xl border border-border/80 bg-secondary/50 p-2.5 text-xs text-foreground font-mono focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  {/* Module Checkboxes */}
                  <div className="space-y-2 pt-2 border-t border-border/60">
                    <p className="font-semibold text-foreground">Include Enterprise Features:</p>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeWalkIn}
                        onChange={(e) => setIncludeWalkIn(e.target.checked)}
                        className="rounded accent-primary"
                      />
                      <span>15-Second Walk-In Front Desk Mode</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeDispensary}
                        onChange={(e) => setIncludeDispensary(e.target.checked)}
                        className="rounded accent-primary"
                      />
                      <span>Chemical Dispensary ml/g Accounting</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeMigration}
                        onChange={(e) => setIncludeMigration(e.target.checked)}
                        className="rounded accent-primary"
                      />
                      <span>White-Glove Database & Client Migration</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-semibold">Live Proposal Preview</h3>
                  <Button onClick={copyProposal} size="sm" className="text-xs gap-1.5">
                    <Copy className="size-3.5" />
                    <span>{copiedProposal ? "✓ Copied!" : "Copy Proposal Message"}</span>
                  </Button>
                </div>

                <div className="rounded-2xl border border-border/70 bg-secondary/30 p-5 font-mono text-xs whitespace-pre-wrap leading-relaxed text-foreground select-all">
                  {generatedProposalText}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-border/80 bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-serif text-xl font-bold">Add Manual Salon Lead</h3>
              <button
                type="button"
                onClick={() => setShowAddLeadModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddLeadSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-muted-foreground block mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={newLeadName}
                    onChange={(e) => setNewLeadName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full rounded-xl border border-border bg-secondary/50 p-2.5"
                  />
                </div>
                <div>
                  <label className="font-medium text-muted-foreground block mb-1">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={newLeadBusiness}
                    onChange={(e) => setNewLeadBusiness(e.target.value)}
                    placeholder="e.g. Royal Fade Studio"
                    className="w-full rounded-xl border border-border bg-secondary/50 p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-muted-foreground block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    placeholder="owner@salon.com"
                    className="w-full rounded-xl border border-border bg-secondary/50 p-2.5"
                  />
                </div>
                <div>
                  <label className="font-medium text-muted-foreground block mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    placeholder="+233... or +44..."
                    className="w-full rounded-xl border border-border bg-secondary/50 p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-muted-foreground block mb-1">City / Country</label>
                  <input
                    type="text"
                    value={newLeadCity}
                    onChange={(e) => setNewLeadCity(e.target.value)}
                    placeholder="e.g. Accra, Ghana"
                    className="w-full rounded-xl border border-border bg-secondary/50 p-2.5"
                  />
                </div>
                <div>
                  <label className="font-medium text-muted-foreground block mb-1">Current Software</label>
                  <select
                    value={newLeadSoftware}
                    onChange={(e) => setNewLeadSoftware(e.target.value)}
                    className="w-full rounded-xl border border-border bg-secondary/50 p-2.5"
                  >
                    <option value="Fresha">Fresha</option>
                    <option value="Booksy">Booksy</option>
                    <option value="Mindbody">Mindbody</option>
                    <option value="Square">Square</option>
                    <option value="Pen & Paper / Excel">Pen & Paper / Excel</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-muted-foreground block mb-1">Team Size</label>
                  <select
                    value={newLeadTeamSize}
                    onChange={(e) => setNewLeadTeamSize(e.target.value)}
                    className="w-full rounded-xl border border-border bg-secondary/50 p-2.5"
                  >
                    <option value="Solo (1 staff)">Solo (1 staff)</option>
                    <option value="2-5 staff">2-5 staff</option>
                    <option value="6-10 staff">6-10 staff</option>
                    <option value="11+ staff">11+ staff</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-muted-foreground block mb-1">Estimated Deal Value ($)</label>
                  <input
                    type="number"
                    value={newLeadValue}
                    onChange={(e) => setNewLeadValue(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-secondary/50 p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddLeadModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                  Save to Pipeline
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
