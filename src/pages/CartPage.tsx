import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { CartLine } from '../components/collage/CartLine';
import { DiscountChoiceNote, PromotionHints, PromotionRows } from '../components/collage/OrderPromotions';
import { PageHeading, PageShell } from '../components/collage/Page';
import { Panel } from '../components/collage/Panel';
import { SummaryRow } from '../components/collage/SummaryRow';

export const CartPage: React.FC = () => {
  const {
    cart,
    clearCart,
    cartSubtotal,
    cartTotalCount,
    setCartDiscount,
    order,
    orderStores,
    totalAmount,
    currentAddress,
    setIsAddressModalOpen,
    navigateTo,
  } = useApp();

  const { t, formatCurrency } = useLanguage();
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
      <PageShell width="narrow" className="pt-10 desk:pt-16">
        <h1 className="sr-only">{t.cart.checkoutTitle}</h1>
        <EmptyState
          title={t.cart.emptyTitle}
          description={t.cart.emptyDesc}
          actionText={t.cart.exploreCatalog}
          onAction={() => navigateTo('catalog')}
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5 desk:mb-8">
        <PageHeading note={t.screens.cart.note} title={t.cart.checkoutTitle} />
        <Button variant="outline" size="sm" onClick={clearCart}>
          {t.cart.clearAll}
        </Button>
      </div>

      <div className="grid desk:grid-cols-[minmax(0,1fr)_400px] gap-5 desk:gap-8 items-start">
        <div className="space-y-5 min-w-0">
          <Panel tape="blue" className="divide-y-2 divide-paper-dot" aria-label={t.cart.orderSummary}>
            {cart.map((item) => (
              <CartLine key={item.product.id} item={item} />
            ))}
          </Panel>

          <Panel tone="health" className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <MapPin aria-hidden="true" className="w-5 h-5 shrink-0 text-action-text" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink-2">{t.cart.deliveryDestination}</p>
                <p className="font-black break-words">{currentAddress}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsAddressModalOpen(true)}>
              {t.cart.changeAddress}
            </Button>
          </Panel>
        </div>

        <Panel as="aside" tone="accent" className="desk:sticky desk:top-24" aria-label={t.cart.orderSummary}>
          <h2 className="mb-2 text-[22px] font-black">{t.cart.orderSummary}</h2>

          <SummaryRow label={`${t.cart.itemsCountLabel} (${cartTotalCount})`} value={formatCurrency(cartSubtotal)} />
          <PromotionRows lines={order.promotionLines} showStore={orderStores.length > 1} />
          {order.promoCodeDiscount > 0 && (
            <SummaryRow label={t.cart.promoDiscount} value={`− ${formatCurrency(order.promoCodeDiscount)}`} />
          )}
          {orderStores.length > 1 ? (
            orderStores.map((line) => (
              <SummaryRow
                key={line.store.id}
                label={
                  <>
                    {t.collage.delivery.deliveryLabel} · <bdi>{t.collage.storeCopy[line.store.id]?.name || line.store.name}</bdi>
                  </>
                }
                value={formatCurrency(line.baseFee)}
              />
            ))
          ) : (
            <SummaryRow label={t.collage.delivery.deliveryLabel} value={formatCurrency(order.baseDeliveryFee)} />
          )}
          <SummaryRow isTotal label={t.collage.delivery.total} value={formatCurrency(totalAmount)} />

          {order.discountChoice !== 'promoCode' && <PromotionHints stores={orderStores} className="mt-3" />}

          <form onSubmit={handleApplyPromo} className="flex items-end gap-2 mt-4">
            <Input
              label={t.screens.cart.promoLabel}
              placeholder="START20"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              autoComplete="off"
            />
            <Button type="submit" variant="secondary" className="shrink-0 px-3.5">
              {t.cart.applyPromo}
            </Button>
          </form>

          <DiscountChoiceNote order={order} className="mt-2.5" />

          {/* Next step: choosing the delivery window. Nothing is charged in this demo. */}
          <Button size="lg" fullWidth onClick={() => navigateTo('delivery')} className="mt-4 whitespace-normal">
            {t.screens.cart.toWindow}
          </Button>
          <p className="mt-2 text-center text-[13px] font-bold">{t.collage.common.demo}</p>
        </Panel>
      </div>
    </PageShell>
  );
};
