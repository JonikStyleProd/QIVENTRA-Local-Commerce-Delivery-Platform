import React, { useState } from 'react';
import { Bike } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { NotebookPage, NotebookStep, NotebookSteps } from '../components/collage/NotebookPage';
import { PageShell } from '../components/collage/Page';
import { PortalHeader } from '../components/collage/PortalHeader';
import { Stamp } from '../components/collage/Stamp';
import { DemoFiguresNote, StatSticker } from '../components/collage/StatSticker';
import { StatusToggle } from '../components/collage/StatusToggle';

export const CourierPortalPage: React.FC = () => {
  const { language, t, formatCurrency } = useLanguage();
  const { showToast } = useToast();

  const [isOnShift, setIsOnShift] = useState(true);
  const [activeDeliveryStep, setActiveDeliveryStep] = useState<'to_store' | 'to_client' | 'delivered'>('to_store');

  const courierName = language === 'he' ? 'אבי מזרחי' : language === 'en' ? 'Avi Mizrahi' : 'Ави Мизрахи';
  const vehicleName = language === 'he' ? 'אופניים חשמליים' : language === 'en' ? 'E-Bike' : 'Электровелосипед';
  const shiftTime = language === 'he' ? 'משמרת פעילה 3 שעות 20 דק׳' : language === 'en' ? 'Shift active 3h 20m' : 'Смена открыта 3 ч 20 мин';
  const storeName = language === 'he' ? 'שוק הכרמל - חנות טרייה' : 'Carmel Fresh Market';
  const storeAddr = language === 'he' ? 'רחוב הכרמל 18, תל אביב' : language === 'en' ? '18 HaCarmel St, Tel Aviv' : 'ул. Кармель 18, Тель-Авив';
  const clientName = language === 'he' ? 'נועה כהן' : language === 'en' ? 'Noa Cohen' : 'Ноа Коэн';
  const clientAddr = language === 'he' ? 'רחוב דיזנגוף 142, קומה 3, דירה 12' : language === 'en' ? '142 Dizengoff St, Fl 3, Apt 12' : 'ул. Дизенгоф 142, эт. 3, кв. 12';

  const handleAdvanceStep = () => {
    if (activeDeliveryStep === 'to_store') {
      setActiveDeliveryStep('to_client');
      showToast({
        type: 'success',
        title: t.courier.orderPickedUpTitle,
        message: t.courier.orderPickedUpMsg,
      });
    } else if (activeDeliveryStep === 'to_client') {
      setActiveDeliveryStep('delivered');
      showToast({
        type: 'success',
        title: t.courier.orderDeliveredTitle,
        message: `${t.courier.payoutCredited} +${formatCurrency(25)}`,
      });
    } else {
      setActiveDeliveryStep('to_store');
      showToast({
        type: 'info',
        title: t.courier.findingNextOrderTitle,
        message: t.courier.findingNextOrderMsg,
      });
    }
  };

  const toggleShift = () => {
    setIsOnShift(!isOnShift);
    showToast({
      type: 'info',
      title: !isOnShift ? t.courier.shiftStartedTitle : t.courier.shiftPausedTitle,
      message: !isOnShift ? t.courier.shiftStartedMsg : t.courier.shiftPausedMsg,
    });
  };

  const route: NotebookStep[] = [
    {
      key: 'pickup',
      label: t.courier.pointAPickup,
      state: activeDeliveryStep === 'to_store' ? 'current' : 'done',
      detail: (
        <>
          <p className="font-black text-ink">
            <bdi>{storeName}</bdi>
          </p>
          <p>
            {storeAddr} · {t.screens.portal.pickupCode}: <bdi>481</bdi>
          </p>
        </>
      ),
    },
    {
      key: 'delivery',
      label: t.courier.pointBDelivery,
      state: activeDeliveryStep === 'delivered' ? 'done' : activeDeliveryStep === 'to_client' ? 'current' : 'todo',
      detail: (
        <>
          <p className="font-black text-ink">{clientName}</p>
          <p>
            {clientAddr} · {t.screens.portal.doorCode}: <bdi>12B</bdi>
          </p>
        </>
      ),
    },
  ];

  return (
    <PageShell width="narrow">
      <PortalHeader
        icon={<Bike className="w-7 h-7 desk:w-9 desk:h-9" />}
        note={t.courier.courierLabel}
        title={courierName}
        lead={`${vehicleName} · ${shiftTime}`}
      >
        <StatusToggle isOn={isOnShift} label={isOnShift ? t.courier.onShift : t.courier.breakTime} onToggle={toggleShift} />
      </PortalHeader>

      <section className="mb-9 desk:mb-12">
        <DemoFiguresNote text={t.screens.common.demoFigures} />
        <div className="grid grid-cols-2 desk:grid-cols-3 gap-3.5 desk:gap-5">
          <StatSticker label={t.courier.earnedShift} value={formatCurrency(285)} hint={t.courier.includingTips} tint="gift" />
          <StatSticker label={t.courier.completedDeliveries} value={`8 ${t.orders.deliveriesCount}`} tint="health" />
          <StatSticker label={t.courier.batteryLevel} value="84%" hint={`~4 ${t.courier.hoursLeft}`} tint="tech" />
        </div>
      </section>

      <NotebookPage>
        <p className="hand text-[26px] leading-[44px] text-action">{t.courier.currentTask}</p>
        <div className="flex flex-wrap items-center gap-2.5 min-h-11">
          <h2 className="text-[26px] font-black tracking-tight">
            <bdi>#QIV-7821-M</bdi>
          </h2>
          <Stamp tone={activeDeliveryStep === 'delivered' ? 'success' : activeDeliveryStep === 'to_client' ? 'action' : 'warn'}>
            {activeDeliveryStep === 'to_store'
              ? t.courier.headingToStore
              : activeDeliveryStep === 'to_client'
              ? t.courier.headingToClient
              : t.orders.statusDelivered}
          </Stamp>
        </div>

        <NotebookSteps steps={route} label={t.courier.currentTask} />

        <Button size="lg" onClick={handleAdvanceStep} fullWidth className="mt-3 whitespace-normal">
          {activeDeliveryStep === 'to_store'
            ? t.courier.confirmPickup
            : activeDeliveryStep === 'to_client'
            ? t.courier.confirmDelivery
            : t.courier.acceptNewOrder}
        </Button>
      </NotebookPage>
    </PageShell>
  );
};
