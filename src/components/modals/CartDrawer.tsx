import React from 'react';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartTotalCount,
    cartSubtotal,
    deliveryFee,
    totalAmount,
    freeDeliveryThreshold,
    navigateTo,
  } = useApp();

  const { language, t, isRTL, formatCurrency } = useLanguage();

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
      width="md"
    >
      {cart.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-surface-elevated flex items-center justify-center text-muted border border-theme">
            <ShoppingBag className="w-8 h-8 text-[#123B35] dark:text-[#B8D96B]" />
          </div>
          <div className="space-y-1 max-w-xs">
            <h3 className="text-base font-bold text-primary">
              {t.cart.emptyTitle}
            </h3>
            <p className="text-xs text-secondary leading-relaxed">
              {t.cart.drawerEmptyDesc}
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setIsCartOpen(false);
              navigateTo('catalog');
            }}
          >
            {t.cart.goToCatalog}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between">
          
          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto divide-y divide-theme/60 pe-1 scrollbar-none">
            {cart.map((item) => {
              const productName = item.product.names?.[language] || item.product.name;
              const productUnit = item.product.units?.[language] || item.product.unit;
              const storeName = item.product.storeNames?.[language] || item.product.storeName;

              return (
                <div key={item.product.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-primary truncate">
                      {productName}
                    </h4>
                    <p className="text-[11px] text-muted truncate">
                      {storeName} • {productUnit}
                    </p>
                    <div className="text-xs font-semibold text-primary mt-1 tabular-nums">
                      {formatCurrency(item.product.price * item.quantity)}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex items-center bg-surface-elevated rounded-xl p-0.5 border border-theme text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:text-primary text-secondary transition active:scale-95"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-primary tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:text-primary text-secondary transition active:scale-95"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 text-muted hover:text-[#C53030] transition rounded-lg hover:bg-surface-elevated shrink-0"
                      aria-label={t.cart.clearAll}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout & Summary Footer */}
          <div className="pt-4 mt-4 border-t border-theme shrink-0 space-y-3">
            
            {/* Free Delivery progress */}
            {cartSubtotal < freeDeliveryThreshold ? (
              <div className="p-2.5 rounded-xl bg-surface-elevated border border-theme text-xs text-secondary flex items-center justify-between">
                <span>{t.cart.freeDeliveryProgress}</span>
                <span className="font-bold text-[#123B35] dark:text-[#B8D96B] tabular-nums">
                  {formatCurrency(freeDeliveryThreshold - cartSubtotal)}
                </span>
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-[#E8F5EE] dark:bg-[#132E20] text-[#1E824C] dark:text-[#48BB78] text-xs font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>{t.cart.freeDeliveryUnlocked}</span>
              </div>
            )}

            {/* Calculations */}
            <div className="space-y-1.5 text-xs">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center text-secondary">
                <span>{t.cart.itemsSubtotal}</span>
                <span className="font-medium text-primary whitespace-nowrap tabular-nums">{formatCurrency(cartSubtotal)}</span>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center text-secondary">
                <span>{t.cart.deliveryFee}</span>
                <span className="font-medium text-primary whitespace-nowrap tabular-nums">
                  {deliveryFee === 0 ? t.cart.free : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center text-sm font-extrabold text-primary pt-2 border-t border-theme/60">
                <span>{t.cart.totalPayable}</span>
                <span className="text-base text-primary font-sans whitespace-nowrap tabular-nums">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                onClick={handleCheckout}
              >
                {t.cart.checkoutButton}
              </Button>
            </div>

            <p className="text-[11px] text-center text-muted flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1E824C] shrink-0" />
              {t.cart.securePaymentNote}
            </p>
          </div>
        </div>
      )}
    </Drawer>
  );
};
