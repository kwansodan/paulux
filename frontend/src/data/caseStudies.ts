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
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "barbershops",
    industry: "Barbershops & Men's Grooming",
    businessName: "The Noble Barber Co.",
    tagline: "High-Volume Chair Turnover & Zero Walk-In Chaos",
    heroHeadline: "How The Noble Barber Co. Saved $19,400/Year and Eliminated No-Shows",
    summary: "A premier 7-chair barbershop migrated from Booksy to their own custom booking domain, cutting platform fees to zero and filling chairs with automated SMS reminders.",
    location: "London, UK",
    teamSize: "7 Master Barbers",
    previousPlatform: "Booksy & Square",
    metrics: {
      commissionSaved: "100%",
      noShowReduction: "92% drop in missed appointments",
      revenueGrowth: "+34% recurring appointment volume",
      annualSavings: "$19,400 saved in commissions & subscription tiers",
    },
    challenge: "Booksy was taking recurring per-chair subscription fees and advertising rival barbershops in the same neighbourhood whenever clients opened the app. Walk-ins frequently collided with online appointments.",
    solution: "Deployed Paulux on booking.thenoblebarber.com with individual barber chair selection, upfront card hold deposits for peak weekend slots, and real-time walk-in queue management.",
    keyFeaturesUsed: [
      "Per-Barber Schedule & Chair Assignment",
      "Instant 2-Way Google Calendar Sync for all 7 barbers",
      "Automated SMS Reminders 2 hours before appointments",
      "Fast 30-second mobile booking without client app downloads",
      "Custom tip & add-on service selection (Beard Sculpt, Hot Towel)",
    ],
    testimonial: {
      quote: "Switching to Paulux on our own domain was the best business move we made this year. We stopped paying hundreds every month per chair, and our clients love that they don't have to download third-party marketplace apps.",
      author: "Marcus Vance",
      role: "Founder & Master Barber",
    },
    faqs: [
      {
        q: "Can each barber have their own working hours and service pricing?",
        a: "Yes. Paulux allows individual staff schedules, custom service assignments, and individual breaks or days off while maintaining a unified booking calendar.",
      },
      {
        q: "Can clients pick their preferred barber or choose 'first available'?",
        a: "Clients can choose their favourite barber or select any available specialist for fastest chair availability.",
      },
    ],
  },
  {
    slug: "medspas-aesthetics",
    industry: "MedSpas, Laser & Aesthetic Clinics",
    businessName: "Aura Medical Aesthetics",
    tagline: "High-Ticket Deposits & Private Patient Confidentiality",
    heroHeadline: "How Aura Aesthetics Secured $42,000 in Pre-Paid Treatment Deposits",
    summary: "A clinical aesthetics practice offering Botox, dermal fillers, and laser treatments deployed Paulux to protect high-ticket doctor consultation slots and safeguard patient privacy.",
    location: "Miami, FL",
    teamSize: "4 Practitioners & 2 Patient Coordinators",
    previousPlatform: "Mindbody",
    metrics: {
      commissionSaved: "100%",
      noShowReduction: "98% reduction in high-ticket consultation cancellations",
      revenueGrowth: "+41% deposit pre-payment compliance",
      annualSavings: "$31,200 saved in platform percentages & booking fees",
    },
    challenge: "Mindbody's clunky checkout caused high drop-off for multi-hundred dollar aesthetic consultations, and marketplace platforms failed strict patient privacy expectations.",
    solution: "A dedicated Paulux system on booking.auramedspa.com with mandatory pre-payment deposit policies, consultation intake notes, and automated post-procedure care email sequences.",
    keyFeaturesUsed: [
      "Custom mandatory consultation deposits via Stripe/Paystack",
      "Private patient data isolation with zero shared marketplace databases",
      "Treatment duration buffers for clinical sterilization & room turnaround",
      "Custom service packages & treatment series bundles",
      "Client treatment notes and appointment history tracking",
    ],
    testimonial: {
      quote: "In clinical aesthetics, brand prestige and patient confidentiality are paramount. Having a dedicated booking portal on our own domain elevated our patient trust and eliminated $500 consultation no-shows overnight.",
      author: "Dr. Elena Rostova",
      role: "Medical Director",
    },
    faqs: [
      {
        q: "Can we require a 50% or full deposit for high-value aesthetic treatments?",
        a: "Yes. Paulux lets you set custom deposit rules per service: full payment, fixed deposit (e.g. $100), or percentage deposit.",
      },
      {
        q: "Can we enforce buffer times between clinical treatments for sanitation?",
        a: "Yes. Services automatically support prep and turnaround buffers so rooms and lasers can be sterilized before the next patient arrives.",
      },
    ],
  },
  {
    slug: "hair-salons",
    industry: "Hair Salons & Color Studios",
    businessName: "Atelier Saint-Honoré",
    tagline: "Multi-Service Carts & Master Stylist Scheduling",
    heroHeadline: "How Atelier Saint-Honoré Reclaimed $27,800/Year Lost to Marketplace Cuts",
    summary: "A premier hair coloring and balayage boutique replaced Fresha with a standalone Paulux deployment, allowing clients to book multi-hour color treatments seamlessly.",
    location: "Toronto, Canada",
    teamSize: "9 Colorists & Stylists",
    previousPlatform: "Fresha",
    metrics: {
      commissionSaved: "100% of 20% new client commissions",
      noShowReduction: "95% attendance rate with card authorization",
      revenueGrowth: "+28% retail product add-ons at checkout",
      annualSavings: "$27,800 annual revenue retained",
    },
    challenge: "Fresha was skimming 20% off every new high-ticket balayage client ($350+ appointments) and frequently prompted their clients to discover competing hair salons nearby.",
    solution: "A bespoke booking engine on booking.ateliersainthonore.com with multi-service bundles (Balayage + Toner + Gloss + Blowout), stylist tiers (Junior vs Senior), and digital retail add-ons.",
    keyFeaturesUsed: [
      "Multi-service booking carts for complex hair appointments",
      "Lookbook style image gallery linked directly to treatment booking",
      "Integrated retail product inventory with row-locked stock tracking",
      "Digital gift card purchasing for holiday campaigns",
      "Direct payouts to salon merchant account with zero escrow hold",
    ],
    testimonial: {
      quote: "Fresha was taking $70 from every $350 new client we brought in through our own Instagram marketing! With Paulux, every penny stays in our salon and our clients get a seamless luxury booking experience.",
      author: "Chloe Dubois",
      role: "Owner & Lead Colorist",
    },
    faqs: [
      {
        q: "Can clients book a haircut and color treatment in a single session?",
        a: "Yes. Paulux supports multi-service carts where total duration and price are automatically aggregated and scheduled together.",
      },
      {
        q: "Can we showcase our portfolio or lookbook on the booking site?",
        a: "Yes. Paulux includes a built-in lookbook / style image gallery so clients can see actual work before choosing their stylist.",
      },
    ],
  },
  {
    slug: "tattoo-piercing",
    industry: "Tattoo & Piercing Studios",
    businessName: "Iron & Oak Tattoo Studio",
    tagline: "Non-Refundable Deposits & Artist Portfolio Booking",
    heroHeadline: "How Iron & Oak Eliminated 8-Hour Artist Gaps with Non-Refundable Booking Deposits",
    summary: "A high-demand custom tattoo studio with 6 resident artists stopped losing full-day bookings to last-minute cancellations by implementing mandatory online booking deposits on their own domain.",
    location: "Austin, TX",
    teamSize: "6 Resident Artists & 1 Piercer",
    previousPlatform: "Email, DMs & Square Invoices",
    metrics: {
      commissionSaved: "100%",
      noShowReduction: "99% show-up rate with non-refundable deposits",
      revenueGrowth: "+50 hrs saved monthly in scheduling back-and-forth",
      annualSavings: "$22,500 in prevented artist downtime",
    },
    challenge: "Artists spent hours in Instagram DMs negotiating slots, and clients frequently flaked on full-day weekend sessions costing artists $1,000+ per lost day.",
    solution: "Turnkey Paulux setup on booking.ironandoaktattoo.com. Clients select their resident artist, upload concept details, and lock in the day with an upfront non-refundable card deposit.",
    keyFeaturesUsed: [
      "Artist-specific hourly rates & custom half-day/full-day block slots",
      "Mandatory upfront deposits paid directly via Stripe/Paystack",
      "Automated appointment waivers and aftercare instructions via email",
      "Lookbook gallery organized by artist style (Fine line, Traditional, Realism)",
    ],
    testimonial: {
      quote: "Tattoo artists lose an entire day's pay when someone doesn't show up. Paulux locked down our booking deposits and stopped all the Instagram DM chaos. It paid for itself in the first week.",
      author: "Jaxson Cole",
      role: "Studio Founder & Resident Artist",
    },
    faqs: [
      {
        q: "Can artists set their own deposit amounts and consultation requirements?",
        a: "Yes. You can configure different deposit amounts for small flash pieces versus full-day custom sessions.",
      },
      {
        q: "Can clients submit appointment notes or tattoo placement ideas?",
        a: "Yes. The client details step captures custom notes, placement, and sizing details directly into the booking dossier.",
      },
    ],
  },
  {
    slug: "massage-bodywork",
    industry: "Massage Therapy & Chiropractic Clinics",
    businessName: "Align Bodywork & Sports Recovery",
    tagline: "Treatment Packages, Client Intake & Recurring Care",
    heroHeadline: "How Align Bodywork Scaled Recurring Treatment Packages by 65%",
    summary: "A clinical sports massage clinic deployed Paulux on their own domain to sell treatment packages, enforce room scheduling, and automate reminder sequences.",
    location: "Melbourne, Australia",
    teamSize: "5 Licensed Massage Therapists",
    previousPlatform: "Cliniko & Mindbody",
    metrics: {
      commissionSaved: "100%",
      noShowReduction: "94% attendance rate",
      revenueGrowth: "+65% pre-sold 5-session massage packages",
      annualSavings: "$16,800 saved in platform fees & lost bookings",
    },
    challenge: "High platform subscription fees across 5 practitioners, plus recurring difficulty selling multi-session treatment packages and tracking promo codes.",
    solution: "Dedicated Paulux system on booking.alignrecovery.com with pre-paid package bundles, custom gift cards, and automated intake confirmation emails.",
    keyFeaturesUsed: [
      "Package bundles (e.g. 5x 60-min Deep Tissue Pack with auto-deduction)",
      "Room and equipment buffer management",
      "Digital gift card purchasing & balance lookup",
      "Automated SMS & email reminders with calendar .ics invites",
    ],
    testimonial: {
      quote: "Our clients love the simplicity of booking on our own website. We pre-sell thousands in treatment packages every month, and we never have to worry about platform outages or surprise fees.",
      author: "Sarah Jenkins",
      role: "Lead Physiotherapist & Owner",
    },
    faqs: [
      {
        q: "Can we sell discounted multi-session packages (e.g., 5 sessions for $400)?",
        a: "Yes. Paulux has native Package management where clients purchase bundles and redeem sessions seamlessly.",
      },
      {
        q: "Can we set different room availability for hot stone vs sports massage?",
        a: "Yes. Services can be configured by duration and specialist availability to prevent room conflicts.",
      },
    ],
  },
  {
    slug: "fitness-coaching",
    industry: "Personal Trainers & Fitness Studios",
    businessName: "Vanguard Performance & Private Coaching",
    tagline: "Private 1-on-1 Sessions & Upfront Retainer Payments",
    heroHeadline: "How Vanguard Performance Automated 1-on-1 Private Training Bookings",
    summary: "An elite private personal training studio eliminated manual WhatsApp schedule juggling by launching their own private booking portal with upfront monthly retainers.",
    location: "New York, NY",
    teamSize: "4 Strength Coaches",
    previousPlatform: "WhatsApp & Calendly",
    metrics: {
      commissionSaved: "100%",
      noShowReduction: "97% on-time attendance",
      revenueGrowth: "+35% more client session bookings per week",
      annualSavings: "$14,500 saved in admin hours and booking fees",
    },
    challenge: "Coaches wasted 8-10 hours weekly coordinating schedules over WhatsApp, with clients canceling last-minute without paying for reserved studio time.",
    solution: "A bespoke booking portal on booking.vanguardfit.com. Clients purchase training packs or recurring session slots and book directly based on coach availability.",
    keyFeaturesUsed: [
      "Coach-specific availability and personal training slot limits",
      "Pre-paid package credits and promo code campaigns",
      "Real-time 2-way Google Calendar synchronization",
      "Instant cancellation policy enforcement with cutoff time windows",
    ],
    testimonial: {
      quote: "Paulux freed up nearly 10 hours a week of scheduling back-and-forth for my coaches. Clients book their own slots, pay upfront, and our studio operates like clockwork.",
      author: "David Vance",
      role: "Head Strength Coach",
    },
    faqs: [
      {
        q: "Can coaches block out personal workout or vacation time?",
        a: "Yes. The Blocked Dates & Schedule feature allows individual coaches or the entire studio to block dates or specific hours.",
      },
      {
        q: "Can we set cancellation notice rules (e.g. 24 hours in advance)?",
        a: "Yes. You can enforce policies so clients cannot reschedule or cancel within your specified cutoff window.",
      },
    ],
  },
  {
    slug: "nail-lash-studios",
    industry: "Nail Salons, Lash & Brow Studios",
    businessName: "Velvet Lash & Brow Lounge",
    tagline: "Add-On Upsells & Fast Mobile Checkout",
    heroHeadline: "How Velvet Lash Boosted Average Ticket Size by $28 with Add-On Booking Upsells",
    summary: "A high-volume lash and nail studio switched from Fresha to their own domain, capturing $28 extra per appointment by prompting clients with nail art and lash tint add-ons.",
    location: "Los Angeles, CA",
    teamSize: "8 Lash & Nail Artists",
    previousPlatform: "Fresha & Vagaro",
    metrics: {
      commissionSaved: "100%",
      noShowReduction: "96% show-up rate with card holds",
      revenueGrowth: "+$28 average ticket increase via add-ons",
      annualSavings: "$23,900 saved in marketplace commissions",
    },
    challenge: "Third-party apps didn't allow intuitive service add-ons (nail art, lash removal, gel upgrades) and took a massive cut on every new client acquired.",
    solution: "Deployed Paulux on booking.velvetlashlounge.com with integrated add-on checkboxes, instant card deposits, and lookbook galleries showing trending nail designs.",
    keyFeaturesUsed: [
      "Seamless multi-service add-ons during step 1 of booking",
      "Lookbook gallery for seasonal nail art inspiration",
      "Digital gift card purchasing for birthdays and holidays",
      "Row-locked inventory tracking for retail lash serums and cuticle oils",
    ],
    testimonial: {
      quote: "Our clients love how clean and fast the booking is on their phones. Our average ticket increased immediately because the system suggests nail art and brow tinting during checkout.",
      author: "Mia Chen",
      role: "Salon Director",
    },
    faqs: [
      {
        q: "Can clients pick both a gel manicure and add custom nail art in one booking?",
        a: "Yes. Paulux lets clients select main services and add-on treatments together with accurate aggregated time calculations.",
      },
      {
        q: "Does it work seamlessly on mobile browsers like Safari and Chrome?",
        a: "Yes. The entire booking wizard is responsive and touch-optimized with zero app store installation needed.",
      },
    ],
  },
  {
    slug: "pet-grooming",
    industry: "Pet Grooming Salons & Mobile Spas",
    businessName: "The Pampered Pooch Pet Spa",
    tagline: "Breed-Specific Durations & Zero Scheduling Collisions",
    heroHeadline: "How The Pampered Pooch Eliminated Overbooked Kennels and Saved $12,000/Year",
    summary: "A luxury dog grooming salon automated appointments with breed-specific durations and upfront deposits, ending phone tag with busy pet owners.",
    location: "Chicago, IL",
    teamSize: "4 Professional Groomers",
    previousPlatform: "Groomer.io & Square",
    metrics: {
      commissionSaved: "100%",
      noShowReduction: "95% attendance with automated SMS reminders",
      revenueGrowth: "+40% online bookings booked outside business hours",
      annualSavings: "$12,400 saved in booking fees and lost slots",
    },
    challenge: "Pet owners called all day during grooming hours, causing groomers to stop work to answer phones. Big dogs were accidentally booked in small-dog time slots.",
    solution: "Dedicated Paulux system on booking.thepamperedpooch.com with clear breed-size categories (Small, Medium, Large, Giant), grooming add-ons (De-shedding, Teeth Cleaning), and automated SMS drop-off reminders.",
    keyFeaturesUsed: [
      "Custom service durations based on pet size & coat complexity",
      "Automated SMS drop-off and pickup notifications",
      "Deposit collection to stop no-shows on 2-hour grooming slots",
      "Groomer assignment based on breed specialty",
    ],
    testimonial: {
      quote: "Before Paulux, we were constantly interrupted by phone calls while holding dogs on the grooming table. Now 80% of our appointments are booked online at night while we sleep!",
      author: "Jessica Bradley",
      role: "Head Groomer & Owner",
    },
    faqs: [
      {
        q: "Can we set different appointment durations for small dogs vs large dogs?",
        a: "Yes. You can create distinct services (e.g., Full Groom - Small Dog 60 min vs Full Groom - Large Dog 120 min) with accurate durations and prices.",
      },
      {
        q: "Can pet parents leave special coat or temperament notes?",
        a: "Yes. The appointment notes field allows pet owners to record pet age, vaccination status, and special handling instructions.",
      },
    ],
  },
];
