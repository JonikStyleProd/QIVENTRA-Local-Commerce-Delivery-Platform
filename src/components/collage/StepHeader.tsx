import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

interface StepHeaderProps {
  step: string;
  title: string;
  backLabel: string;
  onBack: () => void;
}

/** Phone header of the two checkout steps: back, step note with the page title, language. */
export const StepHeader: React.FC<StepHeaderProps> = ({ step, title, backLabel, onBack }) => (
  <header
    className="desk:hidden flex items-center gap-2.5 px-4 pb-1"
    style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}
  >
    <button
      type="button"
      onClick={onBack}
      aria-label={backLabel}
      className="chip-tilt grid place-items-center w-11 h-11 shrink-0 bg-white text-ink border-2 border-ink rounded-xl cursor-pointer"
    >
      <ChevronLeft aria-hidden="true" strokeWidth={3} className="w-5 h-5 rtl-flip" />
    </button>
    <div className="flex-1 min-w-0">
      <p className="hand text-[22px] leading-tight text-action">{step}</p>
      <h1 className="text-[26px] font-black tracking-tight leading-[1.05]">{title}</h1>
    </div>
    <LanguageSwitcher />
  </header>
);
