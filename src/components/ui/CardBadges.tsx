import React from 'react';
import { Star, Clock, MapPin } from 'lucide-react';

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
        bg-ink/75 backdrop-blur-xs text-paper text-[11px] font-semibold
        border border-white/15 tabular-nums whitespace-nowrap select-none
        ${className}
      `}
    >
      <Clock className="w-3.5 h-3.5 text-accent shrink-0" aria-hidden="true" />
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
        bg-ink/75 backdrop-blur-xs text-paper text-[11px] font-semibold
        border border-white/15 tabular-nums whitespace-nowrap select-none
        ${className}
      `}
    >
      <MapPin className="w-3 h-3 text-accent shrink-0" aria-hidden="true" />
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
        bg-paper text-ink text-[11px] font-bold
        border border-paper-dot shadow-xs truncate max-w-[140px] select-none
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
    pistachio: 'bg-accent text-ink border border-accent/50',
    mineral: 'bg-ink text-paper border border-ink',
    warning: 'bg-warn-bg text-warn border border-[#F6AD55]/30',
    eco: 'bg-success-bg text-success border border-success/30',
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
