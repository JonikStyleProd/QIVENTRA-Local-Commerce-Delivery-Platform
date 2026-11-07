import React from 'react';
import { Leaf, Sprout, Utensils } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { FACT_LABELS, ProductLabel, isFactLabel } from '../../data/promotions';

export const FACT_LABEL_ICON: Partial<Record<ProductLabel, React.ReactNode>> = {
  eco: <Leaf aria-hidden="true" className="w-3.5 h-3.5 shrink-0" />,
  kosher: <Utensils aria-hidden="true" className="w-3.5 h-3.5 shrink-0" />,
  vegan: <Sprout aria-hidden="true" className="w-3.5 h-3.5 shrink-0" />,
};

/** The shop's promotional words: a loud yellow tag, as on a shelf. */
export const PromoLabels: React.FC<{ labels: ProductLabel[]; className?: string }> = ({ labels, className = '' }) => {
  const { t } = useLanguage();
  const promo = labels.filter((label) => !isFactLabel(label));
  if (promo.length === 0) return null;
  return (
    <span className={`flex flex-wrap gap-1 ${className}`}>
      {promo.map((label) => (
        <span key={label} className="px-2 py-0.5 bg-accent border-2 border-ink rounded-lg text-xs font-black -rotate-1">
          {t.promotions.labels[label]}
        </span>
      ))}
    </span>
  );
};

/** Facts about the product: a calm chip with an icon, so they do not read as advertising. */
export const FactLabels: React.FC<{ labels: ProductLabel[]; className?: string }> = ({ labels, className = '' }) => {
  const { t } = useLanguage();
  const facts = FACT_LABELS.filter((label) => labels.includes(label));
  if (facts.length === 0) return null;
  return (
    <ul className={`flex flex-wrap gap-1 ${className}`}>
      {facts.map((label) => (
        <li
          key={label}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-tint-tech text-ink border border-ink rounded-full text-xs font-bold"
        >
          {FACT_LABEL_ICON[label]}
          {t.promotions.labels[label]}
        </li>
      ))}
    </ul>
  );
};
