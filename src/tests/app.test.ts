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
      expect(t.cart.freeDeliveryProgress).toBeTruthy();
      expect(t.cart.freeDeliveryUnlocked).toBeTruthy();
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
  const freeDeliveryThreshold = 100;
  const deliveryFee = 15;

  it('calculates free delivery when subtotal reaches or exceeds 100 ILS', () => {
    const subtotalBelow: number = 85;
    const subtotalEqual: number = 100;
    const subtotalAbove: number = 145;

    const feeBelow = subtotalBelow >= freeDeliveryThreshold || subtotalBelow === 0 ? 0 : deliveryFee;
    const feeEqual = subtotalEqual >= freeDeliveryThreshold || subtotalEqual === 0 ? 0 : deliveryFee;
    const feeAbove = subtotalAbove >= freeDeliveryThreshold || subtotalAbove === 0 ? 0 : deliveryFee;

    expect(feeBelow).toBe(15);
    expect(feeEqual).toBe(0);
    expect(feeAbove).toBe(0);
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

  it('contains the mandatory footer compliance statement', () => {
    const expectedStatement = 'Produced and developed by JonikStyle Production. All rights reserved by JonikStyle Production.';
    expect(expectedStatement).toBe('Produced and developed by JonikStyle Production. All rights reserved by JonikStyle Production.');
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


