import { describe, it, expect } from 'vitest';
import { translations } from '../i18n/translations';

describe('QIVENTRA Cart & Financial Logic', () => {
  const lineFor = async (productId: string, quantity = 1) => {
    const { MOCK_PRODUCTS } = await import('../data/mockData');
    return { product: MOCK_PRODUCTS.find((p) => p.id === productId)!, quantity };
  };

  it('takes the delivery fee from the shop, whatever the basket total', async () => {
    const { summarizeOrderStores, orderDeliveryFee } = await import('../data/cartRules');
    // Jaffa charges 18, even far above the old 100 threshold.
    const jaffa = summarizeOrderStores([await lineFor('prod-11', 5)], null);
    expect(orderDeliveryFee(jaffa)).toBe(18);
    // Levinsky charges 0, even below it.
    const levinsky = summarizeOrderStores([await lineFor('prod-4')], null);
    expect(orderDeliveryFee(levinsky)).toBe(0);
    expect(orderDeliveryFee(summarizeOrderStores([], 'store-4'))).toBe(0);
  });

  it('pays each shop its own fee, including a picked shop with no goods yet', async () => {
    const { summarizeOrderStores, orderDeliveryFee } = await import('../data/cartRules');
    const mixed = summarizeOrderStores([await lineFor('prod-11'), await lineFor('prod-9')], null);
    expect(orderDeliveryFee(mixed)).toBe(18 + 12);
    const picked = summarizeOrderStores([await lineFor('prod-4')], 'store-4');
    expect(orderDeliveryFee(picked)).toBe(18);
  });

  it('reports how much each shop is short of its minimum order', async () => {
    const { summarizeOrderStores } = await import('../data/cartRules');
    const [below] = summarizeOrderStores([await lineFor('prod-4')], null);
    expect(below.shortfall).toBe(45 - 16);
    const [met] = summarizeOrderStores([await lineFor('prod-4', 3)], null);
    expect(met.shortfall).toBe(0);
    const pickedEmpty = summarizeOrderStores([await lineFor('prod-4', 3)], 'store-4');
    expect(pickedEmpty.find((l) => l.store.id === 'store-4')?.shortfall).toBe(90);
  });

  it('formats shekels through Intl in each language', async () => {
    const { formatShekels } = await import('../i18n/format');
    const plain = (text: string) => text.replace(/[\u200e\u200f\u061c]/g, '').replace(/\u00a0/g, ' ');
    expect(plain(formatShekels(45, 'ru'))).toBe('45 ₪');
    expect(plain(formatShekels(45, 'en'))).toBe('₪45');
    expect(plain(formatShekels(45, 'he'))).toContain('45');
    expect(plain(formatShekels(45, 'he'))).toContain('₪');
    expect(plain(formatShekels(12.5, 'en'))).toBe('₪12.50');
  });
});

describe('QIVENTRA pages', () => {
  it('renders App component without throwing', async () => {
    const React = await import('react');
    const { renderToString } = await import('react-dom/server');
    const { createMemoryRouter, RouterProvider } = await import('react-router');
    const { appRoutes } = await import('../router/routes');
    const { ThemeProvider } = await import('../context/ThemeContext');
    const { LanguageProvider } = await import('../context/LanguageContext');
    const { ToastProvider } = await import('../context/ToastContext');
    const router = createMemoryRouter(appRoutes, { initialEntries: ['/'] });
    const html = renderToString(
      React.createElement(
        ThemeProvider,
        null,
        React.createElement(
          LanguageProvider,
          null,
          React.createElement(ToastProvider, null, React.createElement(RouterProvider, { router }))
        )
      )
    );
    expect(html).toBeTruthy();
  });

  it('renders all individual page components without throwing', async () => {
    const React = await import('react');
    const { renderToString } = await import('react-dom/server');
    const { ThemeProvider } = await import('../context/ThemeContext');
    const { LanguageProvider } = await import('../context/LanguageContext');
    const { ToastProvider } = await import('../context/ToastContext');
    const { AppProvider } = await import('../context/AppContext');
    const { MemoryRouter, Routes, Route } = await import('react-router');

    const { HomePage } = await import('../pages/HomePage');
    const { CatalogPage } = await import('../pages/CatalogPage');
    const { SearchPage } = await import('../pages/SearchPage');
    const { OrdersPage } = await import('../pages/OrdersPage');
    const { CartPage } = await import('../pages/CartPage');
    const { DeliveryPage } = await import('../pages/DeliveryPage');
    const { ProfilePage } = await import('../pages/ProfilePage');
    const { StoreDetailPage } = await import('../pages/StoreDetailPage');
    const { VendorPortalPage } = await import('../pages/VendorPortalPage');
    const { CourierPortalPage } = await import('../pages/CourierPortalPage');
    const { AdminPortalPage } = await import('../pages/AdminPortalPage');

    const pages = [
      HomePage,
      CatalogPage,
      SearchPage,
      OrdersPage,
      CartPage,
      DeliveryPage,
      ProfilePage,
      StoreDetailPage,
      VendorPortalPage,
      CourierPortalPage,
      AdminPortalPage,
    ];

    for (const Page of pages) {
      const wrapped = React.createElement(
        ThemeProvider,
        null,
        React.createElement(
          LanguageProvider,
          null,
          React.createElement(
            ToastProvider,
            null,
            React.createElement(
              MemoryRouter,
              { initialEntries: ['/shops/store-1'] },
              React.createElement(
                Routes,
                null,
                React.createElement(Route, {
                  path: '/shops/:storeId',
                  element: React.createElement(AppProvider, null, React.createElement(Page)),
                })
              )
            )
          )
        )
      );
      const str = renderToString(wrapped);
      expect(str).toBeTruthy();
    }
  });
});

