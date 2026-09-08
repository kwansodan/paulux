import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { api } from "@/lib/api";
import { paths } from "@/router/paths";
import { currentTenantSlug } from "@/lib/tenant";
import MarketingLanding from "./MarketingLanding";

interface StyleImage {
  id: string;
  url: string;
  caption: string | null;
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: string;
  currency: string;
}

export default function HomePage() {
  const slug = currentTenantSlug();

  const lookbook = useQuery({
    queryKey: ["public-style-images"],
    enabled: !!slug,
    queryFn: async () =>
      (await api.get<{ data: StyleImage[] }>("/api/style-images")).data.data,
  });

  const services = useQuery({
    queryKey: ["public-services"],
    enabled: !!slug,
    queryFn: async () =>
      (await api.get<{ data: Service[] }>("/api/services")).data.data,
  });

  // Apex (no tenant subdomain) => the spa-owner marketing/sign-up landing.
  if (!slug) return <MarketingLanding />;

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-wash text-primary-foreground relative overflow-hidden">
        <Container className="relative flex flex-col items-center gap-7 py-28 text-center md:py-36">
          <span className="text-primary-foreground/70 text-xs tracking-luxe uppercase">
            {slug ? "Luxury wellness" : "Standalone Salon Platform"}
          </span>
          <h1 className="font-serif max-w-3xl text-5xl leading-[1.05] font-medium md:text-6xl">
            {slug ? `Moments of calm at ${slug}` : "Paulux"}
          </h1>
          <p className="text-primary-foreground/80 max-w-xl text-lg">
            {slug
              ? "Book your treatment in a few gentle steps — relaxation, care, and a seamless experience."
              : "Private, white-label booking software for luxury salons and spas on your own domain."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {slug ? (
              <>
                <Button asChild size="lg" className="bg-primary-foreground text-primary hover:brightness-95">
                  <Link to={paths.book}>
                    Book an appointment <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline"
                        className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to={paths.giftCards}>Buy a gift card</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="bg-primary-foreground text-primary hover:brightness-95">
                  <Link to={paths.signup}>
                    Start free trial <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline"
                        className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to={paths.login}>Sign in</Link>
                </Button>
              </>
            )}
          </div>
        </Container>
      </section>

      {/* Services teaser */}
      {(services.data ?? []).length > 0 && (
        <Container className="py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-accent text-xs tracking-luxe uppercase">Treatments</p>
              <h2 className="font-serif mt-1 text-3xl">Signature services</h2>
            </div>
            <Link
              to={paths.book}
              className="text-muted-foreground hover:text-foreground hidden items-center gap-1 text-sm sm:flex"
            >
              View all <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(services.data ?? []).slice(0, 6).map((s) => (
              <Link
                key={s.id}
                to={paths.book}
                className="group bg-card hover:shadow-[var(--shadow-lift)] flex flex-col gap-3 rounded-2xl border border-border/70 p-6 shadow-[var(--shadow-soft)] transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-xl">{s.name}</h3>
                  <span className="text-accent shrink-0 text-sm font-medium">
                    {s.currency} {s.price}
                  </span>
                </div>
                {s.description && (
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {s.description}
                  </p>
                )}
                <span className="text-muted-foreground mt-auto text-xs tracking-wide">
                  {s.durationMinutes} minutes
                </span>
              </Link>
            ))}
          </div>
        </Container>
      )}

      {/* Lookbook */}
      {(lookbook.data ?? []).length > 0 && (
        <section className="bg-secondary/50 py-20">
          <Container>
            <div className="mb-10 text-center">
              <p className="text-accent text-xs tracking-luxe uppercase">Gallery</p>
              <h2 className="font-serif mt-1 text-3xl">Our work</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {(lookbook.data ?? []).map((img) => (
                <figure
                  key={img.id}
                  className="group relative overflow-hidden rounded-2xl border border-border/60"
                >
                  <img
                    src={img.url}
                    alt={img.caption ?? "Style"}
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {img.caption && (
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2b0217cc] to-transparent p-3 text-xs text-white">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Closing CTA */}
      <Container className="py-24 text-center">
        <h2 className="font-serif mx-auto max-w-2xl text-4xl leading-tight">
          Ready when you are
        </h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-md">
          Reserve your moment of calm. It only takes a minute.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link to={paths.book}>
            Start booking <ArrowRight className="size-4" />
          </Link>
        </Button>
      </Container>
    </>
  );
}
