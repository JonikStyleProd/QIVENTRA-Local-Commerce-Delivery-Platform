import { CartItem, OrderItem, OrderPromotionLine, Product, Store } from '../types';
import { MOCK_PRODUCTS, MOCK_STORES } from './mockData';
import { PromoCode, Promotion, isLive } from './promotions';
import { GeoPoint, StoreDelivery, storeDelivery } from './addresses';

/** A promotion working on the current order, and what it is worth to the buyer. */
export interface AppliedPromotion {
  promotion: Promotion;
  saving: number;
  giftProduct?: Product;
}

/** A promotion the buyer could still reach by adding goods to this shop's part of the order. */
export interface PromotionHint {
  promotion: Promotion;
  missing: number;
  giftProduct?: Product;
  product?: Product;
}

/** One shop's part of the current order: what it gets, its fee and how far it is from its minimum. */
export interface OrderStoreLine {
  store: Store;
  /** The shop's goods at regular prices. Minimums and promotion thresholds are checked against this. */
  subtotal: number;
  /** The fee to pay, after a free delivery promotion. */
  fee: number;
  /** The shop's own fee. */
  baseFee: number;
  /** ₪ still missing to reach the shop's minimum order; 0 when the minimum is met. */
  shortfall: number;
  applied: AppliedPromotion[];
  hints: PromotionHint[];
  /** What the buyer pays per unit, by product id. */
  unitPrices: Record<string, number>;
  /** Distance and time to the delivery address, when one is known. */
  delivery?: StoreDelivery;
}

const roundMoney = (amount: number): number => Math.round(amount * 100) / 100;

const isInScope = (promotion: Promotion, product: Product): boolean => {
  if (promotion.productIds.length === 0 && promotion.categories.length === 0) return true;
  return promotion.productIds.includes(product.id) || promotion.categories.includes(product.category);
};

const findProduct = (id?: string): Product | undefined => MOCK_PRODUCTS.find((product) => product.id === id);

/**
 * Works out one shop's promotions. Rules, in order:
 * - a new product price applies per unit;
 * - of the % and ₪ discounts only the best one applies, on the goods in its scope;
 * - free delivery zeroes this shop's fee, and each gift adds a line at 0 ₪.
 */
const applyPromotions = (
  line: Pick<OrderStoreLine, 'store' | 'subtotal' | 'baseFee'>,
  items: CartItem[],
  promotions: Promotion[],
  now: Date
): Pick<OrderStoreLine, 'fee' | 'applied' | 'hints' | 'unitPrices'> => {
  const unitPrices: Record<string, number> = {};
  items.forEach((item) => {
    unitPrices[item.product.id] = item.product.price;
  });

  const live = promotions.filter((promotion) => promotion.storeId === line.store.id && isLive(promotion, now));
  const reachesThreshold = (promotion: Promotion) => line.subtotal >= promotion.minSubtotal;
  const hasGoodsInScope = (promotion: Promotion) => items.some((item) => isInScope(promotion, item.product));
  const qualifies = (promotion: Promotion) => reachesThreshold(promotion) && hasGoodsInScope(promotion);

  const applied: AppliedPromotion[] = [];
  const hints: PromotionHint[] = [];

  live
    .filter((promotion) => promotion.type === 'productPrice')
    .forEach((promotion) => {
      const item = items.find((candidate) => candidate.product.id === promotion.productId);
      const newPrice = promotion.newPrice ?? 0;
      if (!item || newPrice >= unitPrices[item.product.id]) return;
      if (!reachesThreshold(promotion)) {
        hints.push({ promotion, missing: promotion.minSubtotal - line.subtotal, product: item.product });
        return;
      }
      unitPrices[item.product.id] = newPrice;
      applied.push({ promotion, saving: roundMoney((item.product.price - newPrice) * item.quantity) });
    });

  const inScopeSum = (promotion: Promotion) =>
    items
      .filter((item) => isInScope(promotion, item.product))
      .reduce((sum, item) => sum + unitPrices[item.product.id] * item.quantity, 0);

  const discounts = live.filter((promotion) => promotion.type === 'percent' || promotion.type === 'amount');
  const bestDiscount = discounts
    .filter(qualifies)
    .map((promotion) => ({
      promotion,
      saving:
        promotion.type === 'percent'
          ? roundMoney((inScopeSum(promotion) * (promotion.percent ?? 0)) / 100)
          : Math.min(promotion.amount ?? 0, inScopeSum(promotion)),
    }))
    .sort((a, b) => b.saving - a.saving)[0];
  if (bestDiscount && bestDiscount.saving > 0) applied.push(bestDiscount);

  discounts
    .filter((promotion) => !reachesThreshold(promotion) && (hasGoodsInScope(promotion) || items.length === 0))
    .forEach((promotion) => hints.push({ promotion, missing: promotion.minSubtotal - line.subtotal }));

  let fee = line.baseFee;
  live
    .filter((promotion) => promotion.type === 'freeDelivery' && line.baseFee > 0)
    .forEach((promotion) => {
      if (qualifies(promotion) && fee > 0) {
        applied.push({ promotion, saving: line.baseFee });
        fee = 0;
      } else if (!reachesThreshold(promotion) && (hasGoodsInScope(promotion) || items.length === 0)) {
        hints.push({ promotion, missing: promotion.minSubtotal - line.subtotal });
      }
    });

  live
    .filter((promotion) => promotion.type === 'gift')
    .forEach((promotion) => {
      const giftProduct = findProduct(promotion.giftProductId);
      if (!giftProduct?.inStock) return;
      if (qualifies(promotion)) {
        applied.push({ promotion, saving: giftProduct.price, giftProduct });
      } else if (!reachesThreshold(promotion) && (hasGoodsInScope(promotion) || items.length === 0)) {
        hints.push({ promotion, missing: promotion.minSubtotal - line.subtotal, giftProduct });
      }
    });

  // A free-delivery hint is pointless once another promotion of the same kind already applies.
  const appliedTypes = new Set(applied.map((entry) => entry.promotion.type));
  return {
    fee,
    applied,
    unitPrices,
    hints: hints.filter((hint) => !(hint.promotion.type === 'freeDelivery' && appliedTypes.has('freeDelivery'))),
  };
};

