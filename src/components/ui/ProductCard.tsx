import React from 'react';
import { Plus, Minus, Zap, Leaf } from 'lucide-react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { RatingBadge, PromotionBadge } from './CardBadges';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: Product;
  inCartQuantity?: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  inCartQuantity = 0,
  onAddToCart,
  onUpdateQuantity,
  onClick,
}) => {
  const { language, t, formatCurrency } = useLanguage();

  const displayName = product.names?.[language] || product.name;
  const displayDesc = product.descriptions?.[language] || product.description;
  const displayUnit = product.units?.[language] || product.unit;
  const displayStore = product.storeNames?.[language] || product.storeName;
  const displayOrigin = product.origins?.[language] || product.origin;
  const displayBadge = product.badges?.[language] || product.badge;

  return (
    <div
      className="
        group relative grid w-full min-w-0 h-full
        rounded-2xl sm:rounded-3xl bg-surface border border-theme
        hover:border-[#123B35]/40 dark:hover:border-[#B8D96B]/50
        hover:shadow-md transition-all duration-200 overflow-hidden
      "
      style={{ gridTemplateRows: 'auto 1fr auto' }}
    >
      {/* 1. TOP MEDIA CONTAINER (.productMedia) */}
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
        className="productMedia relative h-40 sm:h-44 w-full min-w-0 bg-[#EDE9DE] dark:bg-[#1A2220] cursor-pointer select-none overflow-hidden shrink-0"
      >
        {/* Real Product Image with fixed container and lazy loading */}
        <SafeImage
          src={product.imageUrl}
          alt={displayName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          containerClassName="absolute inset-0 w-full h-full"
          fallbackText={displayName}
        />

        {/* Subtle gradient overlay to enhance badge contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

        {/* .productRating: Top-right corner */}
        <div className="productRating absolute top-2 end-2 z-10">
          <RatingBadge rating={product.rating} isAbsolute={false} />
        </div>

        {/* .productTags: Bottom-left corner */}
        <div className="productTags absolute bottom-2 start-2 z-10 flex items-center gap-1 flex-wrap max-w-[calc(100%-16px)]">
          {product.isBestSeller && (
            <PromotionBadge
              label={t.productCard.topBadge}
              variant="pistachio"
              icon={<Zap className="w-3 h-3 text-[#151817]" />}
            />
          )}
          {product.isNew && (
            <PromotionBadge
              label={t.productCard.newBadge}
              variant="mineral"
            />
          )}
          {displayBadge && (
            <PromotionBadge
              label={displayBadge}
              variant="pistachio"
            />
          )}
        </div>
      </div>

      {/* 2. BODY INFO CONTAINER (Fixed logical slots: Store/Origin -> Title -> Desc -> Unit) */}
      <div className="p-3 sm:p-4 flex flex-col justify-between min-w-0">
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
          className="cursor-pointer min-w-0"
        >
          {/* Seller and origin on a dedicated clean row */}
          <div className="flex items-center justify-between gap-1.5 mb-1.5 min-w-0 text-[11px]">
            <span className="font-semibold text-secondary truncate max-w-[65%]">
              {displayStore}
            </span>
            {displayOrigin && (
              <span className="flex items-center gap-1 text-[10px] text-muted truncate max-w-[35%] shrink-0">
                <Leaf className="w-2.5 h-2.5 text-[#2E7D32] shrink-0" />
                <span className="truncate">{displayOrigin}</span>
              </span>
            )}
          </div>

          {/* Product Name: clamped to 2 lines with strictly fixed min/max height */}
          <h4 className="text-xs sm:text-sm font-bold text-primary tracking-tight group-hover:text-[#123B35] dark:group-hover:text-[#B8D96B] transition-colors line-clamp-2 leading-snug h-[2.5rem] overflow-hidden">
            {displayName}
          </h4>

          {/* Description: clamped to 2 lines with strictly fixed min/max height */}
          <p className="text-[11px] text-muted line-clamp-2 leading-snug h-[2rem] overflow-hidden mt-1">
            {displayDesc}
          </p>

          {/* Quantity / Weight unit */}
          <div className="flex items-center text-[11px] text-secondary font-medium h-4 mt-1.5">
            <span className="tabular-nums">{displayUnit}</span>
          </div>
        </div>
      </div>

      {/* 3. PRICE & ACTION ROW (Fixed 60px height bar anchored to card bottom) */}
      <div className="px-3 pb-3 sm:px-4 sm:pb-4 pt-2.5 border-t border-theme/60 flex items-center justify-between gap-1.5 min-w-0 h-[60px]">
        <div className="flex flex-col shrink-0 min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="text-sm sm:text-base font-extrabold text-primary tabular-nums whitespace-nowrap">
              {formatCurrency(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-[11px] text-muted line-through tabular-nums whitespace-nowrap hidden min-[390px]:inline">
                {formatCurrency(product.oldPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Cart Stepper or Add Button with minimum 44px interactive area */}
        {inCartQuantity > 0 ? (
          <div className="flex items-center bg-surface-elevated rounded-xl p-0.5 border border-theme text-xs font-bold shadow-xs shrink-0 min-h-[44px]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateQuantity(product.id, inCartQuantity - 1);
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-surface text-secondary hover:text-primary transition active:scale-90 shrink-0"
              aria-label={t.productCard.decrease}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 sm:w-7 text-center text-primary tabular-nums text-xs font-extrabold shrink-0">
              {inCartQuantity}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateQuantity(product.id, inCartQuantity + 1);
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-surface text-secondary hover:text-primary transition active:scale-90 shrink-0"
              aria-label={t.productCard.increase}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="
              inline-flex items-center justify-center gap-1.5 h-11 px-3 sm:px-4 rounded-xl
              bg-[#123B35] text-[#F3F1EA] hover:bg-[#0E2E29] active:scale-95
              dark:bg-[#B8D96B] dark:text-[#151817] dark:hover:bg-[#A6C958]
              font-bold text-xs transition-all shadow-xs select-none shrink-0 whitespace-nowrap min-h-[44px]
            "
            aria-label={`${t.productCard.addToCart} ${displayName}`}
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">{t.productCard.addToCart}</span>
          </button>
        )}
      </div>
    </div>
  );
};

