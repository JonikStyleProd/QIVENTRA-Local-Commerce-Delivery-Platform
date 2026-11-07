import React from 'react';
import { Link } from 'react-router';
import { ShoppingBag } from 'lucide-react';
import { DesktopHeader } from './DesktopHeader';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { AddressButton, CartCountBadge } from '../collage/HeaderControls';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { pathFor } from '../../router/paths';

/** The two checkout steps draw their own phone header, so the shared one steps aside there. */
const ROUTES_WITH_STEP_HEADER = ['catalog', 'delivery'];

export const Navbar: React.FC = () => {
  const { currentRoute, cartTotalCount } = useApp();
  const { t } = useLanguage();

  const hideOnPhone = ROUTES_WITH_STEP_HEADER.includes(currentRoute);

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-paper border-b-2 border-ink ${hideOnPhone ? 'hidden desk:block' : ''}`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="hidden desk:block">
        <DesktopHeader />
      </div>

      <div className="desk:hidden flex items-center justify-between gap-2 px-4 py-2">
        <AddressButton className="flex-1 max-w-[200px]" />
        <div className="flex items-center gap-2 shrink-0">
          <LanguageSwitcher />
          <Link
            to={pathFor('cart')}
            aria-label={`${t.collage.common.cartItems} ${cartTotalCount}`}
            className="chip-tilt relative grid place-items-center w-11 h-11 shrink-0 bg-action-strong text-white border-2 border-ink rounded-[14px] shadow-hard-3 cursor-pointer"
            style={{ rotate: '3deg' }}
          >
            <ShoppingBag aria-hidden="true" strokeWidth={2.4} className="w-5 h-5" />
            <CartCountBadge count={cartTotalCount} className="absolute -top-2 -end-2" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
