import { collageTranslations } from '../i18n/collage';
import { Language } from '../i18n/translations';
import { LocalizedText, Product, Store } from '../types';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_STORES } from './mockData';

const LANGUAGES: Language[] = ['ru', 'en', 'he'];

/** Case, Latin accents and Hebrew vowel marks do not change what a query finds. */
export const normalizeQuery = (text: string): string =>
  text
    .toLocaleLowerCase()
    .normalize('NFKD')
    .replace(/[̀-֑ͯ-ׇ]/g, '')
    .trim();

const texts = (localized?: Partial<LocalizedText>): string[] => (localized ? Object.values(localized) : []);

const categoryNames = (name: string): string[] => {
  const category = MOCK_CATEGORIES.find((candidate) => candidate.name === name);
  return [name, ...texts(category?.names)];
};

const storeText = (store: Store): string[] => [
  store.name,
  store.address,
  ...texts(store.names),
  ...texts(store.categories),
  ...texts(store.addresses),
  ...categoryNames(store.category),
  ...store.tags,
  ...LANGUAGES.flatMap((language) => {
    const copy = collageTranslations[language].storeCopy[store.id];
    return copy ? [copy.name, copy.kind, copy.area] : [];
  }),
];

const productText = (product: Product): string[] => [
  product.name,
  product.description,
  product.storeName,
  ...texts(product.names),
  ...texts(product.descriptions),
  ...texts(product.storeNames),
  ...categoryNames(product.category),
  ...(product.variants ?? []).flatMap((variant) => texts(variant.labels)),
  ...LANGUAGES.map((language) => collageTranslations[language].productLabels[product.id] ?? ''),
];

const matches = (haystack: string[], query: string): boolean =>
  haystack.some((text) => normalizeQuery(text).includes(query));

/** Shops and products for a query, in any of the three languages. An empty query matches everything. */
export const searchCatalog = (
  rawQuery: string,
  stores: Store[] = MOCK_STORES,
  products: Product[] = MOCK_PRODUCTS
): { stores: Store[]; products: Product[] } => {
  const query = normalizeQuery(rawQuery);
  if (!query) return { stores, products };
  return {
    stores: stores.filter((store) => matches(storeText(store), query)),
    products: products.filter((product) => matches(productText(product), query)),
  };
};

const SUGGESTION_COUNT = 6;

const capitalize = (text: string, language: Language): string =>
  text.charAt(0).toLocaleUpperCase(language) + text.slice(1);

/**
 * Sample queries built from the catalog: products on sale, with as many shops represented as fit.
 * Each one is a real product's short name, so it always finds that product.
 */
export const buildSearchSuggestions = (language: Language, products: Product[] = MOCK_PRODUCTS): string[] => {
  const labels = collageTranslations[language].productLabels;
  const onSale = products.filter((product) => product.inStock && labels[product.id]);
  const firstOfEachStore = onSale.filter(
    (product, index) => onSale.findIndex((other) => other.storeId === product.storeId) === index
  );
  const rest = onSale.filter((product) => !firstOfEachStore.includes(product));
  return [...firstOfEachStore, ...rest]
    .slice(0, SUGGESTION_COUNT)
    .map((product) => capitalize(labels[product.id], language));
};
