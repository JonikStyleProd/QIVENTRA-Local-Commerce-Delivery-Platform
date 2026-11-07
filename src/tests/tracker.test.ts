import { describe, expect, it } from 'vitest';
import { pointAlong, projectRoute } from '../components/collage/RouteMap';
import { MOCK_ACTIVE_ORDER } from '../data/mockData';
import { ORDER_FLOW, advanceOrder, isOrderActive, nextStatus, routeProgress, trackerStep } from '../data/orderTracker';
import { Order } from '../types';

const fresh = (): Order => ({ ...MOCK_ACTIVE_ORDER, status: 'received', etaMinutes: 40, etaTotalMinutes: 40 });

const walk = (order: Order, steps: number): Order[] => {
  const seen = [order];
  for (let index = 0; index < steps; index += 1) seen.push(advanceOrder(seen[seen.length - 1]));
  return seen;
};

describe('order tracker', () => {
  it('goes through the flow in order', () => {
    expect(walk(fresh(), 4).map((order) => order.status)).toEqual(ORDER_FLOW);
  });

  it('stops at "delivered", however many times it is pushed', () => {
    const delivered = walk(fresh(), 4)[4];
    expect(nextStatus('delivered')).toBeNull();
    expect(advanceOrder(delivered)).toBe(delivered);
    expect(walk(fresh(), 20).at(-1)?.status).toBe('delivered');
  });

  it('only ever shrinks the estimate, and reaches zero at the door', () => {
    const estimates = walk(fresh(), 4).map((order) => order.etaMinutes);
    expect(estimates).toEqual([40, 30, 20, 10, 0]);
  });

  it('works out the total for an order that started midway', () => {
    const midway: Order = { ...MOCK_ACTIVE_ORDER, status: 'on_the_way', etaMinutes: 14, etaTotalMinutes: undefined };
    const delivered = advanceOrder(midway);
    expect(delivered.status).toBe('delivered');
    expect(delivered.etaMinutes).toBe(0);
  });

  it('moves a delivered order out of the active list', () => {
    expect(isOrderActive(fresh())).toBe(true);
    expect(isOrderActive(walk(fresh(), 4)[4])).toBe(false);
  });

  it('shows "courier assigned" and "on the way" as one step', () => {
    expect(ORDER_FLOW.map(trackerStep)).toEqual([0, 1, 2, 2, 3]);
  });

  it('moves the courier along the route with the status', () => {
    expect(routeProgress('preparing')).toBe(0);
    expect(routeProgress('on_the_way')).toBeGreaterThan(0);
    expect(routeProgress('delivered')).toBe(1);
  });
});

describe('route diagram', () => {
  const shop = { lat: 32.0686, lng: 34.7686 };
  const door = { lat: 32.0812, lng: 34.7739 };

  it('fits the points inside the drawing, north up', () => {
    const project = projectRoute([shop, door], 360, 220, 34);
    const [a, b] = [project(shop), project(door)];
    [a, b].forEach((point) => {
      expect(point.x).toBeGreaterThanOrEqual(0);
      expect(point.x).toBeLessThanOrEqual(360);
      expect(point.y).toBeGreaterThanOrEqual(0);
      expect(point.y).toBeLessThanOrEqual(220);
    });
    expect(b.y).toBeLessThan(a.y);
  });

  it('copes with a route of one point', () => {
    const { x, y } = projectRoute([shop], 360, 220, 34)(shop);
    expect(x).toBe(180);
    expect(y).toBe(110);
  });

  it('places the courier along the line', () => {
    const line = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
    ];
    expect(pointAlong(line, 0)).toEqual({ x: 0, y: 0 });
    expect(pointAlong(line, 0.5)).toEqual({ x: 10, y: 0 });
    expect(pointAlong(line, 1)).toEqual({ x: 10, y: 10 });
  });
});
