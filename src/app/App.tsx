import { Route, Routes } from 'react-router';
import { ScrollToTop, SiteFooter, SiteHeader } from './components/SiteChrome';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { About } from './components/About';
import { GuideArticle, Resources } from './components/Resources';
import { PrivacyNotice } from './components/PrivacyNotice';
import {
  CompanyPage,
  ContactPage,
  DonatePage,
  FaqsPage,
  NhsPage,
  NotFoundPage,
  SelfAssessmentPage,
  TermsPage,
} from './pages/InfoPages';

export default function App() {
  return (
    <div className="min-h-screen text-ink">
      <a
        href="#main"
        className="visually-hidden focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:w-auto focus:h-auto focus:m-0 focus:[clip:auto] focus:overflow-visible focus:whitespace-normal focus:px-4 focus:py-3 focus:rounded-md focus:bg-ink focus:text-white focus:font-semibold"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <SiteHeader />

      <main id="main" tabIndex={-1} className="max-w-7xl mx-auto px-6 pt-6 pb-12 md:py-16 focus:outline-none">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/guides/:category" element={<Resources />} />
          <Route path="/guides/:category/:articleId" element={<GuideArticle />} />
          <Route path="/self-assessment" element={<SelfAssessmentPage />} />
          <Route path="/privacy" element={<PrivacyNotice />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faqs" element={<FaqsPage />} />
          <Route path="/nhs" element={<NhsPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <SiteFooter />
    </div>
  );
}
