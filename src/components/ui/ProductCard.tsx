import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { usePromotions } from '../../context/PromotionsContext';
import { tiltFor } from '../../data/collageCatalog';
import { Tape } from '../collage/Tape';
import { PolaroidPhoto } from '../collage/PolaroidPhoto';
import { FactLabels, PromoLabels } from '../collage/ProductLabelChips';
import { ProductPrice } from '../collage/ProductPrice';
import { ProductSheet } from '../collage/ProductSheet';
import { QuantityStepper } from '../collage/QuantityStepper';

interface ProductCardProps {
  product: Product;
  inCartQuantity?: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

/** Product sticker for shop, search and catalog grids: taped photo, price and basket controls. */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  inCartQuantity = 0,
  onAddToCart,
  onUpdateQuantity,
}) => {
  const { language, t } = useLanguage();
  const { labelsFor } = usePromotions();
  const { deliveryFor } = useApp();
  const canOrder = deliveryFor(product.storeId).inRange;
  const [flash, setFlash] = useState(0);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const displayName = product.names?.[language] || product.name;
  const displayDesc = product.descriptions?.[language] || product.description;
  const displayUnit = product.units?.[language] || product.unit;
  const displayStore = product.storeNames?.[language] || product.storeName;
  const labels = labelsFor(product.id);

  return (
    <article
      className="card-tilt relative flex flex-col h-full min-w-0 bg-card p-2 pb-3 shadow-polaroid"
      style={{ '--tilt': tiltFor(product.id) } as React.CSSProperties}
    >
      <Tape small tone="blue" />

      <button
        type="button"
        onClick={() => setIsViewOpen(true)}
        aria-label={`${t.screens.product.details}: ${displayName}`}
        aria-haspopup="dialog"
        className="relative block w-full cursor-pointer"
      >
        <PolaroidPhoto src={product.imageUrl} alt="" noteClassName="text-[22px]" />
        <PromoLabels labels={labels} className="absolute top-1.5 inset-x-1.5" />
      </button>

      <div className="flex-1 min-w-0 pt-2 px-1">
        <p className="text-xs font-bold text-ink-3 truncate">
          <bdi>{displayStore}</bdi>
        </p>
        <h3 className="mt-0.5 text-sm desk:text-base font-black leading-snug line-clamp-2">{displayName}</h3>
        <p className="mt-1 text-xs font-semibold text-ink-3 line-clamp-2">{displayDesc}</p>
        <p className="mt-1 text-xs font-bold text-ink-2">{displayUnit}</p>
        <FactLabels labels={labels} className="mt-1.5" />
      </div>

      <div className="relative flex flex-wrap items-center justify-between gap-1.5 mt-2 px-1">
        <ProductPrice product={product} />

        {!canOrder && inCartQuantity === 0 ? (
          <span className="text-xs font-extrabold text-action-text">{t.demo.delivery.cannotAdd}</span>
        ) : inCartQuantity > 0 ? (
          <QuantityStepper
            quantity={inCartQuantity}
            name={displayName}
            onDecrease={() => onUpdateQuantity(product.id, inCartQuantity - 1)}
            onIncrease={() => {
              onUpdateQuantity(product.id, inCartQuantity + 1);
              setFlash((n) => n + 1);
            }}
          />
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

      <ProductSheet product={product} isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} />
    </article>
  );
};
