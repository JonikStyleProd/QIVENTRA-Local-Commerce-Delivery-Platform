import { Order, OrderStatus } from '../types';

/** The order's life, in order. "delivered" is the end: nothing follows it. */
export const ORDER_FLOW: OrderStatus[] = ['received', 'preparing', 'courier_assigned', 'on_the_way', 'delivered'];

/** What is left of the promised time at each status. */
const ETA_SHARE: Record<OrderStatus, number> = {
  received: 1,
  preparing: 0.75,
  courier_assigned: 0.5,
  on_the_way: 0.25,
  delivered: 0,
};

export const nextStatus = (status: OrderStatus): OrderStatus | null => {
  const index = ORDER_FLOW.indexOf(status);
  return index === -1 || index === ORDER_FLOW.length - 1 ? null : ORDER_FLOW[index + 1];
};

export const isOrderActive = (order: Pick<Order, 'status'>): boolean => order.status !== 'delivered';

/** The whole promised time. Orders without it treat their current estimate as what is left at this status. */
const totalMinutes = (order: Order): number =>
  order.etaTotalMinutes ?? (ETA_SHARE[order.status] > 0 ? Math.round(order.etaMinutes / ETA_SHARE[order.status]) : order.etaMinutes);

/**
 * One step along the flow. The estimate only shrinks, reaches zero at the door, and a delivered
 * order stays as it is, however many times this is called.
 */
export const advanceOrder = (order: Order): Order => {
  const status = nextStatus(order.status);
  if (!status) return order;
  const total = totalMinutes(order);
  return {
    ...order,
    status,
    etaTotalMinutes: total,
    etaMinutes: status === 'delivered' ? 0 : Math.max(1, Math.round(total * ETA_SHARE[status])),
  };
};

const TRACKER_STEPS: OrderStatus[] = ['received', 'preparing', 'on_the_way', 'delivered'];

/** The tracker has four steps; "courier assigned" and "on the way" are the same step to the buyer. */
export const trackerStep = (status: OrderStatus): number =>
  status === 'courier_assigned' ? 2 : Math.max(0, TRACKER_STEPS.indexOf(status));

/** How far along the route the courier is, from 0 at the shop to 1 at the door. */
export const routeProgress = (status: OrderStatus): number => {
  if (status === 'delivered') return 1;
  return status === 'on_the_way' ? 0.5 : 0;
};
