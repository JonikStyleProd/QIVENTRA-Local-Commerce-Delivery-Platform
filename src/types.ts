export type AppRoute =
  | 'home'
  | 'catalog'
  | 'search'
  | 'orders'
  | 'cart'
  | 'profile'
  | 'auth'
  | 'store'
  | 'vendor'
  | 'courier'
  | 'admin';

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
  storesCount: number;
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
  distanceKm: number;
  isVerified: boolean;
  isEco: boolean;
  isFeatured?: boolean;
  isPromo?: boolean;
  promoText?: string;
  promoTexts?: LocalizedText;
  logoSvgBg?: string;
  accentColor?: string;
  tags: string[];
  bannerGradient: string;
  logoUrl?: string;
  coverUrl?: string;
  galleryUrls?: string[];
  imageAlt?: LocalizedText;
}

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
  oldPrice?: number;
  unit: string; // e.g. "1 pc", "500 g", "1 pack"
  units?: LocalizedText;
  category: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  calories?: number;
  origin?: string;
  origins?: LocalizedText;
  badge?: string;
  badges?: LocalizedText;
  tagColor?: 'pistachio' | 'mineral' | 'warning' | 'neutral';
  imageUrl?: string;
  imageGallery?: string[];
  imageAlt?: LocalizedText;
}

export interface CartItem {
  product: Product;
  quantity: number;
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
  etaMinutes: number;
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
