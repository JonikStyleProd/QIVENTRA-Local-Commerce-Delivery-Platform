import React from 'react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { usePromotions } from '../../context/PromotionsContext';
import { productPricePromotion } from '../../data/promotions';
import { hasVariantChoice, lowestPrice, priceOf } from '../../data/variants';

interface ProductPriceProps {
  product: Product;
  /** The variant to price. Without one, a product with a choice shows "from" its lowest price. */
  variantId?: string;
  priceClassName?: string;
  oldPriceClassName?: string;
}

/** A product's price. With a running "new price" promotion the regular one is crossed out beside it. */
export const ProductPrice: React.FC<ProductPriceProps> = ({
  product,
  variantId,
  priceClassName = 'font-black',
  oldPriceClassName = 'text-xs font-bold',
}) => {
  const { formatCurrency, t } = useLanguage();
  const { promotions, now } = usePromotions();

  if (variantId === undefined && hasVariantChoice(product)) {
    return (
      <span className={`${priceClassName} whitespace-nowrap`}>
        {t.demo.variants.from.replace('{price}', formatCurrency(lowestPrice(product)))}
      </span>
    );
  }

  const chosen = variantId || undefined;
  const promotion = productPricePromotion(promotions, product, now, chosen);
  const regular = priceOf(product, chosen);

  if (!promotion) return <span className={`${priceClassName} whitespace-nowrap`}>{formatCurrency(regular)}</span>;

  return (
    <span className="min-w-0">
      <span className="flex flex-wrap items-baseline gap-x-1.5">
        <span className={`${priceClassName} text-action-text whitespace-nowrap`}>{formatCurrency(promotion.newPrice ?? 0)}</span>
        <s className={`${oldPriceClassName} text-ink-3 whitespace-nowrap`}>{formatCurrency(regular)}</s>
      </span>
      {promotion.minSubtotal > 0 && (
        <span className="block text-xs font-bold text-ink-2">
          {t.promotions.conditions.from.replace('{amount}', formatCurrency(promotion.minSubtotal))}
        </span>
      )}
    </span>
  );
};
