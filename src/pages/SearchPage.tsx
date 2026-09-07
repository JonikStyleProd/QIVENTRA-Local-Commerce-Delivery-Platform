import React, { useMemo, useState } from 'react';
import { Search, Store as StoreIcon, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { MOCK_STORES, MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/mockData';
import { SearchBar } from '../components/ui/SearchBar';
import { StoreCard } from '../components/ui/StoreCard';
import { ProductCard } from '../components/ui/ProductCard';
import { EmptyState } from '../components/ui/EmptyState';

export const SearchPage: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    navigateTo,
    addToCart,
    updateCartQuantity,
    cart,
  } = useApp();

  const { language, t } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyEco, setOnlyEco] = useState<boolean>(false);
  const [sortBy] = useState<'rating' | 'price' | 'delivery'>('rating');

  const query = searchQuery.trim().toLowerCase();

  const matchedStores = useMemo(() => {
    let stores = MOCK_STORES;
    if (query) {
      stores = stores.filter((s) => {
        const nameMatch = s.name.toLowerCase().includes(query) || (s.names && Object.values(s.names).some(n => typeof n === 'string' && n.toLowerCase().includes(query)));
        const catMatch = s.category.toLowerCase().includes(query) || (s.categories && Object.values(s.categories).some(c => typeof c === 'string' && c.toLowerCase().includes(query)));
        const tagMatch = s.tags.some((tg) => tg.toLowerCase().includes(query));
        return nameMatch || catMatch || tagMatch;
      });
    }
    if (selectedCategory !== 'all') {
      stores = stores.filter((s) => s.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    }
    if (onlyEco) {
      stores = stores.filter((s) => s.isEco);
    }
    return stores;
  }, [query, selectedCategory, onlyEco]);

  const matchedProducts = useMemo(() => {
    let products = MOCK_PRODUCTS;
    if (query) {
      products = products.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(query) || (p.names && Object.values(p.names).some(n => typeof n === 'string' && n.toLowerCase().includes(query)));
        const descMatch = p.description.toLowerCase().includes(query) || (p.descriptions && Object.values(p.descriptions).some(d => typeof d === 'string' && d.toLowerCase().includes(query)));
        const storeMatch = p.storeName.toLowerCase().includes(query) || (p.storeNames && Object.values(p.storeNames).some(sn => typeof sn === 'string' && sn.toLowerCase().includes(query)));
        const catMatch = p.category.toLowerCase().includes(query);
        return nameMatch || descMatch || storeMatch || catMatch;
      });
    }
    if (selectedCategory !== 'all') {
      products = products.filter((p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    }
    if (sortBy === 'price') {
      products = [...products].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'rating') {
      products = [...products].sort((a, b) => b.rating - a.rating);
    }
    return products;
  }, [query, selectedCategory, sortBy]);

  const getInCartQuantity = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const sampleQueries = language === 'he'
    ? ['אבוקדו האס', 'חלת שבת', 'גבינת עיזים', 'שמן זית', 'אוזניות TWS', 'פירות יער']
    : language === 'en'
    ? ['Hass Avocado', 'Fresh Challah', 'Goat Cheese', 'Olive Oil', 'TWS Earbuds', 'Fresh Berries']
    : ['Авокадо Hass', 'Свежая хала', 'Козий сыр', 'Оливковое масло', 'TWS наушники', 'Свежие ягоды'];

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12 py-6 space-y-6">
      
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center space-y-3">
        <h1 className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
          {t.search.title}
        </h1>
        <p className="text-xs sm:text-sm text-secondary">
          {t.search.subtitle}
        </p>

        {/* Search Input without autofocus */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t.home.searchPlaceholder}
        />

        {/* Quick Sample Queries */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap text-xs pt-1">
          <span className="text-muted text-[11px]">{t.search.trendingSearch}:</span>
          {sampleQueries.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSearchQuery(item)}
              className="px-2.5 py-1 rounded-xl bg-surface-elevated hover:bg-surface border border-theme text-secondary hover:text-primary text-xs transition select-none active:scale-95"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Internal Filter Chips Container */}
      <div className="flex items-center justify-between gap-3 border-y border-theme/60 py-3 overflow-x-auto scrollbar-none px-4 sm:px-0 -mx-4 sm:mx-0">
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`
              px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap select-none
              ${
                selectedCategory === 'all'
                  ? 'bg-[#123B35] text-[#F3F1EA] dark:bg-[#B8D96B] dark:text-[#151817]'
                  : 'bg-surface-elevated text-secondary hover:text-primary border border-theme'
              }
            `}
          >
            {t.catalog.allCategories}
          </button>
          {MOCK_CATEGORIES.map((cat) => {
            const catName = cat.names?.[language] || cat.name;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`
                  px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap select-none
                  ${
                    isSelected
                      ? 'bg-[#123B35] text-[#F3F1EA] dark:bg-[#B8D96B] dark:text-[#151817]'
                      : 'bg-surface-elevated text-secondary hover:text-primary border border-theme'
                  }
                `}
              >
                {catName}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setOnlyEco(!onlyEco)}
            className={`
              px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap select-none
              ${
                onlyEco
                  ? 'bg-[#E8F5EE] dark:bg-[#132E20] text-[#1E824C] dark:text-[#48BB78] border border-[#1E824C]/30'
                  : 'bg-surface-elevated text-secondary border border-theme'
              }
            `}
          >
            🍃 {t.catalog.filterEco}
          </button>
        </div>
      </div>

      {/* Results or Empty State */}
      {!query && selectedCategory === 'all' && !onlyEco ? (
        <div className="pt-4">
          <div className="text-center max-w-md mx-auto p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-surface border border-theme">
            <div className="w-12 h-12 rounded-2xl bg-surface-elevated text-secondary flex items-center justify-center mx-auto mb-3 border border-theme">
              <Search className="w-6 h-6 text-[#123B35] dark:text-[#B8D96B]" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-primary mb-1">
              {t.search.startTypingTitle}
            </h3>
            <p className="text-xs text-secondary leading-relaxed">
              {t.search.startTypingSubtitle}
            </p>
          </div>
        </div>
      ) : matchedStores.length === 0 && matchedProducts.length === 0 ? (
        <EmptyState
          title={`${t.search.noResultsTitle} «${searchQuery}»`}
          description={t.search.noResultsSubtitle}
          actionText={t.search.openCatalog}
          onAction={() => navigateTo('catalog')}
        />
      ) : (
        <div className="space-y-8">
          
          {/* Matched Stores */}
          {matchedStores.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <StoreIcon className="w-4 h-4 text-[#123B35] dark:text-[#B8D96B]" />
                <h2 className="text-base font-bold text-primary">
                  {t.catalog.tabStores} ({matchedStores.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchedStores.map((store) => (
                  <StoreCard
                    key={store.id}
                    store={store}
                    onClick={() => navigateTo('store', { storeId: store.id })}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Matched Products */}
          {matchedProducts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-4 h-4 text-[#123B35] dark:text-[#B8D96B]" />
                <h2 className="text-base font-bold text-primary">
                  {t.catalog.tabProducts} ({matchedProducts.length})
                </h2>
              </div>
              <div className="product-grid">
                {matchedProducts.map((product) => (
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
            </div>
          )}

        </div>
      )}
    </div>
  );
};
