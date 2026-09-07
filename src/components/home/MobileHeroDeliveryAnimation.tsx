import React from 'react';
import { Bike, Sparkles, Store, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const MobileHeroDeliveryAnimation: React.FC = () => {
  const { language } = useLanguage();

  const labels = {
    ru: {
      eta: '15–25 мин',
      status: 'Курьер в пути',
      order: 'Заказ #4829',
      store: 'Пекарня',
      market: 'Маркет',
      dest: 'Ваш адрес',
    },
    en: {
      eta: '15–25 min',
      status: 'Courier en route',
      order: 'Order #4829',
      store: 'Bakery',
      market: 'Market',
      dest: 'Your address',
    },
    he: {
      eta: '15–25 דק׳',
      status: 'השליח בדרך',
      order: 'הזמנה #4829',
      store: 'מאפייה',
      market: 'מרקט',
      dest: 'הכתובת שלך',
    },
  }[language] || {
    eta: '15–25 min',
    status: 'Courier en route',
    order: 'Order #4829',
    store: 'Bakery',
    market: 'Market',
    dest: 'Your address',
  };

  return (
    <div
      className="block lg:hidden w-full my-3 sm:my-4 pointer-events-none select-none relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#276B61]/60 bg-[#0E2E2A]/85 backdrop-blur-xs shadow-inner"
      style={{ height: 'clamp(110px, 30vw, 150px)' }}
      aria-hidden="true"
    >
      {/* Background Soft Pistachio Ambient Glow */}
      <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-[#B8D96B]/15 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-[#B8D96B]/10 blur-2xl pointer-events-none" />

      {/* Internal LTR Canvas for stable geographic coordinates */}
      <div className="relative w-full h-full flex items-center justify-center" dir="ltr">
        <svg
          viewBox="0 0 360 120"
          className="w-full h-full"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="mobileRouteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B8D96B" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#B8D96B" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#EAF8C6" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="mobileAreaFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E524A" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#123B35" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* District Quarter Zone / Shaded Neighborhood */}
          <rect x="18" y="16" width="90" height="88" rx="10" fill="url(#mobileAreaFill)" stroke="#276B61" strokeWidth="0.75" strokeOpacity="0.4" />
          <rect x="250" y="22" width="94" height="76" rx="10" fill="url(#mobileAreaFill)" stroke="#276B61" strokeWidth="0.75" strokeOpacity="0.4" />

          {/* Grid Streets */}
          <line x1="10" y1="40" x2="350" y2="40" stroke="#F3F1EA" strokeOpacity="0.06" strokeWidth="1" />
          <line x1="10" y1="80" x2="350" y2="80" stroke="#F3F1EA" strokeOpacity="0.06" strokeWidth="1" />
          <line x1="110" y1="10" x2="110" y2="110" stroke="#F3F1EA" strokeOpacity="0.06" strokeWidth="1" />
          <line x1="240" y1="10" x2="240" y2="110" stroke="#F3F1EA" strokeOpacity="0.06" strokeWidth="1" />

          {/* Radar Waves around Destination */}
          <circle cx="310" cy="58" r="32" stroke="#B8D96B" strokeOpacity="0.08" strokeWidth="1" />
          <circle cx="310" cy="58" r="18" stroke="#B8D96B" strokeOpacity="0.14" strokeWidth="1" strokeDasharray="3 3" />

          {/* Base Route Track */}
          <path
            d="M 38 78 C 85 30, 130 92, 185 48 C 235 15, 270 85, 310 58"
            stroke="#B8D96B"
            strokeWidth="2.5"
            strokeOpacity="0.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Animated Flowing Delivery Line */}
          <path
            d="M 38 78 C 85 30, 130 92, 185 48 C 235 15, 270 85, 310 58"
            stroke="url(#mobileRouteGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="20 100"
            className="animate-delivery-dash"
          />

          {/* Point 1: Origin Store (Bakery/Farm) */}
          <circle cx="38" cy="78" r="10" fill="#B8D96B" fillOpacity="0.15" />
          <circle cx="38" cy="78" r="5.5" fill="#123B35" stroke="#B8D96B" strokeWidth="1.75" />
          <circle cx="38" cy="78" r="2.5" fill="#B8D96B" />

          {/* Point 2: Local Market Waypoint */}
          <circle cx="185" cy="48" r="8" fill="#B8D96B" fillOpacity="0.12" />
          <circle cx="185" cy="48" r="4" fill="#123B35" stroke="#B8D96B" strokeWidth="1.5" strokeOpacity="0.7" />
          <circle cx="185" cy="48" r="2" fill="#B8D96B" />

          {/* Point 3: Customer Destination */}
          <circle cx="310" cy="58" r="12" fill="#B8D96B" fillOpacity="0.2" className="animate-ping" style={{ animationDuration: '3s' }} />
          <circle cx="310" cy="58" r="6" fill="#123B35" stroke="#B8D96B" strokeWidth="2" />
          <circle cx="310" cy="58" r="2.5" fill="#B8D96B" />
        </svg>

        {/* Floating Store 1 Tag */}
        <div className="absolute bottom-2.5 left-2 sm:left-3">
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#163F39]/95 border border-[#276B61] text-[9px] font-semibold text-[#F3F1EA] shadow-xs">
            <Store className="w-2.5 h-2.5 text-[#B8D96B] shrink-0" />
            <span className="truncate max-w-[65px]">{labels.store}</span>
          </div>
        </div>

        {/* Floating Order / ETA Courier Badge in Transit */}
        <div className="absolute top-2 sm:top-2.5 left-1/2 -translate-x-1/2 animate-courier-transit">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#123B35]/95 border border-[#B8D96B] text-[#F3F1EA] shadow-md backdrop-blur-xs">
            <div className="w-4 h-4 rounded-md bg-[#B8D96B] text-[#151817] flex items-center justify-center shrink-0">
              <Bike className="w-2.5 h-2.5 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-1.5 text-[10px] leading-none">
              <span className="font-extrabold text-[#B8D96B] tabular-nums whitespace-nowrap">
                {labels.eta}
              </span>
              <span className="text-[#F3F1EA]/50 font-light">•</span>
              <span className="text-[9px] text-[#F3F1EA]/90 font-medium whitespace-nowrap">
                {labels.status}
              </span>
            </div>
          </div>
        </div>

        {/* Floating Waypoint Tag */}
        <div className="absolute bottom-2 sm:bottom-2.5 left-[48%] -translate-x-1/2">
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#163F39]/90 border border-[#276B61]/70 text-[8px] font-medium text-[#F3F1EA]/80 shadow-xs">
            <ShoppingBag className="w-2.5 h-2.5 text-[#B8D96B]/80 shrink-0" />
            <span className="truncate max-w-[60px]">{labels.market}</span>
          </div>
        </div>

        {/* Floating Customer Destination Tag */}
        <div className="absolute top-2.5 right-2 sm:right-3">
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#163F39]/95 border border-[#B8D96B]/60 text-[9px] font-bold text-[#B8D96B] shadow-xs">
            <Sparkles className="w-2.5 h-2.5 text-[#B8D96B] shrink-0" />
            <span className="truncate max-w-[75px]">{labels.dest}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MobileHeroDeliveryAnimation;
