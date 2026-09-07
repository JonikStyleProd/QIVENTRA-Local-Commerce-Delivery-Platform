import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
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
    currentAddress,
    setIsAddressModalOpen,
    navigateTo,
  } = useApp();

  const { language, t, formatCurrency, isRTL } = useLanguage();
  const { showToast } = useToast();
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);

  const freeDeliveryThreshold = 100;
  const deliveryFee = cartSubtotal >= freeDeliveryThreshold || cartSubtotal === 0 ? 0 : 15;
  const totalAmount = Math.max(0, cartSubtotal - discountApplied + deliveryFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'START20' || promoCode.trim().toUpperCase() === 'QIVENTRA2026') {
      setDiscountApplied(25);
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

  const handleCheckout = () => {
    showToast({
      type: 'success',
      title: t.orders.placedTitle,
      message: t.orders.placedMessage,
    });
    navigateTo('orders');
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
          className="text-secondary hover:text-[#C53030]"
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
                  className="py-4 first:pt-0 last:pb-0 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:gap-4"
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
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {/* Stepper */}
                    <div className="flex items-center gap-1.5 bg-surface-elevated border border-theme rounded-xl px-2 py-1">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:text-primary text-secondary transition active:scale-95"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold w-5 text-center text-primary tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:text-primary text-secondary transition active:scale-95"
                        aria-label="Increase"
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
                      className="p-1.5 text-muted hover:text-[#C53030] rounded-lg transition"
                      aria-label="Remove"
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
              <MapPin className="w-4 h-4 text-[#123B35] dark:text-[#B8D96B] shrink-0" />
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
          <div className="rounded-2xl sm:rounded-3xl bg-surface border border-theme p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-primary">{t.cart.orderSummary}</h3>

            {/* Calculations */}
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center text-secondary">
                <span>{t.cart.itemsCountLabel} ({cartTotalCount})</span>
                <span className="font-semibold text-primary whitespace-nowrap tabular-nums">{formatCurrency(cartSubtotal)}</span>
              </div>

              {discountApplied > 0 && (
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center text-[#1E824C] dark:text-[#48BB78]">
                  <span>{t.cart.promoDiscount}</span>
                  <span className="font-semibold whitespace-nowrap tabular-nums">- {formatCurrency(discountApplied)}</span>
                </div>
              )}

              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center text-secondary">
                <span>{t.cart.courierDelivery}</span>
                <span className="font-semibold text-primary whitespace-nowrap tabular-nums">
                  {deliveryFee === 0 ? t.cart.free : formatCurrency(deliveryFee)}
                </span>
              </div>

              <div className="pt-3 border-t border-theme grid grid-cols-[minmax(0,1fr)_auto] items-center text-base font-extrabold text-primary">
                <span>{t.cart.totalPayable}</span>
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

            {/* CTA Button */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              rightIcon={isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              onClick={handleCheckout}
            >
              {t.cart.payOrderPrefix} {formatCurrency(totalAmount)}
            </Button>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-muted flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1E824C]" />
                {t.cart.paymentConfirmationNote}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
