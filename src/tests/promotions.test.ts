import { describe, expect, it } from 'vitest';
import { calculateOrder, summarizeOrderStores } from '../data/cartRules';
import { MOCK_PRODUCTS, MOCK_STORES } from '../data/mockData';
import {
  DEMO_PRODUCT_LABELS,
  PRODUCT_LABELS,
  Promotion,
  bestPromotion,
  buildDemoPromotions,
  isLive,
  israelClock,
  localizedText,
  productPricePromotion,
  promotionStatus,
  validatePromotion,
  visiblePromotions,
} from '../data/promotions';
import { translations } from '../i18n/translations';
import { CartItem } from '../types';

// 10:00 in Israel: winter time is UTC+2.
const MORNING = new Date('2026-11-10T08:00:00Z');

const line = (id: string, quantity = 1): CartItem => ({
  product: MOCK_PRODUCTS.find((product) => product.id === id)!,
  quantity,
});

const promotion = (overrides: Partial<Promotion>): Promotion => ({
  id: 'promo',
  storeId: 'store-3',
  title: { ru: 'Акция' },
  description: {},
  type: 'percent',
  minSubtotal: 0,
  productIds: [],
  categories: [],
  startsOn: '2026-11-01',
  endsOn: '2026-11-30',
  isPaused: false,
  ...overrides,
});

const calculate = (cart: CartItem[], promotions: Promotion[], promoCodeAmount = 0, now = MORNING, pickedStoreId: string | null = null) =>
  calculateOrder({ cart, pickedStoreId, promotions, promoCodeAmount, now });

describe('promotion types', () => {
  it('takes a percent discount off the shop goods', () => {
    const order = calculate([line('prod-4', 10)], [promotion({ percent: 10 })]);
    expect(order.itemsSubtotal).toBe(160);
    expect(order.promotionLines).toHaveLength(1);
    expect(order.promotionLines[0].saving).toBe(16);
    expect(order.total).toBe(144);
  });

  it('takes a fixed discount off, never more than the goods in its scope', () => {
    const order = calculate([line('prod-4', 5)], [promotion({ type: 'amount', amount: 15 })]);
    expect(order.total).toBe(80 - 15);
    const capped = calculate([line('prod-4')], [promotion({ type: 'amount', amount: 50 })]);
    expect(capped.promotionLines[0].saving).toBe(16);
    expect(capped.total).toBe(0);
  });

  it('zeroes only its own shop fee with free delivery', () => {
    // Carmel charges 15, Jaffa charges 18.
    const order = calculate(
      [line('prod-3', 2), line('prod-11')],
      [promotion({ storeId: 'store-1', type: 'freeDelivery', minSubtotal: 80 })]
    );
    const carmel = order.stores.find((store) => store.store.id === 'store-1')!;
    const jaffa = order.stores.find((store) => store.store.id === 'store-4')!;
    expect(carmel.fee).toBe(0);
    expect(carmel.baseFee).toBe(15);
    expect(jaffa.fee).toBe(18);
    expect(order.deliveryFee).toBe(18);
    expect(order.baseDeliveryFee).toBe(33);
    expect(order.total).toBe(96 + 160 + 18);
  });

  it('does not apply free delivery where the fee is already zero', () => {
    const order = calculate([line('prod-4', 5)], [promotion({ type: 'freeDelivery' })]);
    expect(order.promotionLines).toHaveLength(0);
  });

  it('adds a gift at 0 ₪ without changing the total', () => {
    const gift = promotion({ type: 'gift', giftProductId: 'prod-6', productIds: ['prod-4'] });
    const order = calculate([line('prod-4', 3)], [gift]);
    expect(order.promotionLines).toHaveLength(1);
    expect(order.promotionLines[0].type).toBe('gift');
    expect(order.promotionLines[0].giftName?.en).toBeTruthy();
    expect(order.total).toBe(48);
  });

  it('sets a new product price per unit and shows it in the unit prices', () => {
    const order = calculate(
      [line('prod-8', 2)],
      [promotion({ storeId: 'store-2', type: 'productPrice', productId: 'prod-8', newPrice: 119 })]
    );
    expect(order.unitPrices['prod-8']).toBe(119);
    expect(order.promotionLines[0].saving).toBe(40);
    expect(order.total).toBe(278 - 40 + 15);
  });

  it('takes a percent discount from prices already reduced by a new product price', () => {
    const order = calculate(
      [line('prod-8')],
      [
        promotion({ id: 'price', storeId: 'store-2', type: 'productPrice', productId: 'prod-8', newPrice: 100 }),
        promotion({ id: 'percent', storeId: 'store-2', percent: 10 }),
      ]
    );
    expect(order.promotionLines.map((entry) => entry.saving)).toEqual([39, 10]);
    expect(order.total).toBe(139 - 49 + 15);
  });
});

