import React from 'react';
import { Plus } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { usePromotions } from '../../context/PromotionsContext';
import { tiltFor } from '../../data/collageCatalog';
import { pathFor } from '../../router/paths';
import { Button } from '../ui/Button';
import { LinkButton } from '../ui/LinkButton';
import { Modal } from '../ui/Modal';
import { PolaroidPhoto } from './PolaroidPhoto';
import { FactLabels, PromoLabels } from './ProductLabelChips';
import { ProductPrice } from './ProductPrice';
import { QuantityStepper } from './QuantityStepper';
import { Tape } from './Tape';

interface ProductSheetProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Product view: photo, description, price and quantity. The data has no product variants,
 * so quantity is the only choice here.
 */
export const ProductSheet: React.FC<ProductSheetProps> = ({ product, isOpen, onClose }) => {
  const { cart, addToCart, updateCartQuantity, currentRoute, selectedStoreId } = useApp();
  const { language, t } = useLanguage();
  const { labelsFor } = usePromotions();
  const copy = t.screens.product;

  const name = product.names?.[language] || product.name;
  const description = product.descriptions?.[language] || product.description;
  const unit = product.units?.[language] || product.unit;
  const storeName = product.storeNames?.[language] || product.storeName;
  const origin = product.origins?.[language] || product.origin;
  const quantity = cart.find((item) => item.product.id === product.id)?.quantity ?? 0;

  // Inside this product's own shop the link would lead back to the same page.
  const isOnOwnStorePage = currentRoute === 'store' && selectedStoreId === product.storeId;

  return (
    <Modal isOpen={isOpen} onClose={onClose} note={storeName} title={name} maxWidth="lg">
      <div className="grid sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)] gap-4 sm:gap-5 items-start">
        <div
          className="relative justify-self-center w-[200px] sm:w-full mt-2 bg-card p-2 pb-3 shadow-polaroid"
          style={{ rotate: tiltFor(product.id) }}
        >
          <Tape tone="blue" small />
          <PolaroidPhoto src={product.imageUrl} alt={product.imageAlt?.[language] || name} eager />
        </div>

        <div className="min-w-0">
          <PromoLabels labels={labelsFor(product.id)} className="mb-2" />
          <p className="font-bold text-ink-2">{description}</p>
          <FactLabels labels={labelsFor(product.id)} className="mt-2" />
          <dl className="mt-3 space-y-1 text-sm">
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-bold text-ink-3">{copy.unit}:</dt>
              <dd className="font-extrabold">{unit}</dd>
            </div>
            {origin && (
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-bold text-ink-3">{copy.origin}:</dt>
                <dd className="font-extrabold">{origin}</dd>
              </div>
            )}
          </dl>

          <p className="mt-3">
            <ProductPrice product={product} priceClassName="text-[30px] font-black leading-none" oldPriceClassName="font-bold" />
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            {quantity > 0 ? (
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-extrabold">{copy.quantity}</span>
                <QuantityStepper
                  quantity={quantity}
                  name={name}
                  onDecrease={() => updateCartQuantity(product.id, quantity - 1)}
                  onIncrease={() => updateCartQuantity(product.id, quantity + 1)}
                />
              </div>
            ) : (
              <Button
                variant="secondary"
                leftIcon={<Plus aria-hidden="true" strokeWidth={3} className="w-5 h-5" />}
                onClick={() => addToCart(product)}
              >
                {t.productCard.addToCart}
              </Button>
            )}
            {!isOnOwnStorePage && (
              <LinkButton to={pathFor('store', { storeId: product.storeId })} variant="outline" onClick={onClose}>
                {copy.openStore}
              </LinkButton>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
