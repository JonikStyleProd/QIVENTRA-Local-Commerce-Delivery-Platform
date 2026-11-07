import { describe, expect, it } from 'vitest';
import {
  DEFAULT_ADDRESS_ID,
  DEMO_ADDRESSES,
  addressById,
  distanceKm,
  sortByDistance,
  storeDelivery,
  suggestAddresses,
} from '../data/addresses';
import { MOCK_STORES, MOCK_USER } from '../data/mockData';

const at = (id: string) => addressById(id)!.coords;
const store = (id: string) => MOCK_STORES.find((candidate) => candidate.id === id)!;

describe('demo addresses', () => {
  it('has at least 15 addresses in different districts, in all languages', () => {
    expect(DEMO_ADDRESSES.length).toBeGreaterThanOrEqual(15);
    expect(new Set(DEMO_ADDRESSES.map((address) => address.district.en)).size).toBeGreaterThanOrEqual(10);
    expect(new Set(DEMO_ADDRESSES.map((address) => address.id)).size).toBe(DEMO_ADDRESSES.length);
    DEMO_ADDRESSES.forEach((address) => {
      expect(address.label.ru && address.label.en && address.label.he, address.id).toBeTruthy();
      expect(address.coords.lat).toBeGreaterThan(31.9);
      expect(address.coords.lat).toBeLessThan(32.3);
      expect(address.coords.lng).toBeGreaterThan(34.7);
      expect(address.coords.lng).toBeLessThan(34.9);
    });
  });

  it('links every saved address to the list', () => {
    MOCK_USER.savedAddresses.forEach((saved) => expect(addressById(saved.demoAddressId), saved.id).toBeDefined());
    expect(addressById(DEFAULT_ADDRESS_ID)).toBeDefined();
  });

  it('suggests from what was typed, in any language', () => {
    ['дизенгоф', 'Dizengoff', 'דיזנגוף'].forEach((query) => {
      expect(suggestAddresses(query).map((address) => address.id), query).toContain('dizengoff-142');
    });
    expect(suggestAddresses('Яффо').map((address) => address.id)).toContain('yefet-40');
    expect(suggestAddresses('')).toHaveLength(DEMO_ADDRESSES.length);
    expect(suggestAddresses('Марс, ул. Ленина')).toHaveLength(0);
  });
});

describe('distance and reach', () => {
  it('measures real distance', () => {
    expect(distanceKm(at('rothschild-42'), at('rothschild-42'))).toBe(0);
    // Tel Aviv center to Herzliya Pituach is about 11 km.
    const far = distanceKm(at('rothschild-42'), at('herzliya-manofim-8'));
    expect(far).toBeGreaterThan(10);
    expect(far).toBeLessThan(13);
  });

  it('gives every shop coordinates and a radius', () => {
    MOCK_STORES.forEach((candidate) => {
      expect(candidate.deliveryRadiusKm, candidate.id).toBeGreaterThan(0);
      expect(candidate.coords.lat, candidate.id).toBeGreaterThan(32);
    });
  });

  it('reaches every shop from the default address, so the first visit is not empty', () => {
    MOCK_STORES.forEach((candidate) => {
      expect(storeDelivery(candidate, at(DEFAULT_ADDRESS_ID)).inRange, candidate.id).toBe(true);
    });
  });

  it('marks a shop out of range by its own radius', () => {
    const jaffa = store('store-4');
    expect(storeDelivery(jaffa, at('yefet-40')).inRange).toBe(true);
    expect(storeDelivery(jaffa, at('dizengoff-142')).inRange).toBe(false);
    MOCK_STORES.forEach((candidate) => {
      expect(storeDelivery(candidate, at('herzliya-manofim-8')).inRange, candidate.id).toBe(false);
    });
  });

  it('has addresses reaching some shops but not all', () => {
    const counts = DEMO_ADDRESSES.map(
      (address) => MOCK_STORES.filter((candidate) => storeDelivery(candidate, address.coords).inRange).length
    );
    expect(counts.some((count) => count > 0 && count < MOCK_STORES.length)).toBe(true);
  });

  it('takes longer the farther it is', () => {
    const sarona = store('store-2');
    const near = storeDelivery(sarona, at('kaplan-12'));
    const far = storeDelivery(sarona, at('einstein-40'));
    expect(far.km).toBeGreaterThan(near.km);
    expect(far.timeMin).toBeGreaterThan(near.timeMin);
    expect(far.timeMax).toBeGreaterThan(far.timeMin);
  });

  it('changes with the address, not with any figure in the data', () => {
    const levinsky = store('store-3');
    expect(storeDelivery(levinsky, at('florentin-12')).km).not.toBe(storeDelivery(levinsky, at('allenby-60')).km);
    expect(levinsky).not.toHaveProperty('distanceKm');
  });

  it('sorts closest first, with shops out of range last', () => {
    const point = at('yefet-40');
    const sorted = sortByDistance(MOCK_STORES, point);
    expect(sorted[0].id).toBe('store-4');
    const reach = sorted.map((candidate) => storeDelivery(candidate, point).inRange);
    expect(reach.lastIndexOf(true)).toBeLessThan(reach.indexOf(false) === -1 ? Infinity : reach.indexOf(false));
  });
});
