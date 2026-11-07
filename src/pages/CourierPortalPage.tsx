import React, { useState } from 'react';
import { Bike } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { distanceKm } from '../data/addresses';
import { MOCK_STORES } from '../data/mockData';
import { isOrderActive, nextStatus, routeProgress } from '../data/orderTracker';
import { formatCount } from '../i18n/format';
import { pathFor } from '../router/paths';
import { Order, OrderStatus } from '../types';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { LinkButton } from '../components/ui/LinkButton';
import { DemoRoleBar } from '../components/collage/DemoRoleBar';
import { NotebookPage, NotebookStep, NotebookSteps } from '../components/collage/NotebookPage';
import { PageShell, SectionHeading } from '../components/collage/Page';
import { Panel } from '../components/collage/Panel';
import { PortalHeader } from '../components/collage/PortalHeader';
import { RouteMap } from '../components/collage/RouteMap';
import { Stamp } from '../components/collage/Stamp';
import { DemoFiguresNote, StatSticker } from '../components/collage/StatSticker';
import { StatusToggle } from '../components/collage/StatusToggle';

const AT_THE_SHOP: OrderStatus[] = ['received', 'preparing', 'courier_assigned'];

/** One order's route: where it goes, the diagram, and the button that moves its status on. */
const CourierTask: React.FC<{ order: Order }> = ({ order }) => {
  const { advanceOrderStatus } = useApp();
  const { language, t, formatDistance } = useLanguage();
  const { showToast } = useToast();
  const copy = t.demo.courier;

  const stores = (order.feeLines?.map((line) => line.storeId) ?? [order.storeId]).flatMap((id) =>
    MOCK_STORES.filter((store) => store.id === id)
  );
  const firstStore = stores[0] ?? MOCK_STORES.find((store) => store.id === order.storeId);
  const storeName = (id: string, fallback: string) => t.collage.storeCopy[id]?.name || fallback;
  const fromName = stores.map((store) => storeName(store.id, store.name)).join(', ') || order.storeNames?.[language] || order.storeName;
  const clientAddress = order.addresses?.[language] || order.address;
  const destination = order.destination ?? firstStore?.coords;
  const routeKm =
    firstStore && destination
      ? stores
          .map((store) => store.coords)
          .concat(destination)
          .reduce((sum, point, index, all) => (index === 0 ? 0 : sum + distanceKm(all[index - 1], point)), 0)
      : 0;

  const isDelivered = order.status === 'delivered';
  const action = order.status === 'delivered' ? null : copy.actions[order.status];

  const steps: NotebookStep[] = [
    {
      key: 'pickup',
      label: t.courier.pointAPickup,
      state: AT_THE_SHOP.includes(order.status) ? 'current' : 'done',
      detail: (
        <>
          <p className="font-black text-ink">
            <bdi>{fromName}</bdi>
          </p>
          <p>
            {firstStore?.addresses?.[language] || firstStore?.address} · {t.screens.portal.pickupCode}: <bdi>481</bdi>
          </p>
        </>
      ),
    },
    {
      key: 'delivery',
      label: t.courier.pointBDelivery,
      state: isDelivered ? 'done' : order.status === 'on_the_way' ? 'current' : 'todo',
      detail: <p>{clientAddress}</p>,
    },
  ];

  const advance = () => {
    const next = nextStatus(order.status);
    if (!next) return;
    advanceOrderStatus(order.id);
    showToast(
      next === 'delivered'
        ? { type: 'success', title: copy.deliveredTitle, message: `${copy.deliveredMsg} ${copy.payoutNote}` }
        : { type: 'info', title: copy.statusChangedTitle, message: t.demo.tracker.status[next] }
    );
  };

  return (
    <div className="grid desk:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 items-start">
      <NotebookPage>
        <p className="hand text-[26px] leading-[44px] text-action">{t.courier.currentTask}</p>
        <div className="flex flex-wrap items-center gap-2.5 min-h-11">
          <h2 className="text-[26px] font-black tracking-tight">
            <bdi>#{order.orderNumber}</bdi>
          </h2>
          <Stamp tone={isDelivered ? 'success' : 'action'}>{t.demo.tracker.status[order.status]}</Stamp>
        </div>

        <NotebookSteps steps={steps} label={t.courier.currentTask} />

        {action && (
          <Button size="lg" onClick={advance} fullWidth className="mt-3 whitespace-normal">
            {action}
          </Button>
        )}
        <p className="mt-2 text-sm font-bold text-ink-2">{t.demo.tracker.syncNote}</p>
      </NotebookPage>

      <Panel as="section" aria-label={copy.routeTitle}>
        <SectionHeading title={copy.routeTitle} />
        {destination && (
          <RouteMap
            from={stores.length > 0 ? stores.map((store) => store.coords) : [destination]}
            to={destination}
            progress={routeProgress(order.status)}
            pointA={copy.pointA}
            pointB={copy.pointB}
            label={copy.routeAria
              .replace('{from}', fromName)
              .replace('{to}', clientAddress)
              .replace('{distance}', formatDistance(routeKm))}
          />
        )}
        <dl className="grid gap-1 mt-3 text-sm">
          <div className="flex gap-2">
            <dt className="font-black">{copy.pointA}</dt>
            <dd className="font-bold">
              {copy.from}: <bdi>{fromName}</bdi>
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-black">{copy.pointB}</dt>
            <dd className="font-bold">
              {copy.to}: {clientAddress}
            </dd>
          </div>
          <div className="flex flex-wrap gap-2">
            <dt className="font-black">{copy.distance}</dt>
            <dd className="font-bold">{formatDistance(routeKm)}</dd>
          </div>
        </dl>
        <p className="mt-2 text-sm font-bold text-ink-2">{copy.schematic}</p>
      </Panel>
    </div>
  );
};

