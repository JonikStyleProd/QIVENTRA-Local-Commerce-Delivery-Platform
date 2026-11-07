import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface QuantityStepperProps {
  quantity: number;
  /** Item name for the buttons' accessible labels. */
  name: string;
  onDecrease: () => void;
  onIncrease: () => void;
}

/** The one quantity control: product cards, product view, basket. */
export const QuantityStepper: React.FC<QuantityStepperProps> = ({ quantity, name, onDecrease, onIncrease }) => {
  const { t } = useLanguage();
  return (
    <span className="seg-group inline-flex items-center shrink-0 bg-accent border-2 border-ink rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={onDecrease}
        aria-label={`${t.productCard.decrease}: ${name}`}
        className="grid place-items-center w-11 h-11 cursor-pointer"
      >
        <Minus aria-hidden="true" className="w-4 h-4" />
      </button>
      <span className="w-6 text-center text-sm font-black tabular-nums" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label={`${t.productCard.increase}: ${name}`}
        className="grid place-items-center w-11 h-11 cursor-pointer"
      >
        <Plus aria-hidden="true" className="w-4 h-4" />
      </button>
    </span>
  );
};
