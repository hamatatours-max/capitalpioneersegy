import React from 'react';
import { ShieldCheck, MapPin, Stethoscope, Handshake, Phone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const WhyUsSection: React.FC = () => {
  const { t } = useLanguage();

  const pillars = [
    {
      icon: MapPin,
      title: t('whyus.p1Title', 'Dual Regional Hubs (Cairo & Red Sea)'),
      description: t('whyus.p1Desc', 'Headquartered in Al Shouyfat, Fifth Settlement (New Cairo) with an active operational branch in Hurghada (Red Sea).'),
    },
    {
      icon: Stethoscope,
      title: t('whyus.p2Title', 'Healthcare & Commercial Specialization'),
      description: t('whyus.p2Desc', 'Deep market experience in medical clinic compliance, retail footfall analysis, and high-visibility corporate offices.'),
    },
    {
      icon: ShieldCheck,
      title: t('whyus.p3Title', 'Verified Project Transparency'),
      description: t('whyus.p3Desc', 'We present clear, realistic timelines, developer track records, and honest project specifications to protect client investments.'),
    },
    {
      icon: Handshake,
      title: t('whyus.p4Title', 'Direct Developer Pricing & Zero Brokerage Markups'),
      description: t('whyus.p4Desc', 'Direct contracts and installment schedules negotiated directly with master developers across Egypt.'),
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-[#FAFBFD] border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('whyus.eyebrow', 'Corporate Trust')}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0F2432] tracking-tight leading-snug">
              {t('whyus.title', 'Why Partner with Capital Pioneers')}
            </h2>

            <div className="h-[2px] w-12 bg-[#C5A880] rounded-full"></div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
              {t('whyus.desc', 'As an established Egyptian real estate marketing firm, we combine deep local expertise in New Cairo’s medical and commercial sectors with an active coastal division in Hurghada.')}
            </p>

            {/* Direct hotline box */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/70 shadow-soft-sm space-y-3">
              <span className="text-xs uppercase font-semibold text-slate-400">
                {t('whyus.deskLabel', 'Direct Consultation Desk')}
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F1F7FA] text-[#0B4D68] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <a
                    href="tel:+201066330570"
                    className="text-base font-bold text-[#0B4D68] hover:underline tracking-tight block"
                    dir="ltr"
                  >
                    +20 10 66330570
                  </a>
                  <div className="text-[11px] text-slate-500 font-light">
                    {t('whyus.availableText', 'Available for WhatsApp & Phone Calls')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Pillars Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="luxury-card p-6 sm:p-7 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F1F7FA] text-[#0B4D68] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-[#0F2432] leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
