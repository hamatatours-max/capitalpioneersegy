import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/types/i18n';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'desktop' | 'mobile' | 'topbar';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'desktop',
  className = '',
}) => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string; name: string }[] = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'ar', label: 'العربية', name: 'Arabic' },
    { code: 'de', label: 'DE', name: 'Deutsch' },
  ];

  if (variant === 'topbar') {
    return (
      <div className={`flex items-center gap-1 text-[11px] font-medium ${className}`}>
        <Globe className="w-3 h-3 text-[#C5A880] mr-0.5" />
        {languages.map((lang, idx) => {
          const isActive = language === lang.code;
          return (
            <React.Fragment key={lang.code}>
              <button
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`transition-colors py-0.5 px-1 rounded ${
                  isActive
                    ? 'text-[#C5A880] font-semibold bg-white/10'
                    : 'text-slate-300 hover:text-white'
                }`}
                aria-label={`Switch to ${lang.name}`}
              >
                {lang.label}
              </button>
              {idx < languages.length - 1 && (
                <span className="text-slate-500 select-none">|</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className={`w-full flex items-center justify-center p-1.5 rounded-2xl bg-white/10 border border-white/15 ${className}`}>
        {languages.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 text-center ${
                isActive
                  ? 'bg-[#C5A880] text-[#061D28] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              aria-label={`Switch to ${lang.name}`}
            >
              {lang.label}
            </button>
          );
        })}
      </div>
    );
  }

  // Desktop Main Navigation Pill Switcher
  return (
    <div className={`inline-flex items-center p-1 rounded-xl bg-[#FAFBFD] border border-slate-200/80 shadow-soft-sm ${className}`}>
      <div className="flex items-center px-1.5 text-slate-400">
        <Globe className="w-3.5 h-3.5 text-[#0B4D68]" />
      </div>
      {languages.map((lang) => {
        const isActive = language === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-[#0B4D68] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#0B4D68] hover:bg-slate-100/80'
            }`}
            aria-label={`Switch to ${lang.name}`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
