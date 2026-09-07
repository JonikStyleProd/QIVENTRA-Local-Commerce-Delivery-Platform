import React from 'react';
import { Star, Clock, MapPin } from 'lucide-react';

/**
 * 1. RatingBadge
 * Strictly standardized to:
 * - height: 24px (h-6)
 * - min-width: 58px
 * - padding-inline: 8px
 * - star icon: exactly 14px (w-3.5 h-3.5)
 * - gap: 4px
 * - absolute positioning in top-right of relative image container:
 *   top: 10px; inset-inline-end: 10px (inset-block-start: 10px; inset-inline-end: 10px;)
 * - numbers & stars are NOT mirrored in RTL
 */
export interface RatingBadgeProps {
  rating: number;
  reviewsCount?: number;
  isAbsolute?: boolean;
  className?: string;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  rating,
  reviewsCount,
  isAbsolute = false,
  className = '',
}) => {
  const formattedRating = Number.isInteger(rating) ? `${rating}.0` : rating.toFixed(rating < 4.95 ? 1 : 2);

  return (
    <div
      dir="ltr"
      className={`
        inline-flex items-center justify-center gap-1 h-6 min-w-[58px] px-2 rounded-full
        bg-[#151817]/85 backdrop-blur-xs text-[#F3F1EA] border border-white/20 shadow-xs
        text-xs font-bold whitespace-nowrap select-none shrink-0 pointer-events-none
        ${isAbsolute ? 'absolute top-2.5 end-2.5 z-10' : ''}
        ${className}
      `}
      style={isAbsolute ? { insetBlockStart: '10px', insetInlineEnd: '10px' } : undefined}
      aria-label={`Рейтинг ${formattedRating}`}
    >
      <Star className="w-3.5 h-3.5 fill-[#B8D96B] text-[#B8D96B] shrink-0" aria-hidden="true" />
      <span className="tabular-nums leading-none tracking-tight">{formattedRating}</span>
      {reviewsCount !== undefined && (
        <span className="text-[10px] font-normal text-[#F3F1EA]/75 tabular-nums leading-none ps-0.5">
          ({reviewsCount})
        </span>
      )}
    </div>
  );
};

/**
 * 2. DeliveryTimeBadge
 * Consistent 24px height badge for store delivery ETA
 */
export interface DeliveryTimeBadgeProps {
  minMinutes: number;
  maxMinutes: number;
  className?: string;
}

export const DeliveryTimeBadge: React.FC<DeliveryTimeBadgeProps> = ({
  minMinutes,
  maxMinutes,
  className = '',
}) => {
  return (
    <span
      dir="ltr"
      className={`
        inline-flex items-center gap-1.5 h-6 px-2 rounded-md
        bg-[#151817]/75 backdrop-blur-xs text-[#F3F1EA] text-[11px] font-semibold
        border border-white/15 tabular-nums whitespace-nowrap select-none
        ${className}
      `}
    >
      <Clock className="w-3.5 h-3.5 text-[#B8D96B] shrink-0" aria-hidden="true" />
      <span>{minMinutes}–{maxMinutes} min</span>
    </span>
  );
};

/**
 * 3. DistanceBadge
 * Consistent 24px height badge for distance calculation
 */
export interface DistanceBadgeProps {
  distanceKm: number;
  className?: string;
}

export const DistanceBadge: React.FC<DistanceBadgeProps> = ({
  distanceKm,
  className = '',
}) => {
  const formattedDistance = distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} km`;

  return (
    <span
      dir="ltr"
      className={`
        inline-flex items-center gap-1 h-6 px-2 rounded-md
        bg-[#151817]/75 backdrop-blur-xs text-[#F3F1EA] text-[11px] font-semibold
        border border-white/15 tabular-nums whitespace-nowrap select-none
        ${className}
      `}
    >
      <MapPin className="w-3 h-3 text-[#B8D96B] shrink-0" aria-hidden="true" />
      <span>{formattedDistance}</span>
    </span>
  );
};

/**
 * 4. CategoryBadge
 * Standardized category pill
 */
export interface CategoryBadgeProps {
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  label,
  icon,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1 h-6 px-2.5 rounded-md
        bg-[#F3F1EA] text-[#151817] text-[11px] font-bold
        border border-[#E2DFD4] shadow-xs truncate max-w-[140px] select-none
        ${className}
      `}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{label}</span>
    </span>
  );
};

/**
 * 5. PromotionBadge
 * Standardized promo / top / new / eco badge with 24px fixed height
 */
export interface PromotionBadgeProps {
  label: string;
  variant?: 'pistachio' | 'mineral' | 'warning' | 'eco';
  icon?: React.ReactNode;
  isAbsolute?: boolean;
  className?: string;
}

export const PromotionBadge: React.FC<PromotionBadgeProps> = ({
  label,
  variant = 'pistachio',
  icon,
  isAbsolute = false,
  className = '',
}) => {
  const variantStyles = {
    pistachio: 'bg-[#B8D96B] text-[#151817] border border-[#A6C958]/50',
    mineral: 'bg-[#123B35] text-[#F3F1EA] border border-[#1E524A]',
    warning: 'bg-[#FEF8E7] text-[#B7791F] dark:bg-[#332612] dark:text-[#F6AD55] border border-[#F6AD55]/30',
    eco: 'bg-[#E8F5EE] text-[#1E824C] dark:bg-[#132E20] dark:text-[#48BB78] border border-[#1E824C]/30',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-[10px] font-black uppercase tracking-wider
        whitespace-nowrap select-none shadow-xs shrink-0
        ${variantStyles[variant]}
        ${isAbsolute ? 'absolute top-2.5 start-2.5 z-10' : ''}
        ${className}
      `}
      style={isAbsolute ? { insetBlockStart: '10px', insetInlineStart: '10px' } : undefined}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </span>
  );
};
