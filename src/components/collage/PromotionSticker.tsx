import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Promotion, localizedText } from '../../data/promotions';
import { Stamp } from './Stamp';
import { Tape } from './Tape';
import { tiltFor } from '../../data/collageCatalog';
import { promotionBadge, promotionConditions } from './promotionCopy';

interface PromotionStickerProps {
  promotion: Promotion;
  /** False when today's hours have passed: the promotion stays visible, marked as not running now. */
  isRunningNow?: boolean;
}

const TINT: Record<Promotion['type'], string> = {
  percent: 'bg-tint-food',
  amount: 'bg-tint-health',
  freeDelivery: 'bg-tint-tech',
  gift: 'bg-tint-gift',
  productPrice: 'bg-tint-pets',
};

/** A promotion as the buyer sees it: stamp, title, description, terms and dates. */
export const PromotionSticker: React.FC<PromotionStickerProps> = ({ promotion, isRunningNow = true }) => {
  const { language, t } = useLanguage();
  const description = localizedText(promotion.description, language);

  return (
    <article
      className={`card-tilt relative h-full p-3.5 pt-5 border-2 border-ink rounded-2xl shadow-hard-3 ${TINT[promotion.type]}`}
      style={{ '--tilt': tiltFor(promotion.id) } as React.CSSProperties}
    >
      <Tape tone="yellow" small />
      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
        <Stamp tone="promo">{promotionBadge(promotion, t, language)}</Stamp>
        {!isRunningNow && <Stamp>{t.promotions.conditions.notNow}</Stamp>}
      </div>
      <h3 className="text-lg font-black leading-snug break-words">{localizedText(promotion.title, language)}</h3>
      {description && <p className="mt-0.5 text-sm font-bold text-ink-2 break-words">{description}</p>}
      <ul className="mt-1.5 text-[13px] font-extrabold text-ink-2">
        {promotionConditions(promotion, t, language).map((line) => (
          <li key={line} className="break-words">
            {line}
          </li>
        ))}
      </ul>
    </article>
  );
};
