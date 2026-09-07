import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translations, translations } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  direction: 'ltr' | 'rtl';
  isRTL: boolean;
  translations: Translations;
  t: Translations;
  setLanguage: (lang: Language) => void;
  formatCurrency: (amount: number) => string;
  formatMinutes: (minutes: number) => string;
  formatDistance: (km: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('qiventra_language');
      if (saved === 'ru' || saved === 'en' || saved === 'he') {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'ru';
  });

  const direction: 'ltr' | 'rtl' = language === 'he' ? 'rtl' : 'ltr';
  const isRTL = direction === 'rtl';

  useEffect(() => {
    try {
      localStorage.setItem('qiventra_language', language);
    } catch {
      // ignore
    }

    // Apply root attributes
    document.documentElement.lang = language;
    document.documentElement.dir = direction;

    if (isRTL) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [language, direction, isRTL]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const currentTranslations = translations[language] || translations.ru;

  const formatCurrency = (amount: number): string => {
    // Israeli standard currency representation with non-breaking space
    if (language === 'he') {
      return `₪\u00A0${amount}`;
    }
    return `${amount}\u00A0₪`;
  };

  const formatMinutes = (minutes: number): string => {
    if (language === 'he') {
      return `${minutes} דק'`;
    }
    if (language === 'en') {
      return `${minutes} min`;
    }
    return `${minutes} мин`;
  };

  const formatDistance = (km: number): string => {
    if (language === 'he') {
      return `${km} ק״מ`;
    }
    if (language === 'en') {
      return `${km} km`;
    }
    return `${km} км`;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        isRTL,
        translations: currentTranslations,
        t: currentTranslations,
        setLanguage,
        formatCurrency,
        formatMinutes,
        formatDistance,
      }}
    >
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
