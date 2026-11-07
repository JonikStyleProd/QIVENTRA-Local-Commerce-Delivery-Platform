import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { CartLine } from '../collage/CartLine';
import { Panel } from '../collage/Panel';
import { SummaryRow } from '../collage/SummaryRow';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartTotalCount,
    cartSubtotal,
    deliveryFee,
    totalAmount,
    navigateTo,
  } = useApp();

  const { language, t, formatCurrency } = useLanguage();

  const getItemCountLabel = (count: number) => {
    if (language === 'he') {
      return `${count} ${t.cart.itemsCountLabel}`;
    }
    if (language === 'en') {
      return `${count} ${count === 1 ? t.cart.itemWord1 : t.cart.itemWordMany}`;
    }
    const lastDigit = count % 10;
    const lastTwo = count % 100;
    if (lastTwo >= 11 && lastTwo <= 19) return `${count} ${t.cart.itemWordMany}`;
    if (lastDigit === 1) return `${count} ${t.cart.itemWord1}`;
    if (lastDigit >= 2 && lastDigit <= 4) return `${count} ${t.cart.itemWordFew}`;
    return `${count} ${t.cart.itemWordMany}`;
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigateTo('cart');
  };

  return (
    <Drawer
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      title={t.cart.drawerTitle}
      subtitle={cartTotalCount > 0 ? getItemCountLabel(cartTotalCount) : undefined}
    >
      {cart.length === 0 ? (
        <EmptyState
          title={t.cart.emptyTitle}
          description={t.cart.drawerEmptyDesc}
          actionText={t.cart.goToCatalog}
          onAction={() => {
            setIsCartOpen(false);
            navigateTo('catalog');
          }}
        />
      ) : (
        <div className="space-y-5">
          <Panel className="divide-y-2 divide-paper-dot">
            {cart.map((item) => (
              <CartLine key={item.product.id} item={item} />
            ))}
          </Panel>

          <Panel tone="accent">
            <SummaryRow label={t.cart.itemsSubtotal} value={formatCurrency(cartSubtotal)} />
            <SummaryRow label={t.cart.deliveryFee} value={formatCurrency(deliveryFee)} />
            <SummaryRow isTotal label={t.collage.delivery.total} value={formatCurrency(totalAmount)} />
            <Button size="lg" fullWidth onClick={handleCheckout} className="mt-3">
              {t.cart.checkoutButton}
            </Button>
            <p className="mt-2 text-center text-[13px] font-bold">{t.collage.common.demo}</p>
          </Panel>
        </div>
      )}
    </Drawer>
  );
};
