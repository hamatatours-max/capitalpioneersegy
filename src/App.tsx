import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { FloatingActions } from './components/common/FloatingActions';
import { MobileStickyCta } from './components/common/MobileStickyCta';
import { ViewingModal } from './components/forms/ViewingModal';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { RedSeaPage } from './pages/RedSeaPage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { DesignSystemShowcase } from './pages/DesignSystemShowcase';
import { AnalyticsProvider } from './components/analytics/AnalyticsProvider';
import { LanguageProvider } from './context/LanguageContext';
import { initTracking } from './utils/utm';

export function App() {
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);
  const [selectedProjectForViewing, setSelectedProjectForViewing] = useState<string | undefined>(undefined);

  // Initialize UTM and session tracking on mount
  useEffect(() => {
    initTracking();
  }, []);

  const handleOpenViewingModal = (projectName?: string) => {
    setSelectedProjectForViewing(projectName);
    setIsViewingModalOpen(true);
  };

  const handleCloseViewingModal = () => {
    setIsViewingModalOpen(false);
    setSelectedProjectForViewing(undefined);
  };

  return (
    <Router>
      <LanguageProvider>
        <AnalyticsProvider>
          <div className="min-h-screen flex flex-col bg-[#FAFBFD] text-[#0F2432] selection:bg-[#0B4D68] selection:text-white pb-16 lg:pb-0">
            {/* Sticky Responsive Header */}
            <Header onRequestViewing={() => handleOpenViewingModal()} />

            {/* Main Routed Content */}
            <main className="flex-grow">
              <Routes>
                <Route
                  path="/"
                  element={<HomePage onRequestViewing={handleOpenViewingModal} />}
                />
                <Route
                  path="/projects"
                  element={<ProjectsPage onRequestViewing={handleOpenViewingModal} />}
                />
                {/* Dynamic Project Details Route */}
                <Route
                  path="/projects/:slug"
                  element={<ProjectDetailPage onRequestViewing={handleOpenViewingModal} />}
                />
                {/* Canonical Red Sea Route */}
                <Route
                  path="/capital-pioneers-red-sea"
                  element={<RedSeaPage onRequestViewing={handleOpenViewingModal} />}
                />
                {/* 301 Aliases & Redirects */}
                <Route
                  path="/offers/downtown-offices"
                  element={<Navigate to="/projects/downtown-offices" replace />}
                />
                <Route
                  path="/offers/downtown-1-2"
                  element={<Navigate to="/projects/downtown-offices" replace />}
                />
                <Route
                  path="/downtown-offices"
                  element={<Navigate to="/projects/downtown-offices" replace />}
                />
                <Route
                  path="/downtown"
                  element={<Navigate to="/projects/downtown-offices" replace />}
                />
                <Route
                  path="/the-island"
                  element={<Navigate to="/projects/the-island" replace />}
                />
                <Route
                  path="/notion"
                  element={<Navigate to="/projects/notion" replace />}
                />
                <Route
                  path="/sokhna-time"
                  element={<Navigate to="/projects/sokhna-time" replace />}
                />
                <Route
                  path="/sokhnatime"
                  element={<Navigate to="/projects/sokhna-time" replace />}
                />
                <Route
                  path="/platinum"
                  element={<Navigate to="/projects/platinum-resort-hurghada" replace />}
                />
                <Route
                  path="/platinum-resort"
                  element={<Navigate to="/projects/platinum-resort-hurghada" replace />}
                />
                <Route
                  path="/platinum-hurghada"
                  element={<Navigate to="/projects/platinum-resort-hurghada" replace />}
                />
                <Route
                  path="/nuxes"
                  element={<Navigate to="/projects/nuxes-mall" replace />}
                />
                <Route
                  path="/nuxes-mall"
                  element={<Navigate to="/projects/nuxes-mall" replace />}
                />
                <Route
                  path="/nuxes-pharmacy"
                  element={<Navigate to="/projects/nuxes-mall" replace />}
                />
                <Route
                  path="/nexus"
                  element={<Navigate to="/projects/nexus-mall" replace />}
                />
                <Route
                  path="/core-point"
                  element={<Navigate to="/projects/core-point" replace />}
                />
                <Route
                  path="/corepoint"
                  element={<Navigate to="/projects/core-point" replace />}
                />
                <Route
                  path="/core"
                  element={<Navigate to="/projects/core-point" replace />}
                />
                <Route
                  path="/nexus-mall"
                  element={<Navigate to="/projects/nexus-mall" replace />}
                />
                <Route
                  path="/nexus-admin"
                  element={<Navigate to="/projects/nexus-mall" replace />}
                />
                <Route
                  path="/nexus-43"
                  element={<Navigate to="/projects/nexus-mall" replace />}
                />
                <Route
                  path="/projects/nexus-mall"
                  element={<Navigate to="/projects/nuxes-mall" replace />}
                />
                <Route
                  path="/kernal"
                  element={<Navigate to="/projects/kernal-mall-41-sqm-clinic-office-new-cairo" replace />}
                />
                <Route
                  path="/kernal-mall"
                  element={<Navigate to="/projects/kernal-mall-41-sqm-clinic-office-new-cairo" replace />}
                />
                <Route
                  path="/kernal-41"
                  element={<Navigate to="/projects/kernal-mall-41-sqm-clinic-office-new-cairo" replace />}
                />
                <Route
                  path="/projects/kernal-mall"
                  element={<Navigate to="/projects/kernal-mall-41-sqm-clinic-office-new-cairo" replace />}
                />
                <Route
                  path="/kernel"
                  element={<Navigate to="/projects/kernal-mall-41-sqm-clinic-office-new-cairo" replace />}
                />
                <Route
                  path="/kernel-mall"
                  element={<Navigate to="/projects/kernal-mall-41-sqm-clinic-office-new-cairo" replace />}
                />
                <Route
                  path="/kernel-business-hub"
                  element={<Navigate to="/projects/kernal-mall-41-sqm-clinic-office-new-cairo" replace />}
                />
                <Route
                  path="/kernel-fnb"
                  element={<Navigate to="/projects/kernal-mall-41-sqm-clinic-office-new-cairo" replace />}
                />
                <Route
                  path="/kernel-mall-fnb"
                  element={<Navigate to="/projects/kernal-mall-41-sqm-clinic-office-new-cairo" replace />}
                />
                <Route
                  path="/kernel-mall-fnb-74sqm"
                  element={<Navigate to="/projects/kernal-mall-41-sqm-clinic-office-new-cairo" replace />}
                />
                <Route
                  path="/kernel-mall-fnb-74sqm-39sqm-outdoor"
                  element={<Navigate to="/projects/kernal-mall-41-sqm-clinic-office-new-cairo" replace />}
                />
                <Route
                  path="/projects/kernel-mall"
                  element={<Navigate to="/projects/kernal-mall-41-sqm-clinic-office-new-cairo" replace />}
                />
                <Route
                  path="/projects/kernel-fnb"
                  element={<Navigate to="/projects/kernal-mall-41-sqm-clinic-office-new-cairo" replace />}
                />
                <Route
                  path="/projects/kernel-mall-fnb"
                  element={<Navigate to="/projects/kernal-mall-41-sqm-clinic-office-new-cairo" replace />}
                />
                <Route
                  path="/kernel-55"
                  element={<Navigate to="/projects/kernal-mall-41-sqm-clinic-office-new-cairo" replace />}
                />
                <Route
                  path="/kernel-mall-55"
                  element={<Navigate to="/projects/kernal-mall-41-sqm-clinic-office-new-cairo" replace />}
                />
                <Route
                  path="/projects/kernel-55"
                  element={<Navigate to="/projects/kernal-mall-41-sqm-clinic-office-new-cairo" replace />}
                />
                <Route
                  path="/projects/kernel-mall-55"
                  element={<Navigate to="/projects/kernal-mall-41-sqm-clinic-office-new-cairo" replace />}
                />
                <Route
                  path="/beit-al-watan-f165"
                  element={<Navigate to="/projects/beit-al-watan-f165-apartment-196sqm" replace />}
                />
                <Route
                  path="/beit-al-watan-165"
                  element={<Navigate to="/projects/beit-al-watan-f165-apartment-196sqm" replace />}
                />
                <Route
                  path="/f165"
                  element={<Navigate to="/projects/beit-al-watan-f165-apartment-196sqm" replace />}
                />
                <Route
                  path="/first-district-beit-al-watan"
                  element={<Navigate to="/projects/beit-al-watan-f165-apartment-196sqm" replace />}
                />
                <Route
                  path="/first-district-beit-al-watan-f165"
                  element={<Navigate to="/projects/beit-al-watan-f165-apartment-196sqm" replace />}
                />
                <Route
                  path="/projects/beit-al-watan-f165"
                  element={<Navigate to="/projects/beit-al-watan-f165-apartment-196sqm" replace />}
                />
                <Route
                  path="/northern-lotus"
                  element={<Navigate to="/projects/northern-lotus-ready-to-move-apartments" replace />}
                />
                <Route
                  path="/northern-lotus-ready-to-move"
                  element={<Navigate to="/projects/northern-lotus-ready-to-move-apartments" replace />}
                />
                <Route
                  path="/projects/northern-lotus"
                  element={<Navigate to="/projects/northern-lotus-ready-to-move-apartments" replace />}
                />
                <Route
                  path="/projects/northern-lotus-ready-to-move"
                  element={<Navigate to="/projects/northern-lotus-ready-to-move-apartments" replace />}
                />
                <Route
                  path="/project-641"
                  element={<Navigate to="/projects/project-641-al-andalus-2-ready-to-move-apartment-184sqm" replace />}
                />
                <Route
                  path="/project-641-al-andalus-2"
                  element={<Navigate to="/projects/project-641-al-andalus-2-ready-to-move-apartment-184sqm" replace />}
                />
                <Route
                  path="/al-andalus-641"
                  element={<Navigate to="/projects/project-641-al-andalus-2-ready-to-move-apartment-184sqm" replace />}
                />
                <Route
                  path="/andalus-641"
                  element={<Navigate to="/projects/project-641-al-andalus-2-ready-to-move-apartment-184sqm" replace />}
                />
                <Route
                  path="/al-andalus-2"
                  element={<Navigate to="/projects/project-641-al-andalus-2-ready-to-move-apartment-184sqm" replace />}
                />
                <Route
                  path="/projects/project-641"
                  element={<Navigate to="/projects/project-641-al-andalus-2-ready-to-move-apartment-184sqm" replace />}
                />
                <Route
                  path="/projects/project-641-al-andalus-2"
                  element={<Navigate to="/projects/project-641-al-andalus-2-ready-to-move-apartment-184sqm" replace />}
                />
                <Route
                  path="/projects/al-andalus-641"
                  element={<Navigate to="/projects/project-641-al-andalus-2-ready-to-move-apartment-184sqm" replace />}
                />
                <Route
                  path="/red-sea"
                  element={<Navigate to="/capital-pioneers-red-sea" replace />}
                />
                <Route
                  path="/properties"
                  element={<Navigate to="/projects" replace />}
                />
                <Route
                  path="/about"
                  element={<AboutPage onRequestViewing={() => handleOpenViewingModal()} />}
                />
                <Route
                  path="/services"
                  element={<ServicesPage onRequestViewing={() => handleOpenViewingModal()} />}
                />
                <Route
                  path="/contact"
                  element={<ContactPage onRequestViewing={handleOpenViewingModal} />}
                />
                <Route
                  path="/design-system"
                  element={<DesignSystemShowcase onRequestViewing={() => handleOpenViewingModal()} />}
                />
                {/* 404 Recovery Handler */}
                <Route
                  path="*"
                  element={<NotFoundPage />}
                />
              </Routes>
            </main>

            {/* Corporate Footer */}
            <Footer />

            {/* Desktop / Tablet Floating Action Group */}
            <FloatingActions />

            {/* Mobile Sticky CTA Bar */}
            <MobileStickyCta onRequestViewing={() => handleOpenViewingModal()} />

            {/* Global Viewing Consultation Modal */}
            <ViewingModal
              isOpen={isViewingModalOpen}
              onClose={handleCloseViewingModal}
              projectName={selectedProjectForViewing}
            />
          </div>
        </AnalyticsProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
