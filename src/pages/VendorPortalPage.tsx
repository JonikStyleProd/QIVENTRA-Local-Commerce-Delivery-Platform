import React, { useState } from 'react';
import { Store } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { PageShell, SectionHeading } from '../components/collage/Page';
import { Panel } from '../components/collage/Panel';
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

  const orders = [
    {
      id: 'QIV-7821-M',
      client: language === 'he' ? 'נועה כהן' : language === 'en' ? 'Noa Cohen' : 'Ноа Коэн',
      items: language === 'he' ? 'אבוקדו האס (2 יח׳), גבינת עיזים (1 יח׳)' : language === 'en' ? 'Hass Avocado (2 pcs), Goat Cheese (1 pc)' : 'Авокадо Hass (2 шт.), Козий сыр (1 шт.)',
      total: 62,
      time: language === 'he' ? 'לפני 5 דק׳' : language === 'en' ? '5 min ago' : '5 мин назад',
    },
    {
      id: 'QIV-7820-K',
      client: language === 'he' ? 'דניאל לוי' : language === 'en' ? 'Daniel Levi' : 'Даниэль Леви',
      items: language === 'he' ? 'שמן זית כתית מעולה 750 מ״ל (1 יח׳)' : language === 'en' ? 'Extra Virgin Olive Oil (1 pc)' : 'Оливковое масло Extra Virgin (1 шт.)',
      total: 48,
      time: language === 'he' ? 'לפני 18 דק׳' : language === 'en' ? '18 min ago' : '18 мин назад',
    },
    {
      id: 'QIV-7815-A',
      client: language === 'he' ? 'מיכל אברהם' : language === 'en' ? 'Michal Avraham' : 'Михаль Авраам',
      items: language === 'he' ? 'חלת שבת קלועה (2 יח׳)' : language === 'en' ? 'Artisan Challah (2 pcs)' : 'Свежая хала (2 шт.)',
      total: 36,
      time: language === 'he' ? 'לפני 42 דק׳' : language === 'en' ? '42 min ago' : '42 мин назад',
    },
  ];

  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);

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

  const storeTitle = language === 'he' ? 'שוק הכרמל - חנות טרייה' : 'Carmel Fresh Market';
  const storeAddress = language === 'he' ? 'תל אביב, רחוב הכרמל 18' : language === 'en' ? 'Tel Aviv, 18 HaCarmel St' : 'Тель-Авив, ул. Кармель 18';

  return (
    <PageShell>
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
    </PageShell>
  );
};
