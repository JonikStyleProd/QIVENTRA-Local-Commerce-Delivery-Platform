import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Leaf, Zap, Search, Store as StoreIcon } from 'lucide-react';
import { usePromotions } from '../context/PromotionsContext';
import { ProductLabel, filterProductsByLabels } from '../data/promotions';
import { FACT_LABEL_ICON } from '../components/collage/ProductLabelChips';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { MOCK_STORES, MOCK_PRODUCTS } from '../data/mockData';
import { GROUP_TINT_CLASS, groupFromSlug, groupOfCategoryName, visibleGroups } from '../data/collageCatalog';
import { ComingSoon } from '../components/collage/ComingSoon';
import { StoreCard } from '../components/ui/StoreCard';
import { ProductCard } from '../components/ui/ProductCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { BottomPanel } from '../components/collage/BottomPanel';
import { CategoryChip } from '../components/collage/CategoryChip';
import { StepHeader } from '../components/collage/StepHeader';
import { pathFor } from '../router/paths';
import { Store } from '../types';

type SortKey = 'distance' | 'deliveryTime' | 'minOrder';

/** Step 1 of the path: shop picker (N9-Stores / M9-Stores) with the existing filters and products tab. */
export const CatalogPage: React.FC = () => {
  const {
    selectedStoreId,
    pickStore,
    deliveryFor,
    currentAddressId,
    navigateTo,
    addToCart,
    updateCartQuantity,
    cart,
  } = useApp();

  const { language, t, formatTimeRange } = useLanguage();
  const { labelsFor } = usePromotions();
  const copy = t.collage.stores;

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategorySlug = searchParams.get('category');
  const activeTab: 'stores' | 'products' = searchParams.get('tab') === 'products' ? 'products' : 'stores';

  // Category and tab live in the address, so a shared link and "Back" return to the same view.
  const updateParam = (key: string, value: string | null) =>
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true, preventScrollReset: true }
    );
  const setSelectedCategorySlug = (slug: string | null) => updateParam('category', slug);
  const setActiveTab = (tab: 'stores' | 'products') => updateParam('tab', tab === 'products' ? tab : null);
  const [filterEcoOnly, setFilterEcoOnly] = useState(false);
  const [filterFreeDeliveryOnly, setFilterFreeDeliveryOnly] = useState(false);
  const [filterKosher, setFilterKosher] = useState(false);
  const [filterVegan, setFilterVegan] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('distance');

  const activeGroup = groupFromSlug(selectedCategorySlug);
  const isComingSoon = activeGroup !== 'all' && !visibleGroups.includes(activeGroup as (typeof visibleGroups)[number]);

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

    // Whatever the sort, shops that cannot reach the address come after the ones that can.
    const rank = (a: Store, b: Store) => {
      const [first, second] = [deliveryFor(a.id), deliveryFor(b.id)];
      if (first.inRange !== second.inRange) return first.inRange ? -1 : 1;
      if (sortBy === 'distance') return first.km - second.km;
      if (sortBy === 'deliveryTime') return first.timeMin - second.timeMin;
      return a.minOrder - b.minOrder;
    };
    return list.sort(rank);
  }, [activeGroup, filterEcoOnly, filterFreeDeliveryOnly, sortBy, deliveryFor, currentAddressId]);

  const requiredLabels = useMemo(() => {
    const required: ProductLabel[] = [];
    if (filterEcoOnly) required.push('eco');
    if (filterKosher) required.push('kosher');
    if (filterVegan) required.push('vegan');
    return required;
  }, [filterEcoOnly, filterKosher, filterVegan]);

  const filteredProducts = useMemo(() => {
    const inGroup =
      activeGroup === 'all' ? MOCK_PRODUCTS : MOCK_PRODUCTS.filter((p) => groupOfCategoryName(p.category) === activeGroup);
    return filterProductsByLabels(inGroup, requiredLabels, labelsFor);
  }, [activeGroup, requiredLabels, labelsFor]);

  const getInCartQuantity = (productId: string) => cart.find((i) => i.product.id === productId)?.quantity ?? 0;

  const resetFilters = () => {
    setSelectedCategorySlug(null);
    setFilterEcoOnly(false);
    setFilterFreeDeliveryOnly(false);
    setFilterKosher(false);
    setFilterVegan(false);
  };

  // The panel follows the mockups: it shows only while the picked shop is on screen.
  const pickedStore = filteredStores.find((s) => s.id === selectedStoreId && deliveryFor(s.id).inRange);
  const pickedName = pickedStore
    ? t.collage.storeCopy[pickedStore.id]?.name || pickedStore.names?.[language] || pickedStore.name
    : '';

  return (
    <div className="paper-dots min-h-screen pb-10">
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
          {visibleGroups.map((group) => (
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
          <div className="seg-group inline-flex shrink-0 bg-card border-2 border-ink rounded-xl overflow-hidden">
            {(['stores', 'products'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                aria-pressed={activeTab === tab}
                className={`min-h-11 px-3 text-sm font-extrabold cursor-pointer ${
                  activeTab === tab ? 'bg-ink text-paper' : 'bg-card text-ink'
                }`}
              >
                {tab === 'stores' ? t.collage.tabs.shops : t.catalog.tabProducts}
              </button>
            ))}
          </div>
          {/* A delivery fee belongs to a shop, so this filter has no meaning on the products tab. */}
          {activeTab === 'stores' && (
            <CategoryChip
              label={t.catalog.filterFreeDelivery}
              isActive={filterFreeDeliveryOnly}
              onClick={() => setFilterFreeDeliveryOnly(!filterFreeDeliveryOnly)}
              icon={<Zap aria-hidden="true" className="w-4 h-4" />}
            />
          )}
          <CategoryChip
            label={t.catalog.filterEco}
            isActive={filterEcoOnly}
            onClick={() => setFilterEcoOnly(!filterEcoOnly)}
            icon={<Leaf aria-hidden="true" className="w-4 h-4" />}
          />
          {activeTab === 'products' && (
            <>
              <CategoryChip
                label={t.promotions.labels.kosher}
                isActive={filterKosher}
                onClick={() => setFilterKosher(!filterKosher)}
                icon={FACT_LABEL_ICON.kosher}
              />
              <CategoryChip
                label={t.promotions.labels.vegan}
                isActive={filterVegan}
                onClick={() => setFilterVegan(!filterVegan)}
                icon={FACT_LABEL_ICON.vegan}
              />
            </>
          )}
          {activeTab === 'stores' && (
            <label className="inline-flex items-center gap-1.5 shrink-0 text-sm font-extrabold whitespace-nowrap">
              <span>{t.catalog.sortLabel}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="min-h-11 px-2 bg-card border-2 border-ink rounded-xl font-extrabold cursor-pointer"
              >
                <option value="distance">{t.demo.delivery.sortNear}</option>
                <option value="deliveryTime">{t.catalog.sortDeliverySpeed}</option>
                <option value="minOrder">{t.catalog.sortMinOrder}</option>
              </select>
            </label>
          )}
          <Link
            to={pathFor('search')}
            className="desk:hidden inline-flex items-center gap-1.5 shrink-0 min-h-11 px-2 text-sm font-extrabold underline cursor-pointer"
          >
            <Search aria-hidden="true" className="w-4 h-4" />
            {t.nav.search}
          </Link>
        </div>
      </section>

      <section className="max-w-[1360px] mx-auto px-4 desk:px-10 pt-2.5 desk:pt-[30px]">
        <ComingSoon className="mb-4" />
        {activeTab === 'stores' ? (
          filteredStores.length === 0 ? (
            <EmptyState
              title={isComingSoon ? t.demo.coming.emptyTitle : copy.emptyT}
              description={isComingSoon ? t.demo.coming.emptyDesc : copy.emptyD}
              actionText={copy.showAll}
              onAction={resetFilters}
            />
          ) : (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-[26px] desk:gap-x-[34px] desk:gap-y-[46px] desk:grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))]">
              {filteredStores.map((store, index) => (
                <li key={store.id} className="anim-drop" style={{ animationDelay: `${(index * 0.08).toFixed(2)}s` }}>
                  <StoreCard
                    store={store}
                    isSelected={store.id === selectedStoreId && deliveryFor(store.id).inRange}
                    to={deliveryFor(store.id).inRange ? undefined : pathFor('store', { storeId: store.id })}
                    onClick={() => pickStore(store.id)}
                  />
                </li>
              ))}
            </ul>
          )
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            title={requiredLabels.length > 0 ? t.promotions.filters.emptyTitle : copy.emptyT}
            description={requiredLabels.length > 0 ? t.promotions.filters.emptyDesc : t.catalog.emptyProductsDesc}
            actionText={requiredLabels.length > 0 ? t.promotions.filters.reset : copy.showAll}
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
              <bdi>{pickedName}</bdi> · {formatTimeRange(deliveryFor(pickedStore.id).timeMin, deliveryFor(pickedStore.id).timeMax)}
            </>
          }
        >
          <Link
            to={pathFor('store', { storeId: pickedStore.id })}
            aria-label={`${copy.openStore}: ${pickedName}`}
            className="chip-tilt inline-flex items-center justify-center gap-1.5 min-w-11 min-h-[52px] px-2.5 desk:px-4 bg-card border-2 border-ink rounded-[14px] font-extrabold cursor-pointer"
          >
            <StoreIcon aria-hidden="true" className="w-5 h-5 shrink-0" />
            <span className="hidden desk:inline whitespace-nowrap">{copy.openStore}</span>
          </Link>
          <Button
            size="lg"
            onClick={() => {
              pickStore(pickedStore.id);
              // With an empty basket there is nothing to deliver yet, so the next step is the shop's goods.
              navigateTo(cart.length > 0 ? 'delivery' : 'store', { storeId: pickedStore.id });
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
