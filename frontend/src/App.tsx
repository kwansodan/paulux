import { Navigate, Route, Routes } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout";
import MarketingLanding from "@/pages/customer/MarketingLanding";
import StandalonePage from "@/pages/customer/StandalonePage";
import FreshaAlternativePage from "@/pages/marketing/FreshaAlternativePage";
import SalonSoftwarePage from "@/pages/marketing/SalonSoftwarePage";
import RoiCalculatorPage from "@/pages/marketing/RoiCalculatorPage";
import DemoPage from "@/pages/marketing/DemoPage";
import CaseStudiesHubPage from "@/pages/marketing/CaseStudiesHubPage";
import IndustryCaseStudyPage from "@/pages/marketing/IndustryCaseStudyPage";
import { TermsPage, PrivacyPage } from "@/pages/legal/LegalPages";
import { NotFoundPage } from "@/pages/StatusPages";
import { paths } from "@/router/paths";

export default function App() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        {/* Core Marketing Routes */}
        <Route path={paths.home} element={<MarketingLanding />} />
        <Route path={paths.standalone} element={<StandalonePage />} />
        <Route path={paths.freshaAlternative} element={<FreshaAlternativePage />} />
        <Route path={paths.salonSoftware} element={<SalonSoftwarePage />} />
        <Route path={paths.roiCalculator} element={<RoiCalculatorPage />} />
        <Route path={paths.demo} element={<DemoPage />} />
        <Route path={paths.caseStudies} element={<CaseStudiesHubPage />} />
        <Route path={paths.caseStudyDetail} element={<IndustryCaseStudyPage />} />
        <Route path={paths.terms} element={<TermsPage />} />
        <Route path={paths.privacy} element={<PrivacyPage />} />

        {/* Legacy & Funnel Aliases -> Redirect to interactive demo & quote intake */}
        <Route path={paths.book} element={<Navigate to={paths.demo} replace />} />
        <Route path={paths.bookingLookup} element={<Navigate to={paths.demo} replace />} />
        <Route path={paths.giftCards} element={<Navigate to={paths.demo} replace />} />
        <Route path={paths.login} element={<Navigate to={paths.demo} replace />} />
        <Route path={paths.signup} element={<Navigate to={paths.standalone} replace />} />
        <Route path={paths.dashboard} element={<Navigate to={paths.demo} replace />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

