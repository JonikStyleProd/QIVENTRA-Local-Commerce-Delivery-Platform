import React from 'react';
import { Link } from 'react-router';
import { Store } from '../../types';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { usePromotions } from '../../context/PromotionsContext';
import { bestPromotion } from '../../data/promotions';
import { promotionBadge } from '../collage/promotionCopy';
import { tiltFor } from '../../data/collageCatalog';
import { FavoriteButton } from '../collage/FavoriteButton';
import { Tape } from '../collage/Tape';
import { HandCircle } from '../collage/HandMarks';
import { PolaroidPhoto } from '../collage/PolaroidPhoto';

interface StoreCardProps {
  store: Store;
  onClick?: () => void;
  /** Makes the card a link to this address instead of a button. */
  to?: string;
  /** Set on the shop picker: the card then behaves as a toggle and can be circled. */
  isSelected?: boolean;
  /** "board" is the compact caption of the landing board; "full" lists time, fee and minimum. */
  detail?: 'board' | 'full';
  tilt?: string;
}

const CHIP = 'px-2.5 py-[5px] rounded-[10px] text-sm font-extrabold';

/** Shop polaroid. Time, fee, minimum and distance always come from the store's data. */
export const StoreCard: React.FC<StoreCardProps> = ({ store, onClick, to, isSelected, detail = 'full', tilt }) => {
  const { language, t, formatCurrency, formatTimeRange, formatDistance } = useLanguage();
  const { promotions, now } = usePromotions();
  const { deliveryFor } = useApp();
  const delivery = deliveryFor(store.id);
  const promotion = bestPromotion(promotions, store.id, now);

  const copy = t.collage.storeCopy[store.id];
  const name = copy?.name || store.names?.[language] || store.name;
  const kind = copy?.kind || store.categories?.[language] || store.category;
  const area = copy?.area;

  const time = formatTimeRange(delivery.timeMin, delivery.timeMax);
  const outOfRange = (
    <span className="block mt-1 px-2 py-1 bg-tint-food border-2 border-ink rounded-lg text-xs desk:text-sm font-extrabold">
      {t.demo.delivery.outOfRange}
      <span className="block font-bold">
        {t.demo.delivery.outOfRangeShort
          .replace('{distance}', formatDistance(delivery.km))
          .replace('{radius}', formatDistance(store.deliveryRadiusKm))}
      </span>
    </span>
  );
  const fee = `${t.collage.common.fee} ${formatCurrency(store.deliveryFee)}`;
  const min = `${t.collage.common.minFrom} ${formatCurrency(store.minOrder)}`;

  const isBoard = detail === 'board';

  const cardClass = `card-tilt relative block w-full h-full bg-card text-ink text-start cursor-pointer shadow-polaroid ${
    isBoard ? 'px-3 pt-3 pb-[18px]' : 'p-[7px] pb-2.5 desk:p-3.5 desk:pb-5'
  }`;
  const cardStyle = { '--tilt': tilt ?? tiltFor(store.id) } as React.CSSProperties;

  const body = (
    <>
      <Tape small={!isBoard} tone="yellow" />
      <span className="relative block">
        <PolaroidPhoto src={store.coverUrl} aspectClassName={isBoard ? 'aspect-square' : 'aspect-square desk:aspect-[4/3]'} />
        {promotion && (
          <span className="absolute top-1.5 start-1.5 max-w-[calc(100%-12px)] px-2 py-0.5 bg-accent border-2 border-ink rounded-lg text-xs font-black -rotate-2">
            {promotionBadge(promotion, t, language)}
          </span>
        )}
      </span>

      <span
        className={`hand block leading-none ${
          isBoard ? 'mt-2.5 text-[30px]' : 'mt-1.5 desk:mt-2.5 text-[22px] desk:text-[34px]'
        }`}
      >
        <bdi>{name}</bdi>
      </span>

      {!delivery.inRange ? (
        outOfRange
      ) : isBoard ? (
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
            {area ? ` · ${area}` : ''} · {formatDistance(delivery.km)}
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
    </>
  );

  return (
    <div className="relative h-full">
      {to ? (
        <Link to={to} className={cardClass} style={cardStyle}>
          {body}
        </Link>
      ) : (
        <button type="button" onClick={onClick} aria-pressed={isSelected} className={cardClass} style={cardStyle}>
          {body}
        </button>
      )}
      <FavoriteButton kind="stores" id={store.id} name={name} className="absolute! top-2.5 end-2.5 z-[1]" />
    </div>
  );
};
