import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEMO_PRODUCT_LABELS,
  PRODUCT_LABELS,
  Promotion,
  ProductLabel,
  buildDemoPromotions,
} from '../data/promotions';

const PROMOTIONS_KEY = 'qiventra_promotions';
const LABELS_KEY = 'qiventra_product_labels';
const CLOCK_TICK_MS = 30_000;

interface PromotionsContextType {
  promotions: Promotion[];
  /** The clock promotions are judged by; ticks on its own, so a promotion ends without a reload. */
  now: Date;
  savePromotion: (promotion: Promotion) => void;
  deletePromotion: (id: string) => void;
  setPromotionPaused: (id: string, isPaused: boolean) => void;
  resetPromotions: () => void;
  productLabels: Record<string, ProductLabel[]>;
  labelsFor: (productId: string) => ProductLabel[];
  toggleProductLabel: (productId: string, label: ProductLabel) => void;
  resetProductLabels: () => void;
}

const PromotionsContext = createContext<PromotionsContextType | undefined>(undefined);

const isPromotion = (value: unknown): value is Promotion => {
  const candidate = value as Promotion | null;
  return Boolean(
    candidate &&
      typeof candidate.id === 'string' &&
      typeof candidate.storeId === 'string' &&
      typeof candidate.type === 'string' &&
      typeof candidate.startsOn === 'string' &&
      typeof candidate.endsOn === 'string' &&
      candidate.title &&
      Array.isArray(candidate.productIds) &&
      Array.isArray(candidate.categories)
  );
};

const readPromotions = (): Promotion[] | null => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PROMOTIONS_KEY) ?? 'null');
    return Array.isArray(parsed) ? parsed.filter(isPromotion) : null;
  } catch {
    return null;
  }
};

const readLabels = (): Record<string, ProductLabel[]> | null => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(LABELS_KEY) ?? 'null');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).map(([id, labels]) => [
        id,
        (Array.isArray(labels) ? labels : []).filter((label) => PRODUCT_LABELS.includes(label)),
      ])
    );
  } catch {
    return null;
  }
};

const write = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Without storage the changes last until the page is reloaded.
  }
};

export function PromotionsProvider({ children }: { children: ReactNode }) {
  const [now, setNow] = useState(() => new Date());
  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    if (typeof window === 'undefined') return buildDemoPromotions(new Date());
    return readPromotions() ?? buildDemoPromotions(new Date());
  });
  const [productLabels, setProductLabels] = useState<Record<string, ProductLabel[]>>(() => {
    if (typeof window === 'undefined') return DEMO_PRODUCT_LABELS;
    return readLabels() ?? DEMO_PRODUCT_LABELS;
  });

  useEffect(() => write(PROMOTIONS_KEY, promotions), [promotions]);
  useEffect(() => write(LABELS_KEY, productLabels), [productLabels]);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const clock = window.setInterval(tick, CLOCK_TICK_MS);
    document.addEventListener('visibilitychange', tick);

    // Another tab of the same browser changed them, say the seller workspace.
    const handleStorage = (event: StorageEvent) => {
      if (event.key === PROMOTIONS_KEY) setPromotions(readPromotions() ?? buildDemoPromotions(new Date()));
      if (event.key === LABELS_KEY) setProductLabels(readLabels() ?? DEMO_PRODUCT_LABELS);
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.clearInterval(clock);
      document.removeEventListener('visibilitychange', tick);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const savePromotion = useCallback((promotion: Promotion) => {
    setPromotions((prev) =>
      prev.some((existing) => existing.id === promotion.id)
        ? prev.map((existing) => (existing.id === promotion.id ? promotion : existing))
        : [...prev, promotion]
    );
    setNow(new Date());
  }, []);

  const deletePromotion = useCallback((id: string) => {
    setPromotions((prev) => prev.filter((promotion) => promotion.id !== id));
  }, []);

  const setPromotionPaused = useCallback((id: string, isPaused: boolean) => {
    setPromotions((prev) => prev.map((promotion) => (promotion.id === id ? { ...promotion, isPaused } : promotion)));
  }, []);

  const resetPromotions = useCallback(() => setPromotions(buildDemoPromotions(new Date())), []);

  const labelsFor = useCallback((productId: string) => productLabels[productId] ?? [], [productLabels]);

  const toggleProductLabel = useCallback((productId: string, label: ProductLabel) => {
    setProductLabels((prev) => {
      const current = prev[productId] ?? [];
      return {
        ...prev,
        [productId]: current.includes(label) ? current.filter((entry) => entry !== label) : [...current, label],
      };
    });
  }, []);

  const resetProductLabels = useCallback(() => setProductLabels(DEMO_PRODUCT_LABELS), []);

  const value = useMemo(
    () => ({
      promotions,
      now,
      savePromotion,
      deletePromotion,
      setPromotionPaused,
      resetPromotions,
      productLabels,
      labelsFor,
      toggleProductLabel,
      resetProductLabels,
    }),
    [
      promotions,
      now,
      savePromotion,
      deletePromotion,
      setPromotionPaused,
      resetPromotions,
      productLabels,
      labelsFor,
      toggleProductLabel,
      resetProductLabels,
    ]
  );

  return <PromotionsContext.Provider value={value}>{children}</PromotionsContext.Provider>;
}

export function usePromotions() {
  const context = useContext(PromotionsContext);
  if (!context) {
    throw new Error('usePromotions must be used within a PromotionsProvider');
  }
  return context;
}
