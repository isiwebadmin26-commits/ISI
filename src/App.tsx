import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, Suspense, useState } from 'react';
import { lazyWithRetry } from "./utils/lazyWithRetry";
import Index from "./pages/Index";
const ContactPage = lazyWithRetry(() => import("./pages/ContactPage"), "ContactPage");

const VerticalsPage = lazyWithRetry(() => import("./pages/VerticalsPage"), "VerticalsPage");

const CareersPage = lazyWithRetry(() => import("./pages/CareersPage"), "CareersPage");

const AboutPage = lazyWithRetry(() => import("./pages/AboutPage"), "AboutPage");

const SolutionsPage = lazyWithRetry(() => import("./pages/SolutionsPage"), "SolutionsPage");

const CustomersPage = lazyWithRetry(() => import("./pages/CustomersPage"), "CustomersPage");

const PartnersPage = lazyWithRetry(() => import("./pages/PartnersPage"), "PartnersPage");

import ErrorBoundary from "./components/ErrorBoundary";
import { useAnalytics } from "./hooks/useAnalytics";
import { ChatBot } from "./components/ai/ChatBot";
import { ISIAcademyChatbot } from "./components/ai/ISIAcademyChatbot";

const IntelligenceDashboard = lazyWithRetry(() => import("./pages/admin/IntelligenceDashboard"), "IntelligenceDashboard");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Scroll to top on route change, or to anchor if hash is present
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (hash) {
      const scrollToHash = () => {
        try {
          const id = hash.replace(/^#/, '');
          let element = document.getElementById(id);
          if (!element && window.CSS && CSS.escape) {
            element = document.querySelector(`#${CSS.escape(id)}`);
          }
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        } catch (e) {
          console.warn('ScrollToTop anchor lookup error:', e);
        }
      };
      timer = setTimeout(scrollToHash, 150);
    } else {
      window.scrollTo(0, 0);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [pathname, hash]);

  return null;
};

const CapabilitiesPage = lazyWithRetry(() => import("./pages/CapabilitiesPage"), "CapabilitiesPage");

const OfferingsPage = lazyWithRetry(() => import("./pages/OfferingsPage"), "OfferingsPage");


const PrivacyPolicy = lazyWithRetry(() => import("./pages/PrivacyPolicy"), "PrivacyPolicy");

const TermsOfService = lazyWithRetry(() => import("./pages/TermsOfService"), "TermsOfService");

const CookiePolicy = lazyWithRetry(() => import("./pages/CookiePolicy"), "CookiePolicy");

const CopyrightPolicy = lazyWithRetry(() => import("./pages/CopyrightPolicy"), "CopyrightPolicy");

const Sitemap = lazyWithRetry(() => import("./pages/Sitemap"), "Sitemap");

const VerticalDetailPage = lazyWithRetry(() => import("./pages/VerticalDetailPage"), "VerticalDetailPage");

const SchoolSafetyLanding = lazyWithRetry(() => import("./pages/SchoolSafetyLanding"), "SchoolSafetyLanding");

const CampusSafetyLanding = lazyWithRetry(() => import("./pages/CampusSafetyLanding"), "CampusSafetyLanding");

const CashLogisticsPage = lazyWithRetry(() => import("./pages/CashLogisticsPage"), "CashLogisticsPage");

const SecureValueLogisticsPage = lazyWithRetry(() => import("./pages/SecureValueLogisticsPage"), "SecureValueLogisticsPage");

const CommandCenterPage = lazyWithRetry(() => import("./pages/CommandCenterPage"), "CommandCenterPage");

const SmartCityPage = lazyWithRetry(() => import("./pages/SmartCityPage"), "SmartCityPage");

const MassTransportationPage = lazyWithRetry(() => import("./pages/MassTransportationPage"), "MassTransportationPage");

const TravelTourismPage = lazyWithRetry(() => import("./pages/TravelTourismPage"), "TravelTourismPage");

const GccItParksPage = lazyWithRetry(() => import("./pages/GccItParksPage"), "GccItParksPage");

const EventManagementPage = lazyWithRetry(() => import("./pages/EventManagementPage"), "EventManagementPage");

const ModernLivingLanding = lazyWithRetry(() => import("./pages/ModernLivingLanding"), "ModernLivingLanding");


import { BackToTop } from "./components/BackToTop";
const ServiceCategoryPage = lazyWithRetry(() => import("./pages/ServiceCategoryPage"), "ServiceCategoryPage");
const SalesInquiryPage = lazyWithRetry(() => import("./pages/SalesInquiryPage"), "SalesInquiryPage");
const ThankYouPage = lazyWithRetry(() => import("./pages/ThankYouPage"), "ThankYouPage");
const BlogListingPage = lazyWithRetry(() => import("./pages/BlogListingPage"), "BlogListingPage");
const BlogDetailPage = lazyWithRetry(() => import("./pages/BlogDetailPage"), "BlogDetailPage");
const NotFound = lazyWithRetry(() => import("./pages/NotFound"), "NotFound");
const CoursesPage = lazyWithRetry(() => import("./pages/CoursesPage"), "CoursesPage");
const AcademyPage = lazyWithRetry(() => import("./pages/AcademyPage"), "AcademyPage");

