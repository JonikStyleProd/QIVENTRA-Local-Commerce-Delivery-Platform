import React from 'react';
import { Bike, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const HeroDeliveryAnimation: React.FC = () => {
  const { language, isRTL, t } = useLanguage();

  // Localized badge labels strictly respecting language setting
  const statusLabels = {
    ru: {
      courierStatus: 'Курьер в пути',
      eta: '15–25 мин',
      ecoFleet: 'Эко-доставка',
      hub: 'Фермерский хаб',
      client: 'Ваш адрес',
    },
    en: {
      courierStatus: 'Courier en route',
      eta: '15–25 min',
      ecoFleet: 'Eco delivery',
      hub: 'Boutique hub',
      client: 'Your address',
    },
    he: {
      courierStatus: 'השליח בדרך',
      eta: '15–25 דק׳',
      ecoFleet: 'משלוח ירוק',
      hub: 'חוות בוטיק',
      client: 'הכתובת שלך',
    },
  }[language] || {
    courierStatus: 'Courier en route',
    eta: '15–25 min',
    ecoFleet: 'Eco delivery',
    hub: 'Boutique hub',
    client: 'Your address',
  };

  return (
    <div
      className="hidden lg:flex absolute top-1/2 -translate-y-1/2 end-4 xl:end-10 w-[38%] max-w-[420px] h-[280px] pointer-events-none select-none items-center justify-center"
      aria-hidden="true"
    >
      {/* Direction-aware soft vignette ensuring left-side text has 100% clarity */}
      <div
        className={`absolute inset-0 z-10 bg-gradient-to-r from-[#123B35] via-[#123B35]/30 to-transparent ${
          isRTL ? 'rotate-180' : ''
        }`}
      />

      <div className="relative w-full h-full flex items-center justify-center">
        {/* Soft Ambient Radial Glow */}
        <div className="absolute w-64 h-64 rounded-full bg-[#B8D96B]/10 blur-3xl pointer-events-none" />

        {/* Clean Vector City Grid & Route Radar */}
        <svg
          viewBox="0 0 420 260"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="vectorRoute" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B8D96B" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#B8D96B" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#EAF8C6" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="pulseFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B8D96B" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#1A4B44" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Gentle concentric radar waves */}
          <circle cx="210" cy="130" r="105" stroke="#B8D96B" strokeOpacity="0.06" strokeWidth="1" />
          <circle cx="210" cy="130" r="70" stroke="#B8D96B" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="210" cy="130" r="38" stroke="#B8D96B" strokeOpacity="0.12" strokeWidth="1" />

          {/* Abstract City Grid Geometry (Low opacity, non-cluttered) */}
          <line x1="30" y1="70" x2="390" y2="70" stroke="#F3F1EA" strokeOpacity="0.05" strokeWidth="1" />
          <line x1="30" y1="190" x2="390" y2="190" stroke="#F3F1EA" strokeOpacity="0.05" strokeWidth="1" />
          <line x1="120" y1="20" x2="120" y2="240" stroke="#F3F1EA" strokeOpacity="0.05" strokeWidth="1" />
          <line x1="300" y1="20" x2="300" y2="240" stroke="#F3F1EA" strokeOpacity="0.05" strokeWidth="1" />

          {/* Primary Route Path (Vendor Hub -> Mid Transit -> Customer Destination) */}
          <path
            d="M 65 175 C 130 115, 175 205, 245 140 C 295 95, 325 145, 360 85"
            stroke="#B8D96B"
            strokeWidth="3"
            strokeOpacity="0.25"
            strokeLinecap="round"
          />

          {/* Animated Glowing Trail */}
          <path
            d="M 65 175 C 130 115, 175 205, 245 140 C 295 95, 325 145, 360 85"
            stroke="url(#vectorRoute)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="18 120"
            className="animate-delivery-dash"
          />

          {/* Point 1: Origin Hub Beacon (65, 175) */}
          <circle cx="65" cy="175" r="14" fill="#B8D96B" fillOpacity="0.12" />
          <circle cx="65" cy="175" r="7" fill="#163F39" stroke="#B8D96B" strokeWidth="2" />
          <circle cx="65" cy="175" r="3" fill="#B8D96B" />

          {/* Point 2: Midpoint Checkpoint (245, 140) */}
          <circle cx="245" cy="140" r="4.5" fill="#163F39" stroke="#B8D96B" strokeWidth="1.5" strokeOpacity="0.6" />
          <circle cx="245" cy="140" r="2" fill="#B8D96B" />

          {/* Point 3: Customer Destination Beacon (360, 85) */}
          <circle cx="360" cy="85" r="16" fill="#B8D96B" fillOpacity="0.14" />
          <circle cx="360" cy="85" r="8" fill="#163F39" stroke="#B8D96B" strokeWidth="2" />
          <circle cx="360" cy="85" r="3.5" fill="#B8D96B" />
        </svg>

        {/* Localized Floating Pill 1: Origin (Farm / Hub) */}
        <div className="absolute top-[182px] start-[35px] -translate-y-1/2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#163F39]/95 border border-[#276B61] text-[10px] font-semibold text-[#F3F1EA] shadow-md backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8D96B]" />
            <span>{statusLabels.hub}</span>
          </div>
        </div>

        {/* Localized Floating Pill 2: Destination (Your Address) */}
        <div className="absolute top-[52px] end-[18px]">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#163F39]/95 border border-[#B8D96B]/50 text-[10px] font-bold text-[#B8D96B] shadow-md backdrop-blur-xs">
            <Sparkles className="w-3 h-3 text-[#B8D96B] shrink-0" />
            <span>{statusLabels.client}</span>
          </div>
        </div>

        {/* Localized In-Transit Active Courier Card */}
        <div className="absolute top-[96px] start-[185px] -translate-x-1/2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#123B35] border border-[#B8D96B] text-[#F3F1EA] shadow-xl backdrop-blur-md">
            <div className="w-6 h-6 rounded-lg bg-[#B8D96B] text-[#151817] flex items-center justify-center shrink-0">
              <Bike className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-start leading-tight">
              <span className="text-[10px] font-extrabold text-[#B8D96B] tabular-nums">
                {statusLabels.eta}
              </span>
              <span className="text-[9px] text-[#F3F1EA]/80 font-medium whitespace-nowrap">
                {statusLabels.courierStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Subtle Eco-fleet indicator chip */}
        <div className="absolute bottom-[22px] end-[30px]">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#1A4B44]/80 border border-[#276B61]/60 text-[9px] font-medium text-[#F3F1EA]/70">
            <ShieldCheck className="w-2.5 h-2.5 text-[#B8D96B]" />
            <span>{statusLabels.ecoFleet}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HeroDeliveryAnimation;
