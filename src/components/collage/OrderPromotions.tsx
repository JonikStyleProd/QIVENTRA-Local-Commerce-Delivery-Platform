import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_STORES } from '../../data/mockData';
import { OrderCalculation, OrderStoreLine } from '../../data/cartRules';
import { localizedText } from '../../data/promotions';
import { OrderPromotionLine } from '../../types';
import { SummaryRow } from './SummaryRow';
import { promotionHintText } from './promotionCopy';

/** One line per applied promotion. Gifts cost 0 ₪; everything else is money off. */
export const PromotionRows: React.FC<{ lines: OrderPromotionLine[]; showStore?: boolean }> = ({ lines, showStore = false }) => {
  const { language, t, formatCurrency } = useLanguage();
  const copy = t.promotions.order;

  return (
    <>
      {lines.map((line) => {
        const store = MOCK_STORES.find((candidate) => candidate.id === line.storeId);
        const storeName = t.collage.storeCopy[line.storeId]?.name || store?.name;
        const isGift = line.type === 'gift';
        const giftName = line.giftName?.[language] || line.giftName?.ru || '';
        return (
          <SummaryRow
            key={`${line.storeId}-${line.promotionId}`}
            label={
              <>
                {isGift ? `${copy.gift} · ${giftName}` : `${copy.promotion} · ${localizedText(line.title, language)}`}
                {showStore && storeName && (
                  <>
                    {' · '}
                    <bdi>{storeName}</bdi>
                  </>
                )}
              </>
            }
            value={isGift ? formatCurrency(0) : `− ${formatCurrency(line.saving)}`}
          />
        );
      })}
    </>
  );
};

/** "Add N more, and …" for every promotion within reach. Stays quiet when a promo code won instead. */
export const PromotionHints: React.FC<{ stores: OrderStoreLine[]; className?: string }> = ({ stores, className = '' }) => {
  const { language, t } = useLanguage();
  const hints = stores.flatMap((line) => line.hints);
  if (hints.length === 0) return null;

  return (
    <ul className={`grid gap-1 text-sm font-extrabold ${className}`}>
      {hints.map((hint) => (
        <li key={hint.promotion.id} className="px-2.5 py-1.5 bg-card/70 border-2 border-dashed border-ink rounded-lg">
          {promotionHintText(hint, t, language)}
        </li>
      ))}
    </ul>
  );
};

/** Says which won, the promo code or the shop promotions, and why. Silent when no code was entered. */
export const DiscountChoiceNote: React.FC<{ order: OrderCalculation; className?: string }> = ({ order, className = '' }) => {
  const { t, formatCurrency } = useLanguage();
  if (order.promoCodeValue <= 0 || order.promotionsValue <= 0) return null;

  const copy = order.discountChoice === 'promoCode' ? t.promotions.order.codeWins : t.promotions.order.promoWins;
  return (
    <p role="status" className={`text-sm font-extrabold ${className}`}>
      {copy.replace('{code}', formatCurrency(order.promoCodeValue)).replace('{promo}', formatCurrency(order.promotionsValue))}
    </p>
  );
};
