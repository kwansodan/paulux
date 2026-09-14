export interface ComparisonFeature {
  name: string;
  description: string;
  paulux: string;
  competitor: string;
  highlight?: boolean;
}

export interface FeatureCategory {
  category: string;
  description: string;
  features: ComparisonFeature[];
}

export interface CompetitorProfile {
  slug: string;
  name: string;
  tagline: string;
  badge: string;
  vertical: string;
  primaryFeeModel: string;
  heroHeadline: string;
  heroSubheadline: string;
  definitionPassageTitle: string;
  definitionPassageBody: string;
  objectiveEvaluation: {
    competitorStrengths: string[];
    competitorBestFor: string;
    pauluxStrengths: string[];
    pauluxBestFor: string;
  };
  categories: FeatureCategory[];
  faqs: { q: string; a: string }[];
}

export interface HeadToHeadComparison {
  slug: string;
  comp1: string;
  comp2: string;
  title: string;
  description: string;
  subtitle: string;
  definitionPassageTitle: string;
  definitionPassageBody: string;
  summary: string;
  tableRows: {
    feature: string;
    comp1Val: string;
    comp2Val: string;
    pauluxVal: string;
  }[];
  objectiveTakeaway: string;
  faqs: { q: string; a: string }[];
}

export const COMPETITORS: Record<string, CompetitorProfile> = {
  fresha: {
    slug: "fresha",
    name: "Fresha",
    tagline: "The Marketplace Giant with 20% Commissions",
    badge: "Marketplace Commission Model",
    vertical: "Salons, Spas & Beauty Studios",
    primaryFeeModel: "20% new-client fee + monthly add-ons & payment processing cuts",
    heroHeadline: "The Zero-Commission Fresha Alternative for High-Performing Salons",
    heroSubheadline:
      "Stop surrendering 20% of your new client revenue to a marketplace that advertises neighboring salons to your clients. Run your salon on your own custom domain with 100% data ownership.",
    definitionPassageTitle: "What is the Paulux Fresha Alternative?",
    definitionPassageBody:
      "Paulux is a self-hosted, white-label salon booking software deployed on an independent custom domain, designed to replace commission-based platforms like Fresha with a 0% transaction-fee architecture, complete client data privacy, and backbar chemical dispensary tracking.",
    objectiveEvaluation: {
      competitorStrengths: [
        "Massive global consumer directory with strong foot-traffic discovery for unknown, newly opened salons with zero reputation.",
        "Zero upfront software setup cost for brand new solo operators who have no existing clientele.",
        "Simple out-of-the-box mobile booking experience for casual consumers already familiar with the Fresha app."
      ],
      competitorBestFor:
        "Brand-new solo stylists or junior technicians with zero existing clientele, no brand equity, and no initial marketing budget who rely 100% on marketplace strangers discovering them in an online directory.",
      pauluxStrengths: [
        "0% marketplace commission — keep 100% of every penny earned from new and returning clients.",
        "Dedicated custom domain (booking.yourbrand.com) reinforcing your prestige brand rather than promoting a third-party app.",
        "100% private, isolated database — zero competitor cross-selling to your clients.",
        "Backbar chemical dispensary inventory tracking down to exact milliliters (ml) and grams (g) with live service gross margin P&L.",
        "Direct merchant account payouts via Stripe or Paystack with zero 7-14 day marketplace payout escrow holds."
      ],
      pauluxBestFor:
        "Established luxury salons, color bars, and aesthetic clinics with their own client base who refuse to pay thousands each month in marketplace commissions and demand enterprise backbar accounting."
    },
    categories: [
      {
        category: "Economics & Business Model",
        description: "Commissions, subscription tiers, and processing deductions.",
        features: [
          {
            name: "New Client Commission",
            description: "Fee charged when a new client books an appointment.",
            paulux: "0% — Keep 100% of every ticket",
            competitor: "20% cut + payment processing surcharge on every new client",
            highlight: true
          },
          {
            name: "Monthly Software License",
            description: "Ongoing platform access fee.",
            paulux: "Dedicated deployment quote; zero recurring subscription lock-in",
            competitor: "Recurring monthly tier fees + paid add-ons",
            highlight: true
          },
          {
            name: "Payment Gateway Choice",
            description: "Freedom to route transactions to your own merchant account.",
            paulux: "Direct to your own Stripe / Paystack account with instant deposits",
            competitor: "Locked into Fresha's proprietary processor with platform surcharges",
            highlight: false
          },
          {
            name: "Booking Web Address",
            description: "Domain authority and client touchpoint URL.",
            paulux: "booking.yourbrand.com (Your Custom Domain)",
            competitor: "fresha.com/a/your-salon-1234 (Fresha Domain)",
            highlight: true
          }
        ]
      },
      {
        category: "Backbar & Chemical Dispensary",
        description: "Consumables accounting, color bar formula logs, and margin tracking.",
        features: [
          {
            name: "Chemical Tracking Precision",
            description: "Unit of measurement for backbar color, bleach, and developers.",
            paulux: "Milliliter (ml) and gram (g) bowl-by-bowl precision per service ticket",
            competitor: "Whole-bottle retail SKU tracking only; no ml/g dispensary ledger",
            highlight: true
          },
          {
            name: "Per-Service Gross Margin P&L",
            description: "Live profit calculation factoring chemical product cost against ticket price.",
            paulux: "Automated real-time ticket P&L (e.g. $185 ticket - $24.50 chemical cost = 86.8% margin)",
            competitor: "Not available; manual spreadsheets required",
            highlight: true
          },
          {
            name: "Client Chemical Formula Vault",
            description: "Recording exact developer volume, toner codes, and processing times.",
            paulux: "Native CRM formula ledger with historical records accessible on mobile",
            competitor: "Basic unstructured text notes field",
            highlight: false
          }
        ]
      },
      {
        category: "Communications & Messaging",
        description: "SMS, WhatsApp, and retention reminder pricing and delivery.",
        features: [
          {
            name: "SMS Pricing & Markups",
            description: "Cost per reminder text message sent to clients.",
            paulux: "Direct carrier wholesale rates (approx. 1¢) or flat-rate with 0% platform markup",
            competitor: "High per-message markup (often 2-4¢ per SMS) or strict monthly allowance caps",
            highlight: true
          },
          {
            name: "WhatsApp Confirmation & Reminders",
            description: "Two-way client communication via WhatsApp Business.",
            paulux: "Native WhatsApp booking confirmation and calendar invite links",
            competitor: "Limited or unsupported; relies primarily on Fresha consumer app notifications",
            highlight: false
          },
          {
            name: "Automated Win-Back Campaigns",
            description: "Re-engaging clients who have not visited in 30, 60, or 90 days.",
            paulux: "Automated 30/60/90-day win-back triggers with personalized promo codes",
            competitor: "Requires manual marketing blast add-ons with extra fees",
            highlight: false
          }
        ]
      },
      {
        category: "Staff Management & Payouts",
        description: "Booth rental, independent contractor splits, and mobile portals.",
        features: [
          {
            name: "Multi-Staff Payout Splits",
            description: "Routing payments directly to booth renters or commission stylists.",
            paulux: "Direct multi-merchant routing; funds deposit directly to each stylist or shop account",
            competitor: "Aggregated into single Fresha account; owner must manually distribute funds",
            highlight: true
          },
          {
            name: "Dedicated Stylist Mobile Portal",
            description: "Independent stylist access without exposing salon financials.",
            paulux: "Independent /stylist mobile portal with chair view and client formula access",
            competitor: "Shared Fresha mobile app with restricted permission tiers",
            highlight: false
          },
          {
            name: "Walk-In Fast Booking Mode",
            description: "Chair assignment speed for spontaneous foot traffic.",
            paulux: "15-second rapid walk-in checkout with chair capacity lock",
            competitor: "Standard multi-step online booking flow",
            highlight: false
          }
        ]
      },
      {
        category: "Hardware & POS Compatibility",
        description: "Payment terminals, receipt printers, and cash drawers.",
        features: [
          {
            name: "Card Reader Hardware",
            description: "Supported in-person tap-to-pay and chip readers.",
            paulux: "Open standard hardware (Stripe Terminal, WisePOS E, Paystack POS, Bluetooth readers)",
            competitor: "Locked into Fresha's proprietary card terminal",
            highlight: false
          },
          {
            name: "Thermal Receipt Printers & Cash Drawers",
            description: "Point-of-sale receipt printing and cash handling.",
            paulux: "Standard ESC/POS thermal printers (Star Micronics, Epson) & standard RJ11 cash drawers",
            competitor: "Supported with Fresha-compatible hardware models",
            highlight: false
          },
          {
            name: "Tablet & Browser Independence",
            description: "Running the booking system across any device.",
            paulux: "100% responsive on any iPad, Android tablet, Mac, PC, or iPhone browser",
            competitor: "Optimized for Fresha app ecosystem",
            highlight: false
          }
        ]
      },
      {
        category: "Data Privacy & Brand Equity",
        description: "Client data ownership and cross-promotional risks.",
        features: [
          {
            name: "Client Database Privacy",
            description: "Who owns and controls your client contact list.",
            paulux: "100% Isolated database owned solely by your salon; never pooled or shared",
            competitor: "Shared consumer marketplace database; Fresha markets competing salons nearby",
            highlight: true
          },
          {
            name: "White-Label Brand Experience",
            description: "Customer visibility into third-party booking brands.",
            paulux: "100% White-label; only your luxury salon logo and brand aesthetics appear",
            competitor: "Prominent Fresha branding on booking screens, confirmation emails, and app",
            highlight: true
          }
        ]
      }
    ],
    faqs: [
      {
        q: "Does Paulux charge commissions on new clients?",
        a: "No. Paulux operates on a 0% booking commission model. Unlike marketplaces that take 20% of your new client revenue, all payments process directly into your Stripe or Paystack merchant account. You keep 100% of every ticket, deposit, and gift card transaction with zero marketplace fees."
      },
      {
        q: "Can Paulux run on my own custom domain?",
        a: "Yes. Every Paulux deployment connects directly to your custom domain (e.g., booking.yourbrand.com) with automated SSL security. Your clients book directly with your brand, eliminating third-party app downloads and preventing competitor salons from advertising on your booking profile."
      },
      {
        q: "How does Paulux handle deposit collection and chargebacks?",
        a: "Paulux includes a native Deposit Enforcer requiring clients to authorize full or partial upfront deposits at checkout. Funds route directly to your merchant gateway with automated 3D Secure fraud protection, minimizing chargeback risks and eliminating no-shows on high-ticket appointment slots."
      },
      {
        q: "Why are top salons migrating away from Fresha?",
        a: "Salons leave Fresha to stop losing 20% commission on every new client discovery, eliminate competitor cross-selling on their booking pages, and maintain 100% customer data privacy with an isolated database on their own custom domain."
      },
      {
        q: "How does Paulux chemical dispensary tracking compare to Fresha?",
        a: "While Fresha only counts unopened retail bottles, Paulux tracks professional hair color, bleach powder, and developers down to exact grams and milliliters per bowl, automatically calculating real-time gross margin profit on every ticket."
      }
    ]
  },

  booksy: {
    slug: "booksy",
    name: "Booksy",
    tagline: "The Barbershop Directory with Heavy Per-Chair Fees",
    badge: "Per-Staff & Marketplace Model",
    vertical: "Barbershops, Grooming Lounges & Stylists",
    primaryFeeModel: "$29.99/mo base + $20/mo per extra barber + up to 20% new-client commission",
    heroHeadline: "The Zero-Commission Booksy Alternative for Premier Barbershops",
    heroSubheadline:
      "Ditch Booksy's monthly per-chair fee penalties and marketplace discovery cuts. Deploy a dedicated white-label booking engine on your own custom domain with 15-second walk-in check-in and 0% commission.",
    definitionPassageTitle: "What is the Paulux Booksy Alternative?",
    definitionPassageBody:
      "Paulux is a dedicated white-label booking platform for barbershops and grooming studios deployed on an independent custom domain, eliminating Booksy's per-chair monthly penalties and marketplace discovery cuts with a 15-second rapid walk-in checkout mode.",
    objectiveEvaluation: {
      competitorStrengths: [
        "Well-established consumer adoption in the barbering and men's grooming demographic.",
        "Good mobile app discovery for traveling barbers and independent booth renters needing quick bookings.",
        "Built-in social booking links with Instagram and Facebook integration."
      ],
      competitorBestFor:
        "Independent solo barbers or casual walk-in shops where barbers already maintain a personal client following on the Booksy consumer app and don't require chemical dispensary tracking or unified multi-chair deposit management.",
      pauluxStrengths: [
        "Flat turnkey deployment with zero per-chair or per-staff monthly penalties — add unlimited barbers at no extra cost.",
        "0% marketplace commission on new or returning clients.",
        "15-second rapid front-desk walk-in check-in mode designed for high foot-traffic shops.",
        "Independent /stylist mobile portal giving each barber access to their personal chair schedule and earnings without exposing shop accounting.",
        "Complete client data privacy with zero cross-promotional advertising for neighboring barbershops."
      ],
      pauluxBestFor:
        "Premier barbershops, multi-chair grooming parlors, and modern salons with 3+ chairs who want to stop paying $100-$300+/month in per-barber software fees and protect their clientele from competitor ads."
    },
    categories: [
      {
        category: "Economics & Business Model",
        description: "Monthly base fees, per-staff penalties, and commissions.",
        features: [
          {
            name: "Per-Barber / Per-Chair Monthly Fees",
            description: "Cost added for each additional barber on the schedule.",
            paulux: "Flat dedicated deployment; $0 per additional staff member forever",
            competitor: "$29.99/mo base + $20/mo for EVERY additional barber chair",
            highlight: true
          },
          {
            name: "Marketplace Commission",
            description: "Fee taken on new client bookings.",
            paulux: "0% — Keep 100% of all client revenue",
            competitor: "Up to 20% on new client discovery via marketplace",
            highlight: true
          },
          {
            name: "Booking Web Address",
            description: "Customer booking URL.",
            paulux: "booking.yourbarbershop.com (Your Custom Domain)",
            competitor: "booksy.com/your-shop (Shared marketplace profile)",
            highlight: true
          },
          {
            name: "Data Ownership",
            description: "Who owns customer phone numbers and booking history.",
            paulux: "100% Private, isolated database with full CSV export rights anytime",
            competitor: "Shared Booksy consumer network; clients get alerts for rival barbers",
            highlight: true
          }
        ]
      },
      {
        category: "Front-Desk & Barbershop Workflows",
        description: "Walk-in management, chair assignment, and mobile staff portals.",
        features: [
          {
            name: "Walk-In Fast Check-In Mode",
            description: "Speed to seat and charge a spontaneous walk-in client.",
            paulux: "15-second rapid walk-in chair assignment and checkout mode",
            competitor: "Multi-click appointment creation flow designed for pre-bookings",
            highlight: true
          },
          {
            name: "Independent Barber Mobile Portal",
            description: "Stylist phone access without exposing owner finances.",
            paulux: "Dedicated /stylist portal showing individual chair schedule and daily tips",
            competitor: "Shared Booksy app with tiered account permissions",
            highlight: false
          },
          {
            name: "No-Show & Deposit Protection",
            description: "Requiring deposits for high-demand Friday/Saturday slots.",
            paulux: "Native Deposit Enforcer requiring upfront card deposits directly to your merchant account",
            competitor: "Optional no-show protection with strict processor guidelines and dispute delays",
            highlight: false
          }
        ]
      },
      {
        category: "Consumables & Dispensary Management",
        description: "Tracking grooming products, beard oils, and color touch-ups.",
        features: [
          {
            name: "Backbar Consumables Accounting",
            description: "Tracking color camouflage, beard toners, and scalp treatments.",
            paulux: "Milliliter and gram tracking for men's color, beard dye, and backbar products",
            competitor: "Retail SKU inventory count only; no backbar service consumable tracking",
            highlight: true
          },
          {
            name: "Retail Inventory POS",
            description: "Selling pomades, clays, and grooming tools at checkout.",
            paulux: "Integrated retail POS with automatic stock alerts and bundle discounts",
            competitor: "Basic retail inventory add-on",
            highlight: false
          }
        ]
      },
      {
        category: "Hardware & POS Compatibility",
        description: "Card readers, barcode scanners, and receipt printing.",
        features: [
          {
            name: "Payment Hardware Freedom",
            description: "Supported card readers and point-of-sale hardware.",
            paulux: "Works with standard Stripe Terminal, Paystack POS, or Bluetooth mobile readers",
            competitor: "Requires Booksy Card Reader or manual card entry",
            highlight: false
          },
          {
            name: "Thermal Receipt Printing",
            description: "Fast paper receipt printing for walk-in clients.",
            paulux: "Direct ESC/POS receipt printer support and cash drawer kick",
            competitor: "Standard receipt printer compatibility via mobile app",
            highlight: false
          }
        ]
      },
      {
        category: "Communications & Marketing",
        description: "SMS reminders, win-backs, and reviews.",
        features: [
          {
            name: "SMS Reminder Pricing",
            description: "Cost per automated booking reminder text.",
            paulux: "Direct carrier wholesale rates with zero markup",
            competitor: "Packaged messaging credits with monthly limits",
            highlight: true
          },
          {
            name: "Automated Win-Back Engine",
            description: "Automated reminders when a regular has not booked in 3 weeks.",
            paulux: "Automated 21/30/60-day haircut reminder triggers with personalized booking links",
            competitor: "Manual marketing blasts",
            highlight: false
          }
        ]
      }
    ],
    faqs: [
      {
        q: "Does Paulux charge commissions on new clients?",
        a: "No. Paulux operates on a 0% booking commission model. Unlike marketplaces that take 20% of your new client revenue, all payments process directly into your Stripe or Paystack merchant account. You keep 100% of every ticket, deposit, and gift card transaction with zero marketplace fees."
      },
      {
        q: "Can Paulux run on my own custom domain?",
        a: "Yes. Every Paulux deployment connects directly to your custom domain (e.g., booking.yourbrand.com) with automated SSL security. Your clients book directly with your brand, eliminating third-party app downloads and preventing competitor salons from advertising on your booking profile."
      },
      {
        q: "How does Paulux handle deposit collection and chargebacks?",
        a: "Paulux includes a native Deposit Enforcer requiring clients to authorize full or partial upfront deposits at checkout. Funds route directly to your merchant gateway with automated 3D Secure fraud protection, minimizing chargeback risks and eliminating no-shows on high-ticket appointment slots."
      },
      {
        q: "Can each barber manage their own schedule independently without seeing shop finances?",
        a: "Yes. Paulux provides an independent /stylist mobile portal where each barber logs in to view their chair schedule, client notes, and daily revenue on mobile without accessing sensitive shop-wide financial accounting."
      },
      {
        q: "How does the 15-second walk-in check-in work?",
        a: "Barbershops handle heavy walk-in traffic. Paulux features a rapid front-desk walk-in mode that lets staff tap a service, select the available barber chair, collect payment, and lock the chair in under 15 seconds without questionnaires."
      }
    ]
  },

  mindbody: {
    slug: "mindbody",
    name: "Mindbody",
    tagline: "The Legacy Enterprise Giant with Expensive Subscription Creep",
    badge: "Legacy Enterprise Subscription",
    vertical: "MedSpas, Aesthetic Clinics & Wellness Centers",
    primaryFeeModel: "$159 to $699+/month + add-on fees + merchant interchange surcharges",
    heroHeadline: "The Modern Mindbody Alternative for MedSpas & Aesthetic Clinics",
    heroSubheadline:
      "Escape Mindbody's $159–$699/month subscription fees and bloated legacy menus. Deploy a luxury, white-label booking experience on your own domain with clinical deposit enforcement and 100% patient data isolation.",
    definitionPassageTitle: "What is the Paulux Mindbody Alternative?",
    definitionPassageBody:
      "Paulux is a modern, white-label booking and clinical deposit enforcement system for aesthetic clinics and medspas, eliminating Mindbody's $159–$699/month subscription fees with 100% patient data isolation and upfront deposit enforcement.",
    objectiveEvaluation: {
      competitorStrengths: [
        "Comprehensive class scheduling engine for large gyms, yoga franchises, and fitness centers managing 50+ classes daily.",
        "Deep hardware integrations with gym turnstiles, RFID membership tags, and barcode check-in scanners.",
        "Extensive partner ecosystem with hundreds of third-party fitness API plugins."
      ],
      competitorBestFor:
        "Large multi-location fitness franchises, CrossFit boxes, and boutique fitness studios that depend primarily on dynamic group class schedules, recurring gym memberships, and physical facility turnstile access control.",
      pauluxStrengths: [
        "Flat dedicated deployment with zero recurring $159–$699/month subscription fees.",
        "100% private, isolated database — complete patient record privacy and GDPR/data governance peace of mind.",
        "Native Clinical Deposit Enforcer protecting high-ticket 60-90 minute Botox, laser, and aesthetic treatment slots from no-shows.",
        "Clinical CRM with allergy warnings, technical injectable/peel formula notes, and service prep/aftercare instructions sent via SMS.",
        "Fast, modern booking wizard that completes in under 60 seconds without requiring clients to navigate legacy multi-page portals."
      ],
      pauluxBestFor:
        "Medical spas, aesthetic dermatology clinics, laser studios, and high-ticket wellness practices that want luxury white-label booking on their own domain without paying $5,000+ per year in Mindbody software rent."
    },
    categories: [
      {
        category: "Economics & Licensing",
        description: "Monthly subscription tiers, merchant processing, and long-term costs.",
        features: [
          {
            name: "Monthly Software Subscription",
            description: "Recurring software license cost.",
            paulux: "Flat dedicated deployment quote; zero recurring monthly software rent",
            competitor: "$159 to $699+ per month depending on tier and mandatory add-ons",
            highlight: true
          },
          {
            name: "Merchant Processing Lock-In",
            description: "Credit card processing terms and gateway freedom.",
            paulux: "Direct to your own Stripe / Paystack merchant account with 0% Paulux cut",
            competitor: "Mandatory locked proprietary processing with interchange surcharges",
            highlight: true
          },
          {
            name: "Booking Web Address",
            description: "Client booking URL.",
            paulux: "booking.yourmedspa.com (Your Custom Domain)",
            competitor: "mindbodyonline.com/classic/your-spa-id",
            highlight: true
          },
          {
            name: "Patient Data Privacy & Isolation",
            description: "Database isolation for confidential clinical records.",
            paulux: "100% Private, isolated database owned solely by your clinic",
            competitor: "Shared corporate database; aggregates patient records across the network",
            highlight: true
          }
        ]
      },
      {
        category: "Clinical & MedSpa Workflows",
        description: "Deposit collection, formula records, and aftercare.",
        features: [
          {
            name: "Clinical Deposit Enforcer",
            description: "Securing high-ticket treatment slots ($300-$800+) against no-shows.",
            paulux: "Native full or partial upfront deposit requirement on high-ticket clinical slots",
            competitor: "Basic credit card holds requiring complex merchant add-ons",
            highlight: true
          },
          {
            name: "Formula, Injectable & Allergy Notes",
            description: "Documenting units injected, skin sensitivities, and patch tests.",
            paulux: "Instant scalp, allergy, and clinical formula flags in CRM with practitioner check-in alert",
            competitor: "Generic text notes buried under multiple legacy tabs",
            highlight: false
          },
          {
            name: "Prep & Aftercare Delivery",
            description: "Sending pre-treatment guidelines and post-treatment recovery care.",
            paulux: "Native service prep and post-treatment aftercare links sent automatically via SMS/Email",
            competitor: "Requires third-party automated email marketing plugins",
            highlight: false
          },
          {
            name: "Backbar Consumables Tracking",
            description: "Tracking aesthetic serums, peels, and clinical vials (ml/g).",
            paulux: "Dispensary tracking by milliliters (ml) and units with live ticket gross margin",
            competitor: "Retail inventory SKU counts only",
            highlight: true
          }
        ]
      },
      {
        category: "Client Experience & Mobile",
        description: "Ease of booking, mobile responsiveness, and client retention.",
        features: [
          {
            name: "Booking Wizard Speed",
            description: "Time required for a client to complete an appointment.",
            paulux: "4-step luxury mobile-first wizard completing in under 45 seconds",
            competitor: "Clunky multi-screen legacy portal requiring account creation and verification",
            highlight: true
          },
          {
            name: "Automated Win-Backs & Touchpoints",
            description: "Re-engaging aesthetic clients for neurotoxin or filler top-ups.",
            paulux: "Automated 60/90/120-day touchpoints aligned with aesthetic maintenance cycles",
            competitor: "Requires high-tier marketing suite upgrades ($299+/mo)",
            highlight: false
          },
          {
            name: "White-Label Brand Elegance",
            description: "Visual alignment with high-end aesthetic clinic branding.",
            paulux: "100% Bespoke luxury typography, customized brand palette, zero third-party logos",
            competitor: "Heavy Mindbody branding on booking flows, emails, and client app",
            highlight: true
          }
        ]
      },
      {
        category: "Hardware & Operational Integrations",
        description: "POS terminals, receipt printing, and calendar synchronization.",
        features: [
          {
            name: "Payment Hardware",
            description: "In-clinic card reader options.",
            paulux: "Open-standard Stripe Terminal (WisePOS E), Paystack POS, or Bluetooth mobile terminals",
            competitor: "Proprietary Mindbody merchant hardware bundles",
            highlight: false
          },
          {
            name: "Google Calendar 2-Way Sync",
            description: "Real-time calendar synchronization for practitioners.",
            paulux: "Instant 2-way sync with Google Calendar, Outlook, and Apple iCal",
            competitor: "Often delayed or requires third-party Zapier bridges",
            highlight: false
          }
        ]
      }
    ],
    faqs: [
      {
        q: "Does Paulux charge commissions on new clients?",
        a: "No. Paulux operates on a 0% booking commission model. Unlike marketplaces that take 20% of your new client revenue, all payments process directly into your Stripe or Paystack merchant account. You keep 100% of every ticket, deposit, and gift card transaction with zero marketplace fees."
      },
      {
        q: "Can Paulux run on my own custom domain?",
        a: "Yes. Every Paulux deployment connects directly to your custom domain (e.g., booking.yourbrand.com) with automated SSL security. Your clients book directly with your brand, eliminating third-party app downloads and preventing competitor salons from advertising on your booking profile."
      },
      {
        q: "How does Paulux handle deposit collection and chargebacks?",
        a: "Paulux includes a native Deposit Enforcer requiring clients to authorize full or partial upfront deposits at checkout. Funds route directly to your merchant gateway with automated 3D Secure fraud protection, minimizing chargeback risks and eliminating no-shows on high-ticket appointment slots."
      },
      {
        q: "Why are MedSpas and aesthetic clinics leaving Mindbody for Paulux?",
        a: "Mindbody charges $159 to $699+ monthly in subscription fees while locking clinics into proprietary payment processing. Paulux runs on your custom domain with 100% patient data isolation, clinical deposit enforcement, and zero recurring software rent."
      },
      {
        q: "How does Paulux protect clinical formulas and allergy warnings?",
        a: "Every client record includes dedicated technical formula, injectable units, and health advisory fields. Estheticians and injectors see instant allergy flags and historical contraindications prominent whenever an aesthetic patient checks in."
      }
    ]
  },

  vagaro: {
    slug: "vagaro",
    name: "Vagaro",
    tagline: "The Feature-Packed System with Endless Add-On Nickel-and-Diming",
    badge: "Tiered Add-On Fee Model",
    vertical: "Salons, Spas & Fitness Studios",
    primaryFeeModel: "$30/mo base + $10/mo per extra user + website builder fee + form fees + SMS fees",
    heroHeadline: "The Independent Vagaro Alternative for High-Ticket Salons & Spas",
    heroSubheadline:
      "Tired of Vagaro's endless add-on fees and marketplace cross-promotion? Deploy a luxury, bespoke booking platform on your own custom domain with all features included and 0% commissions.",
    definitionPassageTitle: "What is the Paulux Vagaro Alternative?",
    definitionPassageBody:
      "Paulux is a luxury, white-label salon and spa management platform deployed on an independent custom domain, replacing Vagaro's tiered add-on fees and marketplace directory cross-selling with an all-inclusive 0% commission architecture and backbar chemical tracking.",
    objectiveEvaluation: {
      competitorStrengths: [
        "Low advertised entry base price ($30/month for a single solo operator).",
        "Wide variety of built-in add-on modules (forms, payroll, website builder, email marketing).",
        "Large consumer directory with broad reach across hair, nails, massage, and fitness."
      ],
      competitorBestFor:
        "Budget-conscious solo practitioners or generalist salons looking for an off-the-shelf directory listing with basic low-cost add-on widgets who don't mind marketplace cross-selling.",
      pauluxStrengths: [
        "Zero add-on nickel-and-diming — custom domain, intake forms, chemical dispensary, and staff portals are fully included.",
        "No per-user monthly penalties — add unlimited stylists and receptionists without software price increases.",
        "Enterprise chemical dispensary tracking down to exact grams and milliliters with live ticket gross margins.",
        "100% private database with zero competitor cross-selling on your booking domain.",
        "Bespoke luxury visual aesthetics tailored to high-ticket salons rather than generic directory templates."
      ],
      pauluxBestFor:
        "Established, high-ticket salons, color bars, and day spas that have outgrown the generic directory feel of Vagaro and want prestige white-label branding on their own custom domain."
    },
    categories: [
      {
        category: "Economics & Add-On Fees",
        description: "Base pricing vs. true cost with all essential operational features.",
        features: [
          {
            name: "True Monthly Software Cost",
            description: "What a 5-chair salon actually pays each month.",
            paulux: "Flat dedicated deployment; $0 monthly software fee",
            competitor: "$30 base + $40 for 4 extra staff + $10 forms + $10 website builder = $90-$150+/mo",
            highlight: true
          },
          {
            name: "Per-User Penalties",
            description: "Monthly fee added for each staff member.",
            paulux: "$0 — Unlimited staff members and receptionists",
            competitor: "$10/month for every additional user login",
            highlight: true
          },
          {
            name: "Marketplace Cross-Selling",
            description: "Whether competitor salons are promoted to your clients.",
            paulux: "Zero cross-selling; private isolated environment on your domain",
            competitor: "Clients see competing salons and special offers on Vagaro marketplace",
            highlight: true
          },
          {
            name: "Custom Domain Booking",
            description: "Hosting on your own brand's domain name.",
            paulux: "Native custom domain (booking.yourbrand.com) included",
            competitor: "Requires extra Vagaro website builder add-on ($10/mo) or generic iframe",
            highlight: false
          }
        ]
      },
      {
        category: "Chemical Dispensary & Backbar",
        description: "Salon color formulation, developer ratios, and margin calculation.",
        features: [
          {
            name: "Color Dispensary ml/g Tracking",
            description: "Measuring professional color bowls down to grams and milliliters.",
            paulux: "Bowl-by-bowl ml/g tracking with real-time gross margin calculation per ticket",
            competitor: "Whole-bottle retail SKU tracking only; no chemical dispensary accounting",
            highlight: true
          },
          {
            name: "Color Formula History in CRM",
            description: "Saving technical color recipes to client files.",
            paulux: "Dedicated formula vault with developer volume, toner ratios, and processing timer",
            competitor: "Basic text notes attached to customer profile",
            highlight: false
          },
          {
            name: "Backbar Consumable Waste Analytics",
            description: "Detecting chemical product over-use and shrinkage.",
            paulux: "Real-time chemical usage vs. expected yield reporting across departments",
            competitor: "Not available",
            highlight: false
          }
        ]
      },
      {
        category: "Communications & Client Experience",
        description: "SMS reminders, automated win-backs, and brand presentation.",
        features: [
          {
            name: "SMS Reminder Pricing",
            description: "Cost per reminder text sent to clients.",
            paulux: "Direct carrier wholesale rates (approx. 1¢) with zero platform markup",
            competitor: "Vagaro packages text credits with monthly overage fees",
            highlight: true
          },
          {
            name: "Visual Brand Prestige",
            description: "High-end luxury aesthetic vs. mass-market directory feel.",
            paulux: "Editorial luxury typography, custom brand accents, 100% white-label",
            competitor: "Generic Vagaro directory layout with prominent Vagaro logos",
            highlight: true
          },
          {
            name: "Automated Win-Back Engine",
            description: "Re-engaging clients after 30, 60, or 90 days.",
            paulux: "Native automated retention sequences included at no extra cost",
            competitor: "Requires Vagaro Email/SMS marketing add-on package ($20/mo)",
            highlight: false
          }
        ]
      },
      {
        category: "Hardware & POS Compatibility",
        description: "Card readers, receipt printers, and checkout stations.",
        features: [
          {
            name: "Card Terminal Compatibility",
            description: "Point-of-sale card reader options.",
            paulux: "Open hardware support: Stripe Terminal, Paystack POS, or Bluetooth mobile readers",
            competitor: "Requires proprietary Vagaro EMV reader or pay-desk terminal",
            highlight: false
          },
          {
            name: "Multi-Staff Split Checkouts",
            description: "Splitting a ticket between a colorist and an assistant.",
            paulux: "Native multi-stylist split ticket assignment with custom commission calculation",
            competitor: "Supported with complex checkout adjustments",
            highlight: false
          }
        ]
      }
    ],
    faqs: [
      {
        q: "Does Paulux charge commissions on new clients?",
        a: "No. Paulux operates on a 0% booking commission model. Unlike marketplaces that take 20% of your new client revenue, all payments process directly into your Stripe or Paystack merchant account. You keep 100% of every ticket, deposit, and gift card transaction with zero marketplace fees."
      },
      {
        q: "Can Paulux run on my own custom domain?",
        a: "Yes. Every Paulux deployment connects directly to your custom domain (e.g., booking.yourbrand.com) with automated SSL security. Your clients book directly with your brand, eliminating third-party app downloads and preventing competitor salons from advertising on your booking profile."
      },
      {
        q: "How does Paulux handle deposit collection and chargebacks?",
        a: "Paulux includes a native Deposit Enforcer requiring clients to authorize full or partial upfront deposits at checkout. Funds route directly to your merchant gateway with automated 3D Secure fraud protection, minimizing chargeback risks and eliminating no-shows on high-ticket appointment slots."
      },
      {
        q: "Why are salons switching from Vagaro to Paulux?",
        a: "Vagaro charges extra fees for each additional stylist, custom intake forms, website builders, and SMS notifications. Additionally, its consumer marketplace exposes your clients to competing local salon promotions. Paulux provides an all-inclusive, white-label booking platform on your own custom domain with 0% commissions and zero monthly add-on penalties."
      },
      {
        q: "Can I track hair color and backbar chemicals on Paulux?",
        a: "Yes. Unlike Vagaro, which only tracks unopened retail bottles, Paulux tracks professional hair color, bleach powder, and developer by the milliliter and gram per bowl, automatically calculating your real-time gross margin and chemical costs on every customer checkout ticket."
      }
    ]
  },

  "square-appointments": {
    slug: "square-appointments",
    name: "Square Appointments",
    tagline: "The Generic Retail POS Struggling with Salon Workflows",
    badge: "Generic POS Model",
    vertical: "Solo Stylists, Small Studios & Retail hybrid shops",
    primaryFeeModel: "Free solo tier, then $29/mo (Plus) to $69/mo (Premium) per location + payment processing",
    heroHeadline: "The Purpose-Built Square Appointments Alternative for Salons",
    heroSubheadline:
      "Square is great for coffee shops, but salons need purpose-built workflows. Upgrade from Square's basic appointment slots to Paulux's backbar chemical dispensary (ml/g), stylist mobile portals, and white-label custom domain booking.",
    definitionPassageTitle: "What is the Paulux Square Appointments Alternative?",
    definitionPassageBody:
      "Paulux is a purpose-built salon and aesthetic clinic booking system deployed on an independent custom domain, replacing generic retail POS tools like Square Appointments with bowl-by-bowl chemical dispensary tracking, stylist mobile portals, and 0% commission booking.",
    objectiveEvaluation: {
      competitorStrengths: [
        "Seamless integration with Square's ubiquitous payment hardware (Square Reader, Square Terminal, Square Register).",
        "Free tier available for single-stylist solo operators needing basic appointment booking.",
        "Unified checkout combining cafe/retail sales with simple calendar appointment slots."
      ],
      competitorBestFor:
        "Solo operators or hybrid retail boutiques/barbershops already deeply invested in Square POS hardware who only need simple calendar slots and have zero chemical dispensary or complex multi-staff commission requirements.",
      pauluxStrengths: [
        "Bespoke salon and clinic workflows: chemical dispensary tracking down to grams/milliliters, service prep/aftercare notes, and patch-test health records.",
        "White-label custom domain booking (booking.yourbrand.com) rather than generic square.site pages.",
        "Independent /stylist mobile portal keeping shop financial accounting private while empowering stylists.",
        "No tiered monthly feature paywalls — full enterprise modules included.",
        "Advanced deposit enforcement with dual Paystack/Stripe failover."
      ],
      pauluxBestFor:
        "Growing salons, color bars, aesthetic clinics, and multi-chair studios that have outgrown Square's rudimentary calendar grid and require professional backbar accounting, stylist portals, and prestige brand presentation."
    },
    categories: [
      {
        category: "Salon Workflow Specialization",
        description: "Purpose-built salon features vs. generic appointment calendars.",
        features: [
          {
            name: "Chemical Dispensary & Backbar (ml/g)",
            description: "Tracking color tubes, oxidants, and bleach powder by weight/volume.",
            paulux: "Milliliter (ml) and gram (g) dispensary ledger with real-time per-ticket gross margins",
            competitor: "Not available; Square only tracks simple retail inventory quantities",
            highlight: true
          },
          {
            name: "Technical Client CRM & Formula Vault",
            description: "Color formulas, developer volume, scalp allergies, and patch tests.",
            paulux: "Dedicated formula vault and medical/allergy warnings surfaced at check-in",
            competitor: "Basic unstructured text field in generic Square customer directory",
            highlight: true
          },
          {
            name: "Service Prep & Post-Care Instructions",
            description: "Automated instructions sent before and after clinical/color services.",
            paulux: "Automated pre-care & post-care instructions attached to confirmation emails & SMS",
            competitor: "Not natively supported; requires third-party email marketing apps",
            highlight: false
          }
        ]
      },
      {
        category: "Economics & Multi-Staff Costs",
        description: "Monthly subscription tiers for growing salon teams.",
        features: [
          {
            name: "Multi-Staff Monthly Pricing",
            description: "Cost for teams with 2 to 10+ stylists.",
            paulux: "Flat dedicated deployment quote; zero recurring per-seat penalties",
            competitor: "$29/mo (Plus tier) or $69/mo (Premium tier) per location + processing fees",
            highlight: true
          },
          {
            name: "Stylist Permission Isolation",
            description: "Keeping business-wide financial totals hidden from individual contractors.",
            paulux: "Independent /stylist mobile portal showing only personal chair schedule and earnings",
            competitor: "Square Team Management requires higher subscription tiers ($35+/mo add-on)",
            highlight: true
          },
          {
            name: "Custom Booking Domain",
            description: "Branded booking URL.",
            paulux: "booking.yoursalon.com (Your Custom Domain)",
            competitor: "square.site/book/your-salon (Square Subdomain)",
            highlight: true
          }
        ]
      },
      {
        category: "Communications & Client Retention",
        description: "Automated client reminders and win-back campaigns.",
        features: [
          {
            name: "SMS Reminder Pricing",
            description: "Cost per reminder text message.",
            paulux: "Direct carrier wholesale rates with 0% platform markup",
            competitor: "Included in higher paid tiers or requires Square Marketing subscription ($15+/mo)",
            highlight: false
          },
          {
            name: "Automated 30/60/90-Day Win-Backs",
            description: "Automatically re-booking clients who haven't returned.",
            paulux: "Native automated win-back triggers included at no extra cost",
            competitor: "Requires Square Marketing paid add-on ($15 to $45+/month)",
            highlight: true
          }
        ]
      },
      {
        category: "Hardware & POS Compatibility",
        description: "Terminal options, thermal receipt printers, and cash drawers.",
        features: [
          {
            name: "Card Terminal Freedom",
            description: "Hardware independence vs. proprietary lock-in.",
            paulux: "Compatible with open standard terminals (Stripe WisePOS E, Paystack POS, Bluetooth)",
            competitor: "Locked into Square's proprietary readers (Square Terminal, Square Register)",
            highlight: false
          },
          {
            name: "Thermal Receipt Printers & Cash Drawers",
            description: "Standard POS hardware.",
            paulux: "Standard ESC/POS thermal printers and RJ11 cash drawers",
            competitor: "Supported with Square-approved hardware list",
            highlight: false
          }
        ]
      }
    ],
    faqs: [
      {
        q: "Does Paulux charge commissions on new clients?",
        a: "No. Paulux operates on a 0% booking commission model. Unlike marketplaces that take 20% of your new client revenue, all payments process directly into your Stripe or Paystack merchant account. You keep 100% of every ticket, deposit, and gift card transaction with zero marketplace fees."
      },
      {
        q: "Can Paulux run on my own custom domain?",
        a: "Yes. Every Paulux deployment connects directly to your custom domain (e.g., booking.yourbrand.com) with automated SSL security. Your clients book directly with your brand, eliminating third-party app downloads and preventing competitor salons from advertising on your booking profile."
      },
      {
        q: "How does Paulux handle deposit collection and chargebacks?",
        a: "Paulux includes a native Deposit Enforcer requiring clients to authorize full or partial upfront deposits at checkout. Funds route directly to your merchant gateway with automated 3D Secure fraud protection, minimizing chargeback risks and eliminating no-shows on high-ticket appointment slots."
      },
      {
        q: "Why do salons outgrow Square Appointments?",
        a: "Square Appointments was designed as a generic calendar tool for retail merchants. It lacks critical salon functionality such as backbar chemical dispensary tracking in milliliters and grams, structured client formula vaults, stylist permission isolation without paid tier upgrades, and white-label booking on your own custom domain."
      },
      {
        q: "Can I still accept in-person card payments without Square hardware?",
        a: "Yes. Paulux integrates directly with Stripe Terminal and Paystack POS hardware, supporting modern smart terminals like the WisePOS E for in-person tap-to-pay and chip transactions. Payments settle directly into your business bank account with zero middleman deductions or merchant processing surcharges."
      }
    ]
  },

  phorest: {
    slug: "phorest",
    name: "Phorest",
    tagline: "The High-Ticket Salon System with Exorbitant Setup Fees and Locked Contracts",
    badge: "Enterprise Contract Model",
    vertical: "High-End Salons, Spa Chains & Aesthetic Practices",
    primaryFeeModel: "$150-$300+/month + $1,000+ onboarding setup fee + long-term annual contracts",
    heroHeadline: "The Modern Phorest Alternative with 0% Commissions & Zero Contract Lock-In",
    heroSubheadline:
      "Escape Phorest's $1,000+ setup fees, locked annual contracts, and expensive monthly software rent. Deploy a luxury, dedicated salon platform on your own custom domain in 48 hours.",
    definitionPassageTitle: "What is the Paulux Phorest Alternative?",
    definitionPassageBody:
      "Paulux is a dedicated enterprise salon software platform deployed on an independent custom domain, offering high-end backbar dispensary tracking and automated client marketing without Phorest's $1,000+ setup fees, locked annual contracts, or expensive monthly software rent.",
    objectiveEvaluation: {
      competitorStrengths: [
        "Comprehensive enterprise feature set designed specifically for traditional multi-chair hair salons.",
        "Dedicated onboarding specialists and phone account managers for large salon chains.",
        "Built-in consultation form iPad app and salon branded consumer app options."
      ],
      competitorBestFor:
        "Large multi-location salon chains with 15+ chairs per location who prefer traditional enterprise vendor contracts, require dedicated corporate account managers, and have the budget for $1,000+ setup fees and $250+/month ongoing software rent.",
      pauluxStrengths: [
        "Zero annual contract lock-in and zero exorbitant $1,000+ setup fees — turnkey deployment in under 48 hours.",
        "100% data autonomy with an isolated database on your custom domain rather than proprietary vendor lock-in.",
        "Superior chemical dispensary tracking down to milliliters and grams with real-time per-ticket gross margin P&L.",
        "Direct merchant account routing (Stripe / Paystack) with immediate deposit access and zero middleman holds.",
        "Modern mobile-first customer booking wizard completing in under 45 seconds."
      ],
      pauluxBestFor:
        "Premier independent salons, luxury color bars, and boutique aesthetic clinics that demand elite enterprise features without being trapped in multi-year software vendor contracts and high recurring overhead."
    },
    categories: [
      {
        category: "Contracts & Setup Economics",
        description: "Onboarding costs, contract terms, and recurring monthly fees.",
        features: [
          {
            name: "Initial Setup & Onboarding Fee",
            description: "Upfront implementation and training costs.",
            paulux: "Included in turnkey deployment; zero inflated training surcharges",
            competitor: "Typically $800 to $1,500+ mandatory implementation fee",
            highlight: true
          },
          {
            name: "Contract Commitment",
            description: "Required contract duration and termination flexibility.",
            paulux: "Zero multi-year contract lock-in; you own your dedicated deployment",
            competitor: "Strict 12 to 36-month locked corporate contracts with auto-renewal clauses",
            highlight: true
          },
          {
            name: "Monthly Software Subscription",
            description: "Ongoing platform licensing fee.",
            paulux: "Dedicated standalone deployment quote; no monthly fee creep",
            competitor: "$150 to $350+ per month depending on chair count and SMS tiers",
            highlight: true
          },
          {
            name: "Data Ownership & Portability",
            description: "Freedom to export full clinical and financial history.",
            paulux: "100% Private, isolated database with full CSV/SQL export rights anytime",
            competitor: "Proprietary database structure; difficult migration when terminating contract",
            highlight: true
          }
        ]
      },
      {
        category: "Chemical Dispensary & Backbar Accounting",
        description: "Measuring color bar consumables and profit margins.",
        features: [
          {
            name: "Gram & Milliliter Bowl Tracking",
            description: "Precision dispensary tracking for bleach, developer, and color.",
            paulux: "Native bowl-by-bowl ml/g tracking with live gross margin per ticket",
            competitor: "Requires third-party dispensary integration (e.g. Vish) or manual stock audits",
            highlight: true
          },
          {
            name: "Live Service Gross Margin P&L",
            description: "Real-time profitability calculation on every chemical ticket.",
            paulux: "Automated ticket P&L deducting chemical product cost from service charge",
            competitor: "Available through complex post-shift end-of-day reporting",
            highlight: false
          },
          {
            name: "Historical Snapshot Accounting",
            description: "Locking in product purchase costs at checkout for permanent P&L accuracy.",
            paulux: "Locked snapshot accounting prevents retroactive P&L distortions",
            competitor: "Standard weighted average inventory valuation",
            highlight: false
          }
        ]
      },
      {
        category: "Client Communications & SMS Rates",
        description: "Reminder texts, marketing campaigns, and review boosters.",
        features: [
          {
            name: "SMS Pricing & Delivery",
            description: "Cost per reminder and promotional text message.",
            paulux: "Direct carrier wholesale rates (approx. 1¢) with zero markups",
            competitor: "High per-message SMS fees or expensive bundle packages",
            highlight: true
          },
          {
            name: "WhatsApp 2-Way Confirmations",
            description: "Direct WhatsApp messaging for client reminders.",
            paulux: "Native WhatsApp booking confirmations and calendar sync links",
            competitor: "Primarily limited to SMS and Phorest Salon Branded App",
            highlight: false
          },
          {
            name: "5-Star Review Booster",
            description: "Automated prompts to drive Google Reviews after happy visits.",
            paulux: "Native 1-click Google Review booster triggered after completed appointments",
            competitor: "Phorest Online Reputation Manager included in high-tier plans",
            highlight: false
          }
        ]
      },
      {
        category: "Hardware & Front-Desk Operations",
        description: "Point-of-sale hardware, card terminals, and mobile staff portals.",
        features: [
          {
            name: "Card Terminal Hardware",
            description: "In-person checkout terminal options.",
            paulux: "Open standard hardware (Stripe WisePOS E, Paystack POS, Bluetooth)",
            competitor: "PhorestPay proprietary terminals with locked merchant processing",
            highlight: false
          },
          {
            name: "Dedicated Stylist Mobile Portal",
            description: "Independent schedule access on stylists' smartphones.",
            paulux: "Independent /stylist mobile portal with chair view and client formula vault",
            competitor: "Phorest Go mobile application",
            highlight: false
          }
        ]
      }
    ],
    faqs: [
      {
        q: "Does Paulux charge commissions on new clients?",
        a: "No. Paulux operates on a 0% booking commission model. Unlike marketplaces that take 20% of your new client revenue, all payments process directly into your Stripe or Paystack merchant account. You keep 100% of every ticket, deposit, and gift card transaction with zero marketplace fees."
      },
      {
        q: "Can Paulux run on my own custom domain?",
        a: "Yes. Every Paulux deployment connects directly to your custom domain (e.g., booking.yourbrand.com) with automated SSL security. Your clients book directly with your brand, eliminating third-party app downloads and preventing competitor salons from advertising on your booking profile."
      },
      {
        q: "How does Paulux handle deposit collection and chargebacks?",
        a: "Paulux includes a native Deposit Enforcer requiring clients to authorize full or partial upfront deposits at checkout. Funds route directly to your merchant gateway with automated 3D Secure fraud protection, minimizing chargeback risks and eliminating no-shows on high-ticket appointment slots."
      },
      {
        q: "Why are premier salons switching from Phorest to Paulux?",
        a: "Phorest locks salons into rigid 12-to-36-month contracts, requires $1,000+ onboarding fees, and charges high monthly software fees with SMS markups. Paulux delivers the same high-end operational power—including backbar chemical dispensary tracking and 0% commission booking—on your own custom domain with zero contract lock-in and direct merchant payouts."
      },
      {
        q: "How does chemical dispensary tracking work in Paulux?",
        a: "Paulux tracks bleach powder, developers, and color tubes in exact grams and milliliters per bowl. When a stylist checks out a client, Paulux calculates the exact chemical cost and shows the salon owner the realized gross margin in real time."
      }
    ]
  }
};

