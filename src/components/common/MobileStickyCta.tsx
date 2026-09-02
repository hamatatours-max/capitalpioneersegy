import React from 'react';
import { MessageCircle, Phone, Calendar } from 'lucide-react';
import { PRIMARY_PHONE, TEL_URL, WHATSAPP_BASE_URL } from '@/services/leadService';
import { useLanguage } from '@/context/LanguageContext';
import { trackClickPhone, trackClickWhatsApp, trackRequestViewing } from '@/services/analyticsService';

interface MobileStickyCtaProps {
  onRequestViewing?: () => void;
}

export const MobileStickyCta: React.FC<MobileStickyCtaProps> = ({ onRequestViewing }) => {
  const { t } = useLanguage();

  const whatsappUrl = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(
    'Hello Capital Pioneers Real Estate, I am interested in scheduling a property consultation.'
  )}`;

  const handlePhoneClick = () => {
    trackClickPhone('mobile_sticky_cta');
  };

  const handleWhatsAppClick = () => {
    trackClickWhatsApp('mobile_sticky_cta');
  };

  const handleViewingClick = () => {
    trackRequestViewing('mobile_sticky_cta');
    if (onRequestViewing) {
      onRequestViewing();
    } else {
      const el = document.getElementById('lead-form-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/contact#viewing';
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-2 sm:p-2.5 shadow-2xl lg:hidden flex items-center gap-2 safe-area-bottom">
      {/* 1. WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleWhatsAppClick}
        className="flex-1 py-3 px-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center gap-1.5 text-xs font-semibold shadow-sm transition-transform active:scale-95 text-center"
        aria-label={t('cta.whatsappUs', 'WhatsApp Us')}
      >
        <MessageCircle className="w-4 h-4 fill-current flex-shrink-0" />
        <span className="truncate">{t('form.contactWhatsApp', 'WhatsApp')}</span>
      </a>

      {/* 2. Call Button */}
      <a
        href={TEL_URL}
        onClick={handlePhoneClick}
        className="flex-1 py-3 px-2 rounded-xl bg-[#0B4D68] hover:bg-[#083e54] text-white flex items-center justify-center gap-1.5 text-xs font-semibold shadow-sm transition-transform active:scale-95 text-center"
        aria-label={`Call Capital Pioneers at ${PRIMARY_PHONE}`}
      >
        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="truncate">{t('cta.callNow', 'Call')}</span>
      </a>

      {/* 3. Request Viewing Button */}
      <button
        onClick={handleViewingClick}
        type="button"
        className="flex-1 py-3 px-2 rounded-xl bg-[#C5A880] hover:bg-[#bfa075] text-[#061D28] flex items-center justify-center gap-1.5 text-xs font-semibold shadow-sm transition-transform active:scale-95 text-center"
        aria-label={t('cta.requestViewing', 'Request Viewing')}
      >
        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="truncate">{t('cta.requestViewing', 'Request Viewing')}</span>
      </button>
    </div>
  );
};

export default MobileStickyCta;
