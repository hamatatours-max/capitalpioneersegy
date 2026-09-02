import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Compass, Search, Home } from 'lucide-react';
import { SEO } from '@/components/common/SEO';
import { useLanguage } from '@/context/LanguageContext';
import { PRIMARY_PHONE, TEL_URL } from '@/services/leadService';

export const NotFoundPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 bg-[#FAFBFD] text-center">
      {/* 404 SEO: Strictly noindex to prevent indexing broken URLs */}
      <SEO
        title={`${t('notfound.title', 'Page Not Found')} | Capital Pioneers Real Estate`}
        description={t('notfound.desc', 'The property opportunity or page you are looking for does not exist or has been relocated in our real estate directory.')}
        noIndex={true}
      />

      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-soft space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#F1F7FA] text-[#0B4D68] mx-auto flex items-center justify-center shadow-soft-sm">
          <Building2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
            {t('notfound.eyebrow', 'Error 404')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#0F2432] tracking-tight">
            {t('notfound.title', 'Page Not Found')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
            {t('notfound.desc', 'The requested page or project listing could not be found. Please check the URL or use our navigation links below.')}
          </p>
        </div>

        {/* Recovery Navigation Links */}
        <div className="space-y-2.5 pt-2 text-xs font-semibold">
          <Link
            to="/"
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>{t('notfound.returnHome', 'Return to Homepage')}</span>
          </Link>

          <Link
            to="/projects"
            className="btn-outline w-full py-3 flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>{t('notfound.exploreProjects', 'Explore All Projects')}</span>
          </Link>

          <Link
            to="/capital-pioneers-red-sea"
            className="btn-gold w-full py-3 flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>{t('notfound.redSeaHub', 'Red Sea Coastal Division')}</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 font-light">
          {t('notfound.helpText', 'Need immediate assistance? Call')} <a href={TEL_URL} className="text-slate-700 font-semibold underline" dir="ltr">{PRIMARY_PHONE}</a>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
