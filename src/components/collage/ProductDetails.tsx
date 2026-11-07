import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { usePromotions } from '../../context/PromotionsContext';
import { tiltFor } from '../../data/collageCatalog';
import { hasVariantChoice, keyOfLine, lineKey, unitLabel, variantOf } from '../../data/variants';
import { pathFor } from '../../router/paths';
import { Button } from '../ui/Button';
import { LinkButton } from '../ui/LinkButton';
import { FavoriteButton } from './FavoriteButton';
import { PolaroidPhoto } from './PolaroidPhoto';
import { FactLabels, PromoLabels } from './ProductLabelChips';
import { ProductPrice } from './ProductPrice';
import { QuantityStepper } from './QuantityStepper';
import { Tape } from './Tape';
import { VariantPicker } from './VariantPicker';

interface ProductDetailsProps {
  product: Product;
  /** Called when a link leads away, so the dialog around this can close. */
  onLeave?: () => void;
  /** The dialog links to the product's own page; that page does not need to. */
  showPageLink?: boolean;
}

/** Photo, description, variants, price and quantity: the same in the product window and on its page. */
export const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onLeave, showPageLink = false }) => {
  const { cart, addToCart, updateCartQuantity, currentRoute, deliveryFor } = useApp();
  const { language, t } = useLanguage();
  const { labelsFor } = usePromotions();
  const copy = t.screens.product;

  const [variantId, setVariantId] = useState(() => variantOf(product)?.id);

  const name = product.names?.[language] || product.name;
  const description = product.descriptions?.[language] || product.description;
  const origin = product.origins?.[language] || product.origin;
  const key = lineKey(product.id, variantId);
  const quantity = cart.find((item) => keyOfLine(item) === key)?.quantity ?? 0;
  const canOrder = deliveryFor(product.storeId).inRange;

  // Inside this product's own shop the link would lead back to the same page.
  const isOnOwnStorePage = currentRoute === 'store';

  return (
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

        {hasVariantChoice(product) && (
          <VariantPicker product={product} value={variantId} onChange={setVariantId} className="mt-3" />
        )}

        <dl className="mt-3 space-y-1 text-sm">
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-bold text-ink-3">{copy.unit}:</dt>
            <dd className="font-extrabold">{unitLabel(product, variantId, language)}</dd>
          </div>
          {origin && (
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-bold text-ink-3">{copy.origin}:</dt>
              <dd className="font-extrabold">{origin}</dd>
            </div>
          )}
        </dl>

        <p className="mt-3">
          <ProductPrice
            product={product}
            variantId={variantId ?? ''}
            priceClassName="text-[30px] font-black leading-none"
            oldPriceClassName="font-bold"
          />
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-4">
          {!canOrder && quantity === 0 ? (
            <p className="font-extrabold text-action-text">{t.demo.delivery.outOfRange}</p>
          ) : quantity > 0 ? (
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-extrabold">{copy.quantity}</span>
              <QuantityStepper
                quantity={quantity}
                name={name}
                onDecrease={() => updateCartQuantity(key, quantity - 1)}
                onIncrease={() => updateCartQuantity(key, quantity + 1)}
              />
            </div>
          ) : (
            <Button
              variant="secondary"
              leftIcon={<Plus aria-hidden="true" strokeWidth={3} className="w-5 h-5" />}
              onClick={() => addToCart(product, 1, variantId)}
            >
              {t.productCard.addToCart}
            </Button>
          )}
          {!isOnOwnStorePage && (
            <LinkButton to={pathFor('store', { storeId: product.storeId })} variant="outline" onClick={onLeave}>
              {copy.openStore}
            </LinkButton>
          )}
          <FavoriteButton kind="products" id={product.id} name={name} />
        </div>

        {showPageLink && (
          <Link
            to={pathFor('product', { storeId: product.storeId, productId: product.id })}
            onClick={onLeave}
            className="inline-flex items-center min-h-11 mt-1 font-extrabold underline"
          >
            {t.demo.variants.openPage}
          </Link>
        )}
      </div>
    </div>
  );
};
