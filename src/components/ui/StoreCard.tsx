import React from 'react';
import { Store } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { tiltFor } from '../../data/collageCatalog';
import { Tape } from '../collage/Tape';
import { HandCircle } from '../collage/HandMarks';
import { PolaroidPhoto } from '../collage/PolaroidPhoto';

interface StoreCardProps {
  store: Store;
  onClick?: () => void;
  /** Set on the shop picker: the card then behaves as a toggle and can be circled. */
  isSelected?: boolean;
  /** "board" is the compact caption of the landing board; "full" lists time, fee and minimum. */
  detail?: 'board' | 'full';
  tilt?: string;
}

const CHIP = 'px-2.5 py-[5px] rounded-[10px] text-sm font-extrabold';

/** Shop polaroid. Time, fee, minimum and distance always come from the store's data. */
export const StoreCard: React.FC<StoreCardProps> = ({ store, onClick, isSelected, detail = 'full', tilt }) => {
  const { language, t, formatCurrency, formatTimeRange, formatDistance } = useLanguage();

  const copy = t.collage.storeCopy[store.id];
  const name = copy?.name || store.names?.[language] || store.name;
  const kind = copy?.kind || store.categories?.[language] || store.category;
  const area = copy?.area;

  const time = formatTimeRange(store.deliveryTimeMin, store.deliveryTimeMax);
  const fee = `${t.collage.common.fee} ${formatCurrency(store.deliveryFee)}`;
  const min = `${t.collage.common.minFrom} ${formatCurrency(store.minOrder)}`;

  const isBoard = detail === 'board';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`card-tilt relative block w-full h-full bg-card text-ink text-start cursor-pointer shadow-polaroid ${
        isBoard ? 'px-3 pt-3 pb-[18px]' : 'p-[7px] pb-2.5 desk:p-3.5 desk:pb-5'
      }`}
      style={{ '--tilt': tilt ?? tiltFor(store.id) } as React.CSSProperties}
    >
      <Tape small={!isBoard} tone="yellow" />
      <PolaroidPhoto src={store.coverUrl} aspectClassName={isBoard ? 'aspect-square' : 'aspect-square desk:aspect-[4/3]'} />

      <span
        className={`hand block leading-none ${
          isBoard ? 'mt-2.5 text-[30px]' : 'mt-1.5 desk:mt-2.5 text-[22px] desk:text-[34px]'
        }`}
      >
        <bdi>{name}</bdi>
      </span>

      {isBoard ? (
        <span className="block mt-1 font-bold text-ink-2">
          {kind} · {time}
        </span>
      ) : (
        <>
          {/* Phone: two short lines. Desktop: description line plus coloured chips. */}
          <span className="desk:hidden block mt-1 text-xs font-extrabold text-ink-2">
            {kind} · {time}
          </span>
          <span className="desk:hidden block text-xs font-bold text-ink-3">
            {fee} · {min}
          </span>
          <span className="hidden desk:block mt-1.5 font-bold text-ink-2">
            {kind}
            {area ? ` · ${area}` : ''} · {formatDistance(store.distanceKm)}
          </span>
          <span className="hidden desk:flex flex-wrap gap-2 mt-2.5">
            <span className={`${CHIP} bg-tint-health`}>{time}</span>
            <span className={`${CHIP} bg-tint-food`}>{fee}</span>
            <span className={`${CHIP} bg-tint-pets`}>{min}</span>
          </span>
        </>
      )}

      {isSelected && (
        <>
          <HandCircle />
          <span
            aria-hidden="true"
            className="hand absolute -top-[26px] desk:-top-[34px] -end-1.5 desk:-end-2.5 text-2xl desk:text-[30px] text-action rotate-[8deg]"
          >
            {t.collage.stores.thisOne}
          </span>
        </>
      )}
    </button>
  );
};
