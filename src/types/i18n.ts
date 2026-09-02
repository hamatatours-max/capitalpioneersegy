export type Language = 'en' | 'ar' | 'de';
export type Direction = 'ltr' | 'rtl';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: Direction;
  isRTL: boolean;
  t: (key: string, defaultText?: string) => string;
}
