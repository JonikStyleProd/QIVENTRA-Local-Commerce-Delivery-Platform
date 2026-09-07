import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../i18n/translations';

interface LanguageSwitcherProps {
  variant?: 'pills' | 'compact' | 'full' | 'header';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string; shortLabel: string }[] = [
    { code: 'ru', label: 'Русский', shortLabel: 'RU' },
    { code: 'en', label: 'English', shortLabel: 'EN' },
    { code: 'he', label: 'עברית', shortLabel: 'HE' },
  ];

  if (variant === 'header') {
    return (
      <div
        className={`inline-flex items-center h-11 p-1 rounded-xl bg-[#1A4B44] border border-[#276B61] select-none shrink-0 ${className}`}
        role="group"
        aria-label="Language selector"
      >
        {languages.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`
                h-9 px-2.5 rounded-lg text-xs font-bold transition select-none whitespace-nowrap flex items-center justify-center
                ${
                  isActive
                    ? 'bg-[#B8D96B] text-[#151817] shadow-xs'
                    : 'text-[#F3F1EA]/75 hover:text-[#F3F1EA] hover:bg-[#205A52]'
                }
              `}
              aria-pressed={isActive}
              aria-label={lang.label}
            >
              {lang.shortLabel}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`grid grid-cols-3 gap-2 ${className}`}>
        {languages.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`
                flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition select-none
                ${
                  isActive
                    ? 'bg-[#123B35] text-[#F3F1EA] dark:bg-[#B8D96B] dark:text-[#151817] border-[#123B35] dark:border-[#B8D96B] shadow-xs ring-1 ring-[#B8D96B]'
                    : 'bg-surface-elevated text-secondary hover:text-primary hover:bg-surface border-theme'
                }
              `}
              aria-pressed={isActive}
              aria-label={`Выбрать язык ${lang.label}`}
            >
              <span className="text-sm">{lang.label}</span>
              <span className={`text-[10px] mt-0.5 ${isActive ? 'opacity-80' : 'text-muted'}`}>
                {lang.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Compact segmented bar (ideal for Navbar & Modals)
  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl bg-surface-elevated border border-theme select-none ${className}`}
      role="group"
      aria-label="Language selector"
    >
      {languages.map((lang) => {
        const isActive = language === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code)}
            className={`
              px-2.5 py-1 rounded-lg text-xs font-semibold transition select-none whitespace-nowrap
              ${
                isActive
                  ? 'bg-[#123B35] text-[#F3F1EA] dark:bg-[#B8D96B] dark:text-[#151817] shadow-xs'
                  : 'text-secondary hover:text-primary hover:bg-surface/50'
              }
            `}
            aria-pressed={isActive}
            aria-label={lang.label}
          >
            {variant === 'pills' ? lang.label : lang.shortLabel}
          </button>
        );
      })}
    </div>
  );
};