export const HEAD_TO_HEAD_COMPARISONS: Record<string, HeadToHeadComparison> = {
  "fresha-vs-booksy": {
    slug: "fresha-vs-booksy",
    comp1: "Fresha",
    comp2: "Booksy",
    title: "Fresha vs. Booksy: 2026 Comparison & The Modern Alternative",
    description: "Evaluating Fresha vs. Booksy for your salon or barbershop? Compare 20% marketplace commissions against $20/chair monthly fees, and see why top studios choose Paulux.",
    subtitle: "Marketplace Commissions vs. Per-Chair Monthly Fees: Choosing the Right Booking Engine",
    definitionPassageTitle: "What is the Paulux Alternative to Fresha and Booksy?",
    definitionPassageBody:
      "Paulux is an independent, white-label booking engine that allows high-earning salons and barbershops to bypass Fresha's 20% new-client commissions and Booksy's per-chair monthly fees by deploying directly on their own custom domain with 0% transaction cuts.",
    summary:
      "Fresha lures salons with free software but charges 20% commission on every new client discovery. Booksy charges $29.99/mo base plus $20/mo for every additional chair, while also charging marketplace cuts. High-earning salons and barbershops use Paulux as the independent third-party alternative to own their domain with 0% fees.",
    tableRows: [
      {
        feature: "New Client Discovery Fee",
        comp1Val: "20% cut on every new client booked",
        comp2Val: "Up to 20% commission via marketplace",
        pauluxVal: "0% — Keep 100% of every ticket"
      },
      {
        feature: "Staff & Chair Monthly Fees",
        comp1Val: "Free base + paid add-ons",
        comp2Val: "$29.99/mo base + $20/mo per extra barber",
        pauluxVal: "Flat deployment quote; $0 per extra staff member"
      },
      {
        feature: "Client Cross-Selling Risk",
        comp1Val: "High: Promotes neighboring competitor salons",
        comp2Val: "High: Advertises rival barbershops to your clients",
        pauluxVal: "Zero: 100% Private isolated database on your domain"
      },
      {
        feature: "Booking Web Address",
        comp1Val: "fresha.com/your-salon",
        comp2Val: "booksy.com/your-barbershop",
        pauluxVal: "booking.yourbrand.com (Your Custom Domain)"
      },
      {
        feature: "Chemical Dispensary (ml/g)",
        comp1Val: "Retail SKU counts only",
        comp2Val: "Retail SKU counts only",
        pauluxVal: "Bowl-by-bowl ml/g tracking with live ticket margin"
      },
      {
        feature: "Walk-In Fast Check-In",
        comp1Val: "Standard online booking flow",
        comp2Val: "Multi-click appointment flow",
        pauluxVal: "15-second rapid chair assignment mode"
      },
      {
        feature: "Payment Gateway",
        comp1Val: "Locked into Fresha card processing",
        comp2Val: "Booksy card processing",
        pauluxVal: "Direct to your own Stripe / Paystack merchant account"
      }
    ],
    objectiveTakeaway:
      "Choose Fresha if you are a solo operator with no clients who wants free software and relies entirely on marketplace discovery. Choose Booksy if you run a casual barbershop where all barbers and clients are already active on the Booksy mobile app. Choose Paulux if you are an established salon or studio with your own brand who refuses to surrender 20% commissions or pay $20/month per barber chair.",
    faqs: [
      {
        q: "Which takes more money: Fresha or Booksy?",
        a: "Fresha takes a 20% commission on every new client discovery, costing busy salons hundreds monthly. Booksy charges $29.99 base plus $20 per additional barber chair every month, alongside marketplace fees. Both models erode margins compared to Paulux's flat deployment and 0% booking commission architecture."
      },
      {
        q: "Why do clients see competitor salons on Fresha and Booksy?",
        a: "Both platforms operate consumer directories incentivized to retain app traffic rather than protect salon brand loyalty. They actively display competing nearby salons, sponsored discounts, and alternative provider suggestions directly within booking confirmation screens, directory listings, and client search results."
      },
      {
        q: "How does Paulux position as the independent third-party alternative?",
        a: "Paulux bypasses third-party consumer directories entirely. Instead of listing your chairs alongside competing rivals, Paulux deploys a bespoke, white-label booking engine on your own custom domain with 0% transaction cuts, isolated client data, and direct Stripe or Paystack merchant payouts."
      }
    ]
  },

  "mindbody-vs-vagaro": {
    slug: "mindbody-vs-vagaro",
    comp1: "Mindbody",
    comp2: "Vagaro",
    title: "Mindbody vs. Vagaro: 2026 Comparison & The Dedicated Alternative",
    description: "Comparing Mindbody vs. Vagaro for your medspa, clinic, or wellness center? Compare $159-$699/mo enterprise bloat against tiered add-on fees, and explore Paulux.",
    subtitle: "High-Cost Legacy Enterprise vs. Add-On Tiered Subscription: Why Clinics Choose Dedicated Systems",
    definitionPassageTitle: "What is the Paulux Alternative to Mindbody and Vagaro?",
    definitionPassageBody:
      "Paulux is a modern, white-label booking and clinical deposit enforcement platform for aesthetic clinics and medspas, eliminating Mindbody's $159–$699/month software bloat and Vagaro's per-feature add-on fees with 100% patient data isolation on your own custom domain.",
    summary:
      "Mindbody dominates high-cost enterprise fitness and wellness with $159 to $699+/month fees and complex features. Vagaro offers a lower $30/month starting point but steadily adds $10/user, forms fees, website fees, and SMS surcharges. Paulux provides a dedicated, luxury platform on your own domain with patient data isolation and clinical deposit protection.",
    tableRows: [
      {
        feature: "Base Monthly Cost",
        comp1Val: "$159 to $699+ / month",
        comp2Val: "$30 / month base",
        pauluxVal: "Flat deployment quote; $0 recurring software rent"
      },
      {
        feature: "Additional Staff Fees",
        comp1Val: "Included in high-tier bundles",
        comp2Val: "$10 / month per extra staff login",
        pauluxVal: "$0 — Unlimited staff and receptionist seats"
      },
      {
        feature: "Clinical Deposit Enforcer",
        comp1Val: "Requires third-party credit card hold plugins",
        comp2Val: "Basic cancellation fees",
        pauluxVal: "Native full or partial deposit requirement on high-ticket slots"
      },
      {
        feature: "Patient Data Isolation",
        comp1Val: "Aggregated in corporate database",
        comp2Val: "Shared directory network",
        pauluxVal: "100% Private, isolated database owned solely by your clinic"
      },
      {
        feature: "Aesthetic Formula & Allergy CRM",
        comp1Val: "Generic text notes buried in tabs",
        comp2Val: "Basic profile notes",
        pauluxVal: "Dedicated technical formula flags and allergy check-in warnings"
      },
      {
        feature: "Booking Web Address",
        comp1Val: "mindbodyonline.com/your-spa",
        comp2Val: "vagaro.com/your-spa",
        pauluxVal: "booking.yourmedspa.com (Your Custom Domain)"
      }
    ],
    objectiveTakeaway:
      "Choose Mindbody if you are a multi-location fitness franchise managing 50+ classes daily with turnstile door access. Choose Vagaro if you want a budget directory listing for a general-purpose salon. Choose Paulux if you operate an aesthetic clinic, medspa, or luxury wellness center that requires patient privacy, clinical deposit enforcement, and bespoke custom domain branding without monthly software rent.",
    faqs: [
      {
        q: "Why are MedSpas switching away from Mindbody and Vagaro?",
        a: "Aesthetic clinics require clinical deposit enforcement, medical history privacy, and luxury branding. Mindbody is bloated with enterprise gym features and costs up to $699 monthly, while Vagaro feels like a discount directory. Paulux delivers a dedicated, white-label platform on your own domain with 100% data isolation."
      },
      {
        q: "How does Paulux prevent no-shows on expensive laser and injectable slots?",
        a: "Paulux features a native Deposit Enforcer requiring upfront partial or full deposits during checkout. Funds route directly to your Stripe or Paystack merchant account with automated 3D Secure verification, protecting high-ticket aesthetic treatment slots and virtually eliminating costly late cancellations and no-shows."
      },
      {
        q: "Can Paulux run on our medical clinic's custom domain?",
        a: "Yes. Every Paulux deployment connects directly to your custom domain (e.g., booking.yourclinic.com) with automated SSL security. Your clients book directly with your brand, eliminating third-party app downloads and preventing competitor salons from advertising on your booking profile."
      }
    ]
  },

  "phorest-vs-fresha": {
    slug: "phorest-vs-fresha",
    comp1: "Phorest",
    comp2: "Fresha",
    title: "Phorest vs. Fresha: 2026 Comparison & The Modern Alternative",
    description: "Evaluating Phorest vs. Fresha? Compare Phorest's $1,000+ setup fees and locked contracts against Fresha's 20% marketplace commissions. See why salons choose Paulux.",
    subtitle: "Enterprise Contract Lock-In vs. 20% Marketplace Commissions: The Independent Alternative",
    definitionPassageTitle: "What is the Paulux Alternative to Phorest and Fresha?",
    definitionPassageBody:
      "Paulux is a dedicated salon management system offering enterprise backbar chemical tracking and 0% commission booking on an independent custom domain, eliminating Phorest's locked annual contracts and setup fees alongside Fresha's 20% marketplace commissions.",
    summary:
      "Phorest targets high-end salons with comprehensive tools but demands $1,000+ onboarding fees, locked 12-to-36-month contracts, and $150-$350+/month fees. Fresha offers free software upfront but extracts a punishing 20% commission on every new client. Paulux provides the modern third way: enterprise-grade backbar accounting and white-label booking with zero contracts and 0% commission.",
    tableRows: [
      {
        feature: "Pricing Model",
        comp1Val: "$150-$350+/mo + $1,000+ onboarding fee",
        comp2Val: "20% commission on new clients + add-ons",
        pauluxVal: "0% commission; flat dedicated deployment quote"
      },
      {
        feature: "Contract Terms",
        comp1Val: "12 to 36-month locked corporate contracts",
        comp2Val: "Month-to-month marketplace agreement",
        pauluxVal: "No locked contracts; you own your deployment"
      },
      {
        feature: "Backbar Dispensary (ml/g)",
        comp1Val: "Requires third-party add-on integration",
        comp2Val: "Retail whole bottles only",
        pauluxVal: "Native bowl-by-bowl ml/g tracking with live ticket margin"
      },
      {
        feature: "SMS Reminder Rates",
        comp1Val: "Expensive bundles with markups",
        comp2Val: "High per-message credit charges",
        pauluxVal: "Direct carrier wholesale rates (approx. 1¢) with 0% markup"
      },
      {
        feature: "Custom Domain Booking",
        comp1Val: "Embedded widget or branded consumer app",
        comp2Val: "fresha.com/a/your-salon",
        pauluxVal: "booking.yoursalon.com (Your Custom Domain)"
      }
    ],
    objectiveTakeaway:
      "Choose Phorest if you are a multi-location salon chain that requires dedicated phone account managers and doesn't mind paying $1,000+ setup fees and $250+/month. Choose Fresha if you are a new solo stylist with zero clients who needs quick marketplace discovery. Choose Paulux if you want top-tier operational software (including backbar ml/g dispensary tracking) on your own custom domain with zero contracts and 0% commissions.",
    faqs: [
      {
        q: "Why is Paulux considered the modern alternative to Phorest and Fresha?",
        a: "Salon owners were historically trapped between two extremes: Phorest's expensive multi-year corporate contracts and $1,000+ setup fees, or Fresha's 20% marketplace commissions and client data sharing. Paulux provides dedicated enterprise software on your own domain with 0% commissions and zero vendor contract lock-in."
      },
      {
        q: "How does chemical dispensary tracking work in Paulux?",
        a: "Paulux tracks bleach powder, developer, and color tubes in exact grams and milliliters per bowl. When a stylist checks out a client, Paulux automatically logs chemical consumption and displays the realized gross profit margin in real time on the service ticket."
      },
      {
        q: "Does Paulux charge commissions on new clients?",
        a: "No. Paulux operates on a 0% booking commission model. Unlike marketplaces that take 20% of your new client revenue, all payments process directly into your Stripe or Paystack merchant account. You keep 100% of every ticket, deposit, and gift card transaction with zero marketplace fees."
      }
    ]
  },

  "square-vs-booksy": {
    slug: "square-vs-booksy",
    comp1: "Square Appointments",
    comp2: "Booksy",
    title: "Square Appointments vs. Booksy: 2026 Comparison & The Salon Alternative",
    description: "Comparing Square Appointments vs. Booksy? Compare Square's generic retail POS against Booksy's per-chair fees and marketplace cuts. Discover Paulux.",
    subtitle: "Generic Retail POS vs. Barbershop Marketplace: Why Dedicated Studios Choose Paulux",
    definitionPassageTitle: "What is the Paulux Alternative to Square and Booksy?",
    definitionPassageBody:
      "Paulux is a purpose-built booking and chair management system for modern barbershops and studios, replacing Square's generic retail POS limitations and Booksy's per-chair fees with a 15-second walk-in check-in mode and custom domain deployment.",
    summary:
      "Square Appointments is a generic appointment add-on designed for retail shops with simple calendar needs. Booksy is built for barbers but penalizes multi-chair shops with $20/month per barber fees while taking marketplace commissions. Paulux gives studios purpose-built salon workflows on their own custom domain with 0% commissions.",
    tableRows: [
      {
        feature: "Primary Focus",
        comp1Val: "Generic retail & appointment POS",
        comp2Val: "Barbershop consumer marketplace",
        pauluxVal: "Dedicated salon, barbershop & clinic platform"
      },
      {
        feature: "Multi-Staff Costs",
        comp1Val: "$29 to $69 / month per location",
        comp2Val: "$29.99/mo + $20/mo per extra barber chair",
        pauluxVal: "Flat deployment quote; $0 per extra chair"
      },
      {
        feature: "New Client Commission",
        comp1Val: "0% commission",
        comp2Val: "Up to 20% on marketplace bookings",
        pauluxVal: "0% commission forever"
      },
      {
        feature: "Chemical Dispensary (ml/g)",
        comp1Val: "Not available",
        comp2Val: "Not available",
        pauluxVal: "Native bowl-by-bowl ml/g tracking with live ticket margin"
      },
      {
        feature: "Rapid Walk-In Mode",
        comp1Val: "Standard retail cart checkout",
        comp2Val: "Multi-click appointment flow",
        pauluxVal: "15-second rapid walk-in chair assignment mode"
      },
      {
        feature: "Branded Web Address",
        comp1Val: "square.site/book/your-shop",
        comp2Val: "booksy.com/your-shop",
        pauluxVal: "booking.yourbarbershop.com (Your Custom Domain)"
      }
    ],
    objectiveTakeaway:
      "Choose Square Appointments if you are a solo barber or small boutique who is already heavily invested in Square hardware and only needs simple calendar slots. Choose Booksy if you are a solo booth renter whose clients already use the Booksy consumer app. Choose Paulux if you have 2+ chairs and want 15-second walk-in check-in, backbar tracking, custom domain branding, and zero per-staff monthly fees.",
    faqs: [
      {
        q: "Can Square Appointments handle chemical dispensary tracking or formula notes?",
        a: "No. Square was designed as a general retail POS. It lacks professional hair color dispensary tracking in milliliters and grams, structured formula logs, and salon-specific client CRM features. Paulux is built specifically for beauty and grooming studios with purpose-built salon workflows."
      },
      {
        q: "Why is Paulux better for multi-chair barbershops than Booksy?",
        a: "Booksy penalizes growing shops by charging $20 monthly for every additional chair while advertising competing local barbershops. Paulux provides flat deployment with zero per-chair penalties, an independent /stylist mobile schedule portal, and a 15-second rapid walk-in checkout mode."
      },
      {
        q: "Can Paulux run on my own custom domain?",
        a: "Yes. Every Paulux deployment connects directly to your custom domain (e.g., booking.yourbrand.com) with automated SSL security. Your clients book directly with your brand, eliminating third-party app downloads and preventing competitor salons from advertising on your booking profile."
      }
    ]
  }
};
