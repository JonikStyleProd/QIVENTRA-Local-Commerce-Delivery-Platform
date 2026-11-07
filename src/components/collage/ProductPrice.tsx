import React from 'react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { usePromotions } from '../../context/PromotionsContext';
import { productPricePromotion } from '../../data/promotions';

interface ProductPriceProps {
  product: Product;
  priceClassName?: string;
  oldPriceClassName?: string;
}

/** A product's price. With a running "new price" promotion the regular one is crossed out beside it. */
export const ProductPrice: React.FC<ProductPriceProps> = ({
  product,
  priceClassName = 'font-black',
  oldPriceClassName = 'text-xs font-bold',
}) => {
  const { formatCurrency, t } = useLanguage();
  const { promotions, now } = usePromotions();
  const promotion = productPricePromotion(promotions, product, now);

  if (!promotion) return <span className={`${priceClassName} whitespace-nowrap`}>{formatCurrency(product.price)}</span>;

  return (
    <span className="min-w-0">
      <span className="flex flex-wrap items-baseline gap-x-1.5">
        <span className={`${priceClassName} text-action-text whitespace-nowrap`}>{formatCurrency(promotion.newPrice ?? 0)}</span>
        <s className={`${oldPriceClassName} text-ink-3 whitespace-nowrap`}>{formatCurrency(product.price)}</s>
      </span>
      {promotion.minSubtotal > 0 && (
        <span className="block text-xs font-bold text-ink-2">
          {t.promotions.conditions.from.replace('{amount}', formatCurrency(promotion.minSubtotal))}
        </span>
      )}
    </span>
  );
};
