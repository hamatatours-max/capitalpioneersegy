import React from 'react';
import { Building2, Compass, MapPin } from 'lucide-react';
import { SEO } from '@/components/common/SEO';
import { useLanguage } from '@/context/LanguageContext';
import { generateOrganizationSchema, generateBreadcrumbSchema } from '@/utils/schemaGenerator';

interface AboutPageProps {
  onRequestViewing?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onRequestViewing }) => {
  const { t } = useLanguage();

  const schemas = [
    generateOrganizationSchema(),
    generateBreadcrumbSchema([
      { name: t('nav.home', 'Home'), item: '/' },
      { name: t('nav.about', 'About Us'), item: '/about' },
    ]),
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFD]">
      {/* Technical SEO */}
      <SEO
        title={`${t('about.title', 'About Capital Pioneers Real Estate')} | Capital Pioneers`}
        description={t('about.subtitle', "Learn about Capital Pioneers Real Estate, Egypt's premier real estate marketing company operating from headquarters in New Cairo and regional branch in Hurghada.")}
        canonicalPath="/about"
        schema={schemas}
      />

      {/* Header */}
      <header className="bg-[#061D28] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-[#153648]">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="eyebrow-tag bg-[#0B4D68]/60 border border-white/10 text-[#C5A880]">
            <Building2 className="w-3.5 h-3.5" />
            <span>{t('about.eyebrow', 'Corporate Identity')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
            {t('about.title', 'About Capital Pioneers Real Estate')}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl font-light leading-relaxed">
            {t('about.subtitle', 'A professional real estate marketing firm specializing in marketing real estate projects and property opportunities across Egypt.')}
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F2432] tracking-tight leading-snug">
              {t('about.heading', 'Marketing excellence in Egypt’s real estate landscape.')}
            </h2>
            <div className="h-[2px] w-12 bg-[#C5A880] rounded-full"></div>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
              {t('about.p1', 'Capital Pioneers Real Estate was established with a singular mission: to provide sophisticated, transparent, and results-driven real estate marketing solutions for premier development projects across Egypt.')}
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
              {t('about.p2', 'With our corporate headquarters located in Al Shouyfat, Fifth Settlement, New Cairo and our regional coastal branch in Hurghada, Red Sea, Egypt, we offer dual-hub advisory bridging Cairo’s administrative and medical developments with coastal leisure and resort properties.')}
            </p>
          </div>

          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/70 p-8 sm:p-10 shadow-soft-sm space-y-6">
            <h3 className="text-base font-semibold text-[#0F2432] border-b border-slate-100 pb-3">
              {t('about.locationsTitle', 'Corporate Locations')}
            </h3>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#0B4D68] mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block text-sm text-[#0F2432] font-semibold">{t('about.hqName', 'New Cairo Headquarters')}</strong>
                  <span className="font-light">{t('about.hqAddr', 'Al Shouyfat, Fifth Settlement, New Cairo, Egypt')}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Compass className="w-4 h-4 text-[#C5A880] mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block text-sm text-[#0F2432] font-semibold">{t('about.branchName', 'Hurghada Red Sea Branch')}</strong>
                  <span className="font-light">{t('about.branchAddr', 'Hurghada, Red Sea Governorate, Egypt')}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button onClick={onRequestViewing} className="btn-primary w-full text-xs">
                {t('about.requestMeeting', 'Request Office Meeting')}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