describe('promotion conditions', () => {
  it('needs the threshold, counted on goods at regular prices', () => {
    const free = promotion({ storeId: 'store-1', type: 'freeDelivery', minSubtotal: 96 });
    expect(calculate([line('prod-3', 2)], [free]).promotionLines).toHaveLength(1);
    const below = calculate([line('prod-3')], [free]);
    expect(below.promotionLines).toHaveLength(0);
    expect(below.deliveryFee).toBe(15);
  });

  it('gives a hint with the missing sum below the threshold, and none above it', () => {
    const free = promotion({ storeId: 'store-1', type: 'freeDelivery', minSubtotal: 80 });
    const below = calculate([line('prod-3')], [free]);
    expect(below.stores[0].hints).toHaveLength(1);
    expect(below.stores[0].hints[0].missing).toBe(32);
    expect(calculate([line('prod-3', 2)], [free]).stores[0].hints).toHaveLength(0);
  });

  it('applies only to the goods and categories in its scope', () => {
    const bakeryOnly = promotion({ percent: 50, productIds: ['prod-4'] });
    const order = calculate([line('prod-4'), line('prod-6')], [bakeryOnly]);
    expect(order.promotionLines[0].saving).toBe(8);
    expect(calculate([line('prod-6')], [bakeryOnly]).promotionLines).toHaveLength(0);

    const byCategory = promotion({ percent: 50, categories: [line('prod-4').product.category] });
    expect(calculate([line('prod-4')], [byCategory]).promotionLines[0].saving).toBe(8);
    expect(calculate([line('prod-4')], [promotion({ percent: 50, categories: ['Зоотовары'] })]).promotionLines).toHaveLength(0);
  });

  it('checks the hours in Israel time, across summer and winter', () => {
    const gift = promotion({
      type: 'gift',
      giftProductId: 'prod-6',
      hoursTo: '11:30',
      startsOn: '2026-01-01',
      endsOn: '2026-12-31',
    });
    // Winter is UTC+2.
    expect(isLive(gift, new Date('2026-11-10T09:29:00Z'))).toBe(true);
    expect(isLive(gift, new Date('2026-11-10T09:30:00Z'))).toBe(false);
    // Summer is UTC+3.
    expect(isLive(gift, new Date('2026-07-10T08:29:00Z'))).toBe(true);
    expect(isLive(gift, new Date('2026-07-10T08:30:00Z'))).toBe(false);
    expect(israelClock(new Date('2026-11-10T22:30:00Z')).date).toBe('2026-11-11');

    const evening = promotion({ percent: 10, hoursFrom: '18:00', hoursTo: '20:00' });
    expect(isLive(evening, new Date('2026-11-10T15:59:00Z'))).toBe(false);
    expect(isLive(evening, new Date('2026-11-10T16:00:00Z'))).toBe(true);
  });

  it('stops applying and showing a promotion once it has ended', () => {
    const percent = promotion({ percent: 10, endsOn: '2026-11-09' });
    expect(promotionStatus(percent, MORNING)).toBe('ended');
    expect(calculate([line('prod-4', 5)], [percent]).promotionLines).toHaveLength(0);
    expect(visiblePromotions([percent], 'store-3', MORNING)).toHaveLength(0);
    // The last day still counts, until the end of that day in Israel.
    const lastDay = promotion({ percent: 10, endsOn: '2026-11-10' });
    expect(promotionStatus(lastDay, new Date('2026-11-10T21:59:00Z'))).toBe('active');
    expect(promotionStatus(lastDay, new Date('2026-11-10T22:00:00Z'))).toBe('ended');
  });

  it('does not apply or show a paused or a not yet started promotion', () => {
    const paused = promotion({ percent: 10, isPaused: true });
    expect(promotionStatus(paused, MORNING)).toBe('paused');
    expect(calculate([line('prod-4', 5)], [paused]).promotionLines).toHaveLength(0);
    expect(visiblePromotions([paused], 'store-3', MORNING)).toHaveLength(0);

    const later = promotion({ percent: 10, startsOn: '2026-11-11' });
    expect(promotionStatus(later, MORNING)).toBe('scheduled');
    expect(calculate([line('prod-4', 5)], [later]).promotionLines).toHaveLength(0);
    expect(visiblePromotions([later], 'store-3', MORNING)).toHaveLength(0);
  });

  it('keeps a promotion outside its hours on the shop page, but not on the card or in the order', () => {
    const morning = promotion({ percent: 10, hoursTo: '09:00' });
    expect(visiblePromotions([morning], 'store-3', MORNING)).toHaveLength(1);
    expect(bestPromotion([morning], 'store-3', MORNING)).toBeUndefined();
    expect(calculate([line('prod-4', 5)], [morning]).promotionLines).toHaveLength(0);
  });
});

