import { formatKm, formatMinutesIn, formatMinutesRange, formatShekels } from '../i18n/format';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translations, translations } from '../i18n/translations';
import { LANGUAGE_KEY, detectLanguage } from '../i18n/detectLanguage';

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
  /** "15–25 мин": the range is isolated so RTL text does not reverse it to "25–15". */
  formatTimeRange: (min: number, max: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(detectLanguage);

  const direction: 'ltr' | 'rtl' = language === 'he' ? 'rtl' : 'ltr';
  const isRTL = direction === 'rtl';

  useEffect(() => {
    // index.html has already set these before the first paint; this keeps them in step with a switch.
    document.documentElement.lang = language;
    document.documentElement.dir = direction;

    if (isRTL) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [language, direction, isRTL]);

  // Only a choice the user made is saved: until then the browser's language keeps deciding.
  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem(LANGUAGE_KEY, lang);
    } catch {
      // Without storage the choice lasts until the page closes.
    }
    setLanguageState(lang);
  };

  const currentTranslations = translations[language] || translations.ru;

  const formatCurrency = (amount: number): string => {
    return formatShekels(amount, language);
  };

  const formatMinutes = (minutes: number): string => formatMinutesIn(minutes, language);
  const formatDistance = (km: number): string => formatKm(km, language);
  const formatTimeRange = (min: number, max: number): string => formatMinutesRange(min, max, language);

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
        formatTimeRange,
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
