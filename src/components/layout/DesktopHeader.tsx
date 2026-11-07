import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  ChevronDown,
  Store as StoreIcon,
  Bike,
  ShieldCheck,
  MessageSquare,
  Moon,
  Sun,
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { BrandLogo } from '../ui/BrandLogo';
import { Button } from '../ui/Button';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { AppRoute } from '../../types';
import { AddressButton, CartCountBadge } from '../collage/HeaderControls';

const ICON_BUTTON =
  'chip-tilt relative grid place-items-center w-11 h-11 shrink-0 bg-card text-ink border-2 border-ink rounded-xl cursor-pointer';

export const DesktopHeader: React.FC = () => {
  const { currentRoute, navigateTo, cartTotalCount, setIsCartDrawerOpen, setIsChatOpen } = useApp();
  const { t } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [isPortalsMenuOpen, setIsPortalsMenuOpen] = useState(false);

  const navLinks: { label: string; route: AppRoute }[] = [
    { label: t.collage.tabs.shops, route: 'catalog' },
    { label: t.collage.tabs.orders, route: 'orders' },
    { label: t.nav.search, route: 'search' },
  ];

  const portals: { label: string; route: AppRoute; icon: React.ReactNode }[] = [
    { label: t.nav.vendorPortal, route: 'vendor', icon: <StoreIcon aria-hidden="true" className="w-4 h-4 shrink-0" /> },
    { label: t.nav.courierHub, route: 'courier', icon: <Bike aria-hidden="true" className="w-4 h-4 shrink-0" /> },
    { label: t.nav.adminHub, route: 'admin', icon: <ShieldCheck aria-hidden="true" className="w-4 h-4 shrink-0" /> },
  ];

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

          <div
            className="relative"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsPortalsMenuOpen(false);
            }}
          >
            <button
              type="button"
              onClick={() => setIsPortalsMenuOpen(!isPortalsMenuOpen)}
              aria-expanded={isPortalsMenuOpen}
              className="inline-flex items-center gap-1 min-h-11 px-2.5 rounded-xl text-[15px] font-extrabold cursor-pointer whitespace-nowrap hover:bg-paper-dot/50"
            >
              {t.nav.portals}
              <ChevronDown aria-hidden="true" className="w-3.5 h-3.5" />
            </button>

            {isPortalsMenuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setIsPortalsMenuOpen(false)} />
                <div className="absolute start-0 z-30 w-60 mt-2 py-2 bg-card border-[3px] border-ink rounded-2xl shadow-hard-4">
                  <p className="hand px-3 text-2xl text-link-text">{t.profile.partnerPortalsTitle}</p>
                  {portals.map((portal) => (
                    <button
                      key={portal.route}
                      type="button"
                      onClick={() => {
                        navigateTo(portal.route);
                        setIsPortalsMenuOpen(false);
                      }}
                      className="flex items-center gap-2.5 w-full min-h-11 px-3 text-sm font-extrabold text-start cursor-pointer hover:bg-tint-gift"
                    >
                      {portal.icon}
                      {portal.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </nav>
      </div>

      <div className="flex items-center gap-2 xl:gap-3 min-w-0">
        <AddressButton className="max-w-[170px] xl:max-w-[210px]" />
        <LanguageSwitcher />

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={resolvedTheme === 'dark' ? t.nav.toggleThemeLight : t.nav.toggleThemeDark}
          title={resolvedTheme === 'dark' ? t.nav.toggleThemeLight : t.nav.toggleThemeDark}
          className={ICON_BUTTON}
        >
          {resolvedTheme === 'dark' ? (
            <Sun aria-hidden="true" className="w-5 h-5" />
          ) : (
            <Moon aria-hidden="true" className="w-5 h-5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsChatOpen(true)}
          aria-label={t.chat?.title}
          title={t.chat?.title}
          className={ICON_BUTTON}
        >
          <MessageSquare aria-hidden="true" className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => {
            setIsCartDrawerOpen(false);
            navigateTo('cart');
          }}
          aria-label={`${t.collage.common.cartItems} ${cartTotalCount}`}
          title={t.collage.tabs.cart}
          className={ICON_BUTTON}
        >
          <ShoppingBag aria-hidden="true" className="w-5 h-5" />
          <CartCountBadge count={cartTotalCount} className="absolute -top-2 -end-2" />
        </button>

        <button
          type="button"
          onClick={() => navigateTo('profile')}
          aria-label={t.nav.profile}
          title={t.nav.profile}
          className={ICON_BUTTON}
        >
          <User aria-hidden="true" className="w-5 h-5" />
        </button>

        {currentRoute === 'home' && (
          <div className="hidden min-[1320px]:block shrink-0">
            <Button size="lg" onClick={() => navigateTo('catalog')} className="whitespace-nowrap">
              {t.collage.landing.cta}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
