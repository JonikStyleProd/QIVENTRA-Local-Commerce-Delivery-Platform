import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { resolveRepeatOrder } from '../data/cartRules';
import { MOCK_PRODUCTS } from '../data/mockData';
import { Order } from '../types';

/** Puts a past order back in the basket and says what could not be repeated. */
export const useRepeatOrder = () => {
  const { addToCart, navigateTo } = useApp();
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const copy = t.screens.orders;

  return useCallback(
    (order: Order) => {
      const { available, unavailable } = resolveRepeatOrder(order.items, MOCK_PRODUCTS);
      const missingNames = unavailable.map((item) => item.names?.[language] || item.name).join(', ');

      if (available.length === 0) {
        showToast({ type: 'error', title: copy.repeatNoneTitle, message: missingNames });
        return;
      }

      available.forEach(({ product, quantity, variantId }) => addToCart(product, quantity, variantId));
      showToast(
        unavailable.length > 0
          ? { type: 'warning', title: t.orders.repeatOrderToastTitle, message: `${copy.repeatMissing}: ${missingNames}` }
          : { type: 'success', title: t.orders.repeatOrderToastTitle, message: `${t.orders.repeatOrderToastMsg} #${order.orderNumber}` }
      );
      navigateTo('cart');
    },
    [addToCart, copy, language, navigateTo, showToast, t]
  );
};
