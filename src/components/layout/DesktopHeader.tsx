import React from 'react';
import { Search, ShoppingBag, Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { BrandLogo } from '../ui/BrandLogo';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { AppRoute } from '../../types';
import { AddressButton, CartCountBadge } from '../collage/HeaderControls';
import { ProfileMenu } from './ProfileMenu';

export const DesktopHeader: React.FC = () => {
  const { currentRoute, navigateTo, cartTotalCount, setIsCartDrawerOpen } = useApp();
  const { t } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();

  const navLinks: { label: string; route: AppRoute }[] = [
    { label: t.collage.tabs.shops, route: 'catalog' },
    { label: t.collage.tabs.orders, route: 'orders' },
    { label: t.nav.search, route: 'search' },
  ];

  const themeLabel = resolvedTheme === 'dark' ? t.nav.toggleThemeLight : t.nav.toggleThemeDark;

  return (
    <div className="flex items-center justify-between gap-3 max-w-[1360px] mx-auto px-6 xl:px-10 py-2.5">
      <div className="flex items-center gap-1 xl:gap-3 min-w-0">
        <button
          type="button"
          onClick={() => navigateTo('home')}
          aria-label="QIVENTRA"
          aria-current={currentRoute === 'home' ? 'page' : undefined}
          className="flex items-center gap-2.5 min-h-11 shrink-0 text-ink cursor-pointer"
        >
          <BrandLogo variant="mark" context="default" alt="" id="header-brand-mark" />
          <span dir="ltr" className="hidden lg:inline text-xl font-black tracking-[0.04em]">
            QIVENTRA
          </span>
        </button>

        <nav aria-label={t.collage.tabs.main} className="flex items-center gap-0.5 shrink-0">
          {navLinks.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => navigateTo(item.route)}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex items-center gap-1.5 min-h-11 px-2.5 rounded-xl text-[15px] font-extrabold cursor-pointer whitespace-nowrap ${
                  isActive ? 'bg-accent' : 'hover:bg-paper-dot/50'
                }`}
              >
                {item.route === 'search' && <Search aria-hidden="true" className="w-4 h-4 shrink-0" />}
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2 xl:gap-3 min-w-0">
        <AddressButton className="max-w-[170px] xl:max-w-[210px]" />
        <LanguageSwitcher />

        <IconButton
          onClick={toggleTheme}
          aria-label={themeLabel}
          title={themeLabel}
          icon={
            resolvedTheme === 'dark' ? (
              <Sun aria-hidden="true" className="w-5 h-5" />
            ) : (
              <Moon aria-hidden="true" className="w-5 h-5" />
            )
          }
        />

        <IconButton
          onClick={() => {
            setIsCartDrawerOpen(false);
            navigateTo('cart');
          }}
          aria-label={`${t.collage.common.cartItems} ${cartTotalCount}`}
          title={t.collage.tabs.cart}
          icon={
            <>
              <ShoppingBag aria-hidden="true" className="w-5 h-5" />
              <CartCountBadge count={cartTotalCount} className="absolute -top-2 -end-2" />
            </>
          }
        />

        <ProfileMenu />

        {/* The picker itself and the narrowest desktop widths do without it; "Shops" goes to the same place. */}
        {currentRoute !== 'catalog' && (
          <div className="hidden min-[1200px]:block shrink-0">
            <Button size="lg" onClick={() => navigateTo('catalog')} className="whitespace-nowrap">
              {t.collage.landing.cta}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