describe('QIVENTRA PWA Suite', () => {
  it('validates PWA manifest requirements', async () => {
    const fs = await import('fs');
    const path = await import('path');

    const manifestPath = path.resolve(process.cwd(), 'public/manifest.webmanifest');
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    expect(manifest.id).toBe('/');
    expect(manifest.name).toBe('QIVENTRA');
    expect(manifest.short_name).toBe('QIVENTRA');
    expect(manifest.display).toBe('standalone');
    expect(manifest.theme_color).toBe('#FFF8EC');
    expect(manifest.background_color).toBe('#FFD84D');
    expect(manifest.icons).toHaveLength(4);

    const iconSrcs = manifest.icons.map((i: { src: string }) => i.src);
    expect(iconSrcs).toContain('/icons/qiventra-icon-v3-192.png');
    expect(iconSrcs).toContain('/icons/qiventra-icon-v3-512.png');
    expect(iconSrcs).toContain('/icons/qiventra-maskable-v3-192.png');
    expect(iconSrcs).toContain('/icons/qiventra-maskable-v3-512.png');
  });

  it('ensures all versioned PWA icon files exist in /public/icons/', async () => {
    const fs = await import('fs');
    const path = await import('path');

    const expectedIcons = [
      'qiventra-icon-v3-48.png',
      'qiventra-icon-v3-72.png',
      'qiventra-icon-v3-96.png',
      'qiventra-icon-v3-128.png',
      'qiventra-icon-v3-144.png',
      'qiventra-icon-v3-192.png',
      'qiventra-icon-v3-384.png',
      'qiventra-icon-v3-512.png',
      'qiventra-maskable-v3-192.png',
      'qiventra-maskable-v3-512.png',
      'qiventra-apple-touch-v3-180.png',
      'qiventra-favicon-v3-32.png',
    ];

    expectedIcons.forEach((filename) => {
      const p = path.resolve(process.cwd(), 'public/icons', filename);
      expect(fs.existsSync(p), `Missing icon file: ${filename}`).toBe(true);
      const stat = fs.statSync(p);
      expect(stat.size).toBeGreaterThan(0);
    });
  });

});

