import React from 'react';
import { ContactFormSection } from '@/components/home/ContactFormSection';
import { ProjectMapSection } from '@/components/home/ProjectMapSection';
import { SEO } from '@/components/common/SEO';
import { useLanguage } from '@/context/LanguageContext';
import { generateBreadcrumbSchema } from '@/utils/schemaGenerator';

interface ContactPageProps {
  onRequestViewing?: (projectName?: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = () => {
  const { t } = useLanguage();

  const schemas = [
    generateBreadcrumbSchema([
      { name: t('nav.home', 'Home'), item: '/' },
      { name: t('nav.contact', 'Contact'), item: '/contact' },
    ]),
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFD]">
      {/* Technical SEO */}
      <SEO
        title={`${t('contactPage.title', 'Contact Capital Pioneers')} | Capital Pioneers`}
        description={t('contactPage.subtitle', 'Reach our advisory teams in Al Shouyfat, Fifth Settlement (New Cairo HQ) and Hurghada (Red Sea Branch).')}
        canonicalPath="/contact"
        schema={schemas}
      />

      {/* Header */}
      <header className="bg-[#061D28] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-[#153648]">
        <div className="max-w-7xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
            {t('contactPage.title', 'Contact Capital Pioneers')}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl font-light leading-relaxed">
            {t('contactPage.subtitle', 'Reach our advisory teams in Al Shouyfat, Fifth Settlement (New Cairo HQ) and Hurghada (Red Sea Branch).')}
          </p>
        </div>
      </header>

      <ContactFormSection />
      <ProjectMapSection />
    </div>
  );
};

export default ContactPage;