describe('gift lifecycle', () => {
  const gift = promotion({
    type: 'gift',
    giftProductId: 'prod-6',
    productIds: ['prod-4', 'prod-5'],
    hoursTo: '11:30',
  });

  it('appears with a qualifying item and disappears when it is removed', () => {
    expect(calculate([line('prod-4')], [gift]).promotionLines).toHaveLength(1);
    expect(calculate([line('prod-6')], [gift]).promotionLines).toHaveLength(0);
  });

  it('appears before 11:30 and disappears after', () => {
    expect(calculate([line('prod-4')], [gift], 0, new Date('2026-11-10T09:00:00Z')).promotionLines).toHaveLength(1);
    expect(calculate([line('prod-4')], [gift], 0, new Date('2026-11-10T09:31:00Z')).promotionLines).toHaveLength(0);
  });

  it('disappears when the basket drops under its threshold', () => {
    const withMinimum = { ...gift, minSubtotal: 40 };
    expect(calculate([line('prod-4', 3)], [withMinimum]).promotionLines).toHaveLength(1);
    const below = calculate([line('prod-4')], [withMinimum]);
    expect(below.promotionLines).toHaveLength(0);
    expect(below.stores[0].hints[0].missing).toBe(24);
  });
});

describe('several shops and several promotions', () => {
  it('applies each shop promotion only to that shop goods', () => {
    const order = calculate([line('prod-4', 10), line('prod-11')], [promotion({ percent: 10 })]);
    expect(order.itemsSubtotal).toBe(320);
    expect(order.promotionLines[0].saving).toBe(16);
    expect(order.promotionLines[0].storeId).toBe('store-3');
    expect(order.total).toBe(320 - 16 + 18);
  });

  it('applies promotions of both shops side by side', () => {
    const order = calculate(
      [line('prod-4', 10), line('prod-11')],
      [promotion({ id: 'a', percent: 10 }), promotion({ id: 'b', storeId: 'store-4', type: 'freeDelivery' })]
    );
    expect(order.promotionLines.map((entry) => entry.storeId).sort()).toEqual(['store-3', 'store-4']);
    expect(order.total).toBe(320 - 16);
  });

  it('applies only the best of a shop discounts, but free delivery and gifts alongside', () => {
    const order = calculate(
      [line('prod-11')],
      [
        promotion({ id: 'percent', storeId: 'store-4', percent: 10 }),
        promotion({ id: 'amount', storeId: 'store-4', type: 'amount', amount: 40, minSubtotal: 100 }),
        promotion({ id: 'free', storeId: 'store-4', type: 'freeDelivery' }),
      ]
    );
    expect(order.promotionLines.map((entry) => entry.promotionId)).toEqual(['amount', 'free']);
    expect(order.total).toBe(160 - 40);
  });

  it('has no promotions for an empty basket', () => {
    expect(summarizeOrderStores([], 'store-4', [promotion({ percent: 10 })], MORNING)).toEqual([]);
  });
});

