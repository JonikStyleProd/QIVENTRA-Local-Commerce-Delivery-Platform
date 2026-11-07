import { describe, expect, it } from 'vitest';
import { calculateOrder, resolveRepeatOrder, summarizeOrderStores } from '../data/cartRules';
import { addressById } from '../data/addresses';
import { MOCK_ACTIVE_ORDER, MOCK_PAST_ORDERS, MOCK_PRODUCTS } from '../data/mockData';
import { Promotion, productPricePromotion, validatePromotion } from '../data/promotions';
import { hasVariantChoice, keyOfLine, lineKey, lowestPrice, normalizeVariantId, priceOf, unitLabel } from '../data/variants';
import { CartItem, Order } from '../types';

const NOW = new Date('2026-11-07T09:00:00Z');
const product = (id: string) => MOCK_PRODUCTS.find((candidate) => candidate.id === id)!;
const line = (id: string, quantity = 1, variantId?: string): CartItem => ({
  product: product(id),
  quantity,
  variantId: normalizeVariantId(product(id), variantId),
});
const promotion = (overrides: Partial<Promotion>): Promotion => ({
  id: 'test',
  storeId: 'store-3',
  type: 'percent',
  minSubtotal: 0,
  productIds: [],
  categories: [],
  title: { ru: 'x' },
  description: {},
  startsOn: '2020-01-01',
  endsOn: '2099-01-01',
  isPaused: false,
  ...overrides,
});
const calculate = (cart: CartItem[], promotions: Promotion[] = [], extra: Partial<Parameters<typeof calculateOrder>[0]> = {}) =>
  calculateOrder({ cart, pickedStoreId: null, promotions, now: NOW, ...extra });

describe('fees and minimums', () => {
  it('charges each shop its own fee and adds them up', () => {
    const order = calculate([line('prod-1'), line('prod-5')]); // Carmel 15 ₪, Levinsky free
    expect(order.deliveryFee).toBe(15);
    expect(order.total).toBe(24 + 22 + 15);
  });

  it('counts a picked shop with no goods yet, unless the basket is empty', () => {
    expect(calculate([line('prod-5')], [], { pickedStoreId: 'store-1' }).deliveryFee).toBe(15);
    expect(calculate([], [], { pickedStoreId: 'store-1' }).deliveryFee).toBe(0);
  });

  it('says how far a shop is below its minimum', () => {
    const [carmel] = summarizeOrderStores([line('prod-1')], null);
    expect(carmel.shortfall).toBe(50 - 24);
    const [met] = summarizeOrderStores([line('prod-3', 2)], null);
    expect(met.shortfall).toBe(0);
  });
});

describe('promotions in the calculation', () => {
  it('applies only the best of the percent and amount discounts', () => {
    const order = calculate(
      [line('prod-5', 5)],
      [
        promotion({ id: 'ten', percent: 10 }),
        promotion({ id: 'twenty', type: 'amount', amount: 20, minSubtotal: 50 }),
      ]
    );
    expect(order.promotionLines.map((entry) => entry.promotionId)).toEqual(['twenty']);
    expect(order.total).toBe(110 - 20);
  });

  it('zeroes the fee with free delivery, and shows the fee and the saving apart', () => {
    const order = calculate([line('prod-3', 2)], [promotion({ storeId: 'store-1', type: 'freeDelivery', minSubtotal: 80 })]);
    expect(order.baseDeliveryFee).toBe(15);
    expect(order.deliveryFee).toBe(0);
    expect(order.total).toBe(96);
  });

  it('ignores a promotion that is paused or over', () => {
    const paused = calculate([line('prod-5', 5)], [promotion({ percent: 50, isPaused: true })]);
    const ended = calculate([line('prod-5', 5)], [promotion({ percent: 50, endsOn: '2021-01-01' })]);
    expect(paused.promotionLines).toHaveLength(0);
    expect(ended.promotionLines).toHaveLength(0);
  });
});

