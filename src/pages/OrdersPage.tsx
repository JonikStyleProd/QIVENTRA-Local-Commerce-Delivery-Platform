import React from 'react';
import { useParams } from 'react-router';
import { Bike, MapPin, MessageSquare, Phone, RefreshCw, Store, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { MOCK_PAST_ORDERS, MOCK_PRODUCTS } from '../data/mockData';
import { resolveRepeatOrder } from '../data/cartRules';
import { Order } from '../types';
import { NotFoundView } from './NotFoundPage';
import { pathFor } from '../router/paths';
import { formatWindow } from '../data/deliverySlots';
import { Button } from '../components/ui/Button';
import { NotebookPage, NotebookStep, NotebookSteps } from '../components/collage/NotebookPage';
import { PromotionRows } from '../components/collage/OrderPromotions';
import { PageHeading, PageShell, SectionHeading } from '../components/collage/Page';
import { Panel } from '../components/collage/Panel';
import { Stamp } from '../components/collage/Stamp';
import { SummaryRow } from '../components/collage/SummaryRow';
import { Tape } from '../components/collage/Tape';

const STATUS_ORDER = ['received', 'preparing', 'on_the_way', 'delivered'] as const;

/** The tracker has four steps; "courier assigned" and "on the way" are the same step to the buyer. */
const stepIndex = (status: string): number => {
  if (status === 'courier_assigned') return 2;
  const index = STATUS_ORDER.indexOf(status as (typeof STATUS_ORDER)[number]);
  return index === -1 ? 0 : index;
};

export const OrdersPage: React.FC = () => {
  const { activeOrder, trackedOrders, advanceOrderSimulation, navigateTo, openChatWithParticipant, currentAddress, addToCart } = useApp();
  const { language, t, formatCurrency, formatMinutes } = useLanguage();
  const { showToast } = useToast();
  const copy = t.screens.orders;
  const { orderId } = useParams();

  const handleCallCourier = () => {
    showToast({
      type: 'info',
      title: copy.callDemoTitle,
      message: copy.callDemoMsg,
    });
  };

  const handleRepeatOrder = (order: Order) => {
    const { available, unavailable } = resolveRepeatOrder(order.items, MOCK_PRODUCTS);
    const missingNames = unavailable.map((item) => item.names?.[language] || item.name).join(', ');

    if (available.length === 0) {
      showToast({ type: 'error', title: copy.repeatNoneTitle, message: missingNames });
      return;
    }

    available.forEach(({ product, quantity }) => addToCart(product, quantity));
    showToast(
      unavailable.length > 0
        ? { type: 'warning', title: t.orders.repeatOrderToastTitle, message: `${copy.repeatMissing}: ${missingNames}` }
        : { type: 'success', title: t.orders.repeatOrderToastTitle, message: `${t.orders.repeatOrderToastMsg} #${order.orderNumber}` }
    );
    navigateTo('cart');
  };

  if (orderId && activeOrder.id !== orderId) {
    return (
      <NotFoundView
        title={t.demo.notFound.orderTitle}
        description={t.demo.notFound.orderDesc}
        actionText={t.demo.notFound.toOrders}
        actionTo={pathFor('orders')}
      />
    );
  }

  const isDelivered = activeOrder.status === 'delivered';
  const isOnTheWay = activeOrder.status === 'courier_assigned' || activeOrder.status === 'on_the_way';
  const displayStoreName = activeOrder.storeNames?.[language] || activeOrder.storeName;
  // A placed order keeps its own address; the demo order follows the current one.
  const displayAddress = activeOrder.placedAt
    ? activeOrder.addresses?.[language] || activeOrder.address
    : currentAddress || activeOrder.addresses?.[language] || activeOrder.address;
  const statusLabel = isDelivered
    ? t.orders.statusDelivered
    : activeOrder.status === 'received'
    ? t.orders.stepReceived
    : t.orders.activeDeliveryBadge;
  const windowLabel =
    activeOrder.deliveryWindow?.kind === 'slot'
      ? formatWindow(activeOrder.deliveryWindow, t.collage.slots, language, new Date())
      : null;
  const otherOrders = trackedOrders.filter((order) => order.id !== activeOrder.id);

  const currentStep = stepIndex(activeOrder.status);
  const stepLabels = [t.orders.stepReceived, t.orders.stepPreparing, t.orders.stepOnTheWay, t.orders.stepAtDoor];
  const steps: NotebookStep[] = stepLabels.map((label, index) => ({
    key: label,
    label,
    state: index < currentStep || isDelivered ? 'done' : index === currentStep ? 'current' : 'todo',
  }));

  const courierName = activeOrder.courier?.names?.[language] || activeOrder.courier?.name || t.screens.chat.courier;

  return (
    <PageShell>
      <PageHeading note={copy.note} title={t.orders.title} lead={t.orders.subtitle} className="mb-5 desk:mb-8" />

      <div className="grid desk:grid-cols-[minmax(0,1fr)_minmax(0,420px)] gap-6 desk:gap-10 items-start">
        {/* ---------- Tracker page ---------- */}
        <NotebookPage>
          <div className="flex flex-wrap items-center gap-2 min-h-11">
            <Stamp tone={isDelivered ? 'success' : 'action'} className="text-sm">
              {statusLabel}
            </Stamp>
            <span className="text-sm font-bold text-ink-2">
              <bdi>#{activeOrder.orderNumber || activeOrder.id}</bdi>
            </span>
          </div>
          <h2 className="text-[26px] desk:text-[32px] font-black tracking-tight leading-tight break-words">
            <bdi>{displayStoreName}</bdi>
          </h2>
          <p className="flex items-start gap-1.5 mb-1 font-bold text-ink-2">
            <MapPin aria-hidden="true" className="w-4 h-4 mt-1 shrink-0" />
            <span className="min-w-0 break-words">{displayAddress}</span>
          </p>

          <p className="hand text-[26px] leading-[44px] text-link-text">{copy.route}</p>
          <NotebookSteps steps={steps} label={t.orders.statusLabel} />

          {isDelivered && (
            <span
              aria-hidden="true"
              className="anim-stamp hidden sm:block absolute end-5 bottom-[110px] px-4 py-2 border-4 border-action-text rounded-xl text-action-text text-2xl font-black bg-card/80"
            >
              {t.orders.statusCompleted}
            </span>
          )}

          <div className="mt-3 pt-3">
            <p className="mb-2 text-sm font-bold text-ink-2">{copy.demoStep}</p>
            <Button
              variant="secondary"
              onClick={advanceOrderSimulation}
              leftIcon={<TrendingUp aria-hidden="true" className="w-4 h-4" />}
              className="whitespace-normal"
            >
              {t.orders.nextStepBtn}
            </Button>
          </div>
        </NotebookPage>

        {/* ---------- Order column ---------- */}
        <div className="space-y-6 min-w-0">
          <Panel tone="accent" as="section" aria-label={t.orders.orderItemsTitle}>
            <p className="text-sm font-extrabold">
              {isDelivered ? t.orders.statusLabel : windowLabel ? t.collage.delivery.windowWord : t.orders.estimatedTimeLabel}
            </p>
            <p className="mb-3 text-[28px] font-black leading-tight tabular-nums">
              {isDelivered ? t.orders.statusCompleted : windowLabel ?? `~${formatMinutes(activeOrder.etaMinutes)}`}
            </p>

            <h3 className="mb-1 pt-2 border-t-2 border-ink font-black">{t.orders.orderItemsTitle}</h3>
            {activeOrder.items.map((item, index) => (
              <SummaryRow
                key={index}
                label={
                  <>
                    <span className="tabular-nums">{item.quantity} ×</span> {item.names?.[language] || item.name}
                  </>
                }
                value={formatCurrency(item.price * item.quantity)}
              />
            ))}
            {activeOrder.placedAt && (
              <>
                <PromotionRows
                  lines={activeOrder.promotionLines ?? []}
                  showStore={(activeOrder.feeLines?.length ?? 0) > 1}
                />
                {(activeOrder.discount ?? 0) > 0 && (
                  <SummaryRow label={t.cart.promoDiscount} value={`− ${formatCurrency(activeOrder.discount ?? 0)}`} />
                )}
                <SummaryRow label={t.collage.delivery.deliveryLabel} value={formatCurrency(activeOrder.deliveryFee)} />
              </>
            )}
            <SummaryRow isTotal label={t.collage.delivery.total} value={formatCurrency(activeOrder.totalAmount)} />

            <Button
              variant="outline"
              fullWidth
              leftIcon={<Store aria-hidden="true" className="w-4 h-4" />}
              onClick={() =>
                openChatWithParticipant({
                  type: 'store',
                  id: activeOrder.storeId,
                  name: displayStoreName,
                  storeId: activeOrder.storeId,
                  orderId: activeOrder.orderNumber,
                })
              }
              className="mt-4"
            >
              {t.chat.withStore}
            </Button>
          </Panel>

          {isOnTheWay && (
            <div aria-hidden="true" className="relative max-w-[420px] mx-auto p-2.5 pb-3 bg-card -rotate-1 shadow-polaroid">
              <Tape tone="yellow" />
              <img
                src="/photos/courier-cargo-bike.webp"
                alt=""
                loading="lazy"
                className="block w-full aspect-[16/9] object-cover"
              />
            </div>
          )}

          {activeOrder.courier && (
            <Panel as="section" tone="health" aria-label={copy.courier}>
              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-12 h-12 shrink-0 bg-card border-2 border-ink rounded-xl -rotate-3">
                  <Bike aria-hidden="true" className="w-6 h-6" />
                </span>
                <div className="min-w-0">
                  <p className="hand text-2xl leading-none text-link-text">{copy.courier}</p>
                  <p className="font-black break-words">{courierName}</p>
                  <p className="text-sm font-bold text-ink-2">
                    {activeOrder.courier.vehicleName?.[language] || activeOrder.courier.vehicle}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm font-bold text-ink-2">
                {activeOrder.courier.currentLocationNames?.[language] || activeOrder.courier.currentLocationName}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Phone aria-hidden="true" className="w-4 h-4" />}
                  onClick={handleCallCourier}
                  className="flex-1"
                >
                  {t.orders.callCourier}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<MessageSquare aria-hidden="true" className="w-4 h-4" />}
                  onClick={() =>
                    openChatWithParticipant({
                      type: 'courier',
                      id: activeOrder.courier?.id || 'courier-1',
                      name: courierName,
                      avatarUrl: activeOrder.courier?.avatarUrl,
                      orderId: activeOrder.orderNumber,
                    })
                  }
                  className="flex-1"
                >
                  {t.orders.chat}
                </Button>
              </div>
            </Panel>
          )}
        </div>
      </div>

      {otherOrders.length > 0 && (
        <section className="mt-10 desk:mt-14">
          <SectionHeading title={t.collage.orders.otherActive} />
          <ul className="grid desk:grid-cols-2 gap-4">
            {otherOrders.map((order) => (
              <Panel key={order.id} as="li" className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink-2">
                    <bdi>#{order.orderNumber}</bdi>
                  </p>
                  <h3 className="font-black break-words">
                    <bdi>{order.storeNames?.[language] || order.storeName}</bdi>
                  </h3>
                </div>
                <span className="text-lg font-black whitespace-nowrap">{formatCurrency(order.totalAmount)}</span>
                <Button variant="outline" size="sm" onClick={() => navigateTo('order', { orderId: order.id })}>
                  {t.collage.orders.open}
                </Button>
              </Panel>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10 desk:mt-14">
        <SectionHeading title={t.orders.historyTitle} />
        <ul className="grid desk:grid-cols-2 gap-4">
          {MOCK_PAST_ORDERS.map((order) => (
            <Panel key={order.id} as="li">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="text-sm font-bold text-ink-2">
                  <bdi>#{order.orderNumber}</bdi>
                </span>
                <Stamp tone={order.status === 'delivered' ? 'success' : 'neutral'}>
                  {order.status === 'delivered' ? t.orders.statusDelivered : order.status}
                </Stamp>
                <span className="text-sm font-bold text-ink-3">{order.createdAts?.[language] || order.createdAt}</span>
              </div>
              <h3 className="mt-1 text-lg font-black break-words">
                <bdi>{order.storeNames?.[language] || order.storeName}</bdi>
              </h3>
              <p className="text-sm font-bold text-ink-2">
                {order.items.map((item) => `${item.quantity} × ${item.names?.[language] || item.name}`).join(', ')}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5">
                <span className="text-lg font-black whitespace-nowrap tabular-nums">{formatCurrency(order.totalAmount)}</span>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<RefreshCw aria-hidden="true" className="w-4 h-4" />}
                  onClick={() => handleRepeatOrder(order)}
                >
                  {t.orders.repeatOrder}
                </Button>
              </div>
            </Panel>
          ))}
        </ul>
      </section>
    </PageShell>
  );
};
