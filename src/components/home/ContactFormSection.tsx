import React from 'react';
import { 
  MapPin, 
  Compass, 
  Building2
} from 'lucide-react';
import { MainLeadForm } from '@/components/forms/MainLeadForm';
import { PRIMARY_PHONE, TEL_URL } from '@/services/leadService';
import { useLanguage } from '@/context/LanguageContext';

export const ContactFormSection: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section id="lead-form-section" className="py-24 lg:py-32 bg-[#FAFBFD] border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Office Contacts */}
          <div className="lg:col-span-5 space-y-6">
            <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
              <Building2 className="w-3.5 h-3.5" />
              <span>{t('form.eyebrow', 'Direct Consultation Desk')}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0F2432] tracking-tight leading-snug">
              {t('form.mainTitle', 'REQUEST A VIEWING OR PROPERTY CONSULTATION')}
            </h2>

            <div className="h-[2px] w-12 bg-[#C5A880] rounded-full"></div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
              {t('form.mainSubtitle', 'Connect directly with our real estate advisory team across New Cairo and Red Sea.')}
            </p>

            {/* Corporate Location Cards */}
            <div className="space-y-4 pt-2">
              {/* New Cairo HQ */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/70 shadow-soft-sm space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#0F2432]">
                  <MapPin className="w-4 h-4 text-[#0B4D68]" />
                  <span>
                    {language === 'ar' ? 'المقر الرئيسي — القاهرة الجديدة' : language === 'de' ? 'Hauptsitz Neu-Kairo' : 'New Cairo Corporate Headquarters'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-light">
                  {t('topbar.hq', 'Al Shouyfat, Fifth Settlement, New Cairo, Egypt')}
                </div>
                <div className="text-xs text-slate-400 font-light">
                  {language === 'ar' ? 'خدمات المشروعات الطبية والتجارية بالقاهرة الجديدة والعاصمة الإدارية.' : language === 'de' ? 'Betreuung von Neu-Kairo, Neuer Hauptstadt und Ost-Kairo.' : 'Serving New Cairo, New Capital CBD, and East Cairo developments.'}
                </div>
              </div>

              {/* Hurghada Branch */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/70 shadow-soft-sm space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#0F2432]">
                  <Compass className="w-4 h-4 text-[#C5A880]" />
                  <span>
                    {language === 'ar' ? 'فرع البحر الأحمر — الغردقة' : language === 'de' ? 'Niederlassung Hurghada am Roten Meer' : 'Hurghada Red Sea Branch'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-light">
                  {t('topbar.branch', 'Hurghada, Red Sea Governorate, Egypt')}
                </div>
                <div className="text-xs text-slate-400 font-light">
                  {language === 'ar' ? 'خدمات الشاليهات والمنتجعات والفيلات بالغردقة والجونة وسهل حشيش.' : language === 'de' ? 'Betreuung von Hurghada, El Gouna, Sahl Hasheesh und Küstenresorts.' : 'Serving Hurghada, El Gouna, Sahl Hasheesh, and coastal resorts.'}
                </div>
              </div>

              {/* Contact Line */}
              <div className="p-5 rounded-2xl bg-[#061D28] text-white space-y-2 shadow-soft-dark">
                <div className="text-xs text-[#C5A880] font-semibold uppercase tracking-wider">
                  {t('form.hotlineLabel', 'Direct Phone & WhatsApp Hotline')}
                </div>
                <a
                  href={TEL_URL}
                  className="text-lg font-bold text-white hover:text-[#C5A880] transition-colors block"
                  dir="ltr"
                >
                  {PRIMARY_PHONE}
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-7">
            <MainLeadForm source="web_form" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
