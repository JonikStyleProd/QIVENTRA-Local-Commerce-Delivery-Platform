import { Language } from '../i18n/translations';
import { Product } from '../types';

/** Shop promotions: the data model, their status over time, and the seller form's validation. */

export type PromotionType = 'percent' | 'amount' | 'freeDelivery' | 'gift' | 'productPrice';
export type PromotionText = Partial<Record<Language, string>>;

export interface Promotion {
  id: string;
  storeId: string;
  /** The seller fills in at least one language; the others fall back to a filled one. */
  title: PromotionText;
  description: PromotionText;
  type: PromotionType;
  /** Discount in %, for type "percent". */
  percent?: number;
  /** Discount in ₪, for type "amount". */
  amount?: number;
  /** The shop's product given for 0 ₪, for type "gift". */
  giftProductId?: string;
  /** The product and its new price, for type "productPrice". */
  productId?: string;
  newPrice?: number;
  /** The shop's goods at regular prices must reach this sum. 0 means no threshold. */
  minSubtotal: number;
  /** Goods the promotion is about. Both empty means all of the shop's goods. */
  productIds: string[];
  categories: string[];
  /** Inclusive dates, YYYY-MM-DD, in Israel time. */
  startsOn: string;
  endsOn: string;
  /** Optional daily hours, HH:mm, in Israel time. The end is exclusive. */
  hoursFrom?: string;
  hoursTo?: string;
  isPaused: boolean;
}

/** "scheduled" has not started yet, so like "paused" and "ended" it stays hidden from buyers. */
export type PromotionStatus = 'active' | 'scheduled' | 'paused' | 'ended';

export const PROMOTION_TIME_ZONE = 'Asia/Jerusalem';

const clockFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: PROMOTION_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/** The date and time of day in Israel, whatever the device's own time zone is. */
export const israelClock = (now: Date): { date: string; minutes: number } => {
  const parts = Object.fromEntries(clockFormat.formatToParts(now).map((part) => [part.type, part.value]));
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
};

const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const promotionStatus = (promotion: Promotion, now: Date): PromotionStatus => {
  const { date } = israelClock(now);
  if (date > promotion.endsOn) return 'ended';
  if (promotion.isPaused) return 'paused';
  if (date < promotion.startsOn) return 'scheduled';
  return 'active';
};

export const isWithinHours = (promotion: Promotion, now: Date): boolean => {
  const { minutes } = israelClock(now);
  const from = promotion.hoursFrom ? toMinutes(promotion.hoursFrom) : 0;
  const to = promotion.hoursTo ? toMinutes(promotion.hoursTo) : 24 * 60;
  return minutes >= from && minutes < to;
};

/** Applies to an order right now: active, and inside its hours if it has any. */
export const isLive = (promotion: Promotion, now: Date): boolean =>
  promotionStatus(promotion, now) === 'active' && isWithinHours(promotion, now);

/** What a buyer may see on the shop page. A promotion outside today's hours stays, marked as such. */
export const visiblePromotions = (promotions: Promotion[], storeId: string, now: Date): Promotion[] =>
  promotions.filter((promotion) => promotion.storeId === storeId && promotionStatus(promotion, now) === 'active');

const TYPE_RANK: Record<PromotionType, number> = { percent: 4, amount: 3, freeDelivery: 2, gift: 1, productPrice: 0 };

/** The one promotion for a shop card: money off first, the bigger value first within a type. */
export const bestPromotion = (promotions: Promotion[], storeId: string, now: Date): Promotion | undefined =>
  promotions
    .filter((promotion) => promotion.storeId === storeId && isLive(promotion, now))
    .sort(
      (a, b) =>
        TYPE_RANK[b.type] - TYPE_RANK[a.type] ||
        (b.percent ?? b.amount ?? 0) - (a.percent ?? a.amount ?? 0)
    )[0];

/** The live "new price" promotion on a product, if there is one. */
export const productPricePromotion = (promotions: Promotion[], product: Product, now: Date): Promotion | undefined =>
  promotions
    .filter(
      (promotion) =>
        promotion.type === 'productPrice' &&
        promotion.productId === product.id &&
        (promotion.newPrice ?? product.price) < product.price &&
        isLive(promotion, now)
    )
    .sort((a, b) => (a.newPrice ?? 0) - (b.newPrice ?? 0))[0];

