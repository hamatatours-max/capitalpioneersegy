import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
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

  const whatsappUrl = 'https://wa.me/201066330570?text=Hello%20Capital%20Pioneers%20Real%20Estate,%20I%20am%20interested%20in%20learning%20more%20about%20your%20property%20projects.';

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Direct WhatsApp Contact"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      {/* Pop-up tooltip (Soft rounded-2xl) */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-3 bg-[#061D28]/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-soft-dark border border-white/15 text-xs animate-in fade-in duration-300">
          <div className="flex flex-col">
            <span className="font-semibold text-[#C5A880] tracking-wide text-[10px]">
              Capital Pioneers Desk
            </span>
            <span className="text-slate-200 font-light">Chat with our advisors on WhatsApp</span>
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

      {/* Floating Circular Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-soft-lg transition-all duration-300 hover:scale-105 active:scale-95 group relative"
        aria-label="Chat with Capital Pioneers on WhatsApp (+20 10 66330570)"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-35 animate-ping" />
        <MessageCircle className="w-6 h-6 fill-current relative z-10" />
      </a>
    </aside>
  );
};

export default WhatsAppButton;
