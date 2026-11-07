import { Language, Translations } from '../../i18n/translations';
import { formatPromotionDate, formatShekels } from '../../i18n/format';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../../data/mockData';
import { Promotion } from '../../data/promotions';
import { PromotionHint } from '../../data/cartRules';
import { Product } from '../../types';

/** Short shelf names keep promotion terms readable; products without one use their full name. */
const productName = (product: Product | undefined, t: Translations, language: Language): string =>
  product ? t.collage.productLabels[product.id] || product.names?.[language] || product.name : '';

const findProduct = (id?: string) => MOCK_PRODUCTS.find((product) => product.id === id);

/** A short label for a shop card or a stamp: what the promotion gives, in a few words. */
export const promotionBadge = (promotion: Promotion, t: Translations, language: Language): string => {
  const copy = t.promotions.badge;
  switch (promotion.type) {
    case 'percent':
      return copy.percent.replace('{n}', String(promotion.percent ?? 0));
    case 'amount':
      return copy.amount.replace('{amount}', formatShekels(promotion.amount ?? 0, language));
    case 'freeDelivery':
      return copy.freeDelivery;
    case 'gift':
      return copy.gift;
    case 'productPrice':
      return copy.productPrice;
  }
};

/** The promotion's terms as short lines: what is given, the threshold, the goods, the hours and the dates. */
export const promotionConditions = (promotion: Promotion, t: Translations, language: Language): string[] => {
  const copy = t.promotions.conditions;
  const lines: string[] = [];

  if (promotion.type === 'gift') {
    lines.push(copy.gift.replace('{gift}', productName(findProduct(promotion.giftProductId), t, language)));
  }
  if (promotion.type === 'productPrice') {
    lines.push(
      `${productName(findProduct(promotion.productId), t, language)}: ${copy.price.replace(
        '{price}',
        formatShekels(promotion.newPrice ?? 0, language)
      )}`
    );
  }
  if (promotion.minSubtotal > 0) {
    lines.push(copy.from.replace('{amount}', formatShekels(promotion.minSubtotal, language)));
  }

  const scope = [
    ...promotion.productIds.map((id) => productName(findProduct(id), t, language)),
    ...promotion.categories.map(
      (name) => MOCK_CATEGORIES.find((category) => category.name === name)?.names?.[language] || name
    ),
  ].filter(Boolean);
  if (scope.length > 0) lines.push(copy.on.replace('{items}', scope.join(', ')));

  if (promotion.hoursFrom && promotion.hoursTo) {
    lines.push(copy.hours.replace('{from}', promotion.hoursFrom).replace('{to}', promotion.hoursTo));
  } else if (promotion.hoursTo) {
    lines.push(copy.hoursUntil.replace('{to}', promotion.hoursTo));
  } else if (promotion.hoursFrom) {
    lines.push(copy.hoursFrom.replace('{from}', promotion.hoursFrom));
  }

  if (promotion.endsOn) lines.push(copy.until.replace('{date}', formatPromotionDate(promotion.endsOn, language)));
  return lines;
};

/** "Add N more, and …" for a promotion the buyer has not reached yet. */
export const promotionHintText = (hint: PromotionHint, t: Translations, language: Language): string => {
  const copy = t.promotions.order;
  const missing = formatShekels(hint.missing, language);
  const { promotion } = hint;
  switch (promotion.type) {
    case 'freeDelivery':
      return copy.hintFree.replace('{n}', missing);
    case 'percent':
      return copy.hintDiscount.replace('{n}', missing).replace('{x}', `${promotion.percent ?? 0}%`);
    case 'amount':
      return copy.hintDiscount.replace('{n}', missing).replace('{x}', formatShekels(promotion.amount ?? 0, language));
    case 'gift':
      return copy.hintGift.replace('{n}', missing).replace('{gift}', productName(hint.giftProduct, t, language));
    case 'productPrice':
      return copy.hintPrice
        .replace('{n}', missing)
        .replace('{product}', productName(hint.product, t, language))
        .replace('{price}', formatShekels(promotion.newPrice ?? 0, language));
  }
};