describe('promo code against promotions', () => {
  it('uses the promotion when it is worth more, and does not add the code', () => {
    const order = calculate([line('prod-11', 2)], [promotion({ storeId: 'store-4', percent: 50 })], 25);
    expect(order.discountChoice).toBe('promotions');
    expect(order.promoCodeDiscount).toBe(0);
    expect(order.promotionLines[0].saving).toBe(160);
    expect(order.total).toBe(320 - 160 + 18);
    expect(order.promoCodeValue).toBe(25);
    expect(order.promotionsValue).toBe(160);
  });

  it('uses the code when it is worth more, and drops the promotion entirely', () => {
    const order = calculate([line('prod-11')], [promotion({ storeId: 'store-4', percent: 5 })], 25);
    expect(order.discountChoice).toBe('promoCode');
    expect(order.promoCodeDiscount).toBe(25);
    expect(order.promotionLines).toHaveLength(0);
    expect(order.total).toBe(160 - 25 + 18);
    expect(order.promotionsValue).toBe(8);
  });

  it('counts the fee saved and a gift price as what promotions are worth', () => {
    // 20 ₪ gift against a 25 ₪ code: the code wins and the gift goes.
    const gift = promotion({ type: 'gift', giftProductId: 'prod-6' });
    const withGift = calculate([line('prod-4', 5)], [gift], 25);
    expect(withGift.discountChoice).toBe('promoCode');
    expect(withGift.promotionLines).toHaveLength(0);

    // 18 ₪ of delivery against a 15 ₪ code: free delivery wins.
    const free = promotion({ storeId: 'store-4', type: 'freeDelivery' });
    const withFree = calculate([line('prod-11')], [free], 15);
    expect(withFree.discountChoice).toBe('promotions');
    expect(withFree.total).toBe(160);
  });

  it('leaves a tie with the promotions', () => {
    const order = calculate([line('prod-11')], [promotion({ storeId: 'store-4', type: 'amount', amount: 25, minSubtotal: 100 })], 25);
    expect(order.discountChoice).toBe('promotions');
    expect(order.total).toBe(160 - 25 + 18);
  });

  it('hands the regular prices back when the code wins over a new price', () => {
    const price = promotion({ storeId: 'store-2', type: 'productPrice', productId: 'prod-8', newPrice: 130 });
    const order = calculate([line('prod-8')], [price], 25);
    expect(order.discountChoice).toBe('promoCode');
    expect(order.unitPrices['prod-8']).toBe(139);
  });

  it('applies the code alone when no promotion is running', () => {
    const order = calculate([line('prod-4', 5)], [], 25);
    expect(order.discountChoice).toBe('promoCode');
    expect(order.total).toBe(55);
  });

  it('never makes a code worth more than the goods', () => {
    const order = calculate([line('prod-4')], [], 25);
    expect(order.promoCodeDiscount).toBe(16);
    expect(order.total).toBe(0);
  });
});

describe('promotion form rules', () => {
  const storeProducts = MOCK_PRODUCTS.filter((product) => product.storeId === 'store-3');
  const errorsOf = (overrides: Partial<Promotion>) => validatePromotion(promotion({ percent: 10, ...overrides }), storeProducts);

  it('accepts a valid promotion', () => {
    expect(errorsOf({})).toEqual({});
  });

  it('needs a title in at least one language', () => {
    expect(errorsOf({ title: {} }).title).toBe('titleRequired');
    expect(errorsOf({ title: { he: '  ' } }).title).toBe('titleRequired');
    expect(errorsOf({ title: { he: 'מבצע' } }).title).toBeUndefined();
  });

  it('limits a percent discount to 1-90', () => {
    expect(errorsOf({ percent: 0 }).percent).toBe('percentRange');
    expect(errorsOf({ percent: 91 }).percent).toBe('percentRange');
    expect(errorsOf({ percent: undefined }).percent).toBe('percentRange');
    expect(errorsOf({ percent: 1 }).percent).toBeUndefined();
    expect(errorsOf({ percent: 90 }).percent).toBeUndefined();
  });

  it('keeps a fixed discount above 0 and below the threshold', () => {
    expect(errorsOf({ type: 'amount', amount: 0, minSubtotal: 100 }).amount).toBe('amountRange');
    expect(errorsOf({ type: 'amount', amount: 100, minSubtotal: 100 }).amount).toBe('amountRange');
    expect(errorsOf({ type: 'amount', amount: 10, minSubtotal: 0 }).amount).toBe('amountRange');
    expect(errorsOf({ type: 'amount', amount: 99, minSubtotal: 100 }).amount).toBeUndefined();
  });

  it('allows a gift only from this shop', () => {
    expect(errorsOf({ type: 'gift' }).giftProductId).toBe('giftRequired');
    expect(errorsOf({ type: 'gift', giftProductId: 'prod-11' }).giftProductId).toBe('giftForeign');
    expect(errorsOf({ type: 'gift', giftProductId: 'prod-6' }).giftProductId).toBeUndefined();
  });

  it('keeps a new price below the regular one', () => {
    expect(errorsOf({ type: 'productPrice' }).productId).toBe('productRequired');
    expect(errorsOf({ type: 'productPrice', productId: 'prod-4', newPrice: 16 }).newPrice).toBe('newPriceRange');
    expect(errorsOf({ type: 'productPrice', productId: 'prod-4', newPrice: 0 }).newPrice).toBe('newPriceRange');
    expect(errorsOf({ type: 'productPrice', productId: 'prod-4', newPrice: 12 }).newPrice).toBeUndefined();
  });

  it('needs the end date after the start date, and the end time after the start time', () => {
    expect(errorsOf({ endsOn: '2026-11-01' }).endsOn).toBe('endBeforeStart');
    expect(errorsOf({ endsOn: '' }).endsOn).toBe('endRequired');
    expect(errorsOf({ startsOn: '' }).startsOn).toBe('startRequired');
    expect(errorsOf({ hoursFrom: '12:00', hoursTo: '11:00' }).hoursTo).toBe('hoursOrder');
  });

  it('has a message for every error in every language', () => {
    (['ru', 'en', 'he'] as const).forEach((language) => {
      Object.values(translations[language].promotions.errors).forEach((message) => expect(message).toBeTruthy());
    });
  });
});

