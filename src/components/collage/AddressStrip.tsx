import React from 'react';
import { MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_STORES } from '../../data/mockData';
import { formatCount } from '../../i18n/format';
import { Button } from '../ui/Button';

/** Top of the home page: where we deliver, and how many shops can reach that address. */
export const AddressStrip: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { currentAddress, deliveryFor, setIsAddressModalOpen } = useApp();
  const { language, t } = useLanguage();
  const copy = t.demo.address;
  const near = MOCK_STORES.filter((store) => deliveryFor(store.id).inRange).length;

  return (
    <section
      aria-label={copy.deliverTo}
      className={`flex flex-wrap items-center gap-x-3 gap-y-1.5 p-2.5 ps-3.5 bg-card border-2 border-ink rounded-2xl shadow-hard-3 ${className}`}
    >
      <MapPin aria-hidden="true" className="w-5 h-5 shrink-0 text-action-text" />
      <p className="min-w-0 flex-1 basis-[200px]">
        <span className="block text-sm font-bold text-ink-2">{copy.deliverTo}</span>
        <span className="block font-black break-words">{currentAddress}</span>
      </p>
      <p className={`text-sm font-extrabold ${near === 0 ? 'text-action-text' : ''}`}>
        {near > 0 ? copy.nearCount.replace('{count}', formatCount(near, t.demo.counts.shops, language)) : copy.noneNear}
      </p>
      <Button variant="outline" size="sm" onClick={() => setIsAddressModalOpen(true)}>
        {copy.change}
      </Button>
    </section>
  );
};
