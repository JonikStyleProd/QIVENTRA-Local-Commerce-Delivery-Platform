import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Leaf, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { MOCK_CATEGORIES } from '../data/mockData';
import { GROUP_TINT_CLASS, categoriesWithStores, groupOfCategoryName } from '../data/collageCatalog';
import { filterProductsByLabels } from '../data/promotions';
import { buildSearchSuggestions, searchCatalog } from '../data/search';
import { usePromotions } from '../context/PromotionsContext';
import { ComingSoon } from '../components/collage/ComingSoon';
import { CollageGroupId } from '../i18n/collage';
import { pathFor } from '../router/paths';
import { SearchBar } from '../components/ui/SearchBar';
import { StoreCard } from '../components/ui/StoreCard';
import { ProductCard } from '../components/ui/ProductCard';
import { EmptyState } from '../components/ui/EmptyState';
import { CategoryChip } from '../components/collage/CategoryChip';
import { PageHeading, PageShell, SectionHeading } from '../components/collage/Page';

export const SearchPage: React.FC = () => {
  const { navigateTo, addToCart, updateCartQuantity, quantityInCart } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') ?? '';
  const setSearchQuery = (next: string) =>
    setSearchParams(next ? { q: next } : {}, { replace: true, preventScrollReset: true });
  const { language, t } = useLanguage();
  const { labelsFor } = usePromotions();
  const copy = t.screens.search;

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyEco, setOnlyEco] = useState<boolean>(false);

  const query = searchQuery.trim();
  // Shops and products keep their category by name, while the chips carry its slug.
  const categoryName = MOCK_CATEGORIES.find((c) => c.slug === selectedCategory)?.name;

  const { matchedStores, matchedProducts } = useMemo(() => {
    const found = searchCatalog(query);
    const stores = found.stores.filter(
      (store) => (!categoryName || store.category === categoryName) && (!onlyEco || store.isEco)
    );
    const products = filterProductsByLabels(
      found.products.filter((product) => !categoryName || product.category === categoryName),
      onlyEco ? ['eco'] : [],
      labelsFor
    );
    return { matchedStores: stores, matchedProducts: products };
  }, [query, categoryName, onlyEco, labelsFor]);

  const sampleQueries = useMemo(() => buildSearchSuggestions(language), [language]);

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
        {categoriesWithStores.map((cat) => (
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

      <ComingSoon className="mt-3" />

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
                      inCartQuantity={quantityInCart(product.id)}
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
