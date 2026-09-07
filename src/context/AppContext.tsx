import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { AppRoute, CartItem, Product, Store, Order, UserProfile, LocalizedText } from '../types';
import { MOCK_STORES, MOCK_PRODUCTS, MOCK_ACTIVE_ORDER, MOCK_USER } from '../data/mockData';
import { useLanguage } from './LanguageContext';

interface NavigationOptions {
  storeId?: string;
  categorySlug?: string;
  searchQuery?: string;
}

interface AppContextType {
  currentRoute: AppRoute;
  navigateTo: (route: AppRoute, options?: NavigationOptions) => void;
  selectedStoreId: string | null;
  setSelectedStoreId: (id: string | null) => void;
  selectedStore: Store | undefined;
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
  freeDeliveryThreshold: number;
  deliveryFee: number;
  totalAmount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

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
  activeOrder: Order;
  advanceOrderSimulation: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('home');
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>('store-1');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USER);
  const [activeOrder, setActiveOrder] = useState<Order>(MOCK_ACTIVE_ORDER);

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
            if (valid.length > 0) {
              return valid;
            }
          }
        }
      }
    } catch {
      // ignore corrupted state and fallback
    }
    return [
      { product: MOCK_PRODUCTS[0], quantity: 1 },
      { product: MOCK_PRODUCTS[3], quantity: 1 },
    ];
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
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

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  };

  const selectedStore = useMemo(() => {
    return MOCK_STORES.find((s) => s.id === selectedStoreId) || MOCK_STORES[0];
  }, [selectedStoreId]);

  const navigateTo = (route: AppRoute, options?: NavigationOptions) => {
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    if (options?.storeId) setSelectedStoreId(options.storeId);
    if (options?.categorySlug !== undefined) setSelectedCategorySlug(options.categorySlug);
    if (options?.searchQuery !== undefined) setSearchQuery(options.searchQuery);

    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  };

  const cartTotalCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  const freeDeliveryThreshold = 100;
  const deliveryFee = useMemo(() => {
    if (cartSubtotal === 0 || cartSubtotal >= freeDeliveryThreshold) return 0;
    return 15;
  }, [cartSubtotal]);

  const totalAmount = useMemo(() => {
    return Math.max(0, cartSubtotal + deliveryFee);
  }, [cartSubtotal, deliveryFee]);

  // Delivery simulation stepper for the live tracker demo
  const advanceOrderSimulation = () => {
    const statuses: Order['status'][] = ['received', 'preparing', 'courier_assigned', 'on_the_way', 'delivered'];
    setActiveOrder((prev) => {
      const idx = statuses.indexOf(prev.status);
      const nextIdx = (idx + 1) % statuses.length;
      const nextStatus = statuses[nextIdx];
      const eta = nextStatus === 'delivered' ? 0 : Math.max(5, prev.etaMinutes - 4);
      return {
        ...prev,
        status: nextStatus,
        etaMinutes: eta,
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigateTo,
        selectedStoreId,
        setSelectedStoreId,
        selectedStore,
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
        freeDeliveryThreshold,
        deliveryFee,
        totalAmount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isCartOpen: isCartDrawerOpen,
        setIsCartOpen: setIsCartDrawerOpen,
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
        advanceOrderSimulation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
