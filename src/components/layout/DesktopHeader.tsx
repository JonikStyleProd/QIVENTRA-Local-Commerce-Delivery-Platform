import React, { useState } from 'react';
import {
  MapPin,
  Search,
  ShoppingCart,
  Sun,
  Moon,
  ChevronDown,
  Store as StoreIcon,
  Bike,
  ShieldCheck,
  X,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { BrandLogo } from '../ui/BrandLogo';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { AppRoute } from '../../types';

export const DesktopHeader: React.FC = () => {
  const {
    currentRoute,
    navigateTo,
    currentAddress,
    setIsAddressModalOpen,
    cartTotalCount,
    setIsCartDrawerOpen,
    setIsChatOpen,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const { resolvedTheme, toggleTheme } = useTheme();
  const { t, isRTL } = useLanguage();
  const [isPortalsMenuOpen, setIsPortalsMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      navigateTo('search', { searchQuery: localSearch.trim() });
    } else {
      navigateTo('search');
    }
  };

  const navLinks: { label: string; route: AppRoute }[] = [
    { label: t.nav.home, route: 'home' },
    { label: t.nav.catalog, route: 'catalog' },
    { label: t.nav.orders, route: 'orders' },
  ];

  const userInitials = 'MC';

  return (
    <div className="w-full h-[76px] max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12 flex items-center justify-between gap-4">
      {/* =========================================================================
          ZONE 1: Logo & Delivery Address (Start)
          44px controls, official light lockup, no wrap or overlap
         ========================================================================= */}
      <div className="flex items-center gap-3 shrink-0">
        <BrandLogo
          variant="lockup"
          context="desktop-header"
          onClick={() => navigateTo('home')}
        />

        {/* Delivery Address Button (44px height, h-11) */}
        <button
          type="button"
          onClick={() => setIsAddressModalOpen(true)}
          className={`h-11 px-3.5 rounded-xl bg-[#1A4B44] hover:bg-[#205A52] border border-[#276B61] text-[#F3F1EA] flex items-center gap-2.5 transition shrink-0 select-none ${
            isRTL ? 'text-right' : 'text-left'
          }`}
          aria-label={t.nav.selectAddress}
        >
          <MapPin className="w-4 h-4 text-[#B8D96B] shrink-0" />
          <div className="flex flex-col truncate min-w-0">
            <span className="text-[9px] text-[#F3F1EA]/70 font-bold uppercase tracking-wider leading-none">
              {t.nav.deliveryTo}
            </span>
            <span className="truncate text-xs font-bold text-[#F3F1EA] mt-0.5 leading-tight max-w-[120px] lg:max-w-[160px] xl:max-w-[200px]">
              {currentAddress}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#F3F1EA]/70 shrink-0 ms-0.5" />
        </button>
      </div>

      {/* =========================================================================
          ZONE 2: Main Navigation (Center)
          Clean, spacious navigation links with 44px height, high readability
         ========================================================================= */}
      <nav
        className="flex items-center gap-2 shrink-0 justify-center"
        aria-label="Main navigation"
      >
        {navLinks.map((item) => {
          const isActive = currentRoute === item.route;
          return (
            <button
              key={item.route}
              type="button"
              onClick={() => navigateTo(item.route)}
              className={`
                h-11 px-4 rounded-xl text-sm font-semibold transition select-none whitespace-nowrap flex items-center justify-center
                ${
                  isActive
                    ? 'bg-[#B8D96B] text-[#151817] font-bold shadow-xs'
                    : 'text-[#F3F1EA]/90 hover:text-white hover:bg-[#1A4B44]'
                }
              `}
            >
              {item.label}
            </button>
          );
        })}

        {/* Quick Search Button (44px) */}
        <button
          type="button"
          onClick={() => navigateTo('search')}
          className={`
            h-11 px-3.5 rounded-xl text-sm font-semibold transition select-none flex items-center gap-2 whitespace-nowrap
            ${
              currentRoute === 'search'
                ? 'bg-[#B8D96B] text-[#151817] font-bold shadow-xs'
                : 'text-[#F3F1EA]/90 hover:text-white hover:bg-[#1A4B44]'
            }
          `}
          aria-label={t.nav.search}
        >
          <Search className="w-4 h-4 shrink-0" />
          <span className="hidden xl:inline">{t.nav.search}</span>
        </button>

        {/* Role Portals Dropdown (44px) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsPortalsMenuOpen(!isPortalsMenuOpen)}
            className="h-11 px-3.5 rounded-xl text-sm font-semibold text-[#F3F1EA]/90 hover:text-white hover:bg-[#1A4B44] flex items-center gap-1.5 transition select-none"
            aria-expanded={isPortalsMenuOpen}
          >
            <span>{t.nav.portals}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#F3F1EA]/70" />
          </button>

          {isPortalsMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsPortalsMenuOpen(false)}
              />
              <div className="absolute end-0 mt-2 w-52 rounded-2xl bg-[#163F39] border border-[#276B61] text-[#F3F1EA] shadow-xl py-2 z-30 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#F3F1EA]/60 border-b border-[#276B61]/60 mb-1">
                  {t.profile.partnerPortalsTitle}
                </div>
                <button
                  onClick={() => {
                    navigateTo('vendor');
                    setIsPortalsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#F3F1EA] hover:bg-[#1E524A] text-start"
                >
                  <StoreIcon className="w-4 h-4 text-[#B8D96B] shrink-0" />
                  <span>{t.nav.vendorPortal}</span>
                </button>
                <button
                  onClick={() => {
                    navigateTo('courier');
                    setIsPortalsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#F3F1EA] hover:bg-[#1E524A] text-start"
                >
                  <Bike className="w-4 h-4 text-[#B8D96B] shrink-0" />
                  <span>{t.nav.courierHub}</span>
                </button>
                <button
                  onClick={() => {
                    navigateTo('admin');
                    setIsPortalsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#F3F1EA] hover:bg-[#1E524A] text-start"
                >
                  <ShieldCheck className="w-4 h-4 text-[#B8D96B] shrink-0" />
                  <span>{t.nav.adminHub}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* =========================================================================
          ZONE 3: Languages, Theme, Chat, Cart & Profile (End)
          All controls strictly 44px height (h-11), 8px grid intervals
         ========================================================================= */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Language Switcher (Segmented 44px controller) */}
        <LanguageSwitcher variant="header" />

        {/* Theme Toggle (44x44px) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#1A4B44] text-[#B8D96B] hover:bg-[#205A52] border border-[#276B61] transition shrink-0 select-none"
          aria-label={resolvedTheme === 'dark' ? t.nav.toggleThemeLight : t.nav.toggleThemeDark}
          title={resolvedTheme === 'dark' ? t.nav.toggleThemeLight : t.nav.toggleThemeDark}
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#B8D96B]" />
          ) : (
            <Moon className="w-4 h-4 text-[#B8D96B]" />
          )}
        </button>

        {/* AI Assistant / Chat (44x44px) */}
        <button
          type="button"
          onClick={() => setIsChatOpen(true)}
          className="w-11 h-11 rounded-xl flex items-center justify-center relative bg-[#1A4B44] text-[#B8D96B] hover:bg-[#205A52] border border-[#276B61] transition shrink-0 select-none"
          aria-label={t.chat?.title || 'Чат'}
          title={t.chat?.title || 'Чат'}
        >
          <MessageSquare className="w-4 h-4 text-[#B8D96B]" />
          <span className="absolute top-2.5 end-2.5 flex h-2 w-2 pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8D96B] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B8D96B]" />
          </span>
        </button>

        {/* Cart Button (44px height, high contrast, non-clipped badge) */}
        <button
          type="button"
          onClick={() => {
            setIsCartDrawerOpen(false);
            navigateTo('cart');
          }}
          className="h-11 px-4 rounded-xl flex items-center gap-2 bg-[#B8D96B] text-[#151817] hover:bg-[#C5E875] active:scale-[0.99] transition shadow-xs select-none shrink-0 font-bold text-sm"
          aria-label={`${t.nav.cart}, ${cartTotalCount}`}
        >
          <ShoppingCart className="w-4 h-4 text-[#151817] shrink-0" />
          <span className="hidden sm:inline">{t.nav.cart}</span>
          {cartTotalCount > 0 && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#123B35] text-[#F3F1EA] text-[11px] font-black tabular-nums leading-none">
              {cartTotalCount}
            </span>
          )}
        </button>

        {/* Profile Button (44x44px) */}
        <button
          type="button"
          onClick={() => navigateTo('profile')}
          className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#1A4B44] hover:bg-[#205A52] border border-[#276B61] transition text-[#F3F1EA] shrink-0 p-1"
          aria-label={t.nav.profile}
        >
          <div className="w-8 h-8 rounded-lg bg-[#B8D96B] text-[#151817] flex items-center justify-center text-xs font-black select-none">
            {userInitials}
          </div>
        </button>
      </div>
    </div>
  );
};
