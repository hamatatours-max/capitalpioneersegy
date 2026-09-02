import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Direction, LanguageContextType } from '@/types/i18n';
import { enTranslations } from '@/i18n/translations/en';
import { arTranslations } from '@/i18n/translations/ar';
import { deTranslations } from '@/i18n/translations/de';

const LANGUAGE_STORAGE_KEY = 'cp_language';

const translationsMap: Record<Language, Record<string, string>> = {
  en: enTranslations,
  ar: arTranslations,
  de: deTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
      if (savedLang && (savedLang === 'en' || savedLang === 'ar' || savedLang === 'de')) {
        return savedLang;
      }
    } catch (e) {
      // Ignore localStorage errors
    }
    return 'en';
  });

  const dir: Direction = language === 'ar' ? 'rtl' : 'ltr';
  const isRTL = language === 'ar';

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    } catch (e) {
      console.warn('Failed to persist language to localStorage:', e);
    }
  };

  useEffect(() => {
    // Update HTML attributes for accessibility and RTL rendering
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = dir;
      if (isRTL) {
        document.body.classList.add('rtl-mode');
      } else {
        document.body.classList.remove('rtl-mode');
      }
    }
  }, [language, dir, isRTL]);

  const t = (key: string, defaultText: string = ''): string => {
    const dict = translationsMap[language] || enTranslations;
    if (dict[key] !== undefined && dict[key] !== '') {
      return dict[key];
    }
    // Fallback to English
    if (enTranslations[key] !== undefined && enTranslations[key] !== '') {
      return enTranslations[key];
    }
    return defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageProvider;
