import React from 'react';
import { ServicesSection } from '@/components/home/ServicesSection';
import { LeadGenerationCta } from '@/components/home/LeadGenerationCta';
import { SEO } from '@/components/common/SEO';
import { useLanguage } from '@/context/LanguageContext';
import { generateBreadcrumbSchema } from '@/utils/schemaGenerator';

interface ServicesPageProps {
  onRequestViewing?: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onRequestViewing }) => {
  const { t } = useLanguage();

  const schemas = [
    generateBreadcrumbSchema([
      { name: t('nav.home', 'Home'), item: '/' },
      { name: t('nav.services', 'Services'), item: '/services' },
    ]),
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFD]">
      {/* Technical SEO */}
      <SEO
        title={`${t('servicesPage.title', 'Real Estate Services & Advisory')} | Capital Pioneers`}
        description={t('servicesPage.subtitle', 'Comprehensive real estate marketing, project sales representation, and developer consulting across New Cairo and Red Sea.')}
        canonicalPath="/services"
        schema={schemas}
      />

      {/* Header */}
      <header className="bg-[#061D28] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-[#153648]">
        <div className="max-w-7xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
            {t('servicesPage.title', 'Real Estate Services & Advisory')}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl font-light leading-relaxed">
            {t('servicesPage.subtitle', 'Comprehensive real estate marketing, project sales representation, and developer consulting across New Cairo and Red Sea.')}
          </p>
        </div>
      </header>

      <ServicesSection />
      <LeadGenerationCta onRequestViewing={onRequestViewing} />
    </div>
  );
};

export default ServicesPage;
