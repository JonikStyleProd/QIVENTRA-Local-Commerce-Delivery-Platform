import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../i18n/translations';

interface LanguageSwitcherProps {
  /** Kept for existing callers; every variant now renders the same Collage control. */
  variant?: 'pills' | 'compact' | 'full' | 'header';
  className?: string;
}

const LANGUAGES: { code: Language; name: string; label: string }[] = [
  { code: 'ru', name: 'Русский', label: 'RU' },
  { code: 'en', name: 'English', label: 'EN' },
  { code: 'he', name: 'עברית', label: 'עב' },
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.collage.common.langLabel}
      className={`seg-group inline-flex shrink-0 bg-white border-2 border-ink rounded-xl overflow-hidden ${className}`}
    >
      {LANGUAGES.map((lang) => {
        const isActive = language === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code)}
            aria-pressed={isActive}
            aria-label={lang.name}
            lang={lang.code}
            className={`min-w-11 min-h-11 px-1 text-[13px] font-black cursor-pointer transition-colors duration-200 ${
              isActive ? 'bg-ink text-white' : 'bg-white text-ink'
            }`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
};