describe('product variants', () => {
  it('has variants on 4–6 products, the first one matching the product price', () => {
    const withChoice = MOCK_PRODUCTS.filter(hasVariantChoice);
    expect(withChoice.length).toBeGreaterThanOrEqual(4);
    expect(withChoice.length).toBeLessThanOrEqual(6);
    withChoice.forEach((candidate) => {
      expect(candidate.variants![0].price).toBe(candidate.price);
      expect(candidate.variantKind).toBeDefined();
      candidate.variants!.forEach((variant) => {
        expect(variant.labels.ru && variant.labels.en && variant.labels.he).toBeTruthy();
        expect(variant.price).toBeGreaterThan(0);
      });
    });
  });

  it('prices a line by its variant', () => {
    const order = calculate([line('prod-3', 1, '250ml')]);
    expect(order.itemsSubtotal).toBe(22);
    expect(priceOf(product('prod-3'), '500ml')).toBe(36);
    expect(lowestPrice(product('prod-3'))).toBe(22);
  });

  it('keeps variants of one product as separate lines', () => {
    const big = line('prod-3', 1, '750ml');
    const small = line('prod-3', 2, '250ml');
    expect(keyOfLine(big)).not.toBe(keyOfLine(small));
    const order = calculate([big, small]);
    expect(order.itemsSubtotal).toBe(48 + 44);
    expect(order.unitPrices[lineKey('prod-3', '750ml')]).toBe(48);
    expect(order.unitPrices[lineKey('prod-3', '250ml')]).toBe(22);
  });

  it('falls back to the first variant for an unknown or missing id', () => {
    expect(normalizeVariantId(product('prod-3'), 'gone')).toBe('750ml');
    expect(normalizeVariantId(product('prod-3'))).toBe('750ml');
    expect(normalizeVariantId(product('prod-2'))).toBeUndefined();
  });

  it('applies a new price only to the variant it names', () => {
    const newPrice = promotion({ storeId: 'store-1', type: 'productPrice', productId: 'prod-3', variantId: '750ml', newPrice: 40 });
    const order = calculate([line('prod-3', 1, '750ml'), line('prod-3', 1, '250ml')], [newPrice]);
    expect(order.unitPrices[lineKey('prod-3', '750ml')]).toBe(40);
    expect(order.unitPrices[lineKey('prod-3', '250ml')]).toBe(22);
    expect(order.promotionLines[0].saving).toBe(8);
    expect(productPricePromotion([newPrice], product('prod-3'), NOW, '750ml')).toBeDefined();
    expect(productPricePromotion([newPrice], product('prod-3'), NOW, '250ml')).toBeUndefined();
  });

  it('applies a new price without a variant wherever it is lower', () => {
    const newPrice = promotion({ storeId: 'store-1', type: 'productPrice', productId: 'prod-3', newPrice: 30 });
    const order = calculate([line('prod-3', 1, '750ml'), line('prod-3', 2, '250ml')], [newPrice]);
    expect(order.unitPrices[lineKey('prod-3', '750ml')]).toBe(30);
    expect(order.unitPrices[lineKey('prod-3', '250ml')]).toBe(22);
    expect(order.promotionLines[0].saving).toBe(18);
  });

  it('values a gift by its variant and names the variant', () => {
    const gift = promotion({ type: 'gift', giftProductId: 'prod-6', giftVariantId: '1l' });
    const order = calculate([line('prod-5')], [gift]);
    expect(order.promotionLines[0].saving).toBe(52);
    expect(order.promotionLines[0].giftName?.en).toContain('1 l');
    expect(order.total).toBe(22);
  });

  it('checks the variant in the seller form', () => {
    const products = MOCK_PRODUCTS.filter((candidate) => candidate.storeId === 'store-1');
    const base = promotion({ storeId: 'store-1', type: 'productPrice', productId: 'prod-3', title: { en: 'x' }, endsOn: '2099-01-02' });
    expect(validatePromotion({ ...base, variantId: 'nope', newPrice: 10 }, products).variantId).toBe('variantForeign');
    expect(validatePromotion({ ...base, variantId: '250ml', newPrice: 30 }, products).newPrice).toBe('newPriceRange');
    expect(validatePromotion({ ...base, variantId: '250ml', newPrice: 20 }, products)).toEqual({});
  });

  it('shows the variant as the unit for weight and volume, next to it for color', () => {
    expect(unitLabel(product('prod-3'), '250ml', 'en')).toBe('250 ml');
    expect(unitLabel(product('prod-10'), 'sand', 'en')).toContain('sand');
    expect(unitLabel(product('prod-2'), undefined, 'en')).toBe(product('prod-2').units?.en);
  });
});

describe('repeating an order', () => {
  it('brings back the same variant', () => {
    const { available } = resolveRepeatOrder(
      [{ name: 'oil', productId: 'prod-3', variantId: '250ml', quantity: 2, price: 22 }],
      MOCK_PRODUCTS
    );
    expect(available[0]).toMatchObject({ quantity: 2, variantId: '250ml' });
  });

  it('calls a variant that is gone unavailable', () => {
    const { available, unavailable } = resolveRepeatOrder(
      [{ name: 'oil', productId: 'prod-3', variantId: 'barrel', quantity: 1, price: 900 }],
      MOCK_PRODUCTS
    );
    expect(available).toHaveLength(0);
    expect(unavailable).toHaveLength(1);
  });

  it('can repeat every seed order', () => {
    [MOCK_ACTIVE_ORDER, ...MOCK_PAST_ORDERS].forEach((order) => {
      expect(resolveRepeatOrder(order.items, MOCK_PRODUCTS).unavailable).toEqual([]);
    });
  });
});

describe('delivery reach in the calculation', () => {
  const far = addressById('herzliya-manofim-8')!.coords;
  const near = addressById('rothschild-42')!.coords;

  it('reports shops that cannot reach the address', () => {
    expect(calculate([line('prod-5')], [], { deliveryPoint: near }).undeliverable).toEqual([]);
    const blocked = calculate([line('prod-5')], [], { deliveryPoint: far });
    expect(blocked.undeliverable.map((entry) => entry.store.id)).toEqual(['store-3']);
  });

  it('drops a picked shop with no goods once it is out of range', () => {
    const order = calculate([line('prod-5')], [], { pickedStoreId: 'store-1', deliveryPoint: far });
    expect(order.stores.map((entry) => entry.store.id)).toEqual(['store-3']);
  });
});

describe('seed orders', () => {
  const addsUp = (order: Order) => {
    const goods = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const off = (order.promotionLines ?? []).filter((entry) => entry.type !== 'gift').reduce((sum, entry) => sum + entry.saving, 0);
    return goods + order.deliveryFee - off - (order.discount ?? 0);
  };

  it('add up to their totals', () => {
    [MOCK_ACTIVE_ORDER, ...MOCK_PAST_ORDERS].forEach((order) => expect(addsUp(order)).toBe(order.totalAmount));
  });
});
