import React from 'react';
import { Leaf, CheckCircle, Sparkles } from 'lucide-react';
import { Store } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  RatingBadge,
  DeliveryTimeBadge,
  DistanceBadge,
  PromotionBadge,
} from './CardBadges';
import { SafeImage } from './SafeImage';

interface StoreCardProps {
  store: Store;
  onClick?: () => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, onClick }) => {
  const { language, t, formatCurrency } = useLanguage();

  const displayName = store.names?.[language] || store.name;
  const displayCategory = store.categories?.[language] || store.category;
  const displayAddress = store.addresses?.[language] || store.address;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="
        group relative grid w-full h-full min-w-0
        rounded-2xl sm:rounded-3xl bg-surface border border-theme
        hover:border-[#123B35]/40 dark:hover:border-[#B8D96B]/50
        hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden
        select-none
      "
      style={{ gridTemplateRows: 'auto 1fr auto' }}
    >
      {/* 1. TOP MEDIA CONTAINER with 2-column overlay and .storeMetaRight stack */}
      <div className="storeMedia relative h-44 w-full p-3 sm:p-3.5 flex flex-col justify-between text-white overflow-hidden shrink-0 select-none">
        {/* Real Store Cover Image with lazy loading */}
        <SafeImage
          src={store.coverUrl}
          alt={displayName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          containerClassName="absolute inset-0 w-full h-full"
          fallbackText={displayName}
        />

        {/* High contrast gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/40 pointer-events-none" />

        {/* Top bar on media */}
        <div className="relative z-10 flex items-start justify-between w-full min-w-0">
          {/* Top-Left: Promo / Eco badges */}
          <div className="flex items-center gap-1.5 flex-wrap max-w-[calc(100%-88px)]">
            {store.isEco && (
              <PromotionBadge
                label={t.storeCard.eco}
                variant="pistachio"
                icon={<Leaf className="w-3 h-3 text-[#151817]" />}
              />
            )}
            {store.isPromo && store.promoText && (
              <PromotionBadge
                label={t.storeCard.promo}
                variant="mineral"
                icon={<Sparkles className="w-3 h-3 text-[#B8D96B]" />}
              />
            )}
          </div>

          {/* Top-Right: .storeMetaRight vertical stack (Rating + Distance) */}
          <div className="storeMetaRight flex flex-col items-end gap-1.5 shrink-0 z-10">
            <RatingBadge
              rating={store.rating}
              reviewsCount={store.reviewsCount}
              isAbsolute={false}
            />
            <DistanceBadge distanceKm={store.distanceKm} />
          </div>
        </div>

        {/* Bottom bar on media (Left: Delivery time & delivery fee pill) */}
        <div className="relative z-10 flex items-center justify-between gap-1.5 text-xs text-white/95 font-medium mt-auto">
          <div className="flex items-center gap-1.5 flex-wrap">
            <DeliveryTimeBadge
              minMinutes={store.deliveryTimeMin}
              maxMinutes={store.deliveryTimeMax}
            />
            <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/10">
              {store.deliveryFee === 0
                ? t.storeCard.freeDelivery
                : `${t.storeCard.deliveryPrice} ${formatCurrency(store.deliveryFee)}`}
            </span>
          </div>
        </div>
      </div>

      {/* 2. BODY INFO CONTAINER (Fixed logical slots: Store Name -> Category & Address) */}
      <div className="p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center gap-1.5 h-6 mb-1">
            <h3 className="text-base font-bold tracking-tight text-primary group-hover:text-[#123B35] dark:group-hover:text-[#B8D96B] transition-colors line-clamp-1">
              {displayName}
            </h3>
            {store.isVerified && (
              <CheckCircle className="w-4 h-4 text-[#1E824C] dark:text-[#48BB78] shrink-0" />
            )}
          </div>

          <p className="text-xs text-secondary font-medium h-5 line-clamp-1 truncate">
            {displayCategory} • {displayAddress}
          </p>
        </div>
      </div>

      {/* 3. DELIVERY CONDITIONS DIVIDER (Fixed 56px height bar anchored to card bottom) */}
      <div className="px-4 pb-4 pt-3 border-t border-theme/60 flex items-center justify-between text-xs h-[56px]">
        <div className="flex items-center gap-1 font-semibold text-primary">
          {store.deliveryFee === 0 ? (
            <span className="text-[#1E824C] dark:text-[#48BB78] font-bold">
              {t.storeCard.freeDelivery}
            </span>
          ) : (
            <span>
              {t.storeCard.deliveryPrice} {formatCurrency(store.deliveryFee)}
            </span>
          )}
        </div>
        <span className="text-muted text-[11px] tabular-nums">
          {t.storeCard.minOrder} {formatCurrency(store.minOrder)}
        </span>
      </div>
    </div>
  );
};

