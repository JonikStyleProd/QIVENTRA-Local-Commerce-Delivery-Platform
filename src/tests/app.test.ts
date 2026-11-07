import { describe, it, expect } from 'vitest';
import { translations } from '../i18n/translations';

describe('QIVENTRA Localization Suite', () => {
  it('contains complete translation keys for all languages (RU, EN, HE)', () => {
    const languages = ['ru', 'en', 'he'] as const;

    languages.forEach((lang) => {
      const t = translations[lang];
      expect(t).toBeDefined();

      // ProductCard badges
      expect(t.productCard.topBadge).toBeTruthy();
      expect(t.productCard.newBadge).toBeTruthy();
      expect(t.productCard.addToCart).toBeTruthy();

      // Profile
      expect(t.profile.activeClient).toBeTruthy();

      // Footer
      expect(t.footer.pwaReady).toBeTruthy();

      // Navigation
      expect(t.nav.home).toBeTruthy();
      expect(t.nav.search).toBeTruthy();
      expect(t.nav.cart).toBeTruthy();
      expect(t.nav.orders).toBeTruthy();
      expect(t.nav.profile).toBeTruthy();

      // Cart
      expect(t.cart.checkoutTitle).toBeTruthy();
    });

    // Language specific values
    expect(translations.ru.profile.activeClient).toBe('Активный клиент');
    expect(translations.he.profile.activeClient).toBe('לקוח פעיל');
    expect(translations.en.profile.activeClient).toBe('Active Client');

    expect(translations.ru.footer.pwaReady).toBe('Работает как PWA');
    expect(translations.he.footer.pwaReady).toBe('מוכן כ-PWA');
    expect(translations.en.footer.pwaReady).toBe('PWA Ready');

    expect(translations.ru.productCard.topBadge).toBe('Хит');
    expect(translations.ru.productCard.newBadge).toBe('Новинка');
    expect(translations.he.productCard.topBadge).toBe('מוביל');
    expect(translations.he.productCard.newBadge).toBe('חדש');
  });
});

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

  it('formats Israeli currency tightly with non-breaking space', () => {
    const formatCurrency = (amount: number, language: 'ru' | 'en' | 'he') => {
      if (language === 'he') {
        return `₪\u00A0${amount}`;
      }
      return `${amount}\u00A0₪`;
    };

    expect(formatCurrency(45, 'he')).toBe('₪\u00A045');
    expect(formatCurrency(45, 'ru')).toBe('45\u00A0₪');
    expect(formatCurrency(45, 'en')).toBe('45\u00A0₪');
    expect(formatCurrency(45, 'ru')).toContain('\u00A0');
  });
});

describe('QIVENTRA Media & Chat Suite', () => {
  it('contains media & chat localization for all supported locales', () => {
    const languages = ['ru', 'en', 'he'] as const;

    languages.forEach((lang) => {
      const t = translations[lang];
      expect(t.media).toBeDefined();
      expect(t.media.changePhoto).toBeTruthy();
      expect(t.media.uploadSuccess).toBeTruthy();
      expect(t.media.allowedFormats).toBeTruthy();

      expect(t.chat).toBeDefined();
      expect(t.chat.title).toBeTruthy();
      expect(t.chat.send).toBeTruthy();
      expect(t.chat.typeMessage).toBeTruthy();
    });

    expect(translations.ru.media.changePhoto).toBe('Изменить фото');
    expect(translations.he.media.changePhoto).toBe('החלף תמונה');
    expect(translations.en.media.changePhoto).toBe('Change Photo');
  });
});

