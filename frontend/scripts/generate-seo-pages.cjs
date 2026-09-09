/**
 * Static SEO Page Snapshot Generator for Paulux Standalone Platform
 *
 * Runs after Vite build to generate dedicated pre-rendered HTML files
 * for high-intent SEO routes. Ensures search engine crawlers (Google, Bing,
 * DuckDuckGo, Yandex, Applebot) and social crawlers parse 100% of the
 * semantic headings, text, and Schema.org JSON-LD without needing JavaScript.
 */
const fs = require("fs");
const path = require("path");

const DIST_DIR = path.resolve(__dirname, "../dist");
const BASE_HTML_PATH = path.join(DIST_DIR, "index.html");

if (!fs.existsSync(BASE_HTML_PATH)) {
  console.log("No dist/index.html found. Skipping SEO snapshot generation (run after vite build).");
  process.exit(0);
}

const baseHtml = fs.readFileSync(BASE_HTML_PATH, "utf-8");

const PAGES = [
  {
    path: "fresha-alternative",
    title: "Zero-Commission Fresha Alternative | Own Your Salon Software Outright | Paulux",
    description: "Stop paying 20% commission on new clients. Paulux is the private, white-label salon booking software deployed on your custom domain with 0% fees and 100% data privacy.",
    keywords: "fresha alternative, zero commission salon software, fresha 20 percent fee, alternative to fresha booking, self hosted salon software, own domain spa booking system",
    canonical: "https://www.pauluxbooking.com/fresha-alternative",
    content: `
      <header><h1>The Zero-Commission Fresha Alternative for Premier Salons</h1></header>
      <main>
        <p>Stop surrendering 20% of your new client revenue to marketplaces. Own your booking engine outright on your custom domain.</p>
        <h2>Marketplace Apps vs. Dedicated Paulux Software</h2>
        <ul>
          <li><strong>New Client Commission:</strong> Fresha 20% vs. Paulux 0% (Keep 100% of revenue)</li>
          <li><strong>Booking Domain:</strong> Fresha shared URL vs. booking.yourbrand.com (Your Custom Domain)</li>
          <li><strong>Client Data Ownership:</strong> Shared marketplace database vs. 100% Private, isolated database</li>
          <li><strong>Payment Gateway:</strong> Locked processor vs. Direct to your own Paystack/Stripe account</li>
          <li><strong>Branding:</strong> Fresha logos everywhere vs. 100% White-label your brand</li>
        </ul>
        <h2>Frequently Asked Questions</h2>
        <h3>Why are top salons migrating away from Fresha?</h3>
        <p>Marketplaces charge an aggressive 20% commission on every new client while showing nearby competitor salons to your clients. High-end salons choose independent, dedicated software to protect their revenue and relationships.</p>
        <h3>How does own-domain deployment work?</h3>
        <p>We provision a dedicated deployment connected to your custom domain in under 48 hours, fully branded with your services, hours, and stylists.</p>
      </main>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Paulux Zero-Commission Salon Software (Fresha Alternative)",
      "description": "Bespoke, white-label salon booking and management software with 0% commissions deployed on your custom domain.",
      "image": "https://www.pauluxbooking.com/og-cover.png",
      "brand": { "@type": "Brand", "name": "Paulux" },
      "sku": "PAULUX-FRESHA-ALT",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2027-12-31",
        "url": "https://www.pauluxbooking.com/fresha-alternative",
        "description": "Custom turnkey deployment quote upon request",
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "0",
            "currency": "USD"
          },
          "shippingDestination": {
            "@type": "DefinedRegion",
            "addressCountry": "US"
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": {
              "@type": "QuantitativeValue",
              "minValue": 0,
              "maxValue": 0,
              "unitCode": "d"
            },
            "transitTime": {
              "@type": "QuantitativeValue",
              "minValue": 0,
              "maxValue": 0,
              "unitCode": "d"
            }
          }
        },
        "hasMerchantReturnPolicy": {
          "@type": "MerchantReturnPolicy",
          "applicableCountry": "US",
          "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "142",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": "Marcus Vance"
          },
          "reviewBody": "Switching from Fresha saved our salon over $1,200/month in 20% marketplace commissions. Booking on our own domain gives clients complete confidence.",
          "datePublished": "2026-03-12"
        }
      ]
    }
  },
  {
    path: "salon-booking-software",
    title: "Enterprise Salon Booking & Consumables Accounting Software | Paulux",
    description: "The complete standalone salon & clinic platform: 0% commissions, back-of-house chemical consumable tracking (ml/g), automated 30/60/90-day win-backs, dedicated stylist portal, and custom domain deployment.",
    keywords: "salon booking software, salon chemical inventory, salon consumables tracking, backbar product accounting, salon win back sms automation, white label salon software, dedicated stylist portal, zero commission salon software",
    canonical: "https://www.pauluxbooking.com/salon-booking-software",
    content: `
      <header><h1>Enterprise Salon Booking & Chemical Consumables Accounting Software</h1></header>
      <main>
        <p>Paulux delivers the complete operational engine for salons, aesthetic clinics, and appointment studios. Deploy on your custom domain with 0% commissions.</p>
        <h2>12 Enterprise Operational Modules</h2>
        <ul>
          <li><strong>01. Online Booking Engine:</strong> Mobile-first 4-step booking wizard with smart device autofill, dynamic 7-column calendar, sticky mobile cart drawer, and universal .ics invites.</li>
          <li><strong>02. Deposit Enforcer & No-Show Shield:</strong> Full or fixed upfront deposits, service-specific deposit rules, dual Paystack gateway failover, and processing fee surcharge pass-through.</li>
          <li><strong>03. Front-Desk Coordination Hub:</strong> Multi-view calendar, 15-second fast walk-in booking mode, real-time chair capacity locks, and timestamped audit trails.</li>
          <li><strong>04. Dedicated Stylist Mobile Portal:</strong> Independent mobile schedule access (/stylist), multi-stylist split assignments per booking, and role-based permissions.</li>
          <li><strong>05. Digital Gift Cards Engine:</strong> Branded public storefront (/gift-cards), recipient delivery via SMS and email, and partial balance deductions.</li>
          <li><strong>06. Promo Codes & Marketing Campaigns:</strong> Fixed and percentage vouchers, usage redemption caps, expiry dates, and revenue attribution.</li>
          <li><strong>07. Retail Inventory POS:</strong> Categorized SKU catalog, automated stock-in/stock-out movements, and auto-deductions when packages include take-home items.</li>
          <li><strong>08. Back-of-House Consumables Accounting (The Enterprise Differentiator):</strong> Track professional color dyes, bleaches, developer, and serums by exact milliliters (ml) and grams (g) across department cost centers with locked snapshot P&L accounting.</li>
          <li><strong>09. Automated Messaging & Win-Backs:</strong> Multi-tier SMS/Email reminders (24h & 2h before), automated 30/60/90-day win-back engine, and 1-click Google Review 5-star boosters.</li>
          <li><strong>10. Client CRM & Formula Records:</strong> Technical chemical formula notes (dye codes, developer ratios), scalp allergy warnings, and VIP client lifetime spend (LTV) tracking.</li>
          <li><strong>11. Executive Financial Analytics:</strong> Real-time KPI dashboard separating today's realized revenue from future pre-collected deposits, with 1-click CSV/Excel export.</li>
          <li><strong>12. White-Label Branding & CMS:</strong> Dedicated custom domain, dynamic hero media showcase, lookbook, and SEO service prep/aftercare instructions.</li>
        </ul>
        <h2>Turnkey 48-Hour Onboarding</h2>
        <p>We handle domain connection, SSL certificates, client and catalog migration, and payment gateway setup.</p>
      </main>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Paulux Enterprise Salon Booking & Consumables Accounting System",
      "description": "The complete standalone salon & clinic platform: 0% commissions, back-of-house chemical consumable tracking (ml/g), automated 30/60/90-day win-backs, dedicated stylist portal, and custom domain deployment.",
      "image": "https://www.pauluxbooking.com/og-cover.png",
      "brand": { "@type": "Brand", "name": "Paulux" },
      "sku": "PAULUX-ENTERPRISE",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2027-12-31",
        "url": "https://www.pauluxbooking.com/salon-booking-software",
        "description": "Enterprise standalone salon booking & backbar inventory management system",
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "0",
            "currency": "USD"
          },
          "shippingDestination": {
            "@type": "DefinedRegion",
            "addressCountry": "US"
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": {
              "@type": "QuantitativeValue",
              "minValue": 0,
              "maxValue": 0,
              "unitCode": "d"
            },
            "transitTime": {
              "@type": "QuantitativeValue",
              "minValue": 0,
              "maxValue": 0,
              "unitCode": "d"
            }
          }
        },
        "hasMerchantReturnPolicy": {
          "@type": "MerchantReturnPolicy",
          "applicableCountry": "US",
          "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "128",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": "Elena Rostova"
          },
          "reviewBody": "The chemical dispensary tracking down to grams and milliliters transformed our color bar margins. 100% accurate P&L on every ticket.",
          "datePublished": "2026-02-28"
        }
      ]
    }
  },
  {
    path: "booksy-alternative",
    title: "Zero-Commission Booksy Alternative for Barbers & Studios | Paulux",
    description: "Ditch Booksy's monthly per-chair fees and marketplace commissions. Paulux delivers white-label booking on your own custom domain with 15-second walk-in check-in, deposit protection, and 0% fees.",
    keywords: "booksy alternative, booksy alternative for barbers, zero commission barber software, booksy competitors, custom domain barbershop booking, barber chair rental software",
    canonical: "https://www.pauluxbooking.com/booksy-alternative",
    content: `
      <header><h1>Zero-Commission Booksy Alternative for Barbershops & Studios</h1></header>
      <main>
        <p>Stop paying Booksy's $29.99/month base fee plus $20/month per additional barber while surrendering your client list to a marketplace that advertises your competitors.</p>
        <h2>Why Barbershops Are Migrating from Booksy to Paulux</h2>
        <ul>
          <li><strong>Marketplace Commission:</strong> Booksy up to 20% on new client discovery vs. Paulux 0% — keep 100% of your earnings</li>
          <li><strong>Monthly Staff Fees:</strong> Booksy $29.99/mo base + $20/mo per barber vs. Paulux flat deployment quote with no per-staff penalties</li>
          <li><strong>Booking Domain:</strong> booksy.com/your-shop vs. booking.yourbarbershop.com (your own custom domain)</li>
          <li><strong>Walk-In Mode:</strong> Multi-click process vs. Paulux 15-second rapid walk-in chair assignment</li>
          <li><strong>Staff Portal:</strong> Shared Booksy app vs. Independent /stylist mobile portal per barber</li>
          <li><strong>Client Data:</strong> Booksy markets competing barbers to your clients vs. 100% private isolated database</li>
        </ul>
        <h2>Frequently Asked Questions</h2>
        <h3>Can each barber manage their own schedule independently?</h3>
        <p>Yes. Paulux includes an independent /stylist mobile portal where each barber accesses their own daily schedule, chair assignments, and revenue totals without seeing shop-wide financials.</p>
        <h3>How does the 15-second walk-in check-in work?</h3>
        <p>The front-desk walk-in mode lets staff tap a service, select the available barber chair, process payment, and lock the chair all within 15 seconds — built specifically for high foot-traffic barbershops.</p>
      </main>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Why are barbershops switching from Booksy to Paulux?", "acceptedAnswer": { "@type": "Answer", "text": "Booksy charges $29.99/month base plus $20/month per extra staff, takes marketplace commission on new client bookings, and promotes competitor barbershops to your own clients. Paulux provides a 0% commission, white-label booking system hosted on your custom domain." } },
        { "@type": "Question", "name": "Can each barber manage their own schedule?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Each barber gets an independent /stylist mobile portal with personal schedule, chair availability, and daily revenue without access to shop-wide accounting." } }
      ]
    }
  },
  {
    path: "mindbody-alternative",
    title: "Modern Mindbody Alternative for MedSpas & Aesthetic Clinics | Paulux",
    description: "Escape Mindbody's $159-$699/mo subscription fees and bloated complexity. Paulux provides a luxury, white-label booking and clinical deposit system deployed on your own custom domain.",
    keywords: "mindbody alternative, mindbody alternative medspa, aesthetic clinic booking software, medspa scheduling system, luxury spa software, clinical deposit booking system",
    canonical: "https://www.pauluxbooking.com/mindbody-alternative",
    content: `
      <header><h1>Modern Mindbody Alternative for MedSpas & Aesthetic Clinics</h1></header>
      <main>
        <p>Escape Mindbody's $159–$699/month recurring subscription tiers. Paulux provides a full-featured, white-label booking and clinical deposit enforcement system on your custom domain.</p>
        <h2>Why MedSpas Are Switching from Mindbody to Paulux</h2>
        <ul>
          <li><strong>Monthly Cost:</strong> Mindbody $159–$699+/month vs. Paulux flat dedicated deployment — no monthly lock-in</li>
          <li><strong>Client Data Privacy:</strong> Mindbody shared corporate database vs. Paulux 100% private isolated database owned by your clinic</li>
          <li><strong>Clinical Deposit Enforcer:</strong> Mindbody complex merchant add-ons vs. Paulux native full/partial deposit requirement on high-ticket slots</li>
          <li><strong>Custom Booking Domain:</strong> mindbodyonline.com/your-spa vs. booking.yourmedspa.com</li>
          <li><strong>Technical Allergy & Formula Notes:</strong> Generic text fields vs. Paulux instant scalp/allergy flags and formula records in client CRM</li>
        </ul>
        <h2>Frequently Asked Questions</h2>
        <h3>Why are MedSpas leaving Mindbody?</h3>
        <p>Mindbody charges the highest recurring fees in the industry while locking clinics into proprietary payment processing. Paulux runs on your own custom domain with database isolation and no monthly rent.</p>
        <h3>How does Paulux protect high-value treatment slots from no-shows?</h3>
        <p>Paulux's Deposit Enforcer requires clients to authorize a full or fixed deposit before confirming any appointment, with funds transferring directly to your bank account via Paystack or Stripe.</p>
      </main>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Why are MedSpas leaving Mindbody for Paulux?", "acceptedAnswer": { "@type": "Answer", "text": "Mindbody charges $159–$699/month in subscription fees, locks clinics into proprietary payment processors, and stores patient data in a shared corporate database. Paulux provides a 0% commission, white-label system on your custom domain with full database isolation." } },
        { "@type": "Question", "name": "How does Paulux protect high-value medspa treatment slots?", "acceptedAnswer": { "@type": "Answer", "text": "Paulux's native Deposit Enforcer requires clients to authorize a full or fixed deposit at booking time, preventing ghost appointments on high-ticket slots like Botox, laser, or HydraFacial treatments." } }
      ]
    }
  },
  {
    path: "salon-chemical-dispensary-software",
    title: "Salon Chemical Dispensary & Backbar Inventory Software (ml/g) | Paulux",
    description: "Stop losing profit at the color bar. Track professional hair dye, lighteners, and developer down to exact grams and milliliters with real-time service gross margin P&L accounting.",
    keywords: "salon chemical inventory management, hair salon color dispensary app, salon backbar inventory tracking, hair color grams milliliters inventory tracker, salon cost per service chemical tracking",
    canonical: "https://www.pauluxbooking.com/salon-chemical-dispensary-software",
    content: `
      <header><h1>Salon Chemical Dispensary & Backbar Consumables Accounting Software</h1></header>
      <main>
        <p>Track professional hair dye, lightener, developer, and backbar treatments down to exact milliliters (ml) and grams (g) on every appointment ticket with real-time service gross margin calculations.</p>
        <h2>What Makes Paulux the Enterprise Dispensary Standard</h2>
        <ul>
          <li><strong>Gram & Milliliter Precision:</strong> Record bleach powder (g), developer oxidants (ml), gloss shades (ml), and bond rebuilders (ml) per bowl</li>
          <li><strong>Live Service Gross Margin:</strong> Real-time ticket P&L — e.g. Service Price $165.00 - Chemical Cost $22.70 = Gross Margin $142.30 (86.2%)</li>
          <li><strong>Historical Snapshot P&L Accounting:</strong> Locks in purchase costs at checkout time so historical P&L reports stay 100% accurate forever</li>
          <li><strong>Department Cost Centers:</strong> Separate Color Bar, Aesthetics, and Nail Backbar into independent chemical cost centers</li>
          <li><strong>Formula Vault in Client CRM:</strong> Complete color formula history saved per client — developer ratios, toner codes, processing times</li>
          <li><strong>Low-Stock Reorder Alerts:</strong> Automated threshold alerts based on projected bookings and remaining ml/g volume</li>
        </ul>
        <h2>Frequently Asked Questions</h2>
        <h3>Why do salons lose money on chemical dispensary waste?</h3>
        <p>Without milliliter and gram-level tracking, stylists mix by eye and owners cannot accurately price services, identify product waste, or calculate true per-ticket gross margins.</p>
        <h3>Can stylists access client formula histories on mobile?</h3>
        <p>Yes. Through the /stylist mobile portal, stylists can look up exact formulas, developer strength, processing times, and tone records from every previous appointment.</p>
      </main>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Why do salons lose profit without ml/g chemical tracking?", "acceptedAnswer": { "@type": "Answer", "text": "Without gram and milliliter-level dispensary records, salons cannot price long hair add-ons correctly, identify chemical waste or theft, or calculate their true per-service gross margins on color tickets." } },
        { "@type": "Question", "name": "How does Paulux's chemical dispensary ledger work?", "acceptedAnswer": { "@type": "Answer", "text": "Stylists log the exact formulation mixed per ticket (e.g. 35g lightener + 70ml 20vol developer + 15ml Olaplex No.1). Paulux calculates the precise material cost, deducts from backbar inventory, and shows the realized gross margin in real time." } }
      ]
    }
  },
  {
    path: "roi-calculator",
    title: "Salon Commission Savings Calculator | Paulux",
    description: "Calculate how much your salon loses to Fresha, Mindbody, and marketplace booking platforms every year. See your savings with a 0% commission standalone system.",
    keywords: "salon commission calculator, fresha fee calculator, salon booking fee comparison, salon software savings",
    canonical: "https://www.pauluxbooking.com/roi-calculator",
    content: `
      <header><h1>Salon Commission Savings Calculator</h1></header>
      <main>
        <p>Find out exactly how much revenue your salon surrenders to third-party booking platforms each year in 20% cuts, monthly rental tiers, and payment surcharges.</p>
      </main>
    `,
    schema: null
  },
  {
    path: "demo",
    title: "Interactive Live Demo | Paulux Standalone Salon Booking Software",
    description: "Experience the Paulux salon booking platform live. Preview the luxury customer appointment wizard and the powerful salon manager admin dashboard.",
    keywords: "salon software demo, live booking software preview, spa appointment system demo, white label salon dashboard",
    canonical: "https://www.pauluxbooking.com/demo",
    content: `
      <header><h1>Interactive Live Demo of Paulux</h1></header>
      <main>
        <p>Preview the luxury customer booking wizard and the comprehensive salon manager dashboard.</p>
      </main>
    `,
    schema: null
  },
  {
    path: "standalone",
    title: "Request Standalone Salon Software Deployment | Paulux",
    description: "Deploy Paulux on your own domain with 0% commissions and complete client data privacy. Fill in your salon details for a fast turnkey deployment quote.",
    keywords: "standalone salon software quote, own domain booking setup, bespoke spa software deployment, white label salon platform inquiry",
    canonical: "https://www.pauluxbooking.com/standalone",
    content: `
      <header><h1>Run Paulux on Your Own Custom Domain</h1></header>
      <main>
        <p>Eliminate commission fees and marketplace noise. Request a dedicated deployment of Paulux on your custom domain in under 48 hours.</p>
      </main>
    `,
    schema: null
  },
  {
    path: "case-studies",
    title: "Appointment Booking Software Case Studies | Barbers, MedSpas, Salons & Studios | Paulux",
    description: "See how barbershops, aesthetic clinics, hair studios, tattoo artists, massage therapists, and pet groomers eliminated marketplace commissions and automated appointments with Paulux.",
    keywords: "salon booking case study, barbershop software case study, medspa appointment software, tattoo studio booking system, white label booking software industries",
    canonical: "https://www.pauluxbooking.com/case-studies",
    content: `
      <header><h1>Appointment Booking Software Case Studies</h1></header>
      <main>
        <p>Real-world results from barbershops, medspas, hair studios, tattoo artists, and fitness coaching businesses running on their own custom booking domain with 0% commissions.</p>
      </main>
    `,
    schema: null
  },
  {
    path: "case-studies/barbershops",
    title: "Barbershop Booking Software Case Study | The Noble Barber Co. | Paulux",
    description: "How The Noble Barber Co. saved $19,400/year and eliminated no-shows by migrating from Booksy to their own dedicated domain.",
    keywords: "barbershop booking software case study, booksy alternative for barbers, own domain barbershop booking, zero commission barber system",
    canonical: "https://www.pauluxbooking.com/case-studies/barbershops",
    content: `
      <header><h1>Barbershop Booking Software Case Study: The Noble Barber Co.</h1></header>
      <main>
        <p>Saved $19,400 per year, cut no-shows by 92%, and enabled individual barber chair booking on their own domain.</p>
      </main>
    `,
    schema: null
  },
  {
    path: "case-studies/medspas-aesthetics",
    title: "MedSpa & Clinical Aesthetics Booking Case Study | Aura Aesthetics | Paulux",
    description: "How Aura Medical Aesthetics secured $42,000 in pre-paid treatment deposits and protected patient privacy with Paulux.",
    keywords: "medspa booking software case study, aesthetic clinic scheduling, mindbody alternative medspa, clinical deposit booking system",
    canonical: "https://www.pauluxbooking.com/case-studies/medspas-aesthetics",
    content: `
      <header><h1>MedSpa & Clinical Aesthetics Case Study: Aura Medical Aesthetics</h1></header>
      <main>
        <p>Saved $31,200 annually, reduced consultation no-shows by 98%, and enforced mandatory card hold deposits on their own domain.</p>
      </main>
    `,
    schema: null
  },
  {
    path: "case-studies/tattoo-piercing",
    title: "Tattoo & Piercing Studio Case Study | Iron & Oak Tattoo | Paulux",
    description: "How Iron & Oak eliminated 8-hour artist gaps with mandatory online non-refundable booking deposits on their own domain.",
    keywords: "tattoo studio booking software, tattoo deposit booking system, artist schedule software, custom tattoo booking",
    canonical: "https://www.pauluxbooking.com/case-studies/tattoo-piercing",
    content: `
      <header><h1>Tattoo & Piercing Studio Case Study: Iron & Oak Tattoo</h1></header>
      <main>
        <p>Eliminated no-shows with mandatory non-refundable deposits, saving artists $22,500 in lost downtime.</p>
      </main>
    `,
    schema: null
  }
];

PAGES.forEach((page) => {
  const targetDir = path.join(DIST_DIR, page.path);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  let html = baseHtml;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/, `<title>${page.title}</title>`);

  // Replace Meta Description
  html = html.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/,
    `<meta name="description" content="${page.description}" />`
  );

  // Replace Meta Keywords
  html = html.replace(
    /<meta\s+name="keywords"\s+content=".*?"\s*\/?>/,
    `<meta name="keywords" content="${page.keywords}" />`
  );

  // Replace Canonical Link
  html = html.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/,
    `<link rel="canonical" href="${page.canonical}" />`
  );

  // Replace OG / Twitter Titles & Descriptions
  html = html.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/,
    `<meta property="og:title" content="${page.title}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/,
    `<meta property="og:description" content="${page.description}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/,
    `<meta property="og:url" content="${page.canonical}" />`
  );

  // Inject Route-specific Schema
  if (page.schema) {
    const schemaScript = `\n    <script type="application/ld+json">\n      ${JSON.stringify(page.schema, null, 2)}\n    </script>`;
    html = html.replace("</head>", `${schemaScript}\n  </head>`);
  }

  // Inject Semantic Crawler Content into #root
  if (page.content) {
    const crawlerBlock = `<div id="root">${page.content}</div>`;
    html = html.replace(/<div id="root"><\/div>/, crawlerBlock);
  }

  const outPath = path.join(targetDir, "index.html");
  fs.writeFileSync(outPath, html, "utf-8");
  console.log(`Generated SEO snapshot: ${page.path}/index.html`);
});

console.log("All SEO static route snapshots successfully generated!");

