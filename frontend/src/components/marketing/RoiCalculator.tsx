import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calculator, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { paths } from "@/router/paths";

export default function RoiCalculator() {
  const [monthlyBookings, setMonthlyBookings] = useState<number>(450);
  const [avgTicket, setAvgTicket] = useState<number>(85);

  const monthlyGross = monthlyBookings * avgTicket;
  const annualGross = monthlyGross * 12;

  // Typical marketplace / platform fee: ~8.5% blended (new client cuts, processing markups, text message fees, tier fees)
  const annualFeesLost = Math.round(annualGross * 0.085 + 1800);
  const monthlyFeesLost = Math.round(annualFeesLost / 12);

  const waMessage = encodeURIComponent(
    `Hi Paulux Team! I ran your ROI Calculator. My salon does ~${monthlyBookings} bookings/mo at $${avgTicket} avg ticket. I'm looking to save ~$${annualFeesLost.toLocaleString()}/yr with a standalone system. Let's talk!`
  );

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-xl md:p-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold tracking-wider text-accent uppercase">
            <Calculator className="size-3.5" />
            <span>Commission Bleed Calculator</span>
          </div>
          <h3 className="font-serif mt-2 text-2xl font-medium tracking-tight md:text-3xl">
            See how much you lose to marketplace platforms
          </h3>
          <p className="text-muted-foreground mt-1 text-sm max-w-xl">
            Marketplaces like Fresha, Mindbody, and Booksy take 20% on new clients plus monthly tiers and processing markups. See what you keep by owning Paulux outright.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-center">
        {/* Sliders Area */}
        <div className="space-y-6 lg:col-span-7">
          <div className="space-y-3 rounded-2xl bg-secondary/40 p-5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Estimated Monthly Appointments</label>
              <span className="font-mono text-lg font-bold text-accent">{monthlyBookings.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="50"
              max="2500"
              step="25"
              value={monthlyBookings}
              onChange={(e) => setMonthlyBookings(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>50 bookings</span>
              <span>1,250</span>
              <span>2,500+</span>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl bg-secondary/40 p-5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Average Service Ticket Price</label>
              <span className="font-mono text-lg font-bold text-accent">${avgTicket}</span>
            </div>
            <input
              type="range"
              min="25"
              max="350"
              step="5"
              value={avgTicket}
              onChange={(e) => setAvgTicket(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$25 (Express)</span>
              <span>$150 (Signature)</span>
              <span>$350+ (Luxury Package)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl border border-border/60 p-4">
              <p className="text-xs text-muted-foreground">Monthly Gross Revenue</p>
              <p className="font-serif mt-1 text-xl font-medium">${monthlyGross.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-border/60 p-4">
              <p className="text-xs text-muted-foreground">Annual Gross Revenue</p>
              <p className="font-serif mt-1 text-xl font-medium">${annualGross.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-primary via-primary/95 to-[#1a0e1c] p-6 text-primary-foreground shadow-2xl lg:col-span-5 lg:p-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-0.5 text-xs text-primary-foreground/90">
              <Sparkles className="size-3 text-amber-300" />
              <span>Your Estimated Savings</span>
            </div>
            <p className="text-primary-foreground/75 mt-4 text-xs tracking-wide uppercase">
              Annual Marketplace Bleed
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-serif text-4xl font-semibold tracking-tight text-white md:text-5xl">
                ${annualFeesLost.toLocaleString()}
              </span>
              <span className="text-xs text-primary-foreground/70">/ year</span>
            </div>
            <p className="text-xs text-primary-foreground/60 mt-1">
              (That is roughly <span className="font-semibold text-white">${monthlyFeesLost.toLocaleString()}/mo</span> you give away to software platforms)
            </p>

            <ul className="mt-6 space-y-2.5 border-t border-primary-foreground/15 pt-5 text-xs text-primary-foreground/85">
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-400 shrink-0" />
                <span><strong>0% Commission</strong> on all bookings & walk-ins</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-400 shrink-0" />
                <span><strong>100% of client payments</strong> go straight to your account</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-400 shrink-0" />
                <span><strong>Dedicated deployment</strong> on your own domain</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 space-y-3">
            <Button asChild size="lg" className="w-full bg-white text-primary font-semibold hover:bg-neutral-100 shadow-md">
              <Link to={paths.standalone}>
                Claim Your Savings � Get Quote <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
            <a
              href={`https://wa.me/?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary-foreground/30 px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
            >
              ?? WhatsApp Us This Calculation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
