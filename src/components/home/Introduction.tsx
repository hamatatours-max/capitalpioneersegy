import React from 'react';
import { Building2, Compass, ShieldCheck, TrendingUp, Award, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const Introduction: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 lg:py-32 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Architectural Story & Corporate Identity */}
          <div className="lg:col-span-7 space-y-6">
            <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68] border border-[#0B4D68]/15">
              <Building2 className="w-3.5 h-3.5" />
              <span>{t('intro.eyebrow', 'Corporate Overview')}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0F2432] tracking-tight leading-snug">
              {t('intro.title', 'Specializing in marketing premier real estate projects and property opportunities across Egypt.')}
            </h2>

            <div className="h-[2px] w-12 bg-[#C5A880] rounded-full"></div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
              {t('intro.desc1', 'Capital Pioneers Real Estate is a dedicated real estate marketing and advisory company operating from our headquarters in Al Shouyfat, Fifth Settlement, New Cairo and our regional branch in Hurghada, Red Sea, Egypt.')}
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
              {t('intro.desc2', 'We connect medical professionals, commercial operators, and discerning homebuyers with verified property opportunities throughout Egypt’s most dynamic development corridors.')}
            </p>

            {/* Strategic Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div className="p-4 rounded-2xl bg-[#FAFBFD] border border-slate-200/70 space-y-1.5 shadow-soft-sm">
                <div className="flex items-center gap-2 font-semibold text-xs tracking-wide text-[#0F2432]">
                  <MapPin className="w-3.5 h-3.5 text-[#0B4D68]" />
                  <span>{t('intro.hqCardTitle', 'New Cairo Headquarters')}</span>
                </div>
                <p className="text-xs text-slate-500 font-light leading-relaxed">
                  {t('intro.hqCardDesc', 'Al Shouyfat, Fifth Settlement — Center for medical, commercial & residential marketing.')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAFBFD] border border-slate-200/70 space-y-1.5 shadow-soft-sm">
                <div className="flex items-center gap-2 font-semibold text-xs tracking-wide text-[#0F2432]">
                  <Compass className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{t('intro.branchCardTitle', 'Hurghada Red Sea Branch')}</span>
                </div>
                <p className="text-xs text-slate-500 font-light leading-relaxed">
                  {t('intro.branchCardDesc', 'Hurghada, Red Sea — Dedicated coastal resorts, beachfront chalets & tourism property.')}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: High-Trust Metrics & Badge Card */}
          <div className="lg:col-span-5">
            <div className="luxury-dark-card p-8 sm:p-10 space-y-8 relative overflow-hidden">
              <div className="space-y-2 border-b border-white/10 pb-5">
                <span className="text-[11px] uppercase tracking-widest text-[#C5A880] font-semibold">
                  {t('intro.badgeTitle', 'Capital Pioneers Standard')}
                </span>
                <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                  {t('intro.badgeHeading', 'Corporate Principles & Market Focus')}
                </h3>
              </div>

              <div className="space-y-5 text-sm text-slate-300">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#C5A880] flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-medium text-sm">
                      {t('intro.pillar1Title', 'Verified Project Opportunities')}
                    </strong>
                    <span className="text-xs text-slate-400 font-light">
                      {t('intro.pillar1Desc', 'Rigorous review of licenses, master plans, and delivery schedules.')}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#0B4D68] flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-[#9AC6DB]" />
                  </div>
                  <div>
                    <strong className="text-white block font-medium text-sm">
                      {t('intro.pillar2Title', 'Medical & Commercial Specialization')}
                    </strong>
                    <span className="text-xs text-slate-400 font-light">
                      {t('intro.pillar2Desc', 'Tailored marketing for specialized healthcare clinics and high-traffic retail spaces.')}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#C5A880] flex-shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-medium text-sm">
                      {t('intro.pillar3Title', 'Direct Investor Guidance')}
                    </strong>
                    <span className="text-xs text-slate-400 font-light">
                      {t('intro.pillar3Desc', 'Transparent consultation on payment structures and capital appreciation.')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>{t('intro.directInquiries', 'Direct Inquiries:')}</span>
                <a
                  href="tel:+201066330570"
                  className="font-semibold text-[#C5A880] hover:underline"
                  dir="ltr"
                >
                  +20 10 66330570
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
