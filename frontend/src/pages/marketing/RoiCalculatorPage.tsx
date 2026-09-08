import { Container } from "@/components/ui/container";
import { SeoHead } from "@/components/seo/SeoHead";
import RoiCalculator from "@/components/marketing/RoiCalculator";

export default function RoiCalculatorPage() {
  return (
    <>
      <SeoHead
        title="Salon Commission Savings Calculator | How Much Do You Lose to Marketplaces?"
        description="Calculate how much your salon loses to Fresha, Mindbody, and marketplace booking platforms every year. See your savings with a 0% commission standalone system."
        keywords="salon commission calculator, fresha fee calculator, salon booking fee comparison, salon software savings"
        canonicalPath="/roi-calculator"
      />

      <section className="bg-brand-wash text-primary-foreground py-20 text-center">
        <Container className="flex flex-col items-center">
          <h1 className="font-serif text-4xl font-medium md:text-5xl">
            Salon Commission Savings Calculator
          </h1>
          <p className="text-primary-foreground/80 mt-3 max-w-xl text-base">
            Find out exactly how much revenue your salon surrenders to third-party booking platforms each year.
          </p>
        </Container>
      </section>

      <Container className="py-16 md:py-24 max-w-5xl">
        <RoiCalculator />
      </Container>
    </>
  );
}
