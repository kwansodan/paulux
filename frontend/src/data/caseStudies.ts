export interface CaseStudy {
  slug: string;
  industry: string;
  businessName: string;
  tagline: string;
  heroHeadline: string;
  summary: string;
  location: string;
  teamSize: string;
  previousPlatform: string;
  metrics: {
    commissionSaved: string;
    noShowReduction: string;
    revenueGrowth: string;
    annualSavings: string;
  };
  challenge: string;
  solution: string;
  keyFeaturesUsed: string[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
  };
  faqs: { q: string; a: string }[];
  instagram?: string;
  verifiedPilot?: boolean;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "polaris-beauty-salon",
    industry: "Hair Styling, Braiding & Luxury Beauty Lounge",
    businessName: "Polaris Beauty Lounge",
    tagline: "Direct Mobile Money Booking & Zero Marketplace Cuts in Tesano, Accra",
    heroHeadline: "How Polaris Beauty Lounge Replaced Fresha with a Standalone Booking Engine",
    summary: "Located at 12 Brenya Avenue in Tesano, Accra, Polaris Beauty Lounge deployed Paulux to stop losing cuts to Fresha, take upfront Momo deposits, and give clients a smooth booking experience on their own link.",
    location: "Tesano, Accra, Ghana",
    teamSize: "Senior Stylists & Nail Technicians",
    previousPlatform: "Fresha",
    metrics: {
      commissionSaved: "0% Marketplace Cut",
      noShowReduction: "Upfront Momo deposit eliminates no-shows",
      revenueGrowth: "100% direct client revenue into their Paystack account",
      annualSavings: "Thousands in platform percentages & currency exchange markups",
    },
    challenge: "Fresha charged heavy cuts on new client discovery, lacked seamless automated Ghana Mobile Money (MTN Momo & Telecel Cash) checkout, and advertised nearby competing salons to their Accra clientele.",
    solution: "A dedicated Paulux booking system with direct Paystack Mobile Money integration, automated WhatsApp and SMS appointment confirmations, and complete ownership of their customer phone book.",
    keyFeaturesUsed: [
      "Direct MTN Mobile Money & Telecel Cash integration via Paystack",
      "Automated WhatsApp & SMS appointment reminders with directions to Tesano",
      "0% commission on braids, silk presses, pedicures, and nail appointments",
      "Stylist-level scheduling and walk-in front desk queue check-in",
      "Private client database owned exclusively by the salon",
    ],
    testimonial: {
      quote: "Our clients in Accra want to book quickly and pay with Mobile Money. Having our own booking link without Fresha taking cuts or showing other salons was an immediate upgrade for Polaris.",
      author: "Management Team",
      role: "Polaris Beauty Lounge (@polarisbeautylounge)",
    },
    instagram: "https://instagram.com/polarisbeautylounge",
    verifiedPilot: true,
    faqs: [
      {
        q: "How do clients at Polaris pay for bookings?",
        a: "Clients book on their phone and pay full or partial deposits directly via MTN Mobile Money, Telecel Cash, or Visa/Mastercard through Paystack. Funds land straight in the salon's account with 0% platform cuts.",
      },
      {
        q: "Where is Polaris Beauty Lounge located?",
        a: "Polaris Beauty Lounge is located at 12 Brenya Avenue, Tesano, Accra, Ghana. You can find them on Instagram @polarisbeautylounge.",
      },
      {
        q: "Why did Polaris Beauty Lounge leave Fresha?",
        a: "Fresha charged 20% commission on first-time client bookings, forced clients into an app where competitor salons were advertised, and lacked local Ghana Mobile Money (MTN MoMo, Telecel Cash) integration. Paulux gave Polaris their own domain with direct Paystack settlement.",
      },
    ],
  },
];