describe('QIVENTRA Collage design', () => {
  const keysOf = (value: unknown, prefix = ''): string[] => {
    if (typeof value !== 'object' || value === null) return [prefix];
    return Object.entries(value).flatMap(([key, nested]) => keysOf(nested, prefix ? `${prefix}.${key}` : key));
  };

  it('keeps the old green palette out of the styles and components', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const walk = (dir: string): string[] =>
      fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const file = path.join(dir, entry.name);
        return entry.isDirectory() ? walk(file) : /\.(tsx|css)$/.test(file) ? [file] : [];
      });
    for (const file of walk(path.resolve(process.cwd(), 'src'))) {
      expect(fs.readFileSync(file, 'utf8'), file).not.toMatch(/#(123B35|B8D96B|1A4B44|132E20|252E2B|1A2220)/i);
    }
  });

  it('has the same Collage copy keys in RU, EN and HE', () => {
    const ru = keysOf(translations.ru.collage).sort();
    expect(keysOf(translations.en.collage).sort()).toEqual(ru);
    expect(keysOf(translations.he.collage).sort()).toEqual(ru);
  });

  it('keeps the demo notice in all three languages', () => {
    expect(translations.ru.collage.common.demo).toBe('Демо-проект портфолио; оплата не проводится');
    expect(translations.en.collage.common.demo).toBe('Portfolio demo project; no payments are processed');
    expect(translations.he.collage.common.demo).toBe('פרויקט הדגמה לתיק עבודות; לא מתבצעים תשלומים');
  });

  it('maps both chip ids and data category slugs onto one shop filter', async () => {
    const { groupFromSlug, groupOfCategoryName } = await import('../data/collageCatalog');
    expect(groupFromSlug(null)).toBe('all');
    expect(groupFromSlug('food')).toBe('food');
    expect(groupFromSlug('bakery')).toBe('food');
    expect(groupOfCategoryName('Кафе & Пекарни')).toBe('food');
    expect(groupOfCategoryName('Цветы & Подарки')).toBe('gift');
  });

  it('gives every store a time, fee and minimum from the data, and leaves Sarona without a photo', async () => {
    const { MOCK_STORES } = await import('../data/mockData');
    for (const store of MOCK_STORES) {
      expect(store.deliveryTimeMin).toBeGreaterThan(0);
      expect(store.deliveryTimeMax).toBeGreaterThan(store.deliveryTimeMin);
      expect(store.deliveryFee).toBeGreaterThanOrEqual(0);
      expect(store.minOrder).toBeGreaterThan(0);
      expect(Boolean(store.coverUrl)).toBe(store.id !== 'store-2');
    }
  });

  it('builds delivery windows from the current time, without past hours', async () => {
    const { buildSlotDays } = await import('../data/deliverySlots');
    const hours = (iso: string) => new Date(iso).getHours();

    const afternoon = buildSlotDays(new Date(2026, 10, 9, 14, 20));
    expect(afternoon.map((d) => d.key)).toEqual(['today', 'tomorrow', 'dayAfter']);
    // 14–15 has already begun, so today starts at 15–16.
    expect(hours(afternoon[0].windows[0])).toBe(15);
    expect(hours(afternoon[0].windows[afternoon[0].windows.length - 1])).toBe(21);
    expect(hours(afternoon[1].windows[0])).toBe(8);
    expect(new Date(afternoon[2].windows[0]).getDate()).toBe(11);

    const earlyMorning = buildSlotDays(new Date(2026, 10, 9, 6, 5));
    expect(hours(earlyMorning[0].windows[0])).toBe(8);
  });

  it('drops today once its last window has begun', async () => {
    const { buildSlotDays } = await import('../data/deliverySlots');
    const lateEvening = buildSlotDays(new Date(2026, 10, 9, 21, 10));
    expect(lateEvening.map((d) => d.key)).toEqual(['tomorrow', 'dayAfter']);
  });

  it('crosses month ends when building delivery windows', async () => {
    const { buildSlotDays } = await import('../data/deliverySlots');
    const [, tomorrow] = buildSlotDays(new Date(2026, 10, 30, 9, 0));
    expect(new Date(tomorrow.windows[0]).getMonth()).toBe(11);
    expect(new Date(tomorrow.windows[0]).getDate()).toBe(1);
  });

  it('describes a window relative to today and isolates its hours', async () => {
    const { formatWindow } = await import('../data/deliverySlots');
    const strings = translations.he.collage.slots;
    const now = new Date(2026, 10, 9, 14, 20);
    const at = (day: number) => ({ kind: 'slot' as const, startsAt: new Date(2026, 10, day, 18).toISOString() });
    expect(formatWindow({ kind: 'asap' }, strings, 'he', now)).toBe('בהקדם האפשרי');
    expect(formatWindow(at(9), strings, 'he', now)).toBe('היום \u206618–19\u2069');
    expect(formatWindow(at(10), strings, 'he', now)).toBe('מחר \u206618–19\u2069');
    expect(formatWindow(at(11), strings, 'he', now)).toBe('מחרתיים \u206618–19\u2069');
    expect(formatWindow(at(20), strings, 'he', now)).not.toContain('היום');
  });
});

