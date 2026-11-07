import React, { useState } from 'react';
import { Store } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { formatMinutesAgo } from '../i18n/format';
import { MOCK_STORES } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { SelectField } from '../components/ui/SelectField';
import { SegmentedControl } from '../components/collage/SegmentedControl';
import { ProductLabelManager } from '../components/vendor/ProductLabelManager';
import { PromotionManager } from '../components/vendor/PromotionManager';
import { PageShell, SectionHeading } from '../components/collage/Page';
import { Panel } from '../components/collage/Panel';
import { DemoRoleBar } from '../components/collage/DemoRoleBar';
import { PortalHeader } from '../components/collage/PortalHeader';
import { Stamp } from '../components/collage/Stamp';
import { DemoFiguresNote, StatSticker } from '../components/collage/StatSticker';
import { StatusToggle } from '../components/collage/StatusToggle';

type VendorOrderStatus = 'assembling' | 'ready_for_pickup' | 'completed';

export const VendorPortalPage: React.FC = () => {
  const { language, t, formatCurrency } = useLanguage();
  const { showToast } = useToast();

  // Statuses live apart from the text, so the list follows a language switch.
  const [statuses, setStatuses] = useState<Record<string, VendorOrderStatus>>({
    'QIV-7821-M': 'assembling',
    'QIV-7820-K': 'ready_for_pickup',
    'QIV-7815-A': 'completed',
  });

  const orderCopy = t.demo.portalData.vendorOrders;
  const orders = [
    { id: 'QIV-7821-M', total: 96, minutesAgo: 5 },
    { id: 'QIV-7820-K', total: 48, minutesAgo: 18 },
    { id: 'QIV-7815-A', total: 32, minutesAgo: 42 },
  ].map((order) => ({ ...order, ...orderCopy[order.id], time: formatMinutesAgo(order.minutesAgo, language) }));

  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);
  const [tab, setTab] = useState<'orders' | 'promotions' | 'labels'>('orders');
  const [managedStoreId, setManagedStoreId] = useState('store-1');
  const seller = t.promotions.seller;

  const handleUpdateStatus = (orderId: string) => {
    setStatuses((prev) => ({
      ...prev,
      [orderId]: prev[orderId] === 'assembling' ? 'ready_for_pickup' : 'completed',
    }));
    showToast({
      type: 'success',
      title: t.vendor.statusUpdatedToastTitle,
      message: `${t.vendor.statusUpdatedToastMsg} #${orderId}`,
    });
  };

  const toggleAcceptance = () => {
    setIsAcceptingOrders(!isAcceptingOrders);
    showToast({
      type: 'info',
      title: !isAcceptingOrders ? t.vendor.acceptanceOpenToast : t.vendor.acceptancePausedToast,
      message: !isAcceptingOrders ? t.vendor.acceptanceOpenMsg : t.vendor.acceptancePausedMsg,
    });
  };

  const ownStore = MOCK_STORES.find((store) => store.id === 'store-1');
  const storeTitle = t.collage.storeCopy['store-1']?.name ?? ownStore?.name ?? '';
  const storeAddress = ownStore?.addresses?.[language] ?? ownStore?.address ?? '';

  return (
    <PageShell>
      <DemoRoleBar current="vendor" />
      <PortalHeader
        icon={<Store className="w-7 h-7 desk:w-9 desk:h-9" />}
        note={t.vendor.portalTitle}
        title={<bdi>{storeTitle}</bdi>}
        lead={storeAddress}
      >
        <StatusToggle
          isOn={isAcceptingOrders}
          label={isAcceptingOrders ? t.vendor.acceptanceActive : t.vendor.acceptancePaused}
          onToggle={toggleAcceptance}
        />
      </PortalHeader>

      <SegmentedControl<'orders' | 'promotions' | 'labels'>
        label={t.vendor.portalTitle}
        value={tab}
        onChange={setTab}
        className="flex w-full max-w-[560px] mb-6"
        options={[
          { value: 'orders', label: seller.tabOrders },
          { value: 'promotions', label: seller.tabPromotions },
          { value: 'labels', label: seller.tabLabels },
        ]}
      />

      {tab !== 'orders' && (
        <div className="max-w-[360px] mb-6">
          <SelectField
            label={seller.store}
            value={managedStoreId}
            onChange={(e) => setManagedStoreId(e.target.value)}
            options={MOCK_STORES.map((store) => ({
              value: store.id,
              label: t.collage.storeCopy[store.id]?.name || store.names?.[language] || store.name,
            }))}
          />
          <p className="mt-1 text-sm font-bold text-ink-2">{seller.storeNote}</p>
        </div>
      )}

      {tab === 'promotions' && <PromotionManager storeId={managedStoreId} />}
      {tab === 'labels' && <ProductLabelManager storeId={managedStoreId} />}

      {tab === 'orders' && (
        <>
      <section className="mb-9 desk:mb-12">
        <DemoFiguresNote text={t.screens.common.demoFigures} />
        <div className="grid grid-cols-2 desk:grid-cols-3 gap-3.5 desk:gap-5">
          <StatSticker label={t.vendor.revenueToday} value={formatCurrency(3840)} tint="gift" />
          <StatSticker label={t.vendor.ordersShift} value="42" tint="health" />
          <StatSticker label={t.vendor.avgTicket} value={formatCurrency(91)} tint="tech" />
        </div>
      </section>

      <section>
        <SectionHeading note={t.screens.portal.queue} title={t.vendor.liveOrdersQueue} />
        <ul className="grid desk:grid-cols-2 gap-4">
          {orders.map((order) => {
            const status = statuses[order.id];
            return (
              <Panel key={order.id} as="li">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <span className="text-sm font-bold text-ink-2">
                    <bdi>#{order.id}</bdi>
                  </span>
                  <Stamp tone={status === 'assembling' ? 'warn' : status === 'ready_for_pickup' ? 'action' : 'success'}>
                    {status === 'assembling'
                      ? t.vendor.statusAssembling
                      : status === 'ready_for_pickup'
                      ? t.vendor.statusReadyForPickup
                      : t.vendor.statusHandedToCourier}
                  </Stamp>
                  <span className="text-sm font-bold text-ink-3">{order.time}</span>
                </div>
                <h3 className="mt-1 text-lg font-black">{order.client}</h3>
                <p className="text-sm font-bold text-ink-2">{order.items}</p>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5">
                  <span className="text-lg font-black whitespace-nowrap tabular-nums">{formatCurrency(order.total)}</span>
                  {status !== 'completed' && (
                    <Button size="sm" onClick={() => handleUpdateStatus(order.id)}>
                      {status === 'assembling' ? t.vendor.finishAssembly : t.vendor.handToCourier}
                    </Button>
                  )}
                </div>
              </Panel>
            );
          })}
        </ul>
      </section>
        </>
      )}
    </PageShell>
  );
};
