import React, { useState } from 'react';
import {
  Bike,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const CourierPortalPage: React.FC = () => {
  const { language, t, formatCurrency } = useLanguage();
  const { showToast } = useToast();

  const [isOnShift, setIsOnShift] = useState(true);
  const [activeDeliveryStep, setActiveDeliveryStep] = useState<'to_store' | 'to_client' | 'delivered'>('to_store');

  const courierName = language === 'he' ? 'אבי מזרחי' : language === 'en' ? 'Avi Mizrahi' : 'Ави Мизрахи';
  const vehicleName = language === 'he' ? 'אופניים חשמליים' : language === 'en' ? 'E-Bike' : 'Электровелосипед';
  const shiftTime = language === 'he' ? 'משמרת פעילה 3 שעות 20 דק׳' : language === 'en' ? 'Shift active 3h 20m' : 'Смена открыта 3 ч 20 мин';
  const storeName = language === 'he' ? 'שוק הכרמל - חנות טרייה' : language === 'en' ? 'Carmel Fresh Market' : 'Carmel Fresh Market';
  const storeAddr = language === 'he' ? 'רחוב הכרמל 18, תל אביב • קוד איסוף: 481' : language === 'en' ? '18 HaCarmel St, Tel Aviv • Pickup code: 481' : 'ул. Кармель 18, Тель-Авив • Код выдачи: 481';
  const clientName = language === 'he' ? 'נועה כהן (+972 54-892-3401)' : language === 'en' ? 'Noa Cohen (+972 54-892-3401)' : 'Ноа Коэн (+972 54-892-3401)';
  const clientAddr = language === 'he' ? 'רחוב דיזנגוף 142, קומה 3, דירה 12 (קוד כניסה 12B)' : language === 'en' ? '142 Dizengoff St, Fl 3, Apt 12 (Door code 12B)' : 'ул. Дизенгоф 142, эт. 3, кв. 12 (домофон 12B)';

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Courier Header */}
      <div className="rounded-3xl bg-surface border border-theme p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-[#123B35] text-[#F3F1EA] flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
            <Bike className="w-7 h-7 text-[#B8D96B]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-primary">{t.courier.courierLabel}: {courierName}</h1>
              <Badge variant="pistachio" size="sm">
                4.98 ★
              </Badge>
            </div>
            <p className="text-xs text-secondary mt-0.5">
              {vehicleName} • {shiftTime}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleShift}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border transition shrink-0 ${
            isOnShift
              ? 'bg-[#E8F5EE] text-[#1E824C] border-[#A3D9B8] dark:bg-[#132E20] dark:text-[#48BB78]'
              : 'bg-surface-elevated text-secondary border-theme'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isOnShift ? 'bg-[#1E824C] animate-pulse' : 'bg-muted'
            }`}
          />
          <span>{isOnShift ? t.courier.onShift : t.courier.breakTime}</span>
        </button>
      </div>

      {/* Courier Shift Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-theme text-center">
          <span className="text-xs text-secondary block">{t.courier.earnedShift}</span>
          <span className="text-xl font-extrabold text-[#123B35] dark:text-[#B8D96B] font-sans mt-0.5 block tabular-nums">
            {formatCurrency(285)}
          </span>
          <span className="text-[10px] text-muted">{t.courier.includingTips}</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-theme text-center">
          <span className="text-xs text-secondary block">{t.courier.completedDeliveries}</span>
          <span className="text-xl font-extrabold text-primary font-sans mt-0.5 block tabular-nums">
            8 {t.orders.deliveriesCount}
          </span>
          <span className="text-[10px] text-[#1E824C] dark:text-[#48BB78]">100% {t.courier.onTime}</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-theme text-center">
          <span className="text-xs text-secondary block">{t.courier.batteryLevel}</span>
          <span className="text-xl font-extrabold text-primary font-sans mt-0.5 block tabular-nums">
            84%
          </span>
          <span className="text-[10px] text-muted">~4 {t.courier.hoursLeft}</span>
        </div>
      </div>

      {/* Active Assignment Card */}
      <div className="rounded-3xl bg-surface border border-theme p-6 sm:p-7 shadow-md space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-theme">
          <div>
            <span className="text-xs font-semibold text-secondary">{t.courier.currentTask}</span>
            <h2 className="text-lg font-bold text-primary">#QIV-7821-M</h2>
          </div>
          <Badge
            variant={
              activeDeliveryStep === 'delivered'
                ? 'success'
                : activeDeliveryStep === 'to_client'
                ? 'pistachio'
                : 'warning'
            }
            size="md"
          >
            {activeDeliveryStep === 'to_store'
              ? t.courier.headingToStore
              : activeDeliveryStep === 'to_client'
              ? t.courier.headingToClient
              : t.orders.statusDelivered}
          </Badge>
        </div>

        {/* Route Steps */}
        <div className="space-y-4">
          <div className="flex items-start gap-3.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              activeDeliveryStep !== 'to_store' ? 'bg-[#E8F5EE] text-[#1E824C]' : 'bg-[#123B35] text-[#F3F1EA]'
            }`}>
              {activeDeliveryStep !== 'to_store' ? <CheckCircle2 className="w-5 h-5" /> : '1'}
            </div>
            <div>
              <span className="text-[11px] text-secondary block">{t.courier.pointAPickup}</span>
              <p className="text-sm font-bold text-primary">{storeName}</p>
              <p className="text-xs text-muted">{storeAddr}</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              activeDeliveryStep === 'delivered' ? 'bg-[#E8F5EE] text-[#1E824C]' : 'bg-surface-elevated text-secondary border border-theme'
            }`}>
              {activeDeliveryStep === 'delivered' ? <CheckCircle2 className="w-5 h-5" /> : '2'}
            </div>
            <div>
              <span className="text-[11px] text-secondary block">{t.courier.pointBDelivery}</span>
              <p className="text-sm font-bold text-primary">{clientName}</p>
              <p className="text-xs text-muted">{clientAddr}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleAdvanceStep}
          >
            {activeDeliveryStep === 'to_store'
              ? t.courier.confirmPickup
              : activeDeliveryStep === 'to_client'
              ? t.courier.confirmDelivery
              : t.courier.acceptNewOrder}
          </Button>
        </div>
      </div>

    </div>
  );
};