export const CourierPortalPage: React.FC = () => {
  const { orders, createDemoOrder } = useApp();
  const { language, t, formatCurrency, formatMinutes } = useLanguage();
  const { showToast } = useToast();
  const copy = t.demo.courier;
  const data = t.demo.portalData;

  const [isOnShift, setIsOnShift] = useState(true);
  const [taskId, setTaskId] = useState<string | null>(null);

  const active = orders.filter(isOrderActive);
  // A task just delivered stays on screen, so the courier sees the result before taking the next one.
  const task = orders.find((order) => order.id === taskId) ?? active[0];
  const others = active.filter((order) => order.id !== task?.id);

  const toggleShift = () => {
    setIsOnShift(!isOnShift);
    showToast({
      type: 'info',
      title: !isOnShift ? t.courier.shiftStartedTitle : t.courier.shiftPausedTitle,
      message: !isOnShift ? t.courier.shiftStartedMsg : t.courier.shiftPausedMsg,
    });
  };

  const shiftTime = `${formatCount(3, t.demo.counts.hours, language)} ${formatMinutes(20)}`;

  return (
    <PageShell>
      <DemoRoleBar current="courier" />
      <PortalHeader
        icon={<Bike className="w-7 h-7 desk:w-9 desk:h-9" />}
        note={t.courier.courierLabel}
        title={data.courierName}
        lead={`${data.courierVehicle} · ${data.shiftOpen.replace('{time}', shiftTime)}`}
      >
        <StatusToggle isOn={isOnShift} label={isOnShift ? t.courier.onShift : t.courier.breakTime} onToggle={toggleShift} />
      </PortalHeader>

      <section className="mb-9 desk:mb-12">
        <DemoFiguresNote text={t.screens.common.demoFigures} />
        <div className="grid grid-cols-2 desk:grid-cols-3 gap-3.5 desk:gap-5">
          <StatSticker label={t.courier.earnedShift} value={formatCurrency(285)} hint={t.courier.includingTips} tint="gift" />
          <StatSticker label={t.courier.completedDeliveries} value={formatCount(8, t.demo.counts.deliveries, language)} tint="health" />
          <StatSticker
            label={t.courier.batteryLevel}
            value={new Intl.NumberFormat(language, { style: 'percent' }).format(0.84)}
            hint={`~${formatCount(4, t.demo.counts.hours, language)}`}
            tint="tech"
          />
        </div>
      </section>

      {task ? (
        <CourierTask key={task.id} order={task} />
      ) : (
        <EmptyState title={copy.noneTitle} description={copy.noneDesc}>
          <div className="flex flex-wrap justify-center gap-2.5">
            <Button variant="secondary" onClick={() => setTaskId(createDemoOrder().id)}>
              {t.demo.orders.newDemoOrder}
            </Button>
            <LinkButton to={pathFor('catalog')} variant="outline">
              {t.demo.portal.backToShop}
            </LinkButton>
          </div>
        </EmptyState>
      )}

      {task?.status === 'delivered' && active.length === 0 && (
        <div className="flex flex-wrap items-center gap-2.5 mt-5">
          <p className="font-bold">{copy.noneDesc}</p>
          <Button variant="secondary" onClick={() => setTaskId(createDemoOrder().id)}>
            {t.demo.orders.newDemoOrder}
          </Button>
        </div>
      )}

      {others.length > 0 && (
        <section className="mt-9">
          <SectionHeading title={copy.otherOrders} />
          <ul className="grid desk:grid-cols-2 gap-4">
            {others.map((order) => (
              <Panel key={order.id} as="li" className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink-2">
                    <bdi>#{order.orderNumber}</bdi> · {t.demo.tracker.status[order.status]}
                  </p>
                  <h3 className="font-black break-words">
                    <bdi>{order.storeNames?.[language] || order.storeName}</bdi>
                  </h3>
                </div>
                <Button variant="outline" size="sm" onClick={() => setTaskId(order.id)}>
                  {copy.take}
                </Button>
              </Panel>
            ))}
          </ul>
        </section>
      )}
    </PageShell>
  );
};
