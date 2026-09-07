import React, { useState } from 'react';
import {
  Store,
  Package,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const VendorPortalPage: React.FC = () => {
  const { language, t, formatCurrency } = useLanguage();
  const { showToast } = useToast();

  const [orders, setOrders] = useState([
    {
      id: 'QIV-7821-M',
      client: language === 'he' ? 'נועה כהן' : language === 'en' ? 'Noa Cohen' : 'Ноа Коэн',
      items: language === 'he' ? 'אבוקדו האס (2 יח׳), גבינת עיזים (1 יח׳)' : language === 'en' ? 'Hass Avocado (2 pcs), Goat Cheese (1 pc)' : 'Авокадо Hass (2 шт.), Козий сыр (1 шт.)',
      total: 62,
      status: 'assembling',
      time: language === 'he' ? 'לפני 5 דק׳' : language === 'en' ? '5 min ago' : '5 мин назад',
    },
    {
      id: 'QIV-7820-K',
      client: language === 'he' ? 'דניאל לוי' : language === 'en' ? 'Daniel Levi' : 'Даниэль Леви',
      items: language === 'he' ? 'שמן זית כתית מעולה 750 מ״ל (1 יח׳)' : language === 'en' ? 'Extra Virgin Olive Oil (1 pc)' : 'Оливковое масло Extra Virgin (1 шт.)',
      total: 48,
      status: 'ready_for_pickup',
      time: language === 'he' ? 'לפני 18 דק׳' : language === 'en' ? '18 min ago' : '18 мин назад',
    },
    {
      id: 'QIV-7815-A',
      client: language === 'he' ? 'מיכל אברהם' : language === 'en' ? 'Michal Avraham' : 'Михаль Авраам',
      items: language === 'he' ? 'חלת שבת קלועה (2 יח׳)' : language === 'en' ? 'Artisan Challah (2 pcs)' : 'Свежая хала (2 шт.)',
      total: 36,
      status: 'completed',
      time: language === 'he' ? 'לפני 42 דק׳' : language === 'en' ? '42 min ago' : '42 мин назад',
    },
  ]);

  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);

  const handleUpdateStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: o.status === 'assembling' ? 'ready_for_pickup' : 'completed',
            }
          : o
      )
    );
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
      message: !isAcceptingOrders
        ? t.vendor.acceptanceOpenMsg
        : t.vendor.acceptancePausedMsg,
    });
  };

  const storeTitle = language === 'he' ? 'שוק הכרמל - חנות טרייה' : language === 'en' ? 'Carmel Fresh Market' : 'Carmel Fresh Market';
  const storeAddress = language === 'he' ? 'תל אביב, רחוב הכרמל 18 • דירוג 4.96 ★' : language === 'en' ? 'Tel Aviv, 18 HaCarmel St • Rating 4.96 ★' : 'Тель-Авив, ул. Кармель 18 • Рейтинг 4.96 ★';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Merchant Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-theme">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#123B35] text-[#F3F1EA] flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            CF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-primary">
                {t.vendor.portalTitle}: «{storeTitle}»
              </h1>
              <Badge variant="pistachio" size="sm">
                {t.vendor.partnerSince}
              </Badge>
            </div>
            <p className="text-xs text-secondary mt-0.5">
              {storeAddress}
            </p>
          </div>
        </div>

        {/* Toggle Store Active Status */}
        <button
          type="button"
          onClick={toggleAcceptance}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border transition shrink-0 ${
            isAcceptingOrders
              ? 'bg-[#E8F5EE] text-[#1E824C] border-[#A3D9B8] dark:bg-[#132E20] dark:text-[#48BB78]'
              : 'bg-surface-elevated text-secondary border-theme'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isAcceptingOrders ? 'bg-[#1E824C] animate-pulse' : 'bg-muted'
            }`}
          />
          <span>{isAcceptingOrders ? t.vendor.acceptanceActive : t.vendor.acceptancePaused}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-theme shadow-xs">
          <span className="text-xs text-secondary block">{t.vendor.revenueToday}</span>
          <span className="text-2xl font-extrabold text-primary font-sans mt-1 block tabular-nums">
            {formatCurrency(3840)}
          </span>
          <span className="text-[11px] text-[#1E824C] dark:text-[#48BB78] font-medium flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3 me-0.5" /> +14.2% {t.vendor.vsLastWeek}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-theme shadow-xs">
          <span className="text-xs text-secondary block">{t.vendor.ordersShift}</span>
          <span className="text-2xl font-extrabold text-primary font-sans mt-1 block tabular-nums">
            42
          </span>
          <span className="text-[11px] text-muted mt-1 block">
            {t.vendor.avgPrepTime}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-theme shadow-xs">
          <span className="text-xs text-secondary block">{t.vendor.avgTicket}</span>
          <span className="text-2xl font-extrabold text-primary font-sans mt-1 block tabular-nums">
            {formatCurrency(91)}
          </span>
          <span className="text-[11px] text-muted mt-1 block">
            {t.vendor.optRange}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-theme shadow-xs">
          <span className="text-xs text-secondary block">{t.vendor.ratingLabel}</span>
          <span className="text-2xl font-extrabold text-[#123B35] dark:text-[#B8D96B] font-sans mt-1 block tabular-nums">
            4.96 ★
          </span>
          <span className="text-[11px] text-muted mt-1 block">
            98.5% {t.vendor.posReviews}
          </span>
        </div>
      </div>

      {/* Live Orders Board */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <Package className="w-5 h-5 text-[#123B35] dark:text-[#B8D96B]" />
            <span>{t.vendor.liveOrdersQueue}</span>
          </h2>
          <span className="text-xs text-secondary">
            {t.vendor.autoRefresh}
          </span>
        </div>

        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-2xl bg-surface border border-theme flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary">#{order.id}</span>
                  <Badge
                    variant={
                      order.status === 'assembling'
                        ? 'warning'
                        : order.status === 'ready_for_pickup'
                        ? 'pistachio'
                        : 'success'
                    }
                    size="sm"
                  >
                    {order.status === 'assembling'
                      ? t.vendor.statusAssembling
                      : order.status === 'ready_for_pickup'
                      ? t.vendor.statusReadyForPickup
                      : t.vendor.statusHandedToCourier}
                  </Badge>
                  <span className="text-[11px] text-muted">{order.time}</span>
                </div>
                <h4 className="text-sm font-bold text-primary">{order.client}</h4>
                <p className="text-xs text-secondary">{order.items}</p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-theme">
                <span className="text-base font-extrabold text-primary font-sans whitespace-nowrap tabular-nums">
                  {formatCurrency(order.total)}
                </span>
                {order.status !== 'completed' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUpdateStatus(order.id)}
                  >
                    {order.status === 'assembling'
                      ? t.vendor.finishAssembly
                      : t.vendor.handToCourier}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
