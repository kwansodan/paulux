import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth, RequirePermission } from "@/auth/guards";
import AdminLayout from "@/layouts/AdminLayout";
import CustomerLayout from "@/layouts/CustomerLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import ServicesPage from "@/features/services/ServicesPage";
import PackagesPage from "@/features/packages/PackagesPage";
import ProductsPage from "@/features/products/ProductsPage";
import BookingsPage from "@/features/bookings/BookingsPage";
import PaymentsPage from "@/features/payments/PaymentsPage";
import PromoCodesPage from "@/features/promo-codes/PromoCodesPage";
import GiftCardsPage from "@/features/gift-cards/GiftCardsPage";
import ReportsPage from "@/features/reports/ReportsPage";
import SettingsPage from "@/features/settings/SettingsPage";
import HomePage from "@/pages/customer/HomePage";
import BookPage from "@/pages/customer/BookPage";
import BookingLookupPage from "@/pages/customer/BookingLookupPage";
import GiftCardPurchasePage from "@/pages/customer/GiftCardPurchasePage";
import PayCallbackPage from "@/pages/customer/PayCallbackPage";
import StandalonePage from "@/pages/customer/StandalonePage";
import FreshaAlternativePage from "@/pages/marketing/FreshaAlternativePage";
import SalonSoftwarePage from "@/pages/marketing/SalonSoftwarePage";
import RoiCalculatorPage from "@/pages/marketing/RoiCalculatorPage";
import DemoPage from "@/pages/marketing/DemoPage";
import CaseStudiesHubPage from "@/pages/marketing/CaseStudiesHubPage";
import IndustryCaseStudyPage from "@/pages/marketing/IndustryCaseStudyPage";
import { ForgotPasswordPage, ResetPasswordPage } from "@/pages/PasswordResetPages";
import { TermsPage, PrivacyPage } from "@/pages/legal/LegalPages";
import { NotFoundPage, UnauthorizedPage } from "@/pages/StatusPages";
import { paths } from "@/router/paths";

/** Permission-gated admin sections. Reports remains a Phase 3+ placeholder. */
const ADMIN_PAGES: { path: string; permission: string; element: ReactElement }[] = [
  { path: paths.dashboard, permission: "dashboard.view", element: <DashboardPage /> },
  { path: paths.bookings, permission: "bookings.view", element: <BookingsPage /> },
  { path: paths.payments, permission: "payments.view", element: <PaymentsPage /> },
  { path: paths.services, permission: "services.view", element: <ServicesPage /> },
  { path: paths.packages, permission: "services.view", element: <PackagesPage /> },
  { path: paths.products, permission: "products.view", element: <ProductsPage /> },
  { path: paths.promoCodes, permission: "promo_codes.view", element: <PromoCodesPage /> },
  { path: paths.giftCardOrders, permission: "gift_cards.view", element: <GiftCardsPage /> },
  { path: paths.reports, permission: "reports.view", element: <ReportsPage /> },
  { path: paths.settings, permission: "settings.view", element: <SettingsPage /> },
];

export default function App() {
  return (
    <Routes>
      {/* Auth (no chrome) */}
      <Route path={paths.login} element={<LoginPage />} />
      {/* Shared self-serve signup is retired — funnel to the standalone enquiry. */}
      <Route path={paths.signup} element={<Navigate to={paths.standalone} replace />} />
      <Route path={paths.forgotPassword} element={<ForgotPasswordPage />} />
      <Route path={paths.resetPassword} element={<ResetPasswordPage />} />
      <Route path={paths.unauthorized} element={<UnauthorizedPage />} />

      {/* Customer & Marketing Routes */}
      <Route element={<CustomerLayout />}>
        <Route path={paths.home} element={<HomePage />} />
        <Route path={paths.book} element={<BookPage />} />
        <Route path={paths.bookingLookup} element={<BookingLookupPage />} />
        <Route path={paths.giftCards} element={<GiftCardPurchasePage />} />
        <Route path={paths.standalone} element={<StandalonePage />} />
        <Route path={paths.freshaAlternative} element={<FreshaAlternativePage />} />
        <Route path={paths.salonSoftware} element={<SalonSoftwarePage />} />
        <Route path={paths.roiCalculator} element={<RoiCalculatorPage />} />
        <Route path={paths.demo} element={<DemoPage />} />
        <Route path={paths.caseStudies} element={<CaseStudiesHubPage />} />
        <Route path={paths.caseStudyDetail} element={<IndustryCaseStudyPage />} />
        <Route path={paths.payCallback} element={<PayCallbackPage />} />
        <Route path={paths.terms} element={<TermsPage />} />
        <Route path={paths.privacy} element={<PrivacyPage />} />
      </Route>

      {/* Admin (auth required) */}
      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          {ADMIN_PAGES.map((p) => (
            <Route
              key={p.path}
              element={<RequirePermission permission={p.permission} />}
            >
              <Route path={p.path} element={p.element} />
            </Route>
          ))}
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
