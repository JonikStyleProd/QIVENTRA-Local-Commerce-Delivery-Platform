import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes, createMemoryRouter, matchRoutes, RouterProvider } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '../context/LanguageContext';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider } from '../context/ToastContext';
import { AppProvider } from '../context/AppContext';
import { shareLink } from '../hooks/useShare';
import { translations } from '../i18n/translations';
import { OrderPage } from '../pages/OrderPage';
import { ROUTE_PATTERNS, pathFor, routeOfPath } from '../router/paths';
import { appRoutes } from '../router/routes';
import { pageTitle } from '../router/usePageTitle';
import { AppRoute } from '../types';

const PROVIDERS = (children: React.ReactNode) =>
  React.createElement(ThemeProvider, null, React.createElement(LanguageProvider, null, React.createElement(ToastProvider, null, children)));

const ADDRESSES: [string, AppRoute][] = [
  ['/', 'home'],
  ['/shops', 'catalog'],
  ['/shops/store-3', 'store'],
  ['/shops/store-3/products/prod-4', 'product'],
  ['/cart', 'cart'],
  ['/delivery', 'delivery'],
  ['/orders', 'orders'],
  ['/orders/ord-84920', 'order'],
  ['/search', 'search'],
  ['/profile', 'profile'],
  ['/vendor', 'vendor'],
  ['/courier', 'courier'],
  ['/admin', 'admin'],
  ['/privacy', 'privacy'],
  ['/terms', 'terms'],
  ['/accessibility', 'accessibility'],
];

describe('addresses', () => {
  it.each(ADDRESSES)('%s opens %s', (address, route) => {
    expect(routeOfPath(address).route).toBe(route);
    expect(routeOfPath(`${address}/`.replace('//', '/')).route).toBe(route);
  });

  it.each(['/nope', '/shops/store-3/products', '/orders/1/2', '/shops/store-3/products/prod-4/extra'])('%s is not found', (address) => {
    expect(routeOfPath(address).route).toBe('notFound');
  });

  it('reads ids from the address', () => {
    expect(routeOfPath('/shops/store-3/products/prod-4').params).toMatchObject({ storeId: 'store-3', productId: 'prod-4' });
    expect(routeOfPath('/orders/ord-1').params).toMatchObject({ orderId: 'ord-1' });
  });

  it('builds the address back from a screen and its ids', () => {
    expect(pathFor('store', { storeId: 'store-3' })).toBe('/shops/store-3');
    expect(pathFor('product', { storeId: 'store-3', productId: 'prod-4' })).toBe('/shops/store-3/products/prod-4');
    expect(pathFor('order', { orderId: 'ord-1' })).toBe('/orders/ord-1');
    expect(pathFor('search', { searchQuery: 'хала и кофе' })).toBe(`/search?q=${encodeURIComponent('хала и кофе')}`);
    expect(pathFor('catalog', { categorySlug: 'food' })).toBe('/shops?category=food');
    expect(pathFor('order')).toBe('/orders');
    expect(pathFor('store')).toBe('/shops');
  });

  it('keeps every screen in the route table', () => {
    Object.values(ROUTE_PATTERNS).forEach((pattern) => {
      const sample = pattern.replace(/:[a-zA-Z]+/g, 'x');
      const matches = matchRoutes(appRoutes, sample);
      expect(matches?.at(-1)?.route.path, pattern).not.toBe('*');
    });
    expect(matchRoutes(appRoutes, '/no/such/page')?.at(-1)?.route.path).toBe('*');
  });

  it('sends every address to the app on the server', () => {
    const config = JSON.parse(fs.readFileSync(path.resolve('vercel.json'), 'utf8'));
    expect(config.rewrites).toContainEqual({ source: '/(.*)', destination: '/index.html' });
  });
});

describe('screens by their address', () => {
  const renderAt = (address: string) =>
    renderToString(PROVIDERS(React.createElement(RouterProvider, { router: createMemoryRouter(appRoutes, { initialEntries: [address] }) })));

  it.each(['/', '/shops', '/cart', '/orders', '/search'])('%s renders', (address) => {
    expect(renderAt(address)).toContain('id="main-content"');
  });

  it('shows the not found screen for an unknown address, an unknown shop and a stranger\'s order', () => {
    const notFound = (address: string) => renderAt(address);
    const titles = Object.values(translations).map((t) => t.demo.notFound.title);
    expect(titles.some((title) => notFound('/no/such/page').includes(title))).toBe(true);
    const storeTitles = Object.values(translations).map((t) => t.demo.notFound.storeTitle);
    expect(storeTitles.some((title) => notFound('/shops/no-such-shop').includes(title))).toBe(true);
  });

  it('says an order from someone else was not found', () => {
    const html = renderToString(
      PROVIDERS(
        React.createElement(
          MemoryRouter,
          { initialEntries: ['/orders/ord-not-mine'] },
          React.createElement(
            Routes,
            null,
            React.createElement(Route, {
              path: '/orders/:orderId',
              element: React.createElement(AppProvider, null, React.createElement(OrderPage)),
            })
          )
        )
      )
    );
    const titles = Object.values(translations).map((t) => t.demo.notFound.orderTitle);
    expect(titles.some((title) => html.includes(title))).toBe(true);
  });
});

describe('tab titles', () => {
  it.each(Object.keys(translations) as (keyof typeof translations)[])('names every screen in %s', (language) => {
    const t = translations[language];
    const titles = ADDRESSES.map(([address]) => pageTitle(address, t, language));
    titles.forEach((title) => expect(title).toContain('QIVENTRA'));
    expect(new Set(titles).size).toBe(titles.length);
    expect(pageTitle('/nope', t, language)).toContain(t.demo.titles.notFound);
    expect(pageTitle('/shops/nope', t, language)).toContain(t.demo.titles.notFound);
    expect(pageTitle('/shops/store-3', t, language)).toContain(t.collage.storeCopy['store-3'].name);
  });
});

describe('sharing', () => {
  const data = { title: 't', text: 'x', url: 'https://example.test/shops/store-3' };

  it('uses the share sheet when there is one', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    expect(await shareLink(data, { share } as unknown as Navigator)).toBe('shared');
    expect(share).toHaveBeenCalledWith(data);
  });

  it('does nothing more when the sheet is closed', async () => {
    const writeText = vi.fn();
    const share = vi.fn().mockRejectedValue(Object.assign(new Error('x'), { name: 'AbortError' }));
    expect(await shareLink(data, { share, clipboard: { writeText } } as unknown as Navigator)).toBe('cancelled');
    expect(writeText).not.toHaveBeenCalled();
  });

  it('copies the real address otherwise', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    expect(await shareLink(data, { clipboard: { writeText } } as unknown as Navigator)).toBe('copied');
    expect(writeText).toHaveBeenCalledWith(data.url);
  });

  it('reports a failure instead of claiming success', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    expect(await shareLink(data, { clipboard: { writeText } } as unknown as Navigator)).toBe('failed');
  });
});