describe('promotion display helpers', () => {
  it('shows a filled language when the requested one is empty', () => {
    expect(localizedText({ he: 'מבצע' }, 'ru')).toBe('מבצע');
    expect(localizedText({ ru: 'Акция', en: ' ' }, 'en')).toBe('Акция');
    expect(localizedText({ en: 'Deal' }, 'en')).toBe('Deal');
  });

  it('picks money off first for the shop card', () => {
    const list = [
      promotion({ id: 'gift', type: 'gift', giftProductId: 'prod-6' }),
      promotion({ id: 'small', percent: 5 }),
      promotion({ id: 'big', percent: 20 }),
    ];
    expect(bestPromotion(list, 'store-3', MORNING)?.id).toBe('big');
  });

  it('finds a running new price for a product', () => {
    const product = line('prod-8').product;
    const price = promotion({ storeId: 'store-2', type: 'productPrice', productId: 'prod-8', newPrice: 119 });
    expect(productPricePromotion([price], product, MORNING)?.newPrice).toBe(119);
    expect(productPricePromotion([{ ...price, isPaused: true }], product, MORNING)).toBeUndefined();
  });
});

describe('demo data', () => {
  const demo = buildDemoPromotions(MORNING);

  it('covers every promotion type and is running from the first visit', () => {
    expect(new Set(demo.map((entry) => entry.type)).size).toBe(5);
    demo.forEach((entry) => expect(promotionStatus(entry, MORNING)).toBe('active'));
    demo.forEach((entry) => expect(validatePromotion(entry, MOCK_PRODUCTS.filter((p) => p.storeId === entry.storeId))).toEqual({}));
  });

  it('has real rules behind the promotions the shops advertise', () => {
    const levinsky = demo.find((entry) => entry.storeId === 'store-3')!;
    expect(levinsky.type).toBe('gift');
    expect(levinsky.giftProductId).toBe('prod-6');
    expect(levinsky.hoursTo).toBe('11:30');
    const carmel = demo.find((entry) => entry.storeId === 'store-1')!;
    expect(carmel.type).toBe('freeDelivery');
    expect(carmel.minSubtotal).toBe(80);
    expect(MOCK_STORES.find((store) => store.id === 'store-1')!.deliveryFee).toBeGreaterThan(0);
  });

  it('leaves no invented promos, sale prices or popularity marks in the catalog', () => {
    const catalog = JSON.stringify([...MOCK_PRODUCTS, ...MOCK_STORES]);
    ['oldPrice', 'isBestSeller', 'promoText', 'isPromo', '"badge"', 'Хит', 'Топ выбор', 'Best Seller'].forEach((text) =>
      expect(catalog).not.toContain(text)
    );
  });

  it('offers only the agreed labels, and none that claim popularity', () => {
    expect([...PRODUCT_LABELS]).toEqual(['new', 'hot', 'storePick', 'eco', 'seasonal', 'limited']);
    expect(translations.ru.promotions.labels.storePick).toBe('Выбор лавки');
    expect(translations.ru.promotions.labels.hot).toBe('С пылу с жару');
    const labels = JSON.stringify([
      translations.ru.promotions.labels,
      translations.en.promotions.labels,
      translations.he.promotions.labels,
    ]);
    ['Хит', 'популярн', 'покупателей', 'Best', 'Popular'].forEach((text) => expect(labels).not.toContain(text));
    Object.values(DEMO_PRODUCT_LABELS).flat().forEach((label) => expect(PRODUCT_LABELS).toContain(label));
  });
});
