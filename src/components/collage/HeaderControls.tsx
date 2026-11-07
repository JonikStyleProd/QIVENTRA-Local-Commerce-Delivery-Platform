import React, { useEffect, useRef } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

/** Cart counter that jumps whenever the count changes (not on first render). */
export const CartCountBadge: React.FC<{ count: number; className?: string }> = ({ count, className = '' }) => {
  const isFirstRender = useRef(true);
  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  return (
    <span
      key={count}
      aria-hidden="true"
      className={`grid place-items-center min-w-[22px] h-[22px] px-1 rounded-full bg-accent text-ink border-2 border-ink text-[11px] font-black tabular-nums ${
        isFirstRender.current ? '' : 'anim-bump'
      } ${className}`}
    >
      {count}
    </span>
  );
};

/** Address pill: opens the existing address modal. */
export const AddressButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { currentAddress, setIsAddressModalOpen } = useApp();
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => setIsAddressModalOpen(true)}
      aria-label={`${t.collage.common.addressLabel}: ${currentAddress}`}
      className={`chip-tilt flex items-center gap-1.5 min-h-11 min-w-0 px-2.5 bg-white text-ink border-2 border-ink rounded-xl text-sm font-extrabold cursor-pointer ${className}`}
      style={{ rotate: '-1.5deg' }}
    >
      <MapPin aria-hidden="true" className="w-4 h-4 shrink-0 text-action" />
      <span className="truncate">{currentAddress}</span>
      <ChevronDown aria-hidden="true" className="w-3.5 h-3.5 shrink-0" />
    </button>
  );
};
