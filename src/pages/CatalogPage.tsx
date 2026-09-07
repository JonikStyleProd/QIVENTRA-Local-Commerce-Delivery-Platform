import React, { useState, useMemo } from 'react';
import { Leaf, Zap, ArrowUpDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { MOCK_CATEGORIES, MOCK_STORES, MOCK_PRODUCTS } from '../data/mockData';
import { StoreCard } from '../components/ui/StoreCard';
import { ProductCard } from '../components/ui/ProductCard';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';

export const CatalogPage: React.FC = () => {
  const {
    selectedCategorySlug,
    setSelectedCategorySlug,
    navigateTo,
    addToCart,
    updateCartQuantity,
    cart,
  } = useApp();

  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'stores' | 'products'>('stores');
  const [filterEcoOnly, setFilterEcoOnly] = useState(false);
  const [filterFreeDeliveryOnly, setFilterFreeDeliveryOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'deliveryTime' | 'minOrder'>('rating');

  const selectedCategory = useMemo(() => {
    if (!selectedCategorySlug) return null;
    return MOCK_CATEGORIES.find((c) => c.slug === selectedCategorySlug);
  }, [selectedCategorySlug]);

  const filteredStores = useMemo(() => {
    let list = [...MOCK_STORES];

    if (selectedCategory) {
      list = list.filter((s) => s.category.toLowerCase().includes(selectedCategory.slug.toLowerCase()) || (s.categories && Object.values(s.categories).some(v => typeof v === 'string' && v.toLowerCase().includes(selectedCategory.slug.toLowerCase()))));
    }

    if (filterEcoOnly) {
      list = list.filter((s) => s.isEco);
    }

    if (filterFreeDeliveryOnly) {
      list = list.filter((s) => s.deliveryFee === 0);
    }

    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'deliveryTime') {
      list.sort((a, b) => a.deliveryTimeMin - b.deliveryTimeMin);
    } else if (sortBy === 'minOrder') {
      list.sort((a, b) => a.minOrder - b.minOrder);
    }

    return list;
  }, [selectedCategory, filterEcoOnly, filterFreeDeliveryOnly, sortBy]);

  const filteredProducts = useMemo(() => {
    let list = [...MOCK_PRODUCTS];

    if (selectedCategory) {
      list = list.filter((p) => p.category.toLowerCase().includes(selectedCategory.slug.toLowerCase()));
    }

    return list;
  }, [selectedCategory]);

  const getInCartQuantity = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const getPlacesLabel = (count: number) => {
    if (language === 'he') {
      return `${count} ${t.catalog.allPlaces}`;
    }
    if (language === 'en') {
      return `${count} ${t.catalog.allPlaces}`;
    }
    return `${count} ${t.catalog.allPlaces}`;
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              {selectedCategory ? (selectedCategory.names?.[language] || selectedCategory.name) : t.catalog.title}
            </h1>
            <Badge variant="pistachio" size="sm">
              {getPlacesLabel(filteredStores.length)}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-secondary">
            {selectedCategory
              ? (selectedCategory.descriptions?.[language] || selectedCategory.description)
              : t.catalog.defaultSubtitle}
          </p>
        </div>

        {/* View Toggle Tabs (Stores vs Products) */}
        <div className="flex items-center bg-surface-elevated p-1 rounded-2xl border border-theme self-start">
          <button
            type="button"
            onClick={() => setActiveTab('stores')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition select-none ${
              activeTab === 'stores'
                ? 'bg-[#123B35] text-[#F3F1EA] shadow-xs'
                : 'text-secondary hover:text-primary'
            }`}
          >
            {t.catalog.tabStores} ({filteredStores.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition select-none ${
              activeTab === 'products'
                ? 'bg-[#123B35] text-[#F3F1EA] shadow-xs'
                : 'text-secondary hover:text-primary'
            }`}
          >
            {t.catalog.tabProducts} ({filteredProducts.length})
          </button>
        </div>
      </div>

      {/* Categories Horizontal Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 px-4 sm:px-0 -mx-4 sm:mx-0 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategorySlug(null)}
          className={`
            px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition border select-none
            ${
              selectedCategorySlug === null
                ? 'bg-[#123B35] text-[#F3F1EA] border-[#123B35]'
                : 'bg-surface text-secondary hover:text-primary border-theme'
            }
          `}
        >
          {t.catalog.allCategories}
        </button>

        {MOCK_CATEGORIES.map((cat) => {
          const isSelected = selectedCategorySlug === cat.slug;
          const catName = cat.names?.[language] || cat.name;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategorySlug(cat.slug)}
              className={`
                px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition border select-none
                ${
                  isSelected
                    ? 'bg-[#123B35] text-[#F3F1EA] border-[#123B35]'
                    : 'bg-surface text-secondary hover:text-primary border-theme'
                }
              `}
            >
              {catName}
            </button>
          );
        })}
      </div>

      {/* Quick Filters & Sorting Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-2 border-y border-theme">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setFilterFreeDeliveryOnly(!filterFreeDeliveryOnly)}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition select-none
              ${
                filterFreeDeliveryOnly
                  ? 'bg-[#123B35] text-[#F3F1EA] border-[#123B35]'
                  : 'bg-surface text-secondary hover:text-primary border-theme'
              }
            `}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{t.catalog.filterFreeDelivery}</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterEcoOnly(!filterEcoOnly)}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition select-none
              ${
                filterEcoOnly
                  ? 'bg-[#123B35] text-[#F3F1EA] border-[#123B35]'
                  : 'bg-surface text-secondary hover:text-primary border-theme'
              }
            `}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>{t.catalog.filterEco}</span>
          </button>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs text-secondary">
          <ArrowUpDown className="w-3.5 h-3.5 text-muted" />
          <span className="hidden sm:inline">{t.catalog.sortLabel}:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-surface border border-theme text-primary text-xs rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="rating">{t.catalog.sortRating}</option>
            <option value="deliveryTime">{t.catalog.sortDeliverySpeed}</option>
            <option value="minOrder">{t.catalog.sortMinOrder}</option>
          </select>
        </div>
      </div>

      {/* Content View: Stores or Products */}
      {activeTab === 'stores' ? (
        filteredStores.length === 0 ? (
          <EmptyState
            title={t.catalog.emptyStoresTitle}
            description={t.catalog.emptyStoresDesc}
            actionText={t.catalog.resetFilters}
            onAction={() => {
              setSelectedCategorySlug(null);
              setFilterEcoOnly(false);
              setFilterFreeDeliveryOnly(false);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onClick={() => navigateTo('store', { storeId: store.id })}
              />
            ))}
          </div>
        )
      ) : (
        filteredProducts.length === 0 ? (
          <EmptyState
            title={t.catalog.emptyProductsTitle}
            description={t.catalog.emptyProductsDesc}
            actionText={t.catalog.allProducts}
            onAction={() => setSelectedCategorySlug(null)}
          />
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
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
        )
      )}
    </div>
  );
};
