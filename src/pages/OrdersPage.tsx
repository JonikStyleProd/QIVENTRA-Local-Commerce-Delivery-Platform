import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { isOrderActive } from '../data/orderTracker';
import { useRepeatOrder } from '../hooks/useRepeatOrder';
import { pathFor } from '../router/paths';
import { Order } from '../types';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { LinkButton } from '../components/ui/LinkButton';
import { PageHeading, PageShell } from '../components/collage/Page';
import { Panel } from '../components/collage/Panel';
import { SegmentedControl } from '../components/collage/SegmentedControl';
import { Stamp } from '../components/collage/Stamp';

type OrdersFilter = 'active' | 'delivered';

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const { language, t, formatCurrency } = useLanguage();
  const repeatOrder = useRepeatOrder();
  const to = pathFor('order', { orderId: order.id });
  const isDelivered = order.status === 'delivered';

  return (
    <Panel as="li" className="flex flex-col">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <span className="text-sm font-bold text-ink-2">
          <bdi>#{order.orderNumber}</bdi>
        </span>
        <Stamp tone={isDelivered ? 'success' : 'action'}>{t.demo.tracker.status[order.status]}</Stamp>
        {order.createdAts?.[language] && (
          <span className="text-sm font-bold text-ink-3">{order.createdAts[language]}</span>
        )}
      </div>
      <h2 className="mt-1 text-lg font-black break-words">
        <Link to={to} className="hover:underline">
          <bdi>{order.storeNames?.[language] || order.storeName}</bdi>
        </Link>
      </h2>
      <p className="flex-1 text-sm font-bold text-ink-2">
        {order.items.map((item) => `${item.quantity} × ${item.names?.[language] || item.name}`).join(', ')}
      </p>
      <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5">
        <span className="text-lg font-black whitespace-nowrap tabular-nums">{formatCurrency(order.totalAmount)}</span>
        <div className="flex flex-wrap gap-2">
          {isDelivered && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw aria-hidden="true" className="w-4 h-4" />}
              onClick={() => repeatOrder(order)}
            >
              {t.orders.repeatOrder}
            </Button>
          )}
          <LinkButton to={to} variant="secondary" size="sm">
            {t.demo.orders.open}
          </LinkButton>
        </div>
      </div>
    </Panel>
  );
};

/** All orders with a filter. The tracker and everything else about one order is on its own page. */
export const OrdersPage: React.FC = () => {
  const { orders, isSignedIn } = useApp();
  const { t } = useLanguage();
  const copy = t.demo.orders;
  const [searchParams, setSearchParams] = useSearchParams();
  const filter: OrdersFilter = searchParams.get('filter') === 'delivered' ? 'delivered' : 'active';

  const shown = useMemo(
    () => orders.filter((order) => (filter === 'active' ? isOrderActive(order) : !isOrderActive(order))),
    [orders, filter]
  );

  return (
    <PageShell>
      <PageHeading note={t.screens.orders.note} title={t.orders.title} lead={t.orders.subtitle} className="mb-5 desk:mb-8" />

      <SegmentedControl<OrdersFilter>
        label={copy.filterLabel}
        value={filter}
        onChange={(next) =>
          setSearchParams(next === 'delivered' ? { filter: next } : {}, { replace: true, preventScrollReset: true })
        }
        className="flex w-full max-w-[420px] mb-5"
        options={[
          { value: 'active', label: copy.active },
          { value: 'delivered', label: copy.delivered },
        ]}
      />

      {!isSignedIn && <p className="max-w-[640px] mb-5 font-bold text-ink-2">{t.demo.auth.guestOrders}</p>}

      {shown.length === 0 ? (
        filter === 'active' ? (
          <EmptyState title={copy.emptyActiveTitle} description={copy.emptyActiveDesc}>
            <LinkButton to={pathFor('catalog')} variant="secondary">
              {t.collage.landing.toShops}
            </LinkButton>
          </EmptyState>
        ) : (
          <EmptyState title={copy.emptyDeliveredTitle} description={copy.emptyDeliveredDesc} />
        )
      ) : (
        <ul className="grid desk:grid-cols-2 gap-4">
          {shown.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </ul>
      )}
    </PageShell>
  );
};
