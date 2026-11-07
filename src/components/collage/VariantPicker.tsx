import React, { useId } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Product } from '../../types';

interface VariantPickerProps {
  product: Product;
  value?: string;
  onChange: (variantId: string) => void;
  className?: string;
}

/** One choice out of a product's variants, with each one's price. Native radios handle the keyboard. */
export const VariantPicker: React.FC<VariantPickerProps> = ({ product, value, onChange, className = '' }) => {
  const { language, t, formatCurrency } = useLanguage();
  const name = useId();
  const legend = product.variantKind ? t.demo.variants.kinds[product.variantKind] : t.demo.variants.variantField;

  return (
    <fieldset className={className}>
      <legend className="mb-1 text-sm font-extrabold">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {product.variants?.map((variant) => {
          const isOn = variant.id === value;
          return (
            <label
              key={variant.id}
              className={`chip-tilt inline-flex items-center gap-1.5 min-h-11 px-3 border-2 border-ink rounded-xl font-extrabold cursor-pointer has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-focus ${
                isOn ? 'bg-accent text-ink shadow-hard-3' : 'bg-card text-ink'
              }`}
            >
              <input
                type="radio"
                name={name}
                checked={isOn}
                onChange={() => onChange(variant.id)}
                className="sr-only"
              />
              <span>{variant.labels[language]}</span>
              <span className="text-sm font-bold">{formatCurrency(variant.price)}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};
