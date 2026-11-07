import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { PROMO_CODES, PromoCode, findPromoCode } from '../data/promotions';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { CartLine } from '../components/collage/CartLine';
import { DiscountChoiceNote, PromotionHints, PromotionRows } from '../components/collage/OrderPromotions';
import { PageHeading, PageShell } from '../components/collage/Page';
import { UndeliverableNotice } from '../components/collage/UndeliverableNotice';
import { Panel } from '../components/collage/Panel';
import { SummaryRow } from '../components/collage/SummaryRow';

export const CartPage: React.FC = () => {
  const {
    cart,
    clearCart,
    cartSubtotal,
    cartTotalCount,
    applyPromoCode,
    removePromoCode,
    order,
    orderStores,
    totalAmount,
    currentAddress,
    setIsAddressModalOpen,
    navigateTo,
  } = useApp();

  const { t, formatCurrency } = useLanguage();
  const { showToast } = useToast();
  const location = useLocation();
  const cameFromDelivery = (location.state as { notice?: string } | null)?.notice === 'emptyForDelivery';
  const [promoCode, setPromoCode] = useState('');

  const promoCopy = t.demo.promo;
  const fillPromo = (text: string, code: PromoCode, missing = 0) =>
    text
      .replace('{code}', code.code)
      .replace('{amount}', formatCurrency(code.amount))
      .replace('{min}', formatCurrency(code.minSubtotal))
      .replace('{missing}', formatCurrency(missing));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applyPromoCode(promoCode);
    const entered = findPromoCode(promoCode);
    if (result === 'applied' && entered) {
      setPromoCode('');
      showToast({ type: 'success', title: promoCopy.appliedTitle, message: fillPromo(promoCopy.appliedMsg, entered) });
    } else if (result === 'already') {
      setPromoCode('');
      showToast({ type: 'info', title: promoCopy.alreadyTitle, message: promoCopy.alreadyMsg });
    } else {
      showToast({ type: 'error', title: promoCopy.invalidTitle, message: fillPromo(promoCopy.invalidMsg, PROMO_CODES[0]) });
    }
  };

  if (cart.length === 0) {
    return (
      <PageShell width="narrow" className="pt-10 desk:pt-16">
        <h1 className="sr-only">{t.cart.checkoutTitle}</h1>
        <EmptyState
          title={t.cart.emptyTitle}
          description={cameFromDelivery ? t.demo.cart.emptyForDelivery : t.cart.emptyDesc}
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
            <SummaryRow
              label={<bdi>{promoCopy.active.replace('{code}', order.promoCode?.code ?? '')}</bdi>}
              value={`− ${formatCurrency(order.promoCodeDiscount)}`}
            />
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

          {order.promoCode ? (
            <div className="flex flex-wrap items-center justify-between gap-2 mt-4 p-2.5 bg-card/70 border-2 border-dashed border-ink rounded-xl">
              <div className="min-w-0 flex-1 basis-[180px]">
                <p className="font-black">
                  <bdi>{promoCopy.active.replace('{code}', order.promoCode.code)}</bdi>
                </p>
                <p role="status" className="text-sm font-extrabold">
                  {order.promoCode.missing > 0
                    ? fillPromo(promoCopy.needMore, order.promoCode, order.promoCode.missing)
                    : fillPromo(promoCopy.summary, order.promoCode)}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={removePromoCode}>
                {promoCopy.remove}
              </Button>
            </div>
          ) : (
            <>
              <form onSubmit={handleApplyPromo} className="flex items-end gap-2 mt-4">
                <Input
                  label={t.screens.cart.promoLabel}
                  placeholder={PROMO_CODES[0].code}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  autoComplete="off"
                />
                <Button type="submit" variant="secondary" className="shrink-0 px-3.5">
                  {t.cart.applyPromo}
                </Button>
              </form>
              <p className="mt-1.5 text-sm font-bold">
                {promoCopy.examples.replace('{code}', PROMO_CODES[0].code)} · {fillPromo(promoCopy.summary, PROMO_CODES[0])}
              </p>
            </>
          )}

          <DiscountChoiceNote order={order} className="mt-2.5" />
          <UndeliverableNotice lines={order.undeliverable} id="cart-undeliverable" className="mt-3" />

          {/* Next step: choosing the delivery window. Nothing is charged in this demo. */}
          <Button
            size="lg"
            fullWidth
            disabled={order.undeliverable.length > 0}
            aria-describedby={order.undeliverable.length > 0 ? 'cart-undeliverable' : undefined}
            onClick={() => navigateTo('delivery')}
            className="mt-4 whitespace-normal"
          >
            {t.screens.cart.toWindow}
          </Button>
          <p className="mt-2 text-center text-[13px] font-bold">{t.collage.common.demo}</p>
        </Panel>
      </div>
    </PageShell>
  );
};
