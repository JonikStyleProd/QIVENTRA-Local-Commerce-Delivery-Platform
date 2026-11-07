import { Language } from '../i18n/translations';
import { CartItem, Product, ProductVariant } from '../types';

export const hasVariantChoice = (product: Product): boolean => (product.variants?.length ?? 0) > 1;

/** The chosen variant, or the product's first one. A product without variants has none. */
export const variantOf = (product: Product, variantId?: string): ProductVariant | undefined =>
  product.variants?.find((variant) => variant.id === variantId) ?? product.variants?.[0];

export const priceOf = (product: Product, variantId?: string): number =>
  variantOf(product, variantId)?.price ?? product.price;

export const lowestPrice = (product: Product): number =>
  product.variants?.length ? Math.min(...product.variants.map((variant) => variant.price)) : product.price;

/** Variants of one product are separate basket lines, so a line is known by product and variant. */
export const lineKey = (productId: string, variantId?: string): string =>
  variantId ? `${productId}:${variantId}` : productId;

export const keyOfLine = (item: Pick<CartItem, 'product' | 'variantId'>): string => lineKey(item.product.id, item.variantId);

/** A saved variant id if the product still has it, otherwise its first variant. */
export const normalizeVariantId = (product: Product, variantId?: string): string | undefined =>
  variantOf(product, variantId)?.id;

/** The size a line is sold in. Weight and volume replace the unit; a color or bouquet size adds to it. */
export const unitLabel = (product: Product, variantId: string | undefined, language: Language): string => {
  const unit = product.units?.[language] || product.unit;
  const variant = variantOf(product, variantId);
  if (!variant || !hasVariantChoice(product)) return unit;
  if (product.variantKind === 'weight' || product.variantKind === 'volume') return variant.labels[language];
  return `${unit} · ${variant.labels[language]}`;
};
