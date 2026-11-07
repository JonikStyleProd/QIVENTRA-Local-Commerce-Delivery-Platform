import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { OrderStoreLine } from '../../data/cartRules';
import { Button } from '../ui/Button';

/** Shops in the basket that cannot reach the chosen address: why, and the two ways out. */
export const UndeliverableNotice: React.FC<{ lines: OrderStoreLine[]; id?: string; className?: string }> = ({
  lines,
  id,
  className = '',
}) => {
  const { removeStoreItems, setIsAddressModalOpen } = useApp();
  const { t, formatDistance } = useLanguage();
  const copy = t.demo.delivery;
  if (lines.length === 0) return null;

  return (
    <ul id={id} role="alert" className={`grid gap-2 text-sm font-extrabold ${className}`}>
      {lines.map((line) => {
        const [before, after] = copy.cartBlocked
          .replace('{distance}', formatDistance(line.delivery?.km ?? 0))
          .replace('{radius}', formatDistance(line.store.deliveryRadiusKm))
          .split('{store}');
        return (
          <li key={line.store.id} className="p-2.5 bg-card border-2 border-action-text rounded-xl">
            <p>
              {before}
              <bdi>{t.collage.storeCopy[line.store.id]?.name || line.store.name}</bdi>
              {after}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button variant="secondary" size="sm" onClick={() => setIsAddressModalOpen(true)}>
                {copy.changeAddress}
              </Button>
              <Button variant="outline" size="sm" onClick={() => removeStoreItems(line.store.id)}>
                {copy.removeItems}
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