/**
 * Shops in the order: every shop with goods in the basket, plus the shop the customer explicitly
 * picked in the shop picker. A picked shop with no goods yet counts, so its fee and minimum match
 * its card. An empty basket has no order, so nothing is charged.
 */
export const summarizeOrderStores = (
  cart: CartItem[],
  pickedStoreId: string | null,
  promotions: Promotion[] = [],
  now: Date = new Date(),
  deliveryPoint?: GeoPoint
): OrderStoreLine[] => {
  if (cart.length === 0) return [];

  const ids = Array.from(new Set(cart.map((line) => line.product.storeId)));
  if (pickedStoreId && !ids.includes(pickedStoreId)) ids.push(pickedStoreId);

  return ids.flatMap((id) => {
    const store = MOCK_STORES.find((s) => s.id === id);
    if (!store) return [];
    const items = cart.filter((line) => line.product.storeId === id);
    const delivery = deliveryPoint ? storeDelivery(store, deliveryPoint) : undefined;
    // A picked shop with no goods has nothing to deliver, so out of range it simply leaves the order.
    if (items.length === 0 && delivery && !delivery.inRange) return [];
    const subtotal = items.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
    const base = { store, subtotal, baseFee: store.deliveryFee };
    return [
      {
        ...base,
        delivery,
        shortfall: Math.max(0, store.minOrder - subtotal),
        ...applyPromotions(base, items, promotions, now),
      },
    ];
  });
};

/** Each shop delivers its own goods, so a basket from several shops pays each shop's own fee. */
export const orderDeliveryFee = (lines: OrderStoreLine[]): number =>
  lines.reduce((sum, line) => sum + line.fee, 0);

export type DiscountChoice = 'none' | 'promotions' | 'promoCode';

export interface OrderCalculation {
  stores: OrderStoreLine[];
  /** All goods at regular prices. */
  itemsSubtotal: number;
  /** What is charged for delivery, after free delivery promotions. */
  deliveryFee: number;
  /** Delivery before promotions: the summary shows this and takes free delivery off as its own line. */
  baseDeliveryFee: number;
  /** Shops with goods in the basket that cannot reach the address. The order cannot be sent until this is empty. */
  undeliverable: OrderStoreLine[];
  /** A promo code and shop promotions do not add up: this says which of them won. */
  discountChoice: DiscountChoice;
  /** The promo code's value, if it won. */
  promoCodeDiscount: number;
  /** The entered code, with what is still missing to its threshold (0 once it is reached). */
  promoCode: (PromoCode & { missing: number }) | null;
  /** What the entered promo code would give, and what the promotions would give, for the explanation. */
  promoCodeValue: number;
  promotionsValue: number;
  promotionLines: OrderPromotionLine[];
  total: number;
  unitPrices: Record<string, number>;
}

