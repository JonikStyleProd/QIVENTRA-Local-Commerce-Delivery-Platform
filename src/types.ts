import { PromotionText, PromotionType } from './data/promotions';
import type { DeliveryWindow } from './data/deliverySlots';
import type { GeoPoint } from './data/addresses';

export type AppRoute =
  | 'home'
  | 'catalog'
  | 'search'
  | 'orders'
  | 'order'
  | 'cart'
  | 'delivery'
  | 'profile'
  | 'store'
  | 'product'
  | 'vendor'
  | 'courier'
  | 'admin'
  | 'privacy'
  | 'terms'
  | 'accessibility'
  | 'notFound';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface LocalizedText {
  ru: string;
  en: string;
  he: string;
}

export interface Category {
  id: string;
  name: string;
  names?: LocalizedText;
  slug: string;
  icon: string;
  description: string;
  descriptions?: LocalizedText;
  popularItems: string[];
  imageUrl?: string;
  imageAlt?: LocalizedText;
}

export interface Store {
  id: string;
  name: string;
  names?: LocalizedText;
  slug: string;
  category: string;
  categories?: LocalizedText;
  rating: number;
  reviewsCount: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryFee: number; // 0 = free
  minOrder: number;
  address: string;
  addresses?: LocalizedText;
  coords: GeoPoint;
  /** The shop delivers this far from its door, in a straight line. */
  deliveryRadiusKm: number;
  isVerified: boolean;
  isEco: boolean;
  isFeatured?: boolean;
  logoSvgBg?: string;
  accentColor?: string;
  tags: string[];
  bannerGradient: string;
  logoUrl?: string;
  coverUrl?: string;
  galleryUrls?: string[];
  imageAlt?: LocalizedText;
}

/** A choice inside one product: weight, volume, size or color, each with its own price. */
export interface ProductVariant {
  id: string;
  labels: LocalizedText;
  price: number;
}

export type VariantKind = 'weight' | 'volume' | 'size' | 'color';

export interface Product {
  id: string;
  storeId: string;
  storeName: string;
  storeNames?: LocalizedText;
  name: string;
  names?: LocalizedText;
  description: string;
  descriptions?: LocalizedText;
  price: number;
  unit: string; // e.g. "1 pc", "500 g", "1 pack"
  units?: LocalizedText;
  category: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  calories?: number;
  origin?: string;
  origins?: LocalizedText;
  imageUrl?: string;
  imageGallery?: string[];
  imageAlt?: LocalizedText;
  /** The first variant matches `price` and `unit`. A product without variants has no choice to make. */
  variants?: ProductVariant[];
  variantKind?: VariantKind;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variantId?: string;
}

export type OrderStatus =
  | 'received'
  | 'preparing'
  | 'courier_assigned'
  | 'on_the_way'
  | 'delivered';

export interface OrderItem {
  name: string;
  names?: LocalizedText;
  quantity: number;
  price: number;
  productId?: string;
  storeId?: string;
  imageUrl?: string;
  variantId?: string;
  variantLabels?: LocalizedText;
}

/** A promotion as it was applied to an order, kept with the order so its sums never change. */
export interface OrderPromotionLine {
  promotionId: string;
  storeId: string;
  type: PromotionType;
  title: PromotionText;
  saving: number;
  giftName?: PromotionText;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  createdAts?: LocalizedText;
  status: OrderStatus;
  storeName: string;
  storeNames?: LocalizedText;
  storeId: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryFee: number;
  address: string;
  addresses?: LocalizedText;
  /** Where it goes, for the courier's route. */
  destination?: GeoPoint;
  etaMinutes: number;
  /** The whole promised time, so the estimate can shrink step by step. */
  etaTotalMinutes?: number;
  /** Set on orders placed in the app; the seed orders in mockData do not have these. */
  placedAt?: string;
  deliveryWindow?: DeliveryWindow;
  note?: string;
  subtotal?: number;
  /** The promo code's discount, if it beat the shop promotions. */
  discount?: number;
  promoCode?: string;
  /** Each shop's regular fee; free delivery is taken off as a promotion line. */
  feeLines?: { storeId: string; fee: number }[];
  promotionLines?: OrderPromotionLine[];
  courier?: {
    id?: string;
    name: string;
    names?: LocalizedText;
    phone: string;
    vehicle: 'электросамокат' | 'электровелосипед' | 'авто' | 'e-bike' | 'scooter';
    vehicleName?: LocalizedText;
    rating: number;
    completedDeliveries: number;
    currentLocationName: string;
    currentLocationNames?: LocalizedText;
    avatarUrl?: string;
  };
}

export interface AddressItem {
  id: string;
  title: string;
  titles?: LocalizedText;
  address: string;
  addresses?: LocalizedText;
  /** The address on the demo list, which has the coordinates. */
  demoAddressId: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  names?: LocalizedText;
  phone: string;
  email: string;
  savedAddresses: AddressItem[];
  favoriteStoreIds: string[];
  role: 'customer' | 'vendor' | 'courier' | 'admin';
  avatarUrl?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

/* -------------------------------------------------------------
   CHAT & MESSAGING TYPES
------------------------------------------------------------- */
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: 'customer' | 'store' | 'courier' | 'system';
  senderName: string;
  senderNames?: LocalizedText;
  senderAvatar?: string;
  text: string;
  texts?: LocalizedText;
  imageUrl?: string;
  status: MessageStatus;
  timestamp: string; // ISO string
  orderId?: string;
}

export interface Conversation {
  id: string;
  type: 'store' | 'courier';
  participantId: string;
  participantName: string;
  participantNames?: LocalizedText;
  participantRole: 'store' | 'courier';
  participantAvatar?: string;
  orderId?: string;
  storeId?: string;
  lastMessage?: string;
  lastMessages?: LocalizedText;
  lastMessageTimestamp?: string;
  unreadCount: number;
  isOnline?: boolean;
}

/* -------------------------------------------------------------
   MEDIA STORAGE ITEM TYPE
------------------------------------------------------------- */
export interface MediaItem {
  id: string;
  category: 'avatar' | 'store_logo' | 'store_cover' | 'product' | 'chat';
  filename: string;
  mimeType: string;
  dataUrl: string;
  sizeBytes: number;
  uploadedAt: string;
  entityId?: string; // userId, storeId, or productId
}

/* -------------------------------------------------------------
   SUPABASE BRAND ASSET TYPES
------------------------------------------------------------- */
export type BrandAssetVariant = 'mark' | 'lockup';
export type BrandAssetMimeType = 'image/png' | 'image/webp' | 'image/svg+xml';

export interface BrandAssetRecord {
  id: string;
  asset_key: string;
  storage_path: string;
  variant: BrandAssetVariant;
  mime_type: BrandAssetMimeType;
  width?: number;
  height?: number;
  sha256: string;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}
