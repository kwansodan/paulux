import { Link } from "react-router-dom";
import { ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import FeatureShowcase from "@/components/marketing/FeatureShowcase";
import { paths } from "@/router/paths";

const BENEFITS = [
  "Your own domain — yourbrand.com, not a shared subdomain",
  "A dedicated, isolated deployment that's yours alone",
  "Your branding end to end",
  "Hands-on onboarding from our team",
];

const STEPS = [
  { n: 1, title: "Tell us about your business", body: "Share a few details through the enquiry form and we'll be in touch." },
  { n: 2, title: "We set you up", body: "We provision your own domain and a dedicated deployment, branded for you." },
  { n: 3, title: "Go live", body: "With hands-on onboarding, start taking bookings on your own home." },
];

export default function MarketingLanding() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-wash text-primary-foreground relative overflow-hidden">
        <Container className="relative flex flex-col items-center gap-7 py-28 text-center md:py-36">
          <span className="text-primary-foreground/70 text-xs tracking-luxe uppercase">
            The booking platform for luxury spas
          </span>
          <h1 className="font-serif max-w-3xl text-5xl leading-[1.05] font-medium md:text-6xl">
            Your salon, on your own domain
          </h1>
          <p className="text-primary-foreground/80 max-w-xl text-lg">
            Paulux gives your salon a dedicated booking home — appointments,
            payments, and gift cards — fully branded and running on your own
            domain.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild size="lg" className="bg-primary-foreground text-primary hover:brightness-95">
              <Link to={paths.standalone}>Get your own domain <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
          <p className="text-primary-foreground/50 text-xs tracking-wide">
            Your own domain · dedicated setup · hands-on onboarding
          </p>
        </Container>
      </section>

      {/* Why standalone */}
      <Container className="py-24">
        <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-accent text-xs tracking-luxe uppercase">Standalone</p>
            <h2 className="font-serif mt-2 text-3xl">A home that's fully your own</h2>
            <p className="text-muted-foreground mt-4">
              No shared subdomain, no platform branding in the way — a dedicated
              deployment on your own domain, set up with you and for you.
            </p>
            <Button asChild className="mt-8">
              <Link to={paths.standalone}>Request access <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
          <ul className="flex flex-col gap-4">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="bg-accent/10 text-accent mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg">
                  <Globe className="size-4" />
                </span>
                <span className="text-sm">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* Features */}
      <FeatureShowcase />

      {/* How it works */}
      <section className="bg-secondary/50 py-24">
        <Container>
          <div className="mb-12 text-center">
            <p className="text-accent text-xs tracking-luxe uppercase">How it works</p>
            <h2 className="font-serif mt-2 text-3xl">Live in three steps</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="flex flex-col items-center gap-3 text-center">
                <span className="bg-primary text-primary-foreground font-serif flex size-12 items-center justify-center rounded-full text-lg">
                  {s.n}
                </span>
                <h3 className="font-serif text-xl">{s.title}</h3>
                <p className="text-muted-foreground max-w-xs text-sm">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="bg-brand-wash text-primary-foreground py-24">
        <Container className="text-center">
          <h2 className="font-serif mx-auto max-w-2xl text-4xl leading-tight">
            Give your spa the home it deserves
          </h2>
          <p className="text-primary-foreground/80 mx-auto mt-3 max-w-md">
            Tell us about your business and we'll set you up on your own domain.
          </p>
          <Button asChild size="lg" className="bg-primary-foreground text-primary hover:brightness-95 mt-8">
            <Link to={paths.standalone}>Request access <ArrowRight className="size-4" /></Link>
          </Button>
        </Container>
      </section>
    </>
  );
}