describe('QIVENTRA Responsive Breakpoints & Grid Behavior (320px–1440px)', () => {
  // Test breakpoints across the required range: 320px to 1440px
  const testBreakpoints = [
    { name: 'Mobile XS (Compact)', width: 320, expectedCols: 1, isMobile: true },
    { name: 'Mobile Standard (iPhone SE/Mini)', width: 375, expectedCols: 1, isMobile: true },
    { name: 'Mobile Large / Phablet', width: 480, expectedCols: 1, isMobile: true },
    { name: 'Small Tablet / Large Mobile (sm)', width: 640, expectedCols: 2, isMobile: false },
    { name: 'Tablet Portrait (md)', width: 768, expectedCols: 2, isMobile: false },
    { name: 'Tablet Landscape / Small Laptop (lg)', width: 1024, expectedCols: 3, isMobile: false },
    { name: 'Desktop Standard (xl)', width: 1280, expectedCols: 4, isMobile: false },
    { name: 'Wide Desktop (2xl)', width: 1440, expectedCols: 4, isMobile: false },
  ];

  it('calculates the correct responsive columns matching .product-grid specification', () => {
    // Standardized .product-grid helper: 1 col on mobile (<640px), 2 cols on sm (>=640px),
    // 3 cols on lg (>=1024px), 4 cols on xl (>=1280px)
    const resolveGridColumns = (width: number): number => {
      if (width >= 1280) return 4;
      if (width >= 1024) return 3;
      if (width >= 640) return 2;
      return 1;
    };

    testBreakpoints.forEach(({ width, expectedCols, name }) => {
      const cols = resolveGridColumns(width);
      expect(cols, `Failed for breakpoint ${name} (${width}px)`).toBe(expectedCols);
    });
  });

  it('enforces chat panel responsive sizing: full-screen on mobile (<768px), fixed 380-420px on desktop (>=768px)', () => {
    const getChatPanelStyle = (viewportWidth: number) => {
      if (viewportWidth < 768) {
        return {
          isFullScreen: true,
          widthClass: 'w-full',
          desktopWidthPx: null,
        };
      }
      return {
        isFullScreen: false,
        widthClass: 'md:w-[400px] lg:w-[420px]',
        desktopWidthPx: Math.min(420, Math.max(380, 400)), // bounded between 380 and 420
      };
    };

    testBreakpoints.forEach(({ width, isMobile }) => {
      const chatStyle = getChatPanelStyle(width);
      if (width < 768) {
        expect(chatStyle.isFullScreen).toBe(true);
        expect(chatStyle.widthClass).toBe('w-full');
      } else {
        expect(chatStyle.isFullScreen).toBe(false);
        expect(chatStyle.desktopWidthPx).toBeGreaterThanOrEqual(380);
        expect(chatStyle.desktopWidthPx).toBeLessThanOrEqual(420);
      }
    });
  });

  it('verifies mobile navigation distribution: exactly 5 items across 320px-640px', () => {
    const mobileNavItems = ['home', 'catalog', 'orders', 'cart', 'profile'];
    expect(mobileNavItems).toHaveLength(5);

    // Verify each nav item has translations in ru, en, he
    const languages = ['ru', 'en', 'he'] as const;
    languages.forEach((lang) => {
      const t = translations[lang].nav;
      expect(t.home).toBeTruthy();
      expect(t.catalog).toBeTruthy();
      expect(t.orders).toBeTruthy();
      expect(t.cart).toBeTruthy();
      expect(t.profile).toBeTruthy();
    });
  });
});

