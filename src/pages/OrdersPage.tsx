import React from 'react';
import {
  Bike,
  Phone,
  MessageSquare,
  TrendingUp,
  MapPin,
  RefreshCw,
  Store,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { MOCK_PAST_ORDERS } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const OrdersPage: React.FC = () => {
  const {
    activeOrder,
    advanceOrderSimulation,
    navigateTo,
    openChatWithParticipant,
    currentAddress,
  } = useApp();
  const { language, t, formatCurrency, formatMinutes } = useLanguage();
  const { showToast } = useToast();

  const handleCallCourier = () => {
    showToast({
      type: 'info',
      title: t.orders.callCourier,
      message: `${activeOrder.courier?.name}: ${activeOrder.courier?.phone}`,
    });
  };

  const handleRepeatOrder = (orderNum: string) => {
    showToast({
      type: 'success',
      title: t.orders.repeatOrderToastTitle,
      message: `${t.orders.repeatOrderToastMsg} #${orderNum}`,
    });
    navigateTo('cart');
  };

  const isDelivered = activeOrder.status === 'delivered';
  const displayStoreName = activeOrder.storeNames?.[language] || activeOrder.storeName;
  const displayAddress = currentAddress || activeOrder.addresses?.[language] || activeOrder.address;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-3xl font-extrabold text-primary tracking-tight">
          {t.orders.title}
        </h1>
        <p className="text-xs sm:text-sm text-secondary mt-1">
          {t.orders.subtitle}
        </p>
      </div>

      {/* ACTIVE ORDER LIVE TRACKER CARD */}
      <div className="rounded-2xl sm:rounded-3xl bg-surface border border-theme p-5 sm:p-8 shadow-xs">
        
        {/* Top Header of Active Order */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-theme">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant={isDelivered ? 'success' : 'pistachio'} size="md" dot>
                {isDelivered ? t.orders.statusDelivered : t.orders.activeDeliveryBadge}
              </Badge>
              <span className="text-xs text-muted font-medium">#{activeOrder.orderNumber || activeOrder.id}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-primary mt-1.5">{displayStoreName}</h2>
            <p className="text-xs text-secondary flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-muted shrink-0" />
              <span className="truncate">{displayAddress}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Store className="w-3.5 h-3.5" />}
              onClick={() =>
                openChatWithParticipant({
                  type: 'store',
                  id: activeOrder.storeId,
                  name: displayStoreName,
                  storeId: activeOrder.storeId,
                  orderId: activeOrder.orderNumber,
                })
              }
              className="text-xs"
            >
              {language === 'he' ? 'צ\'אט עם החנות' : language === 'ru' ? 'Чат с магазином' : 'Chat with Store'}
            </Button>

            <div className="text-start sm:text-end bg-surface-elevated sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-2xl border sm:border-0 border-theme">
              <span className="text-xs text-secondary block">
                {isDelivered ? t.orders.statusLabel : t.orders.estimatedTimeLabel}
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#123B35] dark:text-[#B8D96B] font-sans tabular-nums">
                {isDelivered ? t.orders.statusCompleted : `~${formatMinutes(activeOrder.etaMinutes)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Progress Timeline Bar */}
        <div className="py-6 sm:py-8">
          <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center text-xs font-semibold mb-3">
            <div className="flex flex-col items-center">
              <span className={activeOrder.status === 'received' ? 'text-[#123B35] dark:text-[#B8D96B] font-bold' : 'text-secondary'}>
                1. {t.orders.stepReceived}
              </span>
              <span className="text-[10px] text-muted hidden sm:inline">12:30</span>
            </div>
            <div className="flex flex-col items-center">
              <span className={activeOrder.status === 'preparing' ? 'text-[#123B35] dark:text-[#B8D96B] font-bold' : 'text-secondary'}>
                2. {t.orders.stepPreparing}
              </span>
              <span className="text-[10px] text-muted hidden sm:inline">12:34</span>
            </div>
            <div className="flex flex-col items-center">
              <span className={activeOrder.status === 'courier_assigned' || activeOrder.status === 'on_the_way' ? 'text-[#123B35] dark:text-[#B8D96B] font-bold' : 'text-secondary'}>
                3. {t.orders.stepOnTheWay}
              </span>
              <span className="text-[10px] text-muted hidden sm:inline">12:41</span>
            </div>
            <div className="flex flex-col items-center">
              <span className={isDelivered ? 'text-[#1E824C] dark:text-[#48BB78] font-bold' : 'text-secondary'}>
                4. {t.orders.stepAtDoor}
              </span>
              <span className="text-[10px] text-muted hidden sm:inline">~12:55</span>
            </div>
          </div>

          <div className="relative h-2.5 sm:h-3 rounded-full bg-surface-elevated border border-theme overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#123B35] to-[#B8D96B] transition-all duration-500 rounded-full"
              style={{
                width:
                  activeOrder.status === 'received'
                    ? '25%'
                    : activeOrder.status === 'preparing'
                    ? '50%'
                    : activeOrder.status === 'courier_assigned' || activeOrder.status === 'on_the_way'
                    ? '75%'
                    : '100%',
              }}
            />
          </div>
        </div>

        {/* Courier & Route Information Box */}
        {activeOrder.courier && (
          <div className="p-4 sm:p-5 rounded-2xl bg-surface-elevated border border-theme flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-2xl bg-[#123B35] text-[#F3F1EA] flex items-center justify-center shrink-0 shadow-xs">
                <Bike className="w-5 sm:w-6 h-5 sm:h-6 text-[#B8D96B]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary truncate">{activeOrder.courier.names?.[language] || activeOrder.courier.name}</span>
                  <Badge variant="pistachio" size="sm">
                    ★ {activeOrder.courier.rating}
                  </Badge>
                </div>
                <p className="text-xs text-secondary mt-0.5 truncate">
                  {activeOrder.courier.vehicleName?.[language] || activeOrder.courier.vehicle} • {activeOrder.courier.completedDeliveries} {t.orders.deliveriesCount}
                </p>
                <p className="text-[11px] text-muted mt-0.5 truncate">
                  {activeOrder.courier.currentLocationNames?.[language] || activeOrder.courier.currentLocationName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Phone className="w-3.5 h-3.5" />}
                onClick={handleCallCourier}
                className="flex-1 sm:flex-initial"
              >
                {t.orders.callCourier}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                onClick={() =>
                  openChatWithParticipant({
                    type: 'courier',
                    id: activeOrder.courier?.id || 'courier-1',
                    name: activeOrder.courier?.names?.[language] || activeOrder.courier?.name || (language === 'he' ? 'שליח' : language === 'ru' ? 'Курьер' : 'Courier'),
                    avatarUrl: activeOrder.courier?.avatarUrl,
                    orderId: activeOrder.orderNumber,
                  })
                }
                className="flex-1 sm:flex-initial"
              >
                {t.orders.chat}
              </Button>
            </div>
          </div>
        )}

        {/* Order Items Summary */}
        <div className="space-y-2 pt-2 border-t border-theme">
          <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3">
            {t.orders.orderItemsTitle}
          </h4>
          <div className="space-y-2">
            {activeOrder.items.map((item, idx) => {
              const itemName = item.names?.[language] || item.name;
              return (
                <div
                  key={idx}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-xs"
                >
                  <span className="text-primary font-medium break-words">
                    <span className="font-bold text-secondary me-1 tabular-nums">{item.quantity} ×</span>
                    {itemName}
                  </span>
                  <span className="text-primary font-bold whitespace-nowrap tabular-nums text-end">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 pt-3 border-t border-theme/60 text-sm font-extrabold text-primary">
            <span>{t.cart.totalPayable}</span>
            <span className="font-sans whitespace-nowrap tabular-nums text-end">
              {formatCurrency(activeOrder.totalAmount)}
            </span>
          </div>
        </div>

        {/* Simulator Button */}
        <div className="mt-6 pt-4 border-t border-theme flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-muted text-center sm:text-start">
            {t.orders.simStepDesc}
          </span>
          <Button
            variant="primary"
            size="md"
            onClick={advanceOrderSimulation}
            leftIcon={<TrendingUp className="w-4 h-4 text-[#B8D96B]" />}
          >
            {t.orders.nextStepBtn}
          </Button>
        </div>

      </div>

      {/* PAST ORDERS ARCHIVE */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-primary">{t.orders.historyTitle}</h2>

        <div className="space-y-3">
          {MOCK_PAST_ORDERS.map((order) => {
            const orderStoreName = order.storeNames?.[language] || order.storeName;
            return (
              <div
                key={order.id}
                className="p-4 sm:p-5 rounded-2xl bg-surface border border-theme flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">#{order.orderNumber}</span>
                    <Badge variant="neutral" size="sm">
                      {order.status === 'delivered' ? t.orders.statusDelivered : order.status}
                    </Badge>
                    <span className="text-xs text-muted">{order.createdAt}</span>
                  </div>
                  <h4 className="text-sm font-bold text-primary truncate">{orderStoreName}</h4>
                  <p className="text-xs text-secondary line-clamp-2">
                    {order.items.map((i) => {
                      const iname = i.names?.[language] || i.name;
                      return `${i.quantity}x ${iname}`;
                    }).join(', ')}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-theme">
                  <span className="text-sm font-extrabold text-primary font-sans whitespace-nowrap tabular-nums">
                    {formatCurrency(order.totalAmount)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                    onClick={() => handleRepeatOrder(order.orderNumber)}
                  >
                    {t.orders.repeatOrder}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
