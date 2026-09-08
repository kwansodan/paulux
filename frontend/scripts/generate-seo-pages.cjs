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
    canonical: "https://paulux.app/fresha-alternative",
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
      "brand": { "@type": "Brand", "name": "Paulux" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "description": "Custom turnkey deployment quote" }
    }
  },
  {
    path: "salon-booking-software",
    title: "White-Label Salon Booking Software on Your Custom Domain | Paulux",
    description: "The premier standalone booking and management platform for luxury salons and spas. Custom domain deployment, zero commissions, and complete data privacy.",
    keywords: "white label salon booking software, bespoke salon management software, spa appointment scheduling software, luxury salon pos system, self hosted salon booking",
    canonical: "https://paulux.app/salon-booking-software",
    content: `
      <header><h1>Bespoke Salon & Spa Software Deployed on Your Own Domain</h1></header>
      <main>
        <p>Stop relying on generic marketplace templates. Paulux gives your brand a dedicated, luxury booking experience with total independence and zero commissions.</p>
        <h2>Core Capabilities for Luxury Salons</h2>
        <ul>
          <li><strong>Your Own Custom Domain:</strong> booking.yourbrand.com</li>
          <li><strong>Zero Booking Commissions:</strong> Keep 100% of every client transaction</li>
          <li><strong>100% Private Client Data:</strong> Isolated database owned solely by your salon</li>
          <li><strong>Instant 2-Way Calendar Sync:</strong> Synchronize automatically with Google Calendar</li>
          <li><strong>Upfront Deposits:</strong> Prevent no-shows with integrated card deposits</li>
          <li><strong>Gift Cards & Loyalty:</strong> Sell and redeem digital gift cards effortlessly</li>
        </ul>
        <h2>Turnkey 48-Hour Onboarding</h2>
        <p>We handle domain connection, SSL security, data migration, and payment gateway setup.</p>
      </main>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Paulux White-Label Salon Booking System",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    }
  },
  {
    path: "roi-calculator",
    title: "Salon Commission Savings Calculator | Paulux",
    description: "Calculate how much your salon loses to Fresha, Mindbody, and marketplace booking platforms every year. See your savings with a 0% commission standalone system.",
    keywords: "salon commission calculator, fresha fee calculator, salon booking fee comparison, salon software savings",
    canonical: "https://paulux.app/roi-calculator",
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
    canonical: "https://paulux.app/demo",
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
    canonical: "https://paulux.app/standalone",
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
    canonical: "https://paulux.app/case-studies",
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
    canonical: "https://paulux.app/case-studies/barbershops",
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
    canonical: "https://paulux.app/case-studies/medspas-aesthetics",
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
    canonical: "https://paulux.app/case-studies/tattoo-piercing",
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
