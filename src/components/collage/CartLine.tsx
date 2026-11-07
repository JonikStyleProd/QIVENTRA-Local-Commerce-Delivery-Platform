import React from 'react';
import { Trash2 } from 'lucide-react';
import { CartItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { tiltFor } from '../../data/collageCatalog';
import { IconButton } from '../ui/IconButton';
import { PolaroidPhoto } from './PolaroidPhoto';
import { QuantityStepper } from './QuantityStepper';

/** One basket line: small polaroid, names, quantity, line total and remove. */
export const CartLine: React.FC<{ item: CartItem }> = ({ item }) => {
  const { updateCartQuantity, removeFromCart } = useApp();
  const { language, t, formatCurrency } = useLanguage();

  const name = item.product.names?.[language] || item.product.name;
  const storeName = item.product.storeNames?.[language] || item.product.storeName;
  const unit = item.product.units?.[language] || item.product.unit;

  return (
    <div className="grid grid-cols-[64px_minmax(0,1fr)] desk:grid-cols-[76px_minmax(0,1fr)] gap-3 py-3.5 first:pt-0 last:pb-0">
      <div className="self-start bg-card p-1 pb-1.5 shadow-polaroid" style={{ rotate: tiltFor(item.product.id) }}>
        <PolaroidPhoto src={item.product.imageUrl} alt="" noteClassName="text-sm" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold text-ink-3 truncate">
          <bdi>{storeName}</bdi>
        </p>
        <h3 className="font-black leading-snug break-words">{name}</h3>
        <p className="text-xs font-bold text-ink-2">
          {unit} · {formatCurrency(item.product.price)}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
          <QuantityStepper
            quantity={item.quantity}
            name={name}
            onDecrease={() => updateCartQuantity(item.product.id, item.quantity - 1)}
            onIncrease={() => updateCartQuantity(item.product.id, item.quantity + 1)}
          />
          <div className="flex items-center gap-2 ms-auto">
            <span className="text-lg font-black whitespace-nowrap tabular-nums">
              {formatCurrency(item.product.price * item.quantity)}
            </span>
            <IconButton
              onClick={() => removeFromCart(item.product.id)}
              aria-label={`${t.screens.cart.removeItem}: ${name}`}
              title={t.screens.cart.removeItem}
              icon={<Trash2 aria-hidden="true" className="w-4 h-4" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