const toLine = (storeId: string, entry: AppliedPromotion): OrderPromotionLine => ({
  promotionId: entry.promotion.id,
  storeId,
  type: entry.promotion.type,
  title: entry.promotion.title,
  saving: entry.saving,
  giftName: entry.giftProduct?.names ?? (entry.giftProduct ? { ru: entry.giftProduct.name } : undefined),
});

/**
 * The one calculation of an order: shop fees, minimums, promotions and the promo code.
 * The promo code competes with everything shop promotions are worth to the buyer (discounts,
 * the delivery fee saved, the price of a gift). The bigger value wins; a tie stays with the promotions.
 */
export const calculateOrder = ({
  cart,
  pickedStoreId,
  promotions,
  promoCode = null,
  now,
  deliveryPoint,
}: {
  cart: CartItem[];
  pickedStoreId: string | null;
  promotions: Promotion[];
  promoCode?: PromoCode | null;
  now: Date;
  deliveryPoint?: GeoPoint;
}): OrderCalculation => {
  const withPromotions = summarizeOrderStores(cart, pickedStoreId, promotions, now, deliveryPoint);
  const itemsSubtotal = withPromotions.reduce((sum, line) => sum + line.subtotal, 0);
  const promotionsValue = roundMoney(
    withPromotions.reduce((sum, line) => sum + line.applied.reduce((total, entry) => total + entry.saving, 0), 0)
  );
  // Below its threshold a code is worth nothing yet, but stays entered and says what is missing.
  const missing = promoCode ? Math.max(0, promoCode.minSubtotal - itemsSubtotal) : 0;
  const promoCodeValue = promoCode && cart.length > 0 && missing === 0 ? Math.min(promoCode.amount, itemsSubtotal) : 0;

  const codeWins = promoCodeValue > promotionsValue;
  const stores = codeWins ? summarizeOrderStores(cart, pickedStoreId, [], now, deliveryPoint) : withPromotions;
  const promoCodeDiscount = codeWins ? promoCodeValue : 0;

  const promotionLines = stores.flatMap((line) => line.applied.map((entry) => toLine(line.store.id, entry)));
  // A gift is worth something to the buyer but does not change what they pay.
  const moneyOff = promotionLines
    .filter((line) => line.type !== 'gift')
    .reduce((sum, line) => sum + line.saving, 0);

  const baseDeliveryFee = stores.reduce((sum, line) => sum + line.baseFee, 0);

  return {
    stores,
    itemsSubtotal,
    deliveryFee: orderDeliveryFee(stores),
    baseDeliveryFee,
    undeliverable: stores.filter((line) => line.delivery && !line.delivery.inRange),
    discountChoice: codeWins ? 'promoCode' : promotionsValue > 0 ? 'promotions' : 'none',
    promoCodeDiscount,
    promoCode: promoCode && cart.length > 0 ? { ...promoCode, missing } : null,
    promoCodeValue,
    promotionsValue,
    promotionLines,
    total: Math.max(0, roundMoney(itemsSubtotal + baseDeliveryFee - moneyOff - promoCodeDiscount)),
    unitPrices: Object.assign({}, ...stores.map((line) => line.unitPrices)),
  };
};

/** What a past order can put back in the basket today, and what it cannot. */
export interface RepeatedOrder {
  available: { product: Product; quantity: number }[];
  unavailable: OrderItem[];
}

/** An item counts only if its product is still in the catalog and in stock. */
export const resolveRepeatOrder = (items: OrderItem[], catalog: Product[]): RepeatedOrder => {
  const result: RepeatedOrder = { available: [], unavailable: [] };
  items.forEach((item) => {
    const product = catalog.find((p) => p.id === item.productId);
    if (product?.inStock) {
      result.available.push({ product, quantity: item.quantity });
    } else {
      result.unavailable.push(item);
    }
  });
  return result;
};
