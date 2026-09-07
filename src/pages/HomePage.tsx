import React, { useState } from 'react';
import {
  MapPin,
  Search,
  ArrowRight,
  ArrowLeft,
  Zap,
  Bike,
  ChevronRight,
  ChevronLeft,
  Clock,
  TrendingUp,
  Percent,
  Flame,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { MOCK_CATEGORIES, MOCK_STORES, MOCK_PRODUCTS } from '../data/mockData';
import { CategoryCard } from '../components/ui/CategoryCard';
import { StoreCard } from '../components/ui/StoreCard';
import { ProductCard } from '../components/ui/ProductCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { HeroDeliveryAnimation } from '../components/home/HeroDeliveryAnimation';

export const HomePage: React.FC = () => {
  const {
    navigateTo,
    currentAddress,
    setIsAddressModalOpen,
    addToCart,
    updateCartQuantity,
    cart,
    activeOrder,
    advanceOrderSimulation,
  } = useApp();

  const { language, t, formatCurrency, formatMinutes, isRTL } = useLanguage();

  const [heroSearch, setHeroSearch] = useState('');
  const [selectedStoreFilter, setSelectedStoreFilter] = useState<string>('all');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigateTo('search', { searchQuery: heroSearch.trim() });
    } else {
      navigateTo('search');
    }
  };

  const getInCartQuantity = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  // Filtered stores
  const filteredStores = selectedStoreFilter === 'all'
    ? MOCK_STORES.slice(0, 6)
    : MOCK_STORES.filter((s) => {
        const cat = s.category.toLowerCase() + (s.categories ? JSON.stringify(s.categories).toLowerCase() : '');
        return cat.includes(selectedStoreFilter.toLowerCase());
      }).slice(0, 6);

  // Fast delivery products (under 25 min)
  const fastDeliveryProducts = MOCK_PRODUCTS.slice(0, 4);

  // Trending best sellers
  const trendingProducts = MOCK_PRODUCTS.slice(2, 10);

  const quickTags = [
    { ru: 'Авокадо Hass', en: 'Hass Avocado', he: 'אבוקדו האס' },
    { ru: 'Свежая хала', en: 'Fresh Challah', he: 'חלת שבת' },
    { ru: 'Козий сыр', en: 'Goat Cheese', he: 'גבינת עיזים' },
    { ru: 'Оливковое масло', en: 'Olive Oil', he: 'שמן זית' },
  ];

  return (
    <div className="space-y-8 sm:space-y-12 pb-16">
      
      {/* 1. COMPACT HERO SECTION */}
      <section className="pt-3 sm:pt-6">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="relative rounded-2xl sm:rounded-3xl bg-[#123B35] text-[#F3F1EA] p-5 sm:p-8 lg:p-10 border border-[#1E524A] shadow-md overflow-hidden">
            {/* Background Vector Delivery Animation (Right-hand abstract route) */}
            <HeroDeliveryAnimation />
            
            <div className="relative z-10 max-w-2xl">
              {/* Value proposition pill */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-bold text-[#B8D96B] backdrop-blur-xs mb-3">
                <Zap className="w-3.5 h-3.5 text-[#B8D96B] shrink-0" />
                <span>{t.home.heroTag}</span>
              </div>

              {/* Headline */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#F3F1EA] leading-tight mb-2">
                {t.home.heroTitle}
              </h1>

              {/* Subheadline */}
              <p className="text-xs sm:text-sm text-[#F3F1EA]/85 leading-relaxed mb-4 max-w-xl font-normal">
                {t.home.heroSubtitle}
              </p>

              {/* Address & Search Bar */}
              <div className="bg-surface p-1.5 sm:p-2 rounded-xl sm:rounded-2xl shadow-lg border border-white/20 text-primary">
                <form
                  onSubmit={handleHeroSearch}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5"
                >
                  {/* Address button */}
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(true)}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-lg sm:rounded-xl bg-surface-elevated hover:bg-[#EDE9DE] dark:hover:bg-[#252E2B] text-xs font-medium transition border border-theme shrink-0 select-none ${isRTL ? 'text-right' : 'text-left'}`}
                    aria-label={t.home.deliveryAddress}
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#123B35] dark:text-[#B8D96B] shrink-0" />
                    <div className="truncate max-w-[150px] xs:max-w-[190px]">
                      <span className="block text-[9px] text-secondary uppercase font-bold leading-none">
                        {t.nav.deliveryTo}
                      </span>
                      <span className="truncate font-semibold text-primary block text-xs leading-tight mt-0.5">
                        {currentAddress}
                      </span>
                    </div>
                  </button>

                  {/* Search Input */}
                  <div className="flex-1 flex items-center px-2 py-1">
                    <Search className={`w-4 h-4 text-muted shrink-0 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <input
                      type="text"
                      value={heroSearch}
                      onChange={(e) => setHeroSearch(e.target.value)}
                      placeholder={t.home.searchPlaceholder}
                      className="w-full bg-transparent text-xs sm:text-sm text-primary placeholder:text-muted focus:outline-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="accent"
                    size="sm"
                    className="h-9 px-4 font-bold text-xs shrink-0"
                    rightIcon={isRTL ? <ArrowLeft className="w-3.5 h-3.5 text-[#151817]" /> : <ArrowRight className="w-3.5 h-3.5 text-[#151817]" />}
                  >
                    {t.home.searchButton}
                  </Button>
                </form>
              </div>

              {/* Quick tags */}
              <div className="flex items-center gap-1.5 flex-wrap mt-3 text-[11px] text-[#F3F1EA]/80 font-medium">
                <span className="text-[#B8D96B] font-bold">{t.home.quickTagsTitle}:</span>
                {quickTags.map((tagObj, idx) => {
                  const tagText = tagObj[language] || tagObj.en;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => navigateTo('search', { searchQuery: tagText })}
                      className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 transition backdrop-blur-xs select-none"
                    >
                      {tagText}
                    </button>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. PROMO CAROUSEL / BANNERS */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Promo 1: First Order */}
          <div
            onClick={() => navigateTo('catalog')}
            className="group cursor-pointer rounded-2xl bg-gradient-to-br from-[#123B35] to-[#1A4E46] text-[#F3F1EA] p-4 sm:p-5 flex items-center justify-between border border-[#1E524A] shadow-xs hover:shadow-md transition active:scale-98"
          >
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#B8D96B] text-[#151817] text-[10px] font-black uppercase tracking-wider mb-2">
                {t.home.promo1Code}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#F3F1EA] leading-snug">
                {t.home.promo1Title}
              </h3>
              <p className="text-xs text-[#F3F1EA]/75 mt-1">
                {t.home.promo1Desc}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-[#B8D96B] shrink-0 ms-3 group-hover:scale-110 transition">
              <Percent className="w-5 h-5" />
            </div>
          </div>

          {/* Promo 2: Free Eco Delivery */}
          <div
            onClick={() => navigateTo('catalog')}
            className="group cursor-pointer rounded-2xl bg-surface-elevated text-primary p-4 sm:p-5 flex items-center justify-between border border-theme shadow-xs hover:shadow-md transition active:scale-98"
          >
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#E8F5EE] dark:bg-[#132E20] text-[#1E824C] dark:text-[#48BB78] text-[10px] font-bold uppercase tracking-wider mb-2">
                {t.home.promo2Tag}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-primary leading-snug">
                {t.home.promo2Title}
              </h3>
              <p className="text-xs text-secondary mt-1">
                {t.home.promo2Desc}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#123B35]/10 dark:bg-[#B8D96B]/15 flex items-center justify-center text-[#123B35] dark:text-[#B8D96B] shrink-0 ms-3 group-hover:scale-110 transition">
              <Bike className="w-5 h-5" />
            </div>
          </div>

          {/* Promo 3: Artisan Bakeries */}
          <div
            onClick={() => navigateTo('catalog', { categorySlug: 'bakery' })}
            className="group cursor-pointer rounded-2xl bg-surface-elevated text-primary p-4 sm:p-5 flex items-center justify-between border border-theme shadow-xs hover:shadow-md transition active:scale-98"
          >
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FEF8E7] dark:bg-[#332612] text-[#B7791F] dark:text-[#F6AD55] text-[10px] font-bold uppercase tracking-wider mb-2">
                {t.home.promo3Tag}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-primary leading-snug">
                {t.home.promo3Title}
              </h3>
              <p className="text-xs text-secondary mt-1">
                {t.home.promo3Desc}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#B7791F]/10 dark:bg-[#F6AD55]/15 flex items-center justify-center text-[#B7791F] dark:text-[#F6AD55] shrink-0 ms-3 group-hover:scale-110 transition">
              <Flame className="w-5 h-5" />
            </div>
          </div>

        </div>
      </section>

      {/* 3. CATEGORIES ROW */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-primary">
              {t.home.categoriesTitle}
            </h2>
            <p className="text-xs text-secondary mt-0.5">
              {t.home.categoriesSubtitle}
            </p>
          </div>
          <button
            onClick={() => navigateTo('catalog')}
            className="flex items-center gap-1 text-xs font-bold text-[#123B35] dark:text-[#B8D96B] hover:underline"
          >
            <span>{t.home.viewAllCatalog}</span>
            {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Categories scrollable container */}
        <div className="flex sm:grid sm:grid-cols-4 md:grid-cols-8 gap-2.5 sm:gap-3 overflow-x-auto pb-2 px-3 sm:px-0 -mx-3 sm:mx-0 scrollbar-none">
          {MOCK_CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onClick={() => navigateTo('catalog', { categorySlug: cat.slug })}
            />
          ))}
        </div>
      </section>

      {/* 4. FLASH DELIVERY (15–25 MIN) */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-primary">
              {t.home.expressTitle}
            </h2>
            <Badge variant="pistachio" size="sm">
              <Zap className="w-3 h-3 me-1 inline" />
              {t.home.expressBadge}
            </Badge>
          </div>

          <button
            onClick={() => navigateTo('catalog')}
            className="flex items-center gap-1 text-xs font-bold text-[#123B35] dark:text-[#B8D96B] hover:underline"
          >
            <span>{t.home.viewAll}</span>
            {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        <div className="product-grid">
          {fastDeliveryProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              inCartQuantity={getInCartQuantity(product.id)}
              onAddToCart={addToCart}
              onUpdateQuantity={updateCartQuantity}
              onClick={() => navigateTo('store', { storeId: product.storeId })}
            />
          ))}
        </div>
      </section>

      {/* 5. POPULAR LOCAL STORES */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-primary">
                {t.home.popularStoresTitle}
              </h2>
              <Badge variant="mineral" size="sm">
                {t.home.radiusBadge}
              </Badge>
            </div>
            <p className="text-xs text-secondary mt-0.5">
              {t.home.popularStoresSubtitle}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { label: t.home.filterAll, value: 'all' },
              { label: t.home.filterFarm, value: 'grocery' },
              { label: t.home.filterBakery, value: 'bakery' },
              { label: t.home.filterGadgets, value: 'electronics' },
            ].map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setSelectedStoreFilter(f.value)}
                className={`
                  px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap select-none
                  ${
                    selectedStoreFilter === f.value
                      ? 'bg-[#123B35] text-[#F3F1EA] dark:bg-[#B8D96B] dark:text-[#151817]'
                      : 'bg-surface-elevated text-secondary hover:text-primary border border-theme'
                  }
                `}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {filteredStores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onClick={() => navigateTo('store', { storeId: store.id })}
            />
          ))}
        </div>
      </section>

      {/* 6. BEST SELLERS & TRENDING */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-primary">
                {t.home.bestsellersTitle}
              </h2>
              <Badge variant="mineral" size="sm">
                <TrendingUp className="w-3 h-3 me-1 inline text-[#B8D96B]" />
                {t.home.bestsellersBadge}
              </Badge>
            </div>
            <p className="text-xs text-secondary mt-0.5">
              {t.home.bestsellersSubtitle}
            </p>
          </div>

          <button
            onClick={() => navigateTo('catalog')}
            className="flex items-center gap-1 text-xs font-bold text-[#123B35] dark:text-[#B8D96B] hover:underline"
          >
            <span>{t.home.toCatalog}</span>
            {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        <div className="product-grid">
          {trendingProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              inCartQuantity={getInCartQuantity(product.id)}
              onAddToCart={addToCart}
              onUpdateQuantity={updateCartQuantity}
              onClick={() => navigateTo('store', { storeId: product.storeId })}
            />
          ))}
        </div>
      </section>

      {/* 7. QUICK REORDER / ACTIVE ORDER SHORTCUT */}
      {activeOrder && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="rounded-2xl bg-surface border border-theme p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#123B35] text-[#B8D96B] flex items-center justify-center shrink-0">
                <Bike className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1E824C] dark:text-[#48BB78]">
                    {t.home.activeOrderPrefix} #{activeOrder.orderNumber || activeOrder.id}
                  </span>
                  <span className="text-xs text-muted tabular-nums">
                    • {language === 'ru' ? 'Прибытие через' : language === 'he' ? 'זמן הגעה' : 'ETA'}: {formatMinutes(activeOrder.etaMinutes)}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-primary mt-0.5">
                  {activeOrder.storeNames?.[language] || activeOrder.storeName} ({activeOrder.items.length} {language === 'he' ? 'פריטים' : language === 'en' ? 'items' : 'поз.'}, {formatCurrency(activeOrder.totalAmount)})
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={advanceOrderSimulation}
                className="text-xs font-semibold flex-1 sm:flex-initial"
              >
                {t.home.simulateStep}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigateTo('orders')}
                className="text-xs font-bold flex-1 sm:flex-initial"
                rightIcon={isRTL ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              >
                {t.home.openTracker}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* 8. INTERACTIVE LIVE TRACKING DEMO */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="rounded-2xl sm:rounded-3xl bg-surface border border-theme p-5 sm:p-7 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left: Info */}
            <div className="lg:col-span-6 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8F5EE] dark:bg-[#132E20] text-xs font-bold text-[#1E824C] dark:text-[#48BB78]">
                <Clock className="w-3.5 h-3.5" />
                <span>{t.home.smartTrackingTitle}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
                {t.home.smartTrackingHeadline}
              </h2>

              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                {t.home.smartTrackingDesc}
              </p>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div className="p-2.5 rounded-xl bg-surface-elevated border border-theme text-start">
                  <span className="text-[10px] text-muted block">{t.home.statAvgTime}</span>
                  <span className="text-sm sm:text-base font-extrabold text-primary">{formatMinutes(28)}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-elevated border border-theme text-start">
                  <span className="text-[10px] text-muted block">{t.home.statEtaAccuracy}</span>
                  <span className="text-sm sm:text-base font-extrabold text-primary">99.2%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-elevated border border-theme text-start">
                  <span className="text-[10px] text-muted block">{t.home.statEcoFleet}</span>
                  <span className="text-sm sm:text-base font-extrabold text-[#1E824C] dark:text-[#48BB78]">100%</span>
                </div>
              </div>
            </div>

            {/* Right: Live Interactive Card Preview */}
            <div className="lg:col-span-6 p-4 sm:p-5 rounded-2xl bg-surface-elevated border border-theme">
              <div className="flex items-center justify-between pb-3 border-b border-theme/60">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1E824C] animate-ping" />
                  <span className="text-xs font-bold text-primary">
                    {t.home.courierOnWay}
                  </span>
                </div>
                <span className="text-xs font-extrabold text-[#123B35] dark:text-[#B8D96B] tabular-nums">
                  {language === 'ru' ? 'Осталось' : language === 'he' ? 'זמן משוער' : 'ETA'}: ~{formatMinutes(8)}
                </span>
              </div>

              {/* Timeline Steps */}
              <div className="space-y-3 pt-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#123B35] text-[#B8D96B] flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-primary">{t.home.timelinePacked}</p>
                    <p className="text-[11px] text-muted">14:15 • Carmel Fresh Market (שוק הכרמל)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#B8D96B] text-[#151817] flex items-center justify-center text-xs font-bold shrink-0">
                    🚲
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-primary">{t.home.timelineCourier}</p>
                    <p className="text-[11px] text-muted">{t.home.timelineLocation}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-theme/60 flex items-center justify-between">
                <span className="text-xs text-secondary font-medium truncate max-w-[200px]">
                  {t.nav.deliveryTo}: {currentAddress}
                </span>
                <button
                  type="button"
                  onClick={() => navigateTo('orders')}
                  className="text-xs font-bold text-[#123B35] dark:text-[#B8D96B] hover:underline shrink-0"
                >
                  {t.home.openTracker} {isRTL ? '←' : '→'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