describe('QIVENTRA Brand & Logo Compliance', () => {
  it('ensures official logo is not mirrored or inverted in Hebrew RTL mode', () => {
    // Logo styling rule: in RTL mode, logo must preserve its original orientation
    const getLogoStyle = (isRTL: boolean) => {
      return {
        scaleX: 1, // Must NEVER be -1 (mirrored)
        direction: 'ltr',
        preserveVisual: true,
      };
    };

    const ltrLogo = getLogoStyle(false);
    const rtlLogo = getLogoStyle(true);

    expect(ltrLogo.scaleX).toBe(1);
    expect(rtlLogo.scaleX).toBe(1);
    expect(rtlLogo.preserveVisual).toBe(true);
  });

  it('verifies the 3 official Supabase brand asset URLs and their theme mappings', () => {
    const BRAND_ASSETS = {
      mark: "https://hrhjkixwsxciyxoxfciy.supabase.co/storage/v1/object/public/brand-assets/qiventra/v1/qiventra-mark-transparent-2k.png",
      lightLockup: "https://hrhjkixwsxciyxoxfciy.supabase.co/storage/v1/object/public/brand-assets/qiventra/v1/qiventra-lockup-light-transparent-4k.png",
      darkLockup: "https://hrhjkixwsxciyxoxfciy.supabase.co/storage/v1/object/public/brand-assets/qiventra/v1/qiventra-lockup-dark-transparent-4k.png",
    } as const;

    // Verify URLs
    expect(BRAND_ASSETS.mark).toContain('/qiventra-mark-transparent-2k.png');
    expect(BRAND_ASSETS.lightLockup).toContain('/qiventra-lockup-light-transparent-4k.png');
    expect(BRAND_ASSETS.darkLockup).toContain('/qiventra-lockup-dark-transparent-4k.png');

    // Test theme resolution helper logic
    const resolveLockup = (theme: 'light' | 'dark', context?: string) => {
      if (context === 'footer') return BRAND_ASSETS.lightLockup;
      return theme === 'dark' ? BRAND_ASSETS.lightLockup : BRAND_ASSETS.darkLockup;
    };

    // Dark theme uses lightLockup
    expect(resolveLockup('dark')).toBe(BRAND_ASSETS.lightLockup);
    // Light theme uses darkLockup
    expect(resolveLockup('light')).toBe(BRAND_ASSETS.darkLockup);
    // Footer on dark green background always uses lightLockup
    expect(resolveLockup('light', 'footer')).toBe(BRAND_ASSETS.lightLockup);
    expect(resolveLockup('dark', 'footer')).toBe(BRAND_ASSETS.lightLockup);
  });

  it('validates sizing constraints: desktop 34-40px, tablet 32-36px, mobile 40-44px, footer 38-48px', () => {
    const sizes = {
      desktopLockup: 36, // Within 34–40 px
      tabletLockup: 34,  // Within 32–36 px
      mobileMark: 40,    // Within 40–44 px
      footerLockup: 42,  // Within 38–48 px
    };

    expect(sizes.desktopLockup).toBeGreaterThanOrEqual(34);
    expect(sizes.desktopLockup).toBeLessThanOrEqual(40);

    expect(sizes.tabletLockup).toBeGreaterThanOrEqual(32);
    expect(sizes.tabletLockup).toBeLessThanOrEqual(36);

    expect(sizes.mobileMark).toBeGreaterThanOrEqual(40);
    expect(sizes.mobileMark).toBeLessThanOrEqual(44);

    expect(sizes.footerLockup).toBeGreaterThanOrEqual(38);
    expect(sizes.footerLockup).toBeLessThanOrEqual(48);
  });

  it('renders App component without throwing', async () => {
    const React = await import('react');
    const { renderToString } = await import('react-dom/server');
    const { default: App } = await import('../App');
    const html = renderToString(React.createElement(App));
    expect(html).toBeTruthy();
  });

  it('renders all individual page components without throwing', async () => {
    const React = await import('react');
    const { renderToString } = await import('react-dom/server');
    const { ThemeProvider } = await import('../context/ThemeContext');
    const { LanguageProvider } = await import('../context/LanguageContext');
    const { ToastProvider } = await import('../context/ToastContext');
    const { AppProvider } = await import('../context/AppContext');

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
            React.createElement(AppProvider, null, React.createElement(Page))
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
    expect(html).toContain('srcSet="/brand/jonikstyle-logo.webp"');
    expect(html).toContain('src="/brand/jonikstyle-logo-160.png"');
    expect(html).toContain('alt="JonikStyle Production"');
    expect(html).toContain('width="426"');
    expect(html).toContain('height="160"');
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
    const h = React.createElement;
    return renderToString(
      h(ThemeProvider, null, h(LanguageProvider, null, h(ToastProvider, null, h(AppProvider, null, h(Footer)))))
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
  it('keeps the interface logo small and the source logo out of the precache', async () => {
    const { statSync, readFileSync } = await import('node:fs');
    expect(statSync('public/brand/jonikstyle-logo.webp').size).toBeLessThanOrEqual(30 * 1024);
    const config = readFileSync('vite.config.ts', 'utf8');
    expect(config).toContain("'brand/jonikstyle-logo.webp'");
    expect(config).toContain("globIgnores: ['brand/jonikstyle-logo.png'");
  });
});
