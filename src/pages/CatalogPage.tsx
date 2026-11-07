import React, { useMemo, useState } from 'react';
import { Leaf, Zap, Search, Store as StoreIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { MOCK_STORES, MOCK_PRODUCTS } from '../data/mockData';
import { COLLAGE_GROUPS, GROUP_TINT_CLASS, groupFromSlug, groupOfCategoryName } from '../data/collageCatalog';
import { StoreCard } from '../components/ui/StoreCard';
import { ProductCard } from '../components/ui/ProductCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { BottomPanel } from '../components/collage/BottomPanel';
import { CategoryChip } from '../components/collage/CategoryChip';
import { StepHeader } from '../components/collage/StepHeader';

type SortKey = 'deliveryTime' | 'minOrder';

/** Step 1 of the path: shop picker (N9-Stores / M9-Stores) with the existing filters and products tab. */
export const CatalogPage: React.FC = () => {
  const {
    selectedCategorySlug,
    setSelectedCategorySlug,
    selectedStoreId,
    pickStore,
    navigateTo,
    addToCart,
    updateCartQuantity,
    cart,
  } = useApp();

  const { language, t, formatTimeRange } = useLanguage();
  const copy = t.collage.stores;

  const [activeTab, setActiveTab] = useState<'stores' | 'products'>('stores');
  const [filterEcoOnly, setFilterEcoOnly] = useState(false);
  const [filterFreeDeliveryOnly, setFilterFreeDeliveryOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('deliveryTime');

  const activeGroup = groupFromSlug(selectedCategorySlug);

  const filteredStores = useMemo(() => {
    let list = [...MOCK_STORES];

    if (activeGroup !== 'all') {
      list = list.filter((s) => groupOfCategoryName(s.category) === activeGroup);
    }
    if (filterEcoOnly) {
      list = list.filter((s) => s.isEco);
    }
    if (filterFreeDeliveryOnly) {
      list = list.filter((s) => s.deliveryFee === 0);
    }

    if (sortBy === 'deliveryTime') {
      list.sort((a, b) => a.deliveryTimeMin - b.deliveryTimeMin);
    } else if (sortBy === 'minOrder') {
      list.sort((a, b) => a.minOrder - b.minOrder);
    }

    return list;
  }, [activeGroup, filterEcoOnly, filterFreeDeliveryOnly, sortBy]);

  const filteredProducts = useMemo(() => {
    if (activeGroup === 'all') return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter((p) => groupOfCategoryName(p.category) === activeGroup);
  }, [activeGroup]);

  const getInCartQuantity = (productId: string) => cart.find((i) => i.product.id === productId)?.quantity ?? 0;

  const resetFilters = () => {
    setSelectedCategorySlug(null);
    setFilterEcoOnly(false);
    setFilterFreeDeliveryOnly(false);
  };

  // The panel follows the mockups: it shows only while the picked shop is on screen.
  const pickedStore = filteredStores.find((s) => s.id === selectedStoreId);
  const pickedName = pickedStore
    ? t.collage.storeCopy[pickedStore.id]?.name || pickedStore.names?.[language] || pickedStore.name
    : '';

  return (
    <div
      className="paper-dots min-h-screen pb-[170px] desk:pb-[140px]"
      style={{ '--panel-bottom': 'calc(env(safe-area-inset-bottom, 0px) + 78px)' } as React.CSSProperties}
    >
      <StepHeader
        step={copy.step}
        title={copy.titleMobile}
        backLabel={copy.back}
        onBack={() => navigateTo('home')}
      />

      <section className="max-w-[1360px] mx-auto desk:px-10 desk:pt-2.5 pb-3 desk:pb-[30px]">
        <div className="hidden desk:block mb-6">
          <p className="hand anim-in inline-block text-[30px] text-action -rotate-2">{copy.step}</p>
          <h1 className="anim-in font-black tracking-[-0.03em] leading-none text-[clamp(46px,5.6vw,88px)]">{copy.title}</h1>
        </div>

        <div
          role="group"
          aria-label={copy.catLabel}
          className="scroll-row flex desk:flex-wrap gap-2 desk:gap-2.5 overflow-x-auto desk:overflow-visible px-4 desk:px-0 pt-3 pb-2 desk:py-0"
        >
          {COLLAGE_GROUPS.map((group) => (
            <CategoryChip
              key={group}
              label={t.collage.groups[group]}
              tintClassName={GROUP_TINT_CLASS[group]}
              isActive={activeGroup === group}
              onClick={() => setSelectedCategorySlug(group === 'all' ? null : group)}
            />
          ))}
        </div>

        {/* Existing catalog controls that the mockups do not show but the product keeps. */}
        <div className="scroll-row flex desk:flex-wrap items-center gap-2 mt-1 desk:mt-4 px-4 desk:px-0 pb-1 overflow-x-auto desk:overflow-visible">
          <div className="seg-group inline-flex shrink-0 bg-white border-2 border-ink rounded-xl overflow-hidden">
            {(['stores', 'products'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                aria-pressed={activeTab === tab}
                className={`min-h-11 px-3 text-sm font-extrabold cursor-pointer ${
                  activeTab === tab ? 'bg-ink text-white' : 'bg-white text-ink'
                }`}
              >
                {tab === 'stores' ? t.collage.tabs.shops : t.catalog.tabProducts}
              </button>
            ))}
          </div>
          <CategoryChip
            label={t.catalog.filterFreeDelivery}
            isActive={filterFreeDeliveryOnly}
            onClick={() => setFilterFreeDeliveryOnly(!filterFreeDeliveryOnly)}
            icon={<Zap aria-hidden="true" className="w-4 h-4" />}
          />
          <CategoryChip
            label={t.catalog.filterEco}
            isActive={filterEcoOnly}
            onClick={() => setFilterEcoOnly(!filterEcoOnly)}
            icon={<Leaf aria-hidden="true" className="w-4 h-4" />}
          />
          <label className="inline-flex items-center gap-1.5 shrink-0 text-sm font-extrabold whitespace-nowrap">
            <span>{t.catalog.sortLabel}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="min-h-11 px-2 bg-white border-2 border-ink rounded-xl font-extrabold cursor-pointer"
            >
              <option value="deliveryTime">{t.catalog.sortDeliverySpeed}</option>
              <option value="minOrder">{t.catalog.sortMinOrder}</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => navigateTo('search')}
            className="desk:hidden inline-flex items-center gap-1.5 shrink-0 min-h-11 px-2 text-sm font-extrabold underline cursor-pointer"
          >
            <Search aria-hidden="true" className="w-4 h-4" />
            {t.nav.search}
          </button>
        </div>
      </section>

      <section className="max-w-[1360px] mx-auto px-4 desk:px-10 pt-2.5 desk:pt-[30px]">
        {activeTab === 'stores' ? (
          filteredStores.length === 0 ? (
            <EmptyState title={copy.emptyT} description={copy.emptyD} actionText={copy.showAll} onAction={resetFilters} />
          ) : (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-[26px] desk:gap-x-[34px] desk:gap-y-[46px] desk:grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))]">
              {filteredStores.map((store, index) => (
                <li key={store.id} className="anim-drop" style={{ animationDelay: `${(index * 0.08).toFixed(2)}s` }}>
                  <StoreCard
                    store={store}
                    isSelected={store.id === selectedStoreId}
                    onClick={() => pickStore(store.id)}
                  />
                </li>
              ))}
            </ul>
          )
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            title={copy.emptyT}
            description={t.catalog.emptyProductsDesc}
            actionText={copy.showAll}
            onAction={resetFilters}
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
        )}
      </section>

      {pickedStore && (
        <BottomPanel
          note={copy.chosen}
          title={
            <>
              <bdi>{pickedName}</bdi> · {formatTimeRange(pickedStore.deliveryTimeMin, pickedStore.deliveryTimeMax)}
            </>
          }
        >
          <button
            type="button"
            onClick={() => navigateTo('store', { storeId: pickedStore.id })}
            aria-label={`${copy.openStore}: ${pickedName}`}
            className="chip-tilt inline-flex items-center justify-center gap-1.5 min-w-11 min-h-[52px] px-2.5 desk:px-4 bg-white border-2 border-ink rounded-[14px] font-extrabold cursor-pointer"
          >
            <StoreIcon aria-hidden="true" className="w-5 h-5 shrink-0" />
            <span className="hidden desk:inline whitespace-nowrap">{copy.openStore}</span>
          </button>
          <Button
            size="lg"
            onClick={() => {
              pickStore(pickedStore.id);
              navigateTo('delivery');
            }}
            className="whitespace-nowrap px-3.5 desk:px-6"
          >
            <span className="desk:hidden">{copy.nextMobile}</span>
            <span className="hidden desk:inline">{copy.next}</span>
          </Button>
        </BottomPanel>
      )}
    </div>
  );
};