describe('QIVENTRA author signature', () => {
  const renderSignature = async (language: 'ru' | 'en' | 'he') => {
    const React = await import('react');
    const { renderToString } = await import('react-dom/server');
    const { MadeByView } = await import('../components/collage/MadeBy');
    return renderToString(React.createElement(MadeByView, { copy: translations[language].screens.madeBy }));
  };

  it('shows the current year and the agreed text in every language', async () => {
    const year = new Date().getFullYear();
    const expected = {
      ru: ['Создано', `© ${year} `, '. Все права защищены.'],
      en: ['Created by', `© ${year} `, '. All rights reserved.'],
      he: ['נוצר על ידי', `© ${year} `, '. כל הזכויות שמורות.'],
    } as const;

    for (const language of ['ru', 'en', 'he'] as const) {
      const html = await renderSignature(language);
      expected[language].forEach((part) => expect(html).toContain(part));
      expect(html).toContain('<bdi>JonikStyle Production</bdi>');
    }
  });

  it('uses the WebP logo with a PNG fallback, explicit size and lazy loading, and no link', async () => {
    const html = await renderSignature('en');
    expect(html).toContain('/brand/jonikstyle-logo-36.webp 96w');
    expect(html).toContain('/brand/jonikstyle-logo-72.webp 191w');
    expect(html).toContain('src="/brand/jonikstyle-logo-160.png"');
    expect(html).toContain('alt="JonikStyle Production"');
    expect(html).toContain('width="96"');
    expect(html).toContain('height="36"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('decoding="async"');
    expect(html).not.toContain('<a ');
  });

  it('fills the year into the rights line', async () => {
    const { madeByRightsLine } = await import('../components/collage/MadeBy');
    expect(madeByRightsLine(translations.en.screens.madeBy.rights, 2031)).toBe(
      '© 2031 JonikStyle Production. All rights reserved.'
    );
  });
});

describe('QIVENTRA honest footer', () => {
  const INVENTED = ['890-1200', 'support@qiventra.com', '07:00', '01:00', 'Produced and developed'];

  const renderFooter = async () => {
    const React = await import('react');
    const { renderToString } = await import('react-dom/server');
    const { ThemeProvider } = await import('../context/ThemeContext');
    const { LanguageProvider } = await import('../context/LanguageContext');
    const { ToastProvider } = await import('../context/ToastContext');
    const { AppProvider } = await import('../context/AppContext');
    const { Footer } = await import('../components/layout/Footer');
    const { MemoryRouter } = await import('react-router');
    const h = React.createElement;
    return renderToString(
      h(
        ThemeProvider,
        null,
        h(LanguageProvider, null, h(ToastProvider, null, h(MemoryRouter, null, h(AppProvider, null, h(Footer)))))
      )
    );
  };

  it('shows the signature once and no invented contacts', async () => {
    const html = await renderFooter();
    INVENTED.forEach((text) => expect(html).not.toContain(text));
    expect(html.match(/made-by-logo/g)).toHaveLength(1);
  });

  it('says in every language that contacts are not connected', () => {
    (['ru', 'en', 'he'] as const).forEach((language) => {
      expect(translations[language].screens.footer.contactsDemo).toBeTruthy();
      INVENTED.forEach((text) => expect(JSON.stringify(translations[language].screens)).not.toContain(text));
    });
  });
});

describe('QIVENTRA repeat order', () => {
  const challah = { name: 'Challah', quantity: 2, price: 16, productId: 'prod-4' };

  it('puts every past order back from the catalog with its quantities', async () => {
    const { resolveRepeatOrder } = await import('../data/cartRules');
    const { MOCK_PAST_ORDERS, MOCK_PRODUCTS } = await import('../data/mockData');
    MOCK_PAST_ORDERS.forEach((order) => {
      const { available, unavailable } = resolveRepeatOrder(order.items, MOCK_PRODUCTS);
      expect(unavailable).toHaveLength(0);
      expect(available.map((line) => line.quantity)).toEqual(order.items.map((item) => item.quantity));
    });
  });

  it('leaves out what is out of stock or no longer sold', async () => {
    const { resolveRepeatOrder } = await import('../data/cartRules');
    const { MOCK_PRODUCTS } = await import('../data/mockData');
    const soldOut = MOCK_PRODUCTS.map((p) => (p.id === 'prod-4' ? { ...p, inStock: false } : p));
    const items = [challah, { ...challah, productId: 'prod-5' }, { name: 'Gone', quantity: 1, price: 1, productId: 'prod-999' }, { name: 'Old', quantity: 1, price: 1 }];

    const { available, unavailable } = resolveRepeatOrder(items, soldOut);
    expect(available.map((line) => line.product.id)).toEqual(['prod-5']);
    expect(unavailable.map((item) => item.productId)).toEqual(['prod-4', 'prod-999', undefined]);
  });
});

describe('QIVENTRA service worker assets', () => {
  it('keeps interface logos under 30 KB and brand PNGs out of the precache', async () => {
    const { statSync, readFileSync } = await import('node:fs');
    [
      'jonikstyle-logo-36.webp',
      'jonikstyle-logo-72.webp',
      'jonikstyle-logo.webp',
      'mark.webp',
      'mark-light.webp',
      'qiventra-mark.webp',
      'qiventra-full.webp',
    ].forEach((file) => expect(statSync(`public/brand/${file}`).size).toBeLessThanOrEqual(30 * 1024));
    const config = readFileSync('vite.config.ts', 'utf8');
    expect(config).toContain("'brand/*.webp'");
    expect(config).toContain("globIgnores: ['brand/*.png']");
  });
});