const appRoutes = [
  { path: "/admin", element: <IntelligenceDashboard /> },
  { path: "/admin/intelligence", element: <IntelligenceDashboard /> },
  { path: "/analytics", element: <IntelligenceDashboard /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/courses", element: <CoursesPage /> },
  { path: "/academy", element: <AcademyPage /> },
  { path: "/verticals", element: <VerticalsPage /> },
  { path: "/verticals/:verticalId", element: <VerticalDetailPage /> },
  { path: "/career", element: <CareersPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/capabilities", element: <CapabilitiesPage /> },
  { path: "/offerings", element: <OfferingsPage /> },
  { path: "/solutions", element: <SolutionsPage /> },
  { path: "/customers", element: <CustomersPage /> },
  { path: "/partners", element: <PartnersPage /> },
  { path: "/privacypolicy", element: <PrivacyPolicy /> },
  { path: "/termsofservice", element: <TermsOfService /> },
  { path: "/cookiepolicy", element: <CookiePolicy /> },
  { path: "/copyrightpolicy", element: <CopyrightPolicy /> },
  { path: "/sitemap", element: <Sitemap /> },
  { path: "/blog", element: <BlogListingPage /> },
  { path: "/blog/:slug", element: <BlogDetailPage /> },
  { path: "/schoolsafety", element: <SchoolSafetyLanding /> },
  { path: "/campussafety", element: <CampusSafetyLanding /> },
  { path: "/modernliving", element: <ModernLivingLanding /> },
  { path: "/cashlogistics", element: <CashLogisticsPage /> },
  { path: "/securevaluelogistics", element: <SecureValueLogisticsPage /> },
  { path: "/commandcenter", element: <CommandCenterPage /> },
  { path: "/smartcity", element: <SmartCityPage /> },
  { path: "/masstransportation", element: <MassTransportationPage /> },
  { path: "/traveltourism", element: <TravelTourismPage /> },
  { path: "/gccitparks", element: <GccItParksPage /> },
  { path: "/eventmanagement", element: <EventManagementPage /> },
  { path: "/lp/facility-management", element: <SalesInquiryPage /> },
  { path: "/lp/facility-management/thank-you", element: <ThankYouPage /> },
  { path: "/integratedservices", element: <Navigate to="/lp/facility-management" replace /> },
  { path: "/integratedservices/thank-you", element: <Navigate to="/lp/facility-management/thank-you" replace /> },
  { path: "/integrated-services", element: <Navigate to="/lp/facility-management" replace /> },
  { path: "/integrated-services/thank-you", element: <Navigate to="/lp/facility-management/thank-you" replace /> },
  { path: "/services/integrated-services", element: <Navigate to="/lp/facility-management" replace /> },
  { path: "/services/integratedservices", element: <Navigate to="/lp/facility-management" replace /> },
  { path: "/salesinquiry", element: <Navigate to="/lp/facility-management" replace /> },
  { path: "/sales-inquiry", element: <Navigate to="/lp/facility-management" replace /> },
  { path: "/services", element: <Navigate to="/services/security" replace /> },
  { path: "/services/security", element: <ServiceCategoryPage categoryIdOverride="manned-guarding" canonicalPathOverride="/services/security" /> },
  { path: "/services/integrated-facility-management", element: <ServiceCategoryPage categoryIdOverride="hard-fm" canonicalPathOverride="/services/integrated-facility-management" /> },
  { path: "/services/skill-development-manpower", element: <Navigate to="/academy" replace /> },
  { path: "/mobile-security-services-chennai-crime-prevention", element: <Navigate to="/services/security" replace /> },
  { path: "/need-protection-money-properties-vip-escort-services", element: <ServiceCategoryPage categoryIdOverride="specialized-protection" canonicalPathOverride="/need-protection-money-properties-vip-escort-services" /> },
  { path: "/404", element: <NotFound /> },
  { path: "/services/:type/:categoryId", element: <ServiceCategoryPage /> }
];

const AppRouter = () => {
  const location = useLocation();
  const isIntegratedServices = location.pathname.startsWith('/lp/facility-management') || 
                               location.pathname.startsWith('/integratedservices') || 
                               location.pathname.startsWith('/integrated-services') ||
                               location.pathname.startsWith('/salesinquiry');
  const [showWidgets, setShowWidgets] = useState(false);

  useEffect(() => {
    let fired = false;
    const loadWidgets = () => {
      if (!fired) {
        fired = true;
        setShowWidgets(true);
        cleanup();
      }
    };
    
    const cleanup = () => {
      window.removeEventListener('mousemove', loadWidgets);
      window.removeEventListener('touchstart', loadWidgets);
      window.removeEventListener('keydown', loadWidgets);
    };

    window.addEventListener('mousemove', loadWidgets, { passive: true });
    window.addEventListener('touchstart', loadWidgets, { passive: true });
    window.addEventListener('keydown', loadWidgets, { passive: true });

    return cleanup;
  }, []);

  const isAcademy = location.pathname === '/academy';
  useAnalytics();
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <BackToTop />
      {showWidgets && !isIntegratedServices && (
        isAcademy ? (
          <ISIAcademyChatbot />
        ) : (
          <ChatBot />
        )
      )}
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
      <Routes>
        <Route path="/" element={<Index />} />
        {appRoutes.map((route, idx) => (
          <Route key={`route-${idx}`} path={route.path} element={route.element} />
        ))}
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/">
        <AppRouter />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
