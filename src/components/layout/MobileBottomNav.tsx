import React from 'react';
import { Home, Store, ShoppingBag, ClipboardList, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { AppRoute } from '../../types';
import { CartCountBadge } from '../collage/HeaderControls';

export const MobileBottomNav: React.FC = () => {
  const { currentRoute, navigateTo, cartTotalCount, setIsCartDrawerOpen } = useApp();
  const { t } = useLanguage();

  // The delivery window has its own yellow sheet at the bottom of the phone screen instead.
  if (currentRoute === 'delivery') return null;

  const navItems: { label: string; route: AppRoute; icon: React.ReactNode; aria?: string }[] = [
    { label: t.collage.tabs.home, route: 'home', icon: <Home aria-hidden="true" className="w-5 h-5" /> },
    { label: t.collage.tabs.shops, route: 'catalog', icon: <Store aria-hidden="true" className="w-5 h-5" /> },
    {
      label: t.collage.tabs.cart,
      route: 'cart',
      aria: `${t.collage.common.cartItems} ${cartTotalCount}`,
      icon: (
        <span className="relative">
          <ShoppingBag aria-hidden="true" className="w-5 h-5" />
          <CartCountBadge count={cartTotalCount} className="absolute -top-2.5 -end-3.5" />
        </span>
      ),
    },
    { label: t.collage.tabs.orders, route: 'orders', icon: <ClipboardList aria-hidden="true" className="w-5 h-5" /> },
    { label: t.collage.tabs.profile, route: 'profile', icon: <User aria-hidden="true" className="w-5 h-5" /> },
  ];

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label={t.collage.tabs.label}
      className="desk:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-5 px-2 pt-1 bg-card border-t border-ink"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }}
    >
      {navItems.map((item) => {
        const isActive = currentRoute === item.route;
        return (
          <button
            key={item.route}
            type="button"
            onClick={() => {
              setIsCartDrawerOpen(false);
              navigateTo(item.route);
            }}
            aria-label={item.aria}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center gap-0.5 min-w-0 min-h-[54px] py-1.5 text-[11px] font-bold cursor-pointer ${
              isActive ? 'text-ink' : 'text-ink-3'
            }`}
          >
            <span
              aria-hidden="true"
              className={`grid place-items-center w-[52px] max-w-full h-7 rounded-full ${isActive ? 'bg-accent' : ''}`}
            >
              {item.icon}
            </span>
            <span className="truncate max-w-full">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
