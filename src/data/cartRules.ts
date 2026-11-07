import { CartItem, Store } from '../types';
import { MOCK_STORES } from './mockData';

/** One shop's part of the current order: what it gets, its fee and how far it is from its minimum. */
export interface OrderStoreLine {
  store: Store;
  subtotal: number;
  fee: number;
  /** ₪ still missing to reach the shop's minimum order; 0 when the minimum is met. */
  shortfall: number;
}

/**
 * Shops in the order: every shop with goods in the basket, plus the shop the customer explicitly
 * picked in the shop picker. A picked shop with no goods yet counts, so its fee and minimum match
 * its card. An empty basket has no order, so nothing is charged.
 */
export const summarizeOrderStores = (cart: CartItem[], pickedStoreId: string | null): OrderStoreLine[] => {
  if (cart.length === 0) return [];

  const ids = Array.from(new Set(cart.map((line) => line.product.storeId)));
  if (pickedStoreId && !ids.includes(pickedStoreId)) ids.push(pickedStoreId);

  return ids.flatMap((id) => {
    const store = MOCK_STORES.find((s) => s.id === id);
    if (!store) return [];
    const subtotal = cart
      .filter((line) => line.product.storeId === id)
      .reduce((sum, line) => sum + line.product.price * line.quantity, 0);
    return [{ store, subtotal, fee: store.deliveryFee, shortfall: Math.max(0, store.minOrder - subtotal) }];
  });
};

/** Each shop delivers its own goods, so a basket from several shops pays each shop's own fee. */
export const orderDeliveryFee = (lines: OrderStoreLine[]): number =>
  lines.reduce((sum, line) => sum + line.fee, 0);
