import React from 'react';
import { Link, useParams } from 'react-router';
import { Bike, ChevronLeft, MapPin, MessageSquare, Phone, RefreshCw, Store, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { formatWindow } from '../data/deliverySlots';
import { nextStatus, trackerStep } from '../data/orderTracker';
import { useRepeatOrder } from '../hooks/useRepeatOrder';
import { pathFor } from '../router/paths';
import { Button } from '../components/ui/Button';
import { LinkButton } from '../components/ui/LinkButton';
import { NotebookPage, NotebookStep, NotebookSteps } from '../components/collage/NotebookPage';
import { PromotionRows } from '../components/collage/OrderPromotions';
import { PageHeading, PageShell } from '../components/collage/Page';
import { Panel } from '../components/collage/Panel';
import { Stamp } from '../components/collage/Stamp';
import { SummaryRow } from '../components/collage/SummaryRow';
import { Tape } from '../components/collage/Tape';
import { NotFoundView } from './NotFoundPage';

/** One order: tracker, contents, promotions and promo code, address, window and what to do next. */
export const OrderPage: React.FC = () => {
  const { orderId } = useParams();
  const { orders, advanceOrderStatus, openChatWithParticipant } = useApp();
  const { language, t, formatCurrency, formatMinutes } = useLanguage();
  const { showToast } = useToast();
  const repeatOrder = useRepeatOrder();
  const copy = t.screens.orders;
  const details = t.demo.orders;

  const order = orders.find((candidate) => candidate.id === orderId);

  if (!order) {
    return (
      <NotFoundView
        title={t.demo.notFound.orderTitle}
        description={t.demo.notFound.orderDesc}
        actionText={t.demo.notFound.toOrders}
        actionTo={pathFor('orders')}
      />
    );
  }

  const isDelivered = order.status === 'delivered';
  const isOnTheWay = order.status === 'courier_assigned' || order.status === 'on_the_way';
  const storeName = order.storeNames?.[language] || order.storeName;
  const address = order.addresses?.[language] || order.address;
  const statusLabel = t.demo.tracker.status[order.status];
  const windowLabel = !order.deliveryWindow
    ? null
    : order.deliveryWindow.kind === 'slot'
    ? formatWindow(order.deliveryWindow, t.collage.slots, language, new Date())
    : details.asap;

  const currentStep = trackerStep(order.status);
  const stepLabels = [t.orders.stepReceived, t.orders.stepPreparing, t.orders.stepOnTheWay, t.orders.stepAtDoor];
  const steps: NotebookStep[] = stepLabels.map((label, index) => ({
    key: label,
    label,
    state: isDelivered || index < currentStep ? 'done' : index === currentStep ? 'current' : 'todo',
  }));

  const courierName = order.courier?.names?.[language] || order.courier?.name || t.screens.chat.courier;
  const feeLines = order.feeLines ?? [];

  const openStoreChat = () =>
    openChatWithParticipant({
      type: 'store',
      id: order.storeId,
      name: storeName,
      storeId: order.storeId,
      orderId: order.orderNumber,
    });

  return (
    <PageShell>
      <Link
        to={pathFor('orders', {})}
        className="inline-flex items-center gap-1 min-h-11 -ms-1 px-1 font-extrabold cursor-pointer hover:underline"
      >
        <ChevronLeft aria-hidden="true" className="w-5 h-5 rtl-flip" />
        {details.back}
      </Link>

      <PageHeading
        note={copy.note}
        title={
          <>
            {t.demo.titles.order} <bdi>#{order.orderNumber}</bdi>
          </>
        }
        className="mt-1 mb-5 desk:mb-8"
      />

      <div className="grid desk:grid-cols-[minmax(0,1fr)_minmax(0,420px)] gap-6 desk:gap-10 items-start">
        {/* ---------- Tracker page ---------- */}
        <NotebookPage>
          <div className="flex flex-wrap items-center gap-2 min-h-11">
            <Stamp tone={isDelivered ? 'success' : 'action'} className="text-sm">
              {statusLabel}
            </Stamp>
          </div>
          <h2 className="text-[26px] desk:text-[32px] font-black tracking-tight leading-tight break-words">
            <bdi>{storeName}</bdi>
          </h2>
          <p className="flex items-start gap-1.5 mb-1 font-bold text-ink-2">
            <MapPin aria-hidden="true" className="w-4 h-4 mt-1 shrink-0" />
            <span className="min-w-0 break-words">{address}</span>
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
            {nextStatus(order.status) ? (
              <>
                <p className="mb-2 text-sm font-bold text-ink-2">{copy.demoStep}</p>
                <Button
                  variant="secondary"
                  onClick={() => advanceOrderStatus(order.id)}
                  leftIcon={<TrendingUp aria-hidden="true" className="w-4 h-4" />}
                  className="whitespace-normal"
                >
                  {t.orders.nextStepBtn}
                </Button>
                <p className="mt-2 text-sm font-bold text-ink-2">{t.demo.tracker.syncNote}</p>
              </>
            ) : (
              <>
                <p role="status" className="mb-2 font-bold">
                  {t.demo.tracker.deliveredNote}
                </p>
                <LinkButton to={`${pathFor('orders')}?filter=delivered`} variant="outline">
                  {t.demo.tracker.toHistory}
                </LinkButton>
              </>
            )}
          </div>
        </NotebookPage>

        {/* ---------- Order column ---------- */}
        <div className="space-y-6 min-w-0">
          <Panel tone="accent" as="section" aria-label={t.orders.orderItemsTitle}>
            <p className="text-sm font-extrabold">{isDelivered ? t.orders.statusLabel : t.demo.tracker.eta}</p>
            <p className="mb-3 text-[28px] font-black leading-tight tabular-nums">
              {isDelivered ? t.orders.statusCompleted : `~${formatMinutes(order.etaMinutes)}`}
            </p>

            <dl className="mb-3 pt-2 space-y-1 border-t-2 border-ink text-sm">
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-bold">{details.addressTitle}:</dt>
                <dd className="font-extrabold">{address}</dd>
              </div>
              {windowLabel && (
                <div className="flex flex-wrap gap-x-2">
                  <dt className="font-bold">{details.windowTitle}:</dt>
                  <dd className="font-extrabold">{windowLabel}</dd>
                </div>
              )}
              {order.note && (
                <div className="flex flex-wrap gap-x-2">
                  <dt className="font-bold">{details.noteTitle}:</dt>
                  <dd className="font-extrabold">{order.note}</dd>
                </div>
              )}
            </dl>

            <h3 className="mb-1 pt-2 border-t-2 border-ink font-black">{t.orders.orderItemsTitle}</h3>
            {order.items.map((item, index) => (
              <SummaryRow
                key={index}
                label={
                  <>
                    <span className="tabular-nums">{item.quantity} ×</span> {item.names?.[language] || item.name}
                    {item.variantLabels && <> · {item.variantLabels[language]}</>}
                  </>
                }
                value={formatCurrency(item.price * item.quantity)}
              />
            ))}
            <PromotionRows lines={order.promotionLines ?? []} showStore={feeLines.length > 1} />
            {(order.discount ?? 0) > 0 && (
              <SummaryRow
                label={<bdi>{details.promoCode.replace('{code}', order.promoCode ?? '')}</bdi>}
                value={`− ${formatCurrency(order.discount ?? 0)}`}
              />
            )}
            <SummaryRow label={t.collage.delivery.deliveryLabel} value={formatCurrency(order.deliveryFee)} />
            <SummaryRow isTotal label={t.collage.delivery.total} value={formatCurrency(order.totalAmount)} />

            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant="outline"
                leftIcon={<RefreshCw aria-hidden="true" className="w-4 h-4" />}
                onClick={() => repeatOrder(order)}
                className="flex-1"
              >
                {t.orders.repeatOrder}
              </Button>
              <Button
                variant="outline"
                leftIcon={<Store aria-hidden="true" className="w-4 h-4" />}
                onClick={openStoreChat}
                className="flex-1"
              >
                {details.chat}
              </Button>
            </div>
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

          {order.courier && !isDelivered && (
            <Panel as="section" tone="health" aria-label={copy.courier}>
              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-12 h-12 shrink-0 bg-card border-2 border-ink rounded-xl -rotate-3">
                  <Bike aria-hidden="true" className="w-6 h-6" />
                </span>
                <div className="min-w-0">
                  <p className="hand text-2xl leading-none text-link-text">{copy.courier}</p>
                  <p className="font-black break-words">{courierName}</p>
                  <p className="text-sm font-bold text-ink-2">
                    {order.courier.vehicleName?.[language] || order.courier.vehicle}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm font-bold text-ink-2">
                {order.courier.currentLocationNames?.[language] || order.courier.currentLocationName}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Phone aria-hidden="true" className="w-4 h-4" />}
                  onClick={() => showToast({ type: 'info', title: copy.callDemoTitle, message: copy.callDemoMsg })}
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
                      id: order.courier?.id || 'courier-1',
                      name: courierName,
                      avatarUrl: order.courier?.avatarUrl,
                      orderId: order.orderNumber,
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
    </PageShell>
  );
};
