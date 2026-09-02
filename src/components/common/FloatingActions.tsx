import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import { PRIMARY_PHONE, TEL_URL, WHATSAPP_BASE_URL } from '@/services/leadService';
import { trackClickPhone, trackClickWhatsApp } from '@/services/analyticsService';

export const FloatingActions: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setShowTooltip(true);
    }, 1500);

    const tooltipTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 8500);

    return () => {
      clearTimeout(timer);
      clearTimeout(tooltipTimer);
    };
  }, []);

  const handlePhoneClick = () => {
    trackClickPhone('floating_speed_dial');
  };

  const handleWhatsAppClick = () => {
    trackClickWhatsApp('floating_speed_dial');
  };

  const whatsappUrl = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(
    'Hello Capital Pioneers Real Estate, I am interested in inquiring about property opportunities across Egypt.'
  )}`;

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Direct Customer Support"
      className="hidden lg:flex fixed bottom-8 right-8 z-50 flex-col items-end gap-3.5 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      {/* Pop-up tooltip */}
      {showTooltip && (
        <div className="flex items-center gap-3 bg-[#061D28]/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-soft-dark border border-white/15 text-xs animate-in fade-in duration-300">
          <div className="flex flex-col">
            <span className="font-semibold text-[#C5A880] tracking-wide text-[10px] uppercase">
              Capital Pioneers Desk
            </span>
            <span className="text-slate-200 font-light">Speak directly with our real estate team</span>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white ml-1 p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Buttons Group */}
      <div className="flex flex-col items-center gap-3">
        {/* Floating Call Button */}
        <a
          href={TEL_URL}
          onClick={handlePhoneClick}
          className="w-13 h-13 p-3.5 rounded-full bg-[#0B4D68] hover:bg-[#083e54] text-white flex items-center justify-center shadow-soft-lg transition-all duration-300 hover:scale-105 active:scale-95 group relative"
          title={`Call Capital Pioneers (${PRIMARY_PHONE})`}
          aria-label={`Call Capital Pioneers at ${PRIMARY_PHONE}`}
        >
          <Phone className="w-5 h-5 text-white" />
        </a>

        {/* Floating WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-soft-lg transition-all duration-300 hover:scale-105 active:scale-95 group relative"
          title="Chat with Capital Pioneers on WhatsApp (+20 10 66330570)"
          aria-label="Chat on WhatsApp"
        >
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-35 animate-ping" />
          <MessageCircle className="w-6 h-6 fill-current relative z-10" />
        </a>
      </div>
    </aside>
  );
};

export default FloatingActions;
