import React from 'react';
import { DesktopHeader } from './DesktopHeader';
import { BrandLogo } from '../ui/BrandLogo';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { MapPin, ChevronDown, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

export const Navbar: React.FC = () => {
  const {
    navigateTo,
    currentAddress,
    setIsAddressModalOpen,
    setIsChatOpen,
  } = useApp();
  const { t, isRTL } = useLanguage();

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      {/* Desktop & Tablet View: 76px sticky header, permanently dark #123B35 */}
      <div className="hidden md:block w-full bg-[#123B35] text-[#F3F1EA] border-b border-[#1E524A] shadow-md">
        <DesktopHeader />
      </div>

      {/* Mobile View (screens < 768px): Ultra-compact 56px header with mark, address & switcher */}
      <div className="md:hidden bg-surface/98 dark:bg-[#161B19]/98 backdrop-blur-md border-b border-[#E4E1D7] dark:border-[#252E2B] transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 gap-2 w-full">
          {/* Official Mark Logo */}
          <div className="shrink-0 flex items-center">
            <BrandLogo variant="mark" context="mobile-header" onClick={() => navigateTo('home')} />
          </div>

          {/* Compact Delivery Address Pill */}
          <button
            type="button"
            onClick={() => setIsAddressModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-surface-elevated hover:bg-surface border border-theme min-w-0 flex-1 max-w-[220px] xs:max-w-[260px] transition active:scale-98 select-none ${
              isRTL ? 'text-right' : 'text-left'
            }`}
            aria-label={t.nav.selectAddress}
          >
            <MapPin className="w-3.5 h-3.5 text-[#123B35] dark:text-[#B8D96B] shrink-0" />
            <div className="truncate flex flex-col min-w-0 flex-1">
              <span className="text-[9px] uppercase tracking-wider text-muted font-bold leading-none">
                {t.nav.deliveryTo}
              </span>
              <span className="text-xs font-bold text-primary truncate leading-tight mt-0.5">
                {currentAddress}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-muted shrink-0 ms-0.5" />
          </button>

          {/* Right: Mobile Chat & Language Switcher */}
          <div className="shrink-0 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="relative p-2 rounded-xl bg-surface-elevated text-primary border border-theme"
              aria-label={t.chat?.title || 'Сообщения'}
            >
              <MessageSquare className="w-4 h-4 text-[#123B35] dark:text-[#B8D96B]" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#B8D96B] ring-1 ring-surface" />
            </button>
            <LanguageSwitcher variant="compact" />
          </div>
        </div>
      </div>
    </div>
  </header>
);
};

export default Navbar;
