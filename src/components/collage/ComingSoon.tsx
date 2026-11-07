import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { comingSoonCategories } from '../../data/collageCatalog';

/** Categories with no shops yet: named once, with nothing to click, on every screen that lists categories. */
export const ComingSoon: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, t } = useLanguage();
  const names = comingSoonCategories.map((category) => category.names?.[language] || category.name);
  if (names.length === 0) return null;

  return (
    <p className={`max-w-[640px] px-3 py-2 bg-card border-2 border-dashed border-ink rounded-xl text-sm font-bold ${className}`}>
      <span className="hand me-2 text-[22px] leading-none text-link-text">{t.demo.coming.title}</span>
      {t.demo.coming.desc.replace('{list}', names.join(', '))}
    </p>
  );
};
