import React from 'react';
import { Home, Search, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { AppRoute } from '../../types';

export const MobileBottomNav: React.FC = () => {
  const { currentRoute, navigateTo, cartTotalCount, setIsCartDrawerOpen } = useApp();
  const { t } = useLanguage();

  const navItems: { label: string; route?: AppRoute; isCart?: boolean; icon: React.ReactNode }[] = [
    {
      label: t.nav.home,
      route: 'home',
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: t.nav.search,
      route: 'search',
      icon: <Search className="w-5 h-5" />,
    },
    {
      label: t.nav.cart,
      route: 'cart',
      icon: (
        <div className="relative">
          <ShoppingCart className="w-5 h-5" />
          {cartTotalCount > 0 && (
            <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-[#B8D96B] text-[#151817] text-[10px] font-black leading-none shadow-xs tabular-nums">
              {cartTotalCount}
            </span>
          )}
        </div>
      ),
    },
    {
      label: t.nav.orders,
      route: 'orders',
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      label: t.nav.profile,
      route: 'profile',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Mobile bottom navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FFFFFF] dark:bg-[#161B19] border-t border-[#E2DFD4] dark:border-[#27332E] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.45)] transition-colors"
      style={{
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div className="flex items-center justify-around h-15 max-w-md mx-auto px-1">
        {navItems.map((item, idx) => {
          const isActive = item.route && currentRoute === item.route;

          const handleClick = () => {
            if (item.route) {
              setIsCartDrawerOpen(false);
              navigateTo(item.route);
            }
          };

          return (
            <button
              key={idx}
              type="button"
              onClick={handleClick}
              className={`
                flex flex-col items-center justify-center flex-1 h-full min-h-[44px] min-w-[44px] py-1 transition-all select-none relative
                ${
                  isActive
                    ? 'text-[#123B35] dark:text-[#B8D96B] font-bold'
                    : 'text-[#4D5956] dark:text-[#A0AEA9] hover:text-[#151817] dark:hover:text-[#F3F1EA] font-semibold'
                }
              `}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`
                  flex items-center justify-center w-10 h-7 rounded-xl transition-all
                  ${
                    isActive
                      ? 'bg-[#123B35]/10 dark:bg-[#B8D96B]/15 text-[#123B35] dark:text-[#B8D96B] scale-105'
                      : ''
                  }
                `}
              >
                {item.icon}
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 leading-none whitespace-nowrap truncate max-w-[68px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