/** The text in the requested language, or else any language the seller did fill in. */
export const localizedText = (text: PromotionText, language: Language): string =>
  text[language]?.trim() || text.ru?.trim() || text.en?.trim() || text.he?.trim() || '';

/* ------------------------------ Seller form validation ------------------------------ */

export type PromotionField =
  | 'title'
  | 'percent'
  | 'amount'
  | 'giftProductId'
  | 'productId'
  | 'newPrice'
  | 'minSubtotal'
  | 'startsOn'
  | 'endsOn'
  | 'hoursTo';

export type PromotionError =
  | 'titleRequired'
  | 'percentRange'
  | 'amountRange'
  | 'giftRequired'
  | 'giftForeign'
  | 'productRequired'
  | 'newPriceRange'
  | 'minInvalid'
  | 'startRequired'
  | 'endRequired'
  | 'endBeforeStart'
  | 'hoursOrder';

/** Checks a draft against the rules of the seller form. An empty result means it can be saved. */
export const validatePromotion = (
  draft: Promotion,
  storeProducts: Product[]
): Partial<Record<PromotionField, PromotionError>> => {
  const errors: Partial<Record<PromotionField, PromotionError>> = {};
  const isNumber = (value: number | undefined): value is number => typeof value === 'number' && Number.isFinite(value);

  if (!Object.values(draft.title).some((text) => text?.trim())) errors.title = 'titleRequired';
  if (!isNumber(draft.minSubtotal) || draft.minSubtotal < 0) errors.minSubtotal = 'minInvalid';

  if (draft.type === 'percent' && (!isNumber(draft.percent) || draft.percent < 1 || draft.percent > 90)) {
    errors.percent = 'percentRange';
  }
  if (draft.type === 'amount' && (!isNumber(draft.amount) || draft.amount <= 0 || draft.amount >= draft.minSubtotal)) {
    errors.amount = 'amountRange';
  }
  if (draft.type === 'gift') {
    if (!draft.giftProductId) errors.giftProductId = 'giftRequired';
    else if (!storeProducts.some((product) => product.id === draft.giftProductId)) errors.giftProductId = 'giftForeign';
  }
  if (draft.type === 'productPrice') {
    const product = storeProducts.find((candidate) => candidate.id === draft.productId);
    if (!product) errors.productId = 'productRequired';
    else if (!isNumber(draft.newPrice) || draft.newPrice <= 0 || draft.newPrice >= product.price) {
      errors.newPrice = 'newPriceRange';
    }
  }

  if (!draft.startsOn) errors.startsOn = 'startRequired';
  if (!draft.endsOn) errors.endsOn = 'endRequired';
  else if (draft.startsOn && draft.endsOn <= draft.startsOn) errors.endsOn = 'endBeforeStart';

  if (draft.hoursFrom && draft.hoursTo && toMinutes(draft.hoursTo) <= toMinutes(draft.hoursFrom)) {
    errors.hoursTo = 'hoursOrder';
  }
  return errors;
};

/* ------------------------------ Demo data ------------------------------ */

const shiftDate = (date: string, days: number): string => {
  const shifted = new Date(`${date}T12:00:00Z`);
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return shifted.toISOString().slice(0, 10);
};

