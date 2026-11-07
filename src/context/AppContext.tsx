import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { AppRoute, CartItem, Product, Store, Order, UserProfile, LocalizedText } from '../types';
import { MOCK_STORES, MOCK_PRODUCTS, MOCK_ACTIVE_ORDER, MOCK_PAST_ORDERS, MOCK_USER } from '../data/mockData';
import { advanceOrder } from '../data/orderTracker';
import { DeliveryWindow } from '../data/deliverySlots';
import { collageTranslations } from '../i18n/collage';
import { OrderCalculation, OrderStoreLine, calculateOrder } from '../data/cartRules';
import { useLanguage } from './LanguageContext';
import { findPromoCode } from '../data/promotions';
import { PromotionsProvider, usePromotions } from './PromotionsContext';
import { NavigationOptions, pathFor, routeOfPath } from '../router/paths';

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
  /** Enters a promo code. Whether it gives a discount is up to `order`. */
  applyPromoCode: (raw: string) => 'applied' | 'already' | 'invalid';
  removePromoCode: () => void;
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
  isSignedIn: boolean;
  /** Demo sign-in: nothing is checked. */
  signIn: (role: UserProfile['role']) => void;
  /** Back to the guest state: the demo profile and its orders are hidden. */
  signOut: () => void;
  setDemoRole: (role: UserProfile['role']) => void;
  /** The orders this visitor can see: placed ones first, then the demo profile's, if signed in. */
  orders: Order[];
  /** One step along the order's flow. It stops at "delivered". */
  advanceOrderStatus: (id: string) => void;
  /** A fresh order at "received" for trying the courier flow, without going through a basket. */
  createDemoOrder: () => Order;
  /** Turns the basket into an order with status "received", then empties the basket. */
  placeOrder: (details: { deliveryWindow: DeliveryWindow; note: string }) => Order;
  updateOrder: (id: string, changes: Partial<Order>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ORDERS_KEY = 'qiventra_orders';
const DEMO_ORDER_KEY = 'qiventra_demo_order';
const SESSION_KEY = 'qiventra_session';

interface StoredSession {
  signedIn: boolean;
  role: UserProfile['role'];
}

const ROLES: UserProfile['role'][] = ['customer', 'vendor', 'courier', 'admin'];

/** The demo starts signed in as the sample profile, so its orders and addresses are there to look at. */
const readSession = (): StoredSession => {
  try {
    const parsed = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null');
    if (parsed && typeof parsed.signedIn === 'boolean' && ROLES.includes(parsed.role)) return parsed;
  } catch {
    // Fall through to the default.
  }
  return { signedIn: true, role: 'customer' };
};

const readOrders = (key: string): Order[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(parsed)
      ? parsed.filter((order) => order && typeof order.id === 'string' && Array.isArray(order.items))
      : [];
  } catch {
    return [];
  }
};

const GUEST_USER: UserProfile = {
  id: 'guest',
  name: '',
  phone: '',
  email: '',
  savedAddresses: [],
  favoriteStoreIds: [],
  role: 'customer',
};

function AppStateProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const { promotions, now } = usePromotions();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { route: currentRoute, params: routeParams } = routeOfPath(pathname);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>('store-3');
  const [pickedStoreId, setPickedStoreId] = useState<string | null>(null);

  // A shop opened by its address becomes the selected one, as if it was picked in the list.
  useEffect(() => {
    if (routeParams.storeId) setSelectedStoreId(routeParams.storeId);
  }, [routeParams.storeId]);

  const [session, setSession] = useState<StoredSession>(readSession);
  const isSignedIn = session.signedIn;
  const [profile, setProfile] = useState<UserProfile>(() => ({ ...MOCK_USER, role: session.role }));
  const [placedOrders, setPlacedOrders] = useState<Order[]>(() => readOrders(ORDERS_KEY));
  const [demoOrder, setDemoOrder] = useState<Order>(() => readOrders(DEMO_ORDER_KEY)[0] ?? MOCK_ACTIVE_ORDER);

  useEffect(() => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      // Without storage the session lasts until the page closes.
    }
  }, [session]);

  const currentUser = useMemo<UserProfile>(
    () => (isSignedIn ? profile : { ...GUEST_USER, role: session.role }),
    [isSignedIn, profile, session.role]
  );

  const signIn = useCallback((role: UserProfile['role']) => setSession({ signedIn: true, role }), []);
  const signOut = useCallback(() => setSession({ signedIn: false, role: 'customer' }), []);
  const setDemoRole = useCallback((role: UserProfile['role']) => setSession((prev) => ({ ...prev, role })), []);

  const orders = useMemo(
    () => (isSignedIn ? [...placedOrders, demoOrder, ...MOCK_PAST_ORDERS] : placedOrders),
    [isSignedIn, placedOrders, demoOrder]
  );

  // The tracker and the courier workspace may be open in different tabs of one browser.
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === ORDERS_KEY) setPlacedOrders(readOrders(ORDERS_KEY));
      if (event.key === DEMO_ORDER_KEY) setDemoOrder(readOrders(DEMO_ORDER_KEY)[0] ?? MOCK_ACTIVE_ORDER);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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

  const [promoCodeText, setPromoCodeText] = useState<string | null>(() => {
    try {
      return findPromoCode(localStorage.getItem('qiventra_promo_code'))?.code ?? null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (promoCodeText) localStorage.setItem('qiventra_promo_code', promoCodeText);
      else localStorage.removeItem('qiventra_promo_code');
    } catch {
      // Without storage the code simply lasts until the page closes.
    }
  }, [promoCodeText]);

  const applyPromoCode = (raw: string) => {
    const found = findPromoCode(raw);
    if (!found) return 'invalid';
    if (found.code === promoCodeText) return 'already';
    setPromoCodeText(found.code);
    return 'applied';
  };
  const removePromoCode = () => setPromoCodeText(null);

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
      localStorage.setItem(ORDERS_KEY, JSON.stringify(placedOrders));
    } catch {
      // ignore quota or serialization errors
    }
  }, [placedOrders]);

  useEffect(() => {
    try {
      localStorage.setItem(DEMO_ORDER_KEY, JSON.stringify([demoOrder]));
    } catch {
      // ignore quota or serialization errors
    }
  }, [demoOrder]);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const selectedStore = useMemo(() => {
    return MOCK_STORES.find((s) => s.id === selectedStoreId) || MOCK_STORES[0];
  }, [selectedStoreId]);

  const pickStore = useCallback((id: string) => {
    setSelectedStoreId(id);
    setPickedStoreId(id);
  }, []);

  const navigateTo = useCallback(
    (route: AppRoute, options: NavigationOptions = {}) => {
      if (options.storeId) setSelectedStoreId(options.storeId);
      navigate(pathFor(route, options));
    },
    [navigate]
  );

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
    setPromoCodeText(null);
  };

  const cartTotalCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  const order = useMemo(
    () => calculateOrder({ cart, pickedStoreId, promotions, promoCode: findPromoCode(promoCodeText), now }),
    [cart, pickedStoreId, promotions, promoCodeText, now]
  );
  const orderStores = order.stores;
  const deliveryFee = order.deliveryFee;
  const totalAmount = order.total;

  const advanceOrderStatus = useCallback((id: string) => {
    setPlacedOrders((prev) => prev.map((candidate) => (candidate.id === id ? advanceOrder(candidate) : candidate)));
    setDemoOrder((prev) => (prev.id === id ? advanceOrder(prev) : prev));
  }, []);

  const createDemoOrder = useCallback((): Order => {
    const startedAt = Date.now();
    const created: Order = {
      ...MOCK_ACTIVE_ORDER,
      id: `ord-demo-${startedAt}`,
      orderNumber: `QIV-IL-${String(startedAt).slice(-4)}`,
      status: 'received',
      etaMinutes: 40,
      etaTotalMinutes: 40,
      createdAts: undefined,
      placedAt: new Date(startedAt).toISOString(),
    };
    setPlacedOrders((prev) => [created, ...prev]);
    return created;
  }, []);

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
      promoCode: order.promoCodeDiscount > 0 ? order.promoCode?.code : undefined,
      feeLines: orderStores.map((line) => ({ storeId: line.store.id, fee: line.baseFee })),
      promotionLines: order.promotionLines,
      totalAmount,
      deliveryFee: order.baseDeliveryFee,
      address: currentAddress,
      addresses: currentAddressTexts,
      etaMinutes: Math.max(...orderStores.map((line) => line.store.deliveryTimeMax)),
      etaTotalMinutes: Math.max(...orderStores.map((line) => line.store.deliveryTimeMax)),
      deliveryWindow,
      note: note.trim() || undefined,
    };

    setPlacedOrders((prev) => [placed, ...prev]);
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
        currentAddress,
        setCurrentAddress,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        applyPromoCode,
        removePromoCode,
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
        isSignedIn,
        signIn,
        signOut,
        setDemoRole,
        orders,
        advanceOrderStatus,
        createDemoOrder,
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
