import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { AppRoute, CartItem, Product, Store, Order, UserProfile, LocalizedText } from '../types';
import { MOCK_STORES, MOCK_PRODUCTS, MOCK_ACTIVE_ORDER, MOCK_USER } from '../data/mockData';
import { DeliveryWindow } from '../data/deliverySlots';
import { collageTranslations } from '../i18n/collage';
import { OrderCalculation, OrderStoreLine, calculateOrder } from '../data/cartRules';
import { useLanguage } from './LanguageContext';
import { PromotionsProvider, usePromotions } from './PromotionsContext';

interface NavigationOptions {
  storeId?: string;
  categorySlug?: string;
  searchQuery?: string;
  orderId?: string;
}

interface AppContextType {
  currentRoute: AppRoute;
  navigateTo: (route: AppRoute, options?: NavigationOptions) => void;
  selectedStoreId: string | null;
  setSelectedStoreId: (id: string | null) => void;
  selectedStore: Store | undefined;
  /** The customer chose this shop in the picker, so it joins the order even with no goods yet. */
  pickStore: (id: string) => void;
  /** Shops in the current order, with each one's fee and distance from its minimum. */
  orderStores: OrderStoreLine[];
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentAddress: string;
  setCurrentAddress: (address: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;
  /** The value of the promo code entered on the cart page. Whether it applies is up to `order`. */
  cartDiscount: number;
  setCartDiscount: (amount: number) => void;
  /** The whole calculation: promotions, the promo code, fees and the total. */
  order: OrderCalculation;
  deliveryFee: number;
  totalAmount: number;

  // Modals & Drawers
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAddressModalOpen: boolean;
  setIsAddressModalOpen: (open: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  chatParticipant: {
    type: 'store' | 'courier';
    id: string;
    name: string;
    avatarUrl?: string;
    orderId?: string;
    storeId?: string;
  } | null;
  openChatWithParticipant: (participant?: {
    type: 'store' | 'courier';
    id: string;
    name: string;
    avatarUrl?: string;
    orderId?: string;
    storeId?: string;
  }) => void;

  // Domain state
  currentUser: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  /** The order the tracker shows: the one asked for, else the newest placed, else the demo order. */
  activeOrder: Order;
  /** Every order still tracked, newest placed first, the demo order last. */
  trackedOrders: Order[];
  advanceOrderSimulation: () => void;
  /** Turns the basket into an order with status "received", then empties the basket. */
  placeOrder: (details: { deliveryWindow: DeliveryWindow; note: string }) => Order;
  updateOrder: (id: string, changes: Partial<Order>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function AppStateProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const { promotions, now } = usePromotions();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('home');
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>('store-3');
  const [pickedStoreId, setPickedStoreId] = useState<string | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USER);
  const [demoOrder, setDemoOrder] = useState<Order>(MOCK_ACTIVE_ORDER);
  const [focusedOrderId, setFocusedOrderId] = useState<string | null>(null);
  const [placedOrders, setPlacedOrders] = useState<Order[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('qiventra_orders') : null;
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed)
        ? parsed.filter((order) => order && typeof order.id === 'string' && Array.isArray(order.items))
        : [];
    } catch {
      return [];
    }
  });

  const trackedOrders = useMemo(() => [...placedOrders, demoOrder], [placedOrders, demoOrder]);
  const activeOrder = trackedOrders.find((order) => order.id === focusedOrderId) ?? trackedOrders[0];

  // Address localization and selection state
  const [selectedAddressId, setSelectedAddressId] = useState<string>('addr-1');
  const [customAddressMap, setCustomAddressMap] = useState<LocalizedText | null>(null);

  const currentAddress = useMemo(() => {
    if (customAddressMap) {
      return customAddressMap[language] || customAddressMap.ru || customAddressMap.en;
    }
    const saved = currentUser.savedAddresses.find((a) => a.id === selectedAddressId);
    if (saved) {
      return saved.addresses?.[language] || saved.address;
    }
    return (
      currentUser.savedAddresses[0]?.addresses?.[language] ||
      currentUser.savedAddresses[0]?.address ||
      'Tel Aviv, 42 Rothschild Blvd, Apt 14'
    );
  }, [customAddressMap, currentUser.savedAddresses, selectedAddressId, language]);

  // The same address in every language, so a saved order keeps following the language switch.
  const currentAddressTexts = useMemo((): LocalizedText | undefined => {
    if (customAddressMap) return customAddressMap;
    const saved = currentUser.savedAddresses.find((a) => a.id === selectedAddressId);
    return saved?.addresses;
  }, [customAddressMap, currentUser.savedAddresses, selectedAddressId]);

  const setCurrentAddress = useCallback(
    (addrOrId: string) => {
      // 1. Check if it's an address id
      const foundById = currentUser.savedAddresses.find((a) => a.id === addrOrId);
      if (foundById) {
        setSelectedAddressId(foundById.id);
        setCustomAddressMap(null);
        return;
      }

      // 2. Check if it matches any localized address string in saved addresses
      const foundByText = currentUser.savedAddresses.find(
        (a) =>
          a.address === addrOrId ||
          a.addresses?.ru === addrOrId ||
          a.addresses?.en === addrOrId ||
          a.addresses?.he === addrOrId
      );
      if (foundByText) {
        setSelectedAddressId(foundByText.id);
        setCustomAddressMap(null);
        return;
      }

      // 3. Custom address entered by the user
      setCustomAddressMap({
        ru: addrOrId,
        en: addrOrId,
        he: addrOrId,
      });
    },
    [currentUser.savedAddresses]
  );

  // Initial cart with localStorage persistence and defensive corrupt state recovery
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('qiventra_cart');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const valid = parsed.filter(
              (item) =>
                item &&
                item.product &&
                typeof item.product.id === 'string' &&
                typeof item.product.price === 'number' &&
                typeof item.quantity === 'number' &&
                item.quantity > 0
            );
            // An emptied basket stays empty, and saved items pick up current catalog data.
            return valid.map((item) => ({
              ...item,
              product: MOCK_PRODUCTS.find((p) => p.id === item.product.id) ?? item.product,
            }));
          }
        }
      }
    } catch {
      // ignore corrupted state and fallback
    }
    // First visit starts with one shop's order that meets its minimum, as in the design.
    return ['prod-4', 'prod-5', 'prod-6'].flatMap((id, index) => {
      const product = MOCK_PRODUCTS.find((p) => p.id === id);
      return product ? [{ product, quantity: index === 1 ? 2 : 1 }] : [];
    });
  });

  const [promoDiscount, setCartDiscount] = useState(0);
  const cartDiscount = cart.length > 0 ? promoDiscount : 0;

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatParticipant, setChatParticipant] = useState<{
    type: 'store' | 'courier';
    id: string;
    name: string;
    avatarUrl?: string;
    orderId?: string;
    storeId?: string;
  } | null>(null);

  const openChatWithParticipant = useCallback((participant?: {
    type: 'store' | 'courier';
    id: string;
    name: string;
    avatarUrl?: string;
    orderId?: string;
    storeId?: string;
  }) => {
    setChatParticipant(participant || null);
    setIsChatOpen(true);
  }, []);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('qiventra_cart', JSON.stringify(cart));
      }
    } catch {
      // ignore quota or serialization errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('qiventra_orders', JSON.stringify(placedOrders));
      }
    } catch {
      // ignore quota or serialization errors
    }
  }, [placedOrders]);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  };

  const selectedStore = useMemo(() => {
    return MOCK_STORES.find((s) => s.id === selectedStoreId) || MOCK_STORES[0];
  }, [selectedStoreId]);

  const pickStore = useCallback((id: string) => {
    setSelectedStoreId(id);
    setPickedStoreId(id);
  }, []);

  const navigateTo = (route: AppRoute, options?: NavigationOptions) => {
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    if (options?.storeId) setSelectedStoreId(options.storeId);
    if (options?.categorySlug !== undefined) setSelectedCategorySlug(options.categorySlug);
    if (options?.searchQuery !== undefined) setSearchQuery(options.searchQuery);
    if (options?.orderId) setFocusedOrderId(options.orderId);

    setCurrentRoute(route);
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCartDiscount(0);
  };

  const cartTotalCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  const order = useMemo(
    () => calculateOrder({ cart, pickedStoreId, promotions, promoCodeAmount: cartDiscount, now }),
    [cart, pickedStoreId, promotions, cartDiscount, now]
  );
  const orderStores = order.stores;
  const deliveryFee = order.deliveryFee;
  const totalAmount = order.total;

  // Delivery simulation stepper for the live tracker demo
  const advanceOrderSimulation = () => {
    const statuses: Order['status'][] = ['received', 'preparing', 'courier_assigned', 'on_the_way', 'delivered'];
    const advance = (order: Order): Order => {
      const nextStatus = statuses[(statuses.indexOf(order.status) + 1) % statuses.length];
      return {
        ...order,
        status: nextStatus,
        etaMinutes: nextStatus === 'delivered' ? 0 : Math.max(5, order.etaMinutes - 4),
      };
    };
    if (activeOrder.id === demoOrder.id) {
      setDemoOrder(advance);
    } else {
      setPlacedOrders((prev) => prev.map((order) => (order.id === activeOrder.id ? advance(order) : order)));
    }
  };

  const updateOrder = (id: string, changes: Partial<Order>) => {
    setPlacedOrders((prev) => prev.map((order) => (order.id === id ? { ...order, ...changes } : order)));
  };

  const placeOrder = ({ deliveryWindow, note }: { deliveryWindow: DeliveryWindow; note: string }): Order => {
    const namesIn = (lang: 'ru' | 'en' | 'he') =>
      orderStores
        .map((line) => collageTranslations[lang].storeCopy[line.store.id]?.name || line.store.names?.[lang] || line.store.name)
        .join(', ');
    const placedAt = new Date();

    const placed: Order = {
      id: `ord-${placedAt.getTime()}`,
      orderNumber: `QIV-IL-${String(placedAt.getTime()).slice(-4)}`,
      createdAt: placedAt.toISOString(),
      placedAt: placedAt.toISOString(),
      status: 'received',
      storeName: namesIn('ru'),
      storeNames: { ru: namesIn('ru'), en: namesIn('en'), he: namesIn('he') },
      storeId: orderStores[0]?.store.id ?? '',
      items: cart.map((line) => ({
        productId: line.product.id,
        name: line.product.name,
        names: line.product.names,
        quantity: line.quantity,
        price: line.product.price,
        storeId: line.product.storeId,
        imageUrl: line.product.imageUrl,
      })),
      subtotal: order.itemsSubtotal,
      discount: order.promoCodeDiscount,
      feeLines: orderStores.map((line) => ({ storeId: line.store.id, fee: line.baseFee })),
      promotionLines: order.promotionLines,
      totalAmount,
      deliveryFee: order.baseDeliveryFee,
      address: currentAddress,
      addresses: currentAddressTexts,
      etaMinutes: Math.max(...orderStores.map((line) => line.store.deliveryTimeMax)),
      deliveryWindow,
      note: note.trim() || undefined,
    };

    setPlacedOrders((prev) => [placed, ...prev]);
    setFocusedOrderId(placed.id);
    setPickedStoreId(null);
    clearCart();
    return placed;
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigateTo,
        selectedStoreId,
        setSelectedStoreId,
        selectedStore,
        pickStore,
        orderStores,
        selectedCategorySlug,
        setSelectedCategorySlug,
        searchQuery,
        setSearchQuery,
        currentAddress,
        setCurrentAddress,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        cartDiscount,
        setCartDiscount,
        order,
        deliveryFee,
        totalAmount,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAddressModalOpen,
        setIsAddressModalOpen,
        isChatOpen,
        setIsChatOpen,
        chatParticipant,
        openChatWithParticipant,
        currentUser,
        updateUserProfile,
        activeOrder,
        trackedOrders,
        advanceOrderSimulation,
        placeOrder,
        updateOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <PromotionsProvider>
      <AppStateProvider>{children}</AppStateProvider>
    </PromotionsProvider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