/** Dates count from the first visit, so the demo promotions are running whenever it is opened. */
export const buildDemoPromotions = (now: Date): Promotion[] => {
  const today = israelClock(now).date;
  const period = { startsOn: shiftDate(today, -7), endsOn: shiftDate(today, 90), isPaused: false };

  return [
    {
      id: 'demo-levinsky-gift',
      storeId: 'store-3',
      type: 'gift',
      giftProductId: 'prod-6',
      minSubtotal: 0,
      productIds: ['prod-4', 'prod-5'],
      categories: [],
      hoursTo: '11:30',
      title: {
        ru: 'Колдбрю в подарок к выпечке',
        en: 'Free cold brew with pastries',
        he: 'קולד ברו במתנה עם מאפה',
      },
      description: {
        ru: 'К любой хале или круассану, каждое утро.',
        en: 'With any challah or croissant, every morning.',
        he: 'עם כל חלה או קרואסון, בכל בוקר.',
      },
      ...period,
    },
    {
      id: 'demo-carmel-delivery',
      storeId: 'store-1',
      type: 'freeDelivery',
      minSubtotal: 80,
      productIds: [],
      categories: [],
      title: {
        ru: 'Бесплатная доставка от 80 ₪',
        en: 'Free delivery from 80 ₪',
        he: 'משלוח חינם מ-80 ₪',
      },
      description: {
        ru: 'На любые товары с рынка.',
        en: 'On anything from the market.',
        he: 'על כל מוצר מהשוק.',
      },
      ...period,
    },
    {
      id: 'demo-sarona-price',
      storeId: 'store-2',
      type: 'productPrice',
      productId: 'prod-8',
      newPrice: 119,
      minSubtotal: 0,
      productIds: [],
      categories: [],
      title: {
        ru: 'Зарядка GaN по новой цене',
        en: 'GaN charger at a new price',
        he: 'מטען GaN במחיר חדש',
      },
      description: {
        ru: 'Цена действует для всех заказов.',
        en: 'The price applies to every order.',
        he: 'המחיר תקף לכל הזמנה.',
      },
      ...period,
    },
    {
      id: 'demo-jaffa-percent',
      storeId: 'store-4',
      type: 'percent',
      percent: 10,
      minSubtotal: 150,
      productIds: [],
      categories: [],
      title: {
        ru: 'Скидка 10% на букеты',
        en: '10% off bouquets',
        he: '10% הנחה על זרים',
      },
      description: {
        ru: 'При заказе от 150 ₪.',
        en: 'On orders from 150 ₪.',
        he: 'בהזמנה מ-150 ₪.',
      },
      ...period,
    },
    {
      id: 'demo-galilee-amount',
      storeId: 'store-6',
      type: 'amount',
      amount: 15,
      minSubtotal: 120,
      productIds: [],
      categories: [],
      title: {
        ru: 'Минус 15 ₪ на заказ',
        en: '15 ₪ off your order',
        he: '15 ₪ הנחה על ההזמנה',
      },
      description: {
        ru: 'При заказе от 120 ₪.',
        en: 'On orders from 120 ₪.',
        he: 'בהזמנה מ-120 ₪.',
      },
      ...period,
    },
  ];
};

/* ------------------------------ Promo codes ------------------------------ */

/** A code the buyer types in. It competes with the shop promotions inside calculateOrder. */
export interface PromoCode {
  code: string;
  /** Discount in ₪. */
  amount: number;
  /** The goods at regular prices must reach this sum. */
  minSubtotal: number;
}

export const PROMO_CODES: PromoCode[] = [{ code: 'START20', amount: 20, minSubtotal: 80 }];

export const findPromoCode = (raw: string | null | undefined): PromoCode | undefined => {
  const code = raw?.trim().toUpperCase();
  return code ? PROMO_CODES.find((candidate) => candidate.code === code) : undefined;
};

/* ------------------------------ Product labels ------------------------------ */

/** The fixed list a seller picks from. Nothing here claims sales numbers or buyers' opinions. */
export const PRODUCT_LABELS = ['new', 'hot', 'storePick', 'eco', 'seasonal', 'limited', 'kosher', 'vegan'] as const;
export type ProductLabel = (typeof PRODUCT_LABELS)[number];

/** Facts about the product rather than promotion. They look different and can be filtered by. */
export const FACT_LABELS: ProductLabel[] = ['eco', 'kosher', 'vegan'];
export const isFactLabel = (label: ProductLabel): boolean => FACT_LABELS.includes(label);

export const DEMO_PRODUCT_LABELS: Record<string, ProductLabel[]> = {
  'prod-3': ['eco'],
  'prod-4': ['hot'],
  'prod-5': ['storePick'],
  'prod-9': ['eco'],
  // The only product that carried "Кошер & Веган" in the earlier data.
  'prod-12': ['kosher', 'vegan'],
};

/** Products carrying all the requested labels. No labels requested means all of them. */
export const filterProductsByLabels = <T extends { id: string }>(
  products: T[],
  required: ProductLabel[],
  labelsFor: (productId: string) => ProductLabel[]
): T[] =>
  required.length === 0
    ? products
    : products.filter((product) => {
        const labels = labelsFor(product.id);
        return required.every((label) => labels.includes(label));
      });
