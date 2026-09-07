import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Star,
  Clock,
  MapPin,
  CheckCircle,
  Leaf,
  Sparkles,
  Share2,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { MOCK_STORES, MOCK_PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/ui/ProductCard';
import { Badge } from '../components/ui/Badge';
import { SafeImage } from '../components/ui/SafeImage';
import { ChatDrawer } from '../components/chat/ChatDrawer';

export const StoreDetailPage: React.FC = () => {
  const {
    selectedStoreId,
    navigateTo,
    addToCart,
    updateCartQuantity,
    cart,
  } = useApp();

  const { language, t, formatCurrency, isRTL } = useLanguage();
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const store = useMemo(() => {
    return (
      MOCK_STORES.find((s) => s.id === selectedStoreId) || MOCK_STORES[0]
    );
  }, [selectedStoreId]);

  const storeProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => p.storeId === store.id);
  }, [store.id]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    storeProducts.forEach((p) => set.add(p.category));
    return ['all', ...Array.from(set)];
  }, [storeProducts]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return storeProducts;
    return storeProducts.filter((p) => p.category === selectedCategory);
  }, [storeProducts, selectedCategory]);

  const getInCartQuantity = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const displayName = store.names?.[language] || store.name;
  const displayAddress = store.addresses?.[language] || store.address;
  const displayPromo = store.promoTexts?.[language] || store.promoText;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: displayName,
        text: `QIVENTRA: ${displayName}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      showToast({
        type: 'success',
        title: t.store.linkCopied,
        message: displayName,
      });
    }
  };

  const formatDeliveryTime = (min: number, max: number) => {
    if (language === 'he') return `${min}–${max} דק'`;
    if (language === 'en') return `${min}–${max} min`;
    return `${min}–${max} мин`;
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12 py-6 space-y-8">
      
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigateTo('catalog')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-primary transition"
      >
        {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        <span>{t.store.backToCatalog}</span>
      </button>

      {/* Store Hero Banner & Details */}
      <div className="rounded-3xl bg-surface border border-theme overflow-hidden shadow-sm">
        
        {/* Banner with real cover image and high-contrast overlay */}
        <div className="relative h-48 sm:h-60 w-full p-6 sm:p-8 flex flex-col justify-between text-white overflow-hidden">
          <SafeImage
            src={store.coverUrl}
            alt={displayName}
            className="w-full h-full object-cover"
            containerClassName="absolute inset-0 w-full h-full"
            fallbackText={displayName}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60 pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {store.isEco && (
                <Badge variant="pistachio" size="sm">
                  <Leaf className="w-3 h-3 me-1 inline" />
                  {t.store.ecoCertified}
                </Badge>
              )}
              {store.isPromo && displayPromo && (
                <Badge variant="mineral" size="sm">
                  <Sparkles className="w-3 h-3 me-1 inline text-[#B8D96B]" />
                  {displayPromo}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/45 backdrop-blur-xs hover:bg-black/65 transition text-xs font-semibold text-white border border-white/20"
                aria-label="Chat with store"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#B8D96B]" />
                <span className="hidden sm:inline">
                  {language === 'he' ? 'צ\'אט עם החנות' : language === 'ru' ? 'Чат с магазином' : 'Chat with Store'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-xl bg-black/30 backdrop-blur-xs hover:bg-black/50 transition text-white border border-white/20"
                aria-label={t.store.shareStore}
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {displayName}
                </h1>
                {store.isVerified && (
                  <CheckCircle className="w-5 h-5 text-[#B8D96B] shrink-0" />
                )}
              </div>
              <p className="text-xs sm:text-sm text-white/90 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{displayAddress}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Store Metrics Bar */}
        <div className="p-4 sm:p-6 bg-surface grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs divide-y sm:divide-y-0 sm:divide-x divide-theme/60 rtl:divide-x-reverse">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#123B35]/10 dark:bg-[#B8D96B]/10 text-[#123B35] dark:text-[#B8D96B] flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <div>
              <span className="text-[10px] text-secondary block">{t.store.ratingLabel}</span>
              <span className="font-bold text-primary text-sm tabular-nums">
                {store.rating.toFixed(2)} <span className="text-muted font-normal text-xs">({store.reviewsCount})</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-2 sm:pt-0 sm:ps-4">
            <div className="w-9 h-9 rounded-xl bg-[#123B35]/10 dark:bg-[#B8D96B]/10 text-[#123B35] dark:text-[#B8D96B] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-secondary block">{t.store.courierDeliveryLabel}</span>
              <span className="font-bold text-primary text-sm tabular-nums">
                {formatDeliveryTime(store.deliveryTimeMin, store.deliveryTimeMax)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-2 sm:pt-0 sm:ps-4">
            <div>
              <span className="text-[10px] text-secondary block">{t.store.deliveryCostLabel}</span>
              <span className="font-bold text-primary text-sm tabular-nums">
                {store.deliveryFee === 0 ? t.cart.free : formatCurrency(store.deliveryFee)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-2 sm:pt-0 sm:ps-4">
            <div>
              <span className="text-[10px] text-secondary block">{t.store.minOrderPrefix}</span>
              <span className="font-bold text-primary text-sm tabular-nums">
                {formatCurrency(store.minOrder)}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Store Products Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">
            {t.store.storeAssortment} ({filteredProducts.length})
          </h2>
        </div>

        {/* Categories inside store */}
        {categories.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`
                  px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border
                  ${
                    selectedCategory === cat
                      ? 'bg-[#123B35] text-[#F3F1EA] border-[#123B35]'
                      : 'bg-surface text-secondary hover:text-primary border-theme'
                  }
                `}
              >
                {cat === 'all' ? t.catalog.allProducts : cat}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              inCartQuantity={getInCartQuantity(product.id)}
              onAddToCart={addToCart}
              onUpdateQuantity={updateCartQuantity}
            />
          ))}
        </div>
      </div>

      {/* Direct Chat with this Store */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialParticipant={{
          type: 'store',
          id: store.id,
          name: displayName,
          avatarUrl: store.logoUrl,
          storeId: store.id,
        }}
      />
    </div>
  );
};
