import { matchPath } from 'react-router';
import { AppRoute } from '../types';

/** Every address of the app. The route table and `navigateTo` are both built from this. */
export const ROUTE_PATTERNS: Record<Exclude<AppRoute, 'notFound'>, string> = {
  home: '/',
  catalog: '/shops',
  store: '/shops/:storeId',
  product: '/shops/:storeId/products/:productId',
  cart: '/cart',
  delivery: '/delivery',
  orders: '/orders',
  order: '/orders/:orderId',
  search: '/search',
  profile: '/profile',
  vendor: '/vendor',
  courier: '/courier',
  admin: '/admin',
  privacy: '/privacy',
  terms: '/terms',
  accessibility: '/accessibility',
};

export interface NavigationOptions {
  storeId?: string;
  productId?: string;
  orderId?: string;
  categorySlug?: string | null;
  searchQuery?: string;
}

/** The address of a screen. A screen missing its id falls back to its list. */
export const pathFor = (route: AppRoute, options: NavigationOptions = {}): string => {
  switch (route) {
    case 'store':
      return options.storeId ? `/shops/${encodeURIComponent(options.storeId)}` : ROUTE_PATTERNS.catalog;
    case 'product':
      if (!options.storeId) return ROUTE_PATTERNS.catalog;
      return options.productId
        ? `/shops/${encodeURIComponent(options.storeId)}/products/${encodeURIComponent(options.productId)}`
        : `/shops/${encodeURIComponent(options.storeId)}`;
    case 'order':
      return options.orderId ? `/orders/${encodeURIComponent(options.orderId)}` : ROUTE_PATTERNS.orders;
    case 'catalog':
      return options.categorySlug
        ? `${ROUTE_PATTERNS.catalog}?category=${encodeURIComponent(options.categorySlug)}`
        : ROUTE_PATTERNS.catalog;
    case 'search':
      return options.searchQuery
        ? `${ROUTE_PATTERNS.search}?q=${encodeURIComponent(options.searchQuery)}`
        : ROUTE_PATTERNS.search;
    case 'notFound':
      return '/404';
    default:
      return ROUTE_PATTERNS[route];
  }
};

/** Longer patterns first, so "/shops/x" never stops at "/shops". */
const MATCH_ORDER = (Object.entries(ROUTE_PATTERNS) as [Exclude<AppRoute, 'notFound'>, string][]).sort(
  (a, b) => b[1].length - a[1].length
);

export interface RouteMatch {
  route: AppRoute;
  params: Record<string, string | undefined>;
}

export const routeOfPath = (pathname: string): RouteMatch => {
  for (const [route, pattern] of MATCH_ORDER) {
    const match = matchPath({ path: pattern, end: true }, pathname);
    if (match) return { route, params: match.params };
  }
  return { route: 'notFound', params: {} };
};
