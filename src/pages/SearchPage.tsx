import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Leaf, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { MOCK_STORES, MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/mockData';
import { GROUP_TINT_CLASS, groupOfCategoryName } from '../data/collageCatalog';
import { CollageGroupId } from '../i18n/collage';
import { pathFor } from '../router/paths';
import { SearchBar } from '../components/ui/SearchBar';
import { StoreCard } from '../components/ui/StoreCard';
import { ProductCard } from '../components/ui/ProductCard';
import { EmptyState } from '../components/ui/EmptyState';
import { CategoryChip } from '../components/collage/CategoryChip';
import { PageHeading, PageShell, SectionHeading } from '../components/collage/Page';

export const SearchPage: React.FC = () => {
  const { navigateTo, addToCart, updateCartQuantity, cart } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') ?? '';
  const setSearchQuery = (next: string) =>
    setSearchParams(next ? { q: next } : {}, { replace: true, preventScrollReset: true });
  const { language, t } = useLanguage();
  const copy = t.screens.search;

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyEco, setOnlyEco] = useState<boolean>(false);

  const query = searchQuery.trim().toLowerCase();
  // Shops and products keep their category by name, while the chips carry its slug.
  const categoryName = MOCK_CATEGORIES.find((c) => c.slug === selectedCategory)?.name;

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
    if (categoryName) {
      stores = stores.filter((s) => s.category === categoryName);
    }
    if (onlyEco) {
      stores = stores.filter((s) => s.isEco);
    }
    return stores;
  }, [query, categoryName, onlyEco]);

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
    if (categoryName) {
      products = products.filter((p) => p.category === categoryName);
    }
    return products;
  }, [query, categoryName]);

  const getInCartQuantity = (productId: string) => cart.find((i) => i.product.id === productId)?.quantity ?? 0;

  const sampleQueries =
    language === 'he'
      ? ['אבוקדו האס', 'חלת שבת', 'גבינת עיזים', 'שמן זית', 'אוזניות TWS', 'פירות יער']
      : language === 'en'
      ? ['Hass Avocado', 'Fresh Challah', 'Goat Cheese', 'Olive Oil', 'TWS Earbuds', 'Fresh Berries']
      : ['Авокадо Hass', 'Свежая хала', 'Козий сыр', 'Оливковое масло', 'TWS наушники', 'Свежие ягоды'];

  const resetFilters = () => {
    setSelectedCategory('all');
    setOnlyEco(false);
  };

  const hasFilters = selectedCategory !== 'all' || onlyEco;

  return (
    <PageShell>
      <PageHeading note={copy.note} title={t.search.title} lead={t.search.subtitle} className="max-w-[900px]" />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        label={t.nav.search}
        placeholder={t.home.searchPlaceholder}
        className="max-w-[720px] mt-5"
      />

      <div className="flex flex-wrap items-center gap-2 mt-4">
        <span className="text-sm font-extrabold text-ink-2">{copy.examples}:</span>
        {sampleQueries.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSearchQuery(item)}
            className="chip-tilt min-h-11 px-3 bg-card border-2 border-ink rounded-xl text-sm font-bold cursor-pointer"
          >
            {item}
          </button>
        ))}
      </div>

      <div
        role="group"
        aria-label={t.catalog.allCategories}
        className="scroll-row flex desk:flex-wrap gap-2 -mx-4 px-4 desk:mx-0 desk:px-0 mt-4 pb-1 overflow-x-auto desk:overflow-visible"
      >
        <CategoryChip
          label={t.catalog.allCategories}
          isActive={selectedCategory === 'all'}
          onClick={() => setSelectedCategory('all')}
        />
        {MOCK_CATEGORIES.map((cat) => (
          <CategoryChip
            key={cat.id}
            label={cat.names?.[language] || cat.name}
            isActive={selectedCategory === cat.slug}
            tintClassName={GROUP_TINT_CLASS[groupOfCategoryName(cat.name) as CollageGroupId] ?? 'bg-card'}
            onClick={() => setSelectedCategory(cat.slug)}
          />
        ))}
        <CategoryChip
          label={t.catalog.filterEco}
          isActive={onlyEco}
          icon={<Leaf aria-hidden="true" className="w-4 h-4" />}
          onClick={() => setOnlyEco(!onlyEco)}
        />
      </div>

      <div className="mt-8 desk:mt-10">
        {!query && !hasFilters ? (
          <EmptyState
            icon={<Search aria-hidden="true" className="w-8 h-8" />}
            title={copy.start}
            description={t.search.startTypingSubtitle}
          />
        ) : matchedStores.length === 0 && matchedProducts.length === 0 ? (
          <EmptyState
            title={copy.nothing}
            description={`${query ? `${t.search.noResultsTitle}: «${searchQuery.trim()}». ` : ''}${t.search.noResultsSubtitle}`}
            actionText={hasFilters ? copy.clearFilters : t.search.openCatalog}
            onAction={hasFilters ? resetFilters : () => navigateTo('catalog')}
          />
        ) : (
          <div className="space-y-10">
            {matchedStores.length > 0 && (
              <section>
                <SectionHeading title={`${t.catalog.tabStores} (${matchedStores.length})`} />
                <ul className="grid grid-cols-2 gap-x-4 gap-y-[26px] pt-2 desk:gap-x-[34px] desk:gap-y-[46px] desk:grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))]">
                  {matchedStores.map((store, index) => (
                    <li key={store.id} className="anim-drop" style={{ animationDelay: `${(index * 0.08).toFixed(2)}s` }}>
                      <StoreCard store={store} to={pathFor('store', { storeId: store.id })} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {matchedProducts.length > 0 && (
              <section>
                <SectionHeading title={`${t.catalog.tabProducts} (${matchedProducts.length})`} />
                <div className="product-grid pt-2">
                  {matchedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      inCartQuantity={getInCartQuantity(product.id)}
                      onAddToCart={addToCart}
                      onUpdateQuantity={updateCartQuantity}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </PageShell>
  );
};
