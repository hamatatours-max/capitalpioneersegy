import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Stethoscope, 
  ShoppingBag, 
  Compass, 
  Briefcase, 
  TrendingUp, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const ServicesSection: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const services = [
    {
      icon: Building2,
      title: t('services.srv1Title', 'Real Estate Marketing & Project Launch'),
      description: t('services.srv1Desc', 'Comprehensive marketing strategies for leading Egyptian developers across New Cairo, New Capital, and coastal markets.'),
      tag: t('services.srv1Tag', 'Core Marketing'),
    },
    {
      icon: Stethoscope,
      title: t('services.srv2Title', 'Medical Clinics & Healthcare Complex Advisory'),
      description: t('services.srv2Desc', 'Specialized marketing for doctors, medical investors, and clinics designed in accordance with healthcare specifications.'),
      tag: t('services.srv2Tag', 'Healthcare Sector'),
    },
    {
      icon: ShoppingBag,
      title: t('services.srv3Title', 'Commercial & Retail Portfolio Sales'),
      description: t('services.srv3Desc', 'Marketing high-footfall commercial strips, lifestyle plazas, and retail flagships for established brands and investors.'),
      tag: t('services.srv3Tag', 'High-Yield Assets'),
    },
    {
      icon: Compass,
      title: t('services.srv4Title', 'Capital Pioneers Red Sea Coastal Advisory'),
      description: t('services.srv4Desc', 'Dedicated Hurghada branch advisory for beachfront chalets, hotel-serviced apartments, and holiday resort investments.'),
      tag: t('services.srv4Tag', 'Red Sea Division'),
    },
    {
      icon: Briefcase,
      title: t('services.srv5Title', 'Administrative Headquarters & Offices'),
      description: t('services.srv5Desc', 'Strategic placement of Grade-A office spaces and corporate headquarters in New Cairo and New Capital CBD.'),
      tag: t('services.srv5Tag', 'Corporate Real Estate'),
    },
    {
      icon: TrendingUp,
      title: t('services.srv6Title', 'Investor Payment & Exit Strategy Guidance'),
      description: t('services.srv6Desc', 'In-depth consultation on payment structures, delivery horizons, installment plans, and capital appreciation potential.'),
      tag: t('services.srv6Tag', 'Financial Advisory'),
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="space-y-3">
            <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('services.eyebrow', 'What We Do')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0F2432] tracking-tight">
              {t('services.title', 'Marketing & Advisory Services')}
            </h2>
            <p className="text-slate-500 text-sm max-w-2xl font-light leading-relaxed">
              {t('services.desc', 'End-to-end real estate marketing services connecting developers with qualified buyers across Egypt’s high-value property segments.')}
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B4D68] hover:text-[#083e54] group self-start md:self-auto"
          >
            <span>{t('nav.services', 'Explore All Services')}</span>
            <ArrowRight className={`w-4 h-4 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="luxury-card p-7 sm:p-8 flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#F1F7FA] text-[#0B4D68] group-hover:bg-[#0B4D68] group-hover:text-white transition-colors flex items-center justify-center shadow-soft-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold tracking-wide text-[#C5A880] bg-[#FAF7F2] border border-[#C5A880]/30 px-2.5 py-1 rounded-full">
                      {srv.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-[#0F2432] group-hover:text-[#0B4D68] transition-colors leading-snug">
                    {srv.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#0B4D68] font-semibold group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform">
                  <span>{t('cta.learnMore', 'Learn more')}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
