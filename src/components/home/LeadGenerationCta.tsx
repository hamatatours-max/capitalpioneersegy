import React from 'react';
import { Phone, MessageCircle, Calendar, MapPin, Sparkles } from 'lucide-react';
import { PRIMARY_PHONE, TEL_URL, WHATSAPP_BASE_URL } from '@/services/leadService';
import { useLanguage } from '@/context/LanguageContext';
import { trackClickPhone, trackClickWhatsApp, trackRequestViewing } from '@/services/analyticsService';

interface LeadGenerationCtaProps {
  onRequestViewing?: () => void;
}

export const LeadGenerationCta: React.FC<LeadGenerationCtaProps> = ({ onRequestViewing }) => {
  const { t } = useLanguage();

  const handleViewingClick = () => {
    trackRequestViewing('lead_cta_banner');
    if (onRequestViewing) onRequestViewing();
  };

  const handlePhoneClick = () => {
    trackClickPhone('lead_cta_banner');
  };

  const handleWhatsAppClick = () => {
    trackClickWhatsApp('lead_cta_banner');
  };

  const whatsappUrl = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(
    'Hello Capital Pioneers Real Estate, I would like to schedule a property consultation regarding real estate opportunities.'
  )}`;

  return (
    <section className="py-20 lg:py-24 bg-[#061D28] text-white border-b border-[#153648] relative overflow-hidden">
      {/* Background Subtle Accents */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#0B4D68]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#C5A880]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#C5A880] text-xs font-semibold tracking-wider uppercase mx-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('leadcta.eyebrow', 'Direct Client Consultation')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-[1.2]">
            {t('leadcta.title', 'Begin Your Property Search with Capital Pioneers')}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light max-w-2xl mx-auto">
            {t('leadcta.desc', 'Connect with our real estate advisors in New Cairo (Al Shouyfat HQ) or Hurghada (Red Sea Branch) for tailored project recommendations and payment schedules.')}
          </p>

          {/* Action CTAs Button Strip */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleViewingClick}
              type="button"
              className="btn-gold w-full sm:w-auto py-3.5 px-8 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('cta.requestViewing', 'Request a Viewing')}</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="btn-whatsapp w-full sm:w-auto py-3.5 px-8 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{t('cta.whatsappConsultation', 'WhatsApp Consultation')}</span>
            </a>

            <a
              href={TEL_URL}
              onClick={handlePhoneClick}
              className="btn-outline-white w-full sm:w-auto py-3.5 px-8 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#C5A880]" />
              <span dir="ltr">{PRIMARY_PHONE}</span>
            </a>
          </div>

          {/* Dual Headquarters Trust Line */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-slate-400 font-light">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{t('leadcta.hqText', 'HQ: Fifth Settlement, New Cairo')}</span>
            </div>
            <div className="hidden sm:inline-block text-slate-600">•</div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{t('leadcta.branchText', 'Branch: Hurghada, Red Sea')}</span>
            </div>
            <div className="hidden sm:inline-block text-slate-600">•</div>
            <div className="flex items-center gap-1.5 text-white font-medium">
              <span>{t('leadcta.hotline', 'Direct Hotline:')}</span>
              <a href={TEL_URL} className="text-[#C5A880] hover:underline" dir="ltr">
                {PRIMARY_PHONE}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadGenerationCta;
