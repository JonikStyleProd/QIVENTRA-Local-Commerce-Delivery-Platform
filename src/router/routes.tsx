import React from 'react';
import { RouteObject } from 'react-router';
import { RouteError } from '../pages/RouteError';
import { CartPage } from '../pages/CartPage';
import { CatalogPage } from '../pages/CatalogPage';
import { DeliveryPage } from '../pages/DeliveryPage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { OrdersPage } from '../pages/OrdersPage';
import { SearchPage } from '../pages/SearchPage';
import { StoreDetailPage } from '../pages/StoreDetailPage';
import { AppShell } from './AppShell';
import { RouteLoading } from './RouteLoading';
import { ROUTE_PATTERNS } from './paths';

const relative = (pattern: string) => pattern.replace(/^\//, '');

/** Workspaces and rarely opened screens load on demand. The buyer's path stays in the main bundle. */
const lazyPage = (pattern: string, load: () => Promise<{ Component: React.ComponentType }>): RouteObject => ({
  path: relative(pattern),
  lazy: load,
});

export const appRoutes: RouteObject[] = [
  {
    element: <AppShell />,
    errorElement: <RouteError />,
    HydrateFallback: RouteLoading,
    children: [
      { index: true, Component: HomePage },
      { path: relative(ROUTE_PATTERNS.catalog), Component: CatalogPage },
      { path: relative(ROUTE_PATTERNS.store), Component: StoreDetailPage },
      { path: relative(ROUTE_PATTERNS.cart), Component: CartPage },
      { path: relative(ROUTE_PATTERNS.delivery), Component: DeliveryPage },
      { path: relative(ROUTE_PATTERNS.orders), Component: OrdersPage },
      { path: relative(ROUTE_PATTERNS.order), Component: OrdersPage },
      { path: relative(ROUTE_PATTERNS.search), Component: SearchPage },
      lazyPage(ROUTE_PATTERNS.profile, () => import('../pages/ProfilePage').then((m) => ({ Component: m.ProfilePage }))),
      lazyPage(ROUTE_PATTERNS.vendor, () => import('../pages/VendorPortalPage').then((m) => ({ Component: m.VendorPortalPage }))),
      lazyPage(ROUTE_PATTERNS.courier, () => import('../pages/CourierPortalPage').then((m) => ({ Component: m.CourierPortalPage }))),
      lazyPage(ROUTE_PATTERNS.admin, () => import('../pages/AdminPortalPage').then((m) => ({ Component: m.AdminPortalPage }))),
      { path: '*', Component: NotFoundPage },
    ],
  },
];
