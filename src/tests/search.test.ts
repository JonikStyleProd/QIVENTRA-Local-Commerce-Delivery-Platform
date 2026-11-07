import { describe, expect, it } from 'vitest';
import { categoriesWithStores, comingSoonCategories, groupOfCategoryName, visibleGroups } from '../data/collageCatalog';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_STORES } from '../data/mockData';
import { filterProductsByLabels } from '../data/promotions';
import { buildSearchSuggestions, normalizeQuery, searchCatalog } from '../data/search';

const LANGUAGES = ['ru', 'en', 'he'] as const;

describe('search suggestions', () => {
  it.each(LANGUAGES)('each suggestion finds something in %s', (language) => {
    const suggestions = buildSearchSuggestions(language);
    expect(suggestions.length).toBeGreaterThanOrEqual(4);
    suggestions.forEach((suggestion) => {
      const found = searchCatalog(suggestion);
      expect(found.stores.length + found.products.length, `${language}: ${suggestion}`).toBeGreaterThan(0);
    });
  });

  it('offers only products on sale, and covers several shops', () => {
    const inStock = MOCK_PRODUCTS.map((product) => ({ ...product, inStock: product.id === 'prod-1' }));
    expect(buildSearchSuggestions('en', inStock)).toEqual(['Labneh']);
    const shops = new Set(
      buildSearchSuggestions('en').map((label) => searchCatalog(label).products[0]?.storeId)
    );
    expect(shops.size).toBeGreaterThanOrEqual(4);
  });

  it('no longer offers what found nothing before', () => {
    expect(buildSearchSuggestions('ru')).not.toContain('Свежие ягоды');
  });
});

describe('search', () => {
  it('finds the same product from any language', () => {
    ['хала', 'challah', 'חלה', 'CHALLAH'].forEach((query) => {
      expect(searchCatalog(query).products.map((product) => product.id), query).toContain('prod-4');
    });
  });

  it('finds shops by name, kind, area and address', () => {
    ['Sarona', 'Электроника', 'Яффо', 'Dizengoff', 'דיזנגוף'].forEach((query) => {
      expect(searchCatalog(query).stores.length, query).toBeGreaterThan(0);
    });
  });

  it('finds products by category and variant', () => {
    expect(searchCatalog('Flowers & Gifts').products.map((product) => product.id)).toContain('prod-11');
    expect(searchCatalog('терракота').products.map((product) => product.id)).toEqual(['prod-10']);
  });

  it('ignores case, spaces and Hebrew vowel marks', () => {
    expect(normalizeQuery('  ChAlLaH ')).toBe('challah');
    expect(normalizeQuery('חַלָּה')).toBe('חלה');
  });

  it('returns everything for an empty query and nothing for nonsense', () => {
    expect(searchCatalog('   ').products).toHaveLength(MOCK_PRODUCTS.length);
    const none = searchCatalog('zzzzzz');
    expect(none.stores).toHaveLength(0);
    expect(none.products).toHaveLength(0);
  });
});

describe('filters on products', () => {
  const labelsFor = (id: string) => (id === 'prod-12' ? (['kosher', 'vegan'] as const).slice() : id === 'prod-3' ? (['eco'] as const).slice() : []);

  it('keeps only products with every requested label', () => {
    expect(filterProductsByLabels(MOCK_PRODUCTS, ['kosher'], labelsFor).map((p) => p.id)).toEqual(['prod-12']);
    expect(filterProductsByLabels(MOCK_PRODUCTS, ['kosher', 'vegan'], labelsFor).map((p) => p.id)).toEqual(['prod-12']);
    expect(filterProductsByLabels(MOCK_PRODUCTS, ['kosher', 'eco'], labelsFor)).toHaveLength(0);
    expect(filterProductsByLabels(MOCK_PRODUCTS, [], labelsFor)).toHaveLength(MOCK_PRODUCTS.length);
  });
});

describe('categories and shops', () => {
  it('splits categories into those with shops and those coming soon', () => {
    expect(categoriesWithStores.length + comingSoonCategories.length).toBe(MOCK_CATEGORIES.length);
    expect(comingSoonCategories.map((category) => category.slug).sort()).toEqual(['pets', 'sports']);
    categoriesWithStores.forEach((category) => {
      expect(MOCK_STORES.some((store) => store.category === category.name)).toBe(true);
    });
  });

  it('shows a chip only for a group with shops', () => {
    expect(visibleGroups).not.toContain('pets');
    visibleGroups
      .filter((group) => group !== 'all')
      .forEach((group) => {
        expect(MOCK_STORES.some((store) => groupOfCategoryName(store.category) === group), group).toBe(true);
      });
  });
});
