/** Central route path builders (ported intent from the old app's paths.ts). */
export const paths = {
  // Customer & Marketing
  home: "/",
  book: "/book",
  bookingLookup: "/my-booking",
  giftCards: "/gift-cards",
  payCallback: "/pay/callback",
  terms: "/terms",
  privacy: "/privacy",
  standalone: "/standalone",
  freshaAlternative: "/fresha-alternative",
  salonSoftware: "/salon-booking-software",
  roiCalculator: "/roi-calculator",
  demo: "/demo",
  caseStudies: "/case-studies",
  caseStudyDetail: "/case-studies/:slug",

  // Auth
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  unauthorized: "/unauthorized",

  // Admin
  dashboard: "/admin",
  bookings: "/admin/bookings",
  payments: "/admin/payments",
  services: "/admin/services",
  packages: "/admin/packages",
  products: "/admin/products",
  promoCodes: "/admin/promo-codes",
  giftCardOrders: "/admin/gift-card-orders",
  reports: "/admin/reports",
  settings: "/admin/settings",
} as const;
