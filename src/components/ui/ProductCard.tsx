import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { tiltFor } from '../../data/collageCatalog';
import { Tape } from '../collage/Tape';
import { PolaroidPhoto } from '../collage/PolaroidPhoto';

interface ProductCardProps {
  product: Product;
  inCartQuantity?: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClick?: () => void;
}

/** Product sticker for shop, search and catalog grids: taped photo, price and basket controls. */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  inCartQuantity = 0,
  onAddToCart,
  onUpdateQuantity,
  onClick,
}) => {
  const { language, t, formatCurrency } = useLanguage();
  const [flash, setFlash] = useState(0);

  const displayName = product.names?.[language] || product.name;
  const displayDesc = product.descriptions?.[language] || product.description;
  const displayUnit = product.units?.[language] || product.unit;
  const displayStore = product.storeNames?.[language] || product.storeName;
  const displayBadge = product.badges?.[language] || product.badge;

  const tag = displayBadge || (product.isBestSeller ? t.productCard.topBadge : product.isNew ? t.productCard.newBadge : null);

  return (
    <article
      className="card-tilt relative flex flex-col h-full min-w-0 bg-white p-2 pb-3 shadow-polaroid"
      style={{ '--tilt': tiltFor(product.id) } as React.CSSProperties}
    >
      <Tape small tone="blue" />

      <button
        type="button"
        onClick={onClick}
        aria-label={displayName}
        className="relative block w-full cursor-pointer"
      >
        <PolaroidPhoto src={product.imageUrl} alt="" noteClassName="text-[22px]" />
        {tag && (
          <span className="absolute top-1.5 start-1.5 px-2 py-0.5 bg-accent border-2 border-ink rounded-lg text-xs font-black">
            {tag}
          </span>
        )}
      </button>

      <div className="flex-1 min-w-0 pt-2 px-1">
        <p className="text-xs font-bold text-ink-3 truncate">
          <bdi>{displayStore}</bdi>
        </p>
        <h3 className="mt-0.5 text-sm desk:text-base font-black leading-snug line-clamp-2">{displayName}</h3>
        <p className="mt-1 text-xs font-semibold text-ink-3 line-clamp-2">{displayDesc}</p>
        <p className="mt-1 text-xs font-bold text-ink-2">{displayUnit}</p>
      </div>

      <div className="relative flex flex-wrap items-center justify-between gap-1.5 mt-2 px-1">
        <span className="flex items-baseline gap-1.5 min-w-0">
          <span className="font-black whitespace-nowrap">{formatCurrency(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs font-bold text-ink-3 line-through whitespace-nowrap">
              {formatCurrency(product.oldPrice)}
            </span>
          )}
        </span>

        {inCartQuantity > 0 ? (
          <span className="inline-flex items-center bg-accent border-2 border-ink rounded-xl overflow-hidden seg-group">
            <button
              type="button"
              onClick={() => onUpdateQuantity(product.id, inCartQuantity - 1)}
              aria-label={`${t.productCard.decrease}: ${displayName}`}
              className="grid place-items-center w-11 h-11 cursor-pointer"
            >
              <Minus aria-hidden="true" className="w-4 h-4" />
            </button>
            <span className="w-6 text-center text-sm font-black tabular-nums" aria-live="polite">
              {inCartQuantity}
            </span>
            <button
              type="button"
              onClick={() => {
                onUpdateQuantity(product.id, inCartQuantity + 1);
                setFlash((n) => n + 1);
              }}
              aria-label={`${t.productCard.increase}: ${displayName}`}
              className="grid place-items-center w-11 h-11 cursor-pointer"
            >
              <Plus aria-hidden="true" className="w-4 h-4" />
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => {
              onAddToCart(product);
              setFlash((n) => n + 1);
            }}
            aria-label={`${t.productCard.addToCart}: ${displayName}`}
            className="chip-tilt grid place-items-center w-11 h-11 bg-link text-white border-2 border-ink rounded-xl cursor-pointer"
          >
            <Plus aria-hidden="true" strokeWidth={3} className="w-5 h-5" />
          </button>
        )}

        {flash > 0 && (
          <span
            key={flash}
            aria-hidden="true"
            onAnimationEnd={() => setFlash(0)}
            className="plus-one hand absolute end-2 -top-3 text-2xl text-action pointer-events-none"
          >
            +1
          </span>
        )}
      </div>
    </article>
  );
};
