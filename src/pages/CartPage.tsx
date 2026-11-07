import React, { useState } from 'react';
import { Trash2, Plus, Minus, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartTotalCount,
    cartDiscount,
    setCartDiscount,
    deliveryFee,
    orderStores,
    totalAmount,
    currentAddress,
    setIsAddressModalOpen,
    navigateTo,
  } = useApp();

  const { language, t, formatCurrency } = useLanguage();
  const { showToast } = useToast();
  const [promoCode, setPromoCode] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'START20' || promoCode.trim().toUpperCase() === 'QIVENTRA2026') {
      setCartDiscount(25);
      showToast({
        type: 'success',
        title: t.cart.promoAppliedTitle,
        message: `${t.cart.promoDiscountDesc} ${formatCurrency(25)}`,
      });
    } else {
      showToast({
        type: 'error',
        title: t.cart.promoInvalidTitle,
        message: t.cart.promoInvalidDesc,
      });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <EmptyState
          title={t.cart.emptyTitle}
          description={t.cart.emptyDesc}
          actionText={t.cart.exploreCatalog}
          onAction={() => navigateTo('catalog')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12 py-6 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-theme">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-primary tracking-tight">
            {t.cart.checkoutTitle}
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-0.5">
            {cartTotalCount} {t.cart.itemsCountLabel}
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={clearCart}
          className="text-secondary hover:text-danger"
        >
          {t.cart.clearAll}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl sm:rounded-3xl bg-surface border border-theme p-4 sm:p-6 shadow-xs divide-y divide-theme/60">
            {cart.map((item) => {
              const displayName = item.product.names?.[language] || item.product.name;
              const displayStoreName = item.product.storeNames?.[language] || item.product.storeName;
              const displayUnit = item.product.units?.[language] || item.product.unit;

              return (
                <div
                  key={item.product.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col gap-2 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4"
                >
                  {/* Left: Product Info with wrapping title */}
                  <div className="flex flex-col min-w-0 pe-2">
                    <span className="text-[11px] text-secondary font-medium truncate">
                      {displayStoreName}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-primary break-words mt-0.5">
                      {displayName}
                    </h4>
                    <span className="text-[11px] text-muted mt-0.5">{displayUnit}</span>
                    <span className="text-xs sm:text-sm font-extrabold text-primary mt-1 font-sans whitespace-nowrap tabular-nums">
                      {formatCurrency(item.product.price)}
                    </span>
                  </div>

                  {/* Right: Stepper + Total + Delete */}
                  <div className="flex items-center justify-between gap-2 sm:gap-3 shrink-0">
                    {/* Stepper */}
                    <div className="seg-group flex items-center bg-accent border-2 border-ink rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="grid place-items-center w-11 h-11 cursor-pointer"
                        aria-label={`${t.productCard.decrease}: ${displayName}`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold w-5 text-center text-primary tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="grid place-items-center w-11 h-11 cursor-pointer"
                        aria-label={`${t.productCard.increase}: ${displayName}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <span className="text-xs sm:text-sm font-extrabold text-primary w-14 sm:w-16 text-end font-sans whitespace-nowrap tabular-nums">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="grid place-items-center w-11 h-11 text-ink-3 hover:text-danger rounded-lg cursor-pointer"
                      aria-label={`${t.cart.clearAll}: ${displayName}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery Address Reminder */}
          <div className="p-4 rounded-2xl bg-surface-elevated border border-theme flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <MapPin className="w-4 h-4 text-ink shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[11px] text-secondary block">{t.cart.deliveryDestination}:</span>
                <span className="text-xs font-bold text-primary truncate block">{currentAddress}</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddressModalOpen(true)}
              className="shrink-0"
            >
              {t.cart.changeAddress}
            </Button>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-[22px] bg-accent border-[3px] border-ink p-5 sm:p-6 shadow-hard-6 space-y-4">
            <h3 className="text-base font-bold text-primary">{t.cart.orderSummary}</h3>

            {/* Calculations */}
            <div className="space-y-2 text-sm font-bold">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center text-secondary">
                <span>{t.cart.itemsCountLabel} ({cartTotalCount})</span>
                <span className="font-semibold text-primary whitespace-nowrap tabular-nums">{formatCurrency(cartSubtotal)}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center font-extrabold text-ink">
                  <span>{t.cart.promoDiscount}</span>
                  <span className="font-semibold whitespace-nowrap tabular-nums">- {formatCurrency(cartDiscount)}</span>
                </div>
              )}

              {orderStores.length > 1 ? (
                orderStores.map((line) => (
                  <div key={line.store.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 text-secondary">
                    <span>
                      {t.collage.delivery.deliveryLabel} · <bdi>{t.collage.storeCopy[line.store.id]?.name || line.store.name}</bdi>
                    </span>
                    <span className="font-semibold text-primary whitespace-nowrap tabular-nums">{formatCurrency(line.fee)}</span>
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center text-secondary">
                  <span>{t.collage.delivery.deliveryLabel}</span>
                  <span className="font-semibold text-primary whitespace-nowrap tabular-nums">{formatCurrency(deliveryFee)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-theme grid grid-cols-[minmax(0,1fr)_auto] items-center text-base font-extrabold text-primary">
                <span>{t.collage.delivery.total}</span>
                <span className="text-xl font-sans whitespace-nowrap tabular-nums">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="pt-2 flex gap-2">
              <Input
                placeholder="START20"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="text-xs"
              />
              <Button type="submit" variant="secondary" size="md" className="shrink-0">
                {t.cart.applyPromo}
              </Button>
            </form>

            {/* Next step: choosing the delivery window. Nothing is charged in this demo. */}
            <Button variant="primary" size="lg" fullWidth onClick={() => navigateTo('delivery')}>
              {t.collage.stores.next}
            </Button>

            <p className="pt-1 text-center text-[13px] font-bold">{t.collage.common.demo}</p>
          </div>
        </div>

      </div>
    </div>
  );
};
