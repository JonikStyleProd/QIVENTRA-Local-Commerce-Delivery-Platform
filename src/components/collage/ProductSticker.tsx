import React, { useState } from 'react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { ProductPrice } from './ProductPrice';
import { Tape } from './Tape';

interface ProductStickerProps {
  product: Product;
  inCart: boolean;
  tilt: string;
  tape: 'yellow' | 'blue' | 'red';
  delay: string;
  onAdd: () => void;
}

/** Product sticker from the phone home screen: taped photo, short name, price and one add button. */
export const ProductSticker: React.FC<ProductStickerProps> = ({ product, inCart, tilt, tape, delay, onAdd }) => {
  const { t, language } = useLanguage();
  const [flash, setFlash] = useState(0);

  const label = t.collage.productLabels[product.id] || product.names?.[language] || product.name;
  const copy = t.collage.mobileHome;

  return (
    <li
      className="anim-stick shrink-0 w-[150px]"
      style={{ '--r': tilt, animationDelay: delay } as React.CSSProperties}
    >
      <div className="relative bg-card p-2 pb-2.5 shadow-sticker">
        <Tape tone={tape} small />
        <img
          src={product.imageUrl}
          alt={label}
          loading="lazy"
          decoding="async"
          className="block w-full aspect-square object-cover"
        />
        <p className="hand mt-1.5 text-[22px] leading-none">{label}</p>
        <div className="relative flex items-center justify-between mt-1">
          <ProductPrice product={product} />
          <button
            type="button"
            onClick={() => {
              if (inCart) return;
              onAdd();
              setFlash((n) => n + 1);
            }}
            aria-disabled={inCart}
            aria-label={`${inCart ? copy.inCart : copy.add} ${label}`}
            className={`chip-tilt w-11 h-11 rounded-xl border-2 border-ink text-xl font-black ${
              inCart ? 'bg-accent text-ink cursor-default' : 'bg-link text-white cursor-pointer'
            }`}
          >
            {inCart ? '✓' : '+'}
          </button>
          {flash > 0 && (
            <span
              key={flash}
              aria-hidden="true"
              onAnimationEnd={() => setFlash(0)}
              className="plus-one hand absolute end-1 -top-2.5 text-2xl text-action pointer-events-none"
            >
              +1
            </span>
          )}
        </div>
      </div>
    </li>
  );
};
