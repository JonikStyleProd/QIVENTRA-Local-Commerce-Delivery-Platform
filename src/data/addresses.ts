import { LocalizedText, Store } from '../types';
import { normalizeQuery } from './search';

export interface GeoPoint {
  lat: number;
  lng: number;
}

/** A street from the fixed demo list. There is no geocoder, so only these can be delivered to. */
export interface DemoAddress {
  id: string;
  label: LocalizedText;
  district: LocalizedText;
  coords: GeoPoint;
}

const place = (
  id: string,
  ru: string,
  en: string,
  he: string,
  district: [string, string, string],
  lat: number,
  lng: number
): DemoAddress => ({
  id,
  label: { ru, en, he },
  district: { ru: district[0], en: district[1], he: district[2] },
  coords: { lat, lng },
});

const LEV_HAIR: [string, string, string] = ['Лев а-Ир', 'Lev HaIr', 'לב העיר'];

export const DEMO_ADDRESSES: DemoAddress[] = [
  place('rothschild-42', 'Тель-Авив, бул. Ротшильд, 42, кв. 14', 'Tel Aviv, 42 Rothschild Blvd, Apt 14', 'תל אביב, שדרות רוטשילד 42, דירה 14', LEV_HAIR, 32.0636, 34.7736),
  place('herzliya-manofim-8', 'Герцлия Питуах, ул. Ха-Манофим, 8', 'Herzliya Pituach, 8 HaManofim St', 'הרצליה פיתוח, רחוב המנופים 8', ['Герцлия Питуах', 'Herzliya Pituach', 'הרצליה פיתוח'], 32.1625, 34.802),
  place('dizengoff-142', 'Тель-Авив, ул. Дизенгоф, 142', 'Tel Aviv, 142 Dizengoff St', 'תל אביב, רחוב דיזנגוף 142', ['Центр', 'City Center', 'מרכז העיר'], 32.0812, 34.7739),
  place('ibn-gabirol-90', 'Тель-Авив, ул. Ибн Гвироль, 90', 'Tel Aviv, 90 Ibn Gabirol St', 'תל אביב, רחוב אבן גבירול 90', ['Кикар Рабин', 'Rabin Square', 'כיכר רבין'], 32.0806, 34.7813),
  place('ben-yehuda-120', 'Тель-Авив, ул. Бен Иегуда, 120', 'Tel Aviv, 120 Ben Yehuda St', 'תל אביב, רחוב בן יהודה 120', ['Старый Север', 'Old North', 'הצפון הישן'], 32.0838, 34.7697),
  place('hayarkon-200', 'Тель-Авив, ул. Ха-Яркон, 200', 'Tel Aviv, 200 HaYarkon St', 'תל אביב, רחוב הירקון 200', ['Набережная', 'Seafront', 'טיילת'], 32.0862, 34.7705),
  place('allenby-60', 'Тель-Авив, ул. Алленби, 60', 'Tel Aviv, 60 Allenby St', 'תל אביב, רחוב אלנבי 60', ['Кармель', 'Carmel', 'הכרמל'], 32.0668, 34.7711),
  place('sheinkin-30', 'Тель-Авив, ул. Шейнкин, 30', 'Tel Aviv, 30 Sheinkin St', 'תל אביב, רחוב שינקין 30', LEV_HAIR, 32.0689, 34.7743),
  place('florentin-12', 'Тель-Авив, ул. Флорентин, 12', 'Tel Aviv, 12 Florentin St', 'תל אביב, רחוב פלורנטין 12', ['Флорентин', 'Florentin', 'פלורנטין'], 32.0572, 34.7692),
  place('shabazi-20', 'Тель-Авив, ул. Шабази, 20', 'Tel Aviv, 20 Shabazi St', 'תל אביב, רחוב שבזי 20', ['Неве-Цедек', 'Neve Tzedek', 'נווה צדק'], 32.061, 34.7658),
  place('yefet-40', 'Яффо, ул. Ефет, 40', 'Jaffa, 40 Yefet St', 'יפו, רחוב יפת 40', ['Яффо', 'Jaffa', 'יפו'], 32.0508, 34.753),
  place('kaplan-12', 'Тель-Авив, ул. Каплан, 12', 'Tel Aviv, 12 Kaplan St', 'תל אביב, רחוב קפלן 12', ['Сарона', 'Sarona', 'שרונה'], 32.073, 34.785),
  place('yehuda-maccabi-50', 'Тель-Авив, ул. Иегуда Маккаби, 50', 'Tel Aviv, 50 Yehuda HaMaccabi St', 'תל אביב, רחוב יהודה המכבי 50', ['Новый Север', 'New North', 'הצפון החדש'], 32.095, 34.789),
  place('einstein-40', 'Тель-Авив, ул. Эйнштейн, 40', 'Tel Aviv, 40 Einstein St', 'תל אביב, רחוב איינשטיין 40', ['Рамат-Авив', 'Ramat Aviv', 'רמת אביב'], 32.1135, 34.801),
  place('hamasger-20', 'Тель-Авив, ул. Ха-Масгер, 20', 'Tel Aviv, 20 HaMasger St', 'תל אביב, רחוב המסגר 20', ['Яд-Элияху', 'Yad Eliyahu', 'יד אליהו'], 32.0625, 34.7935),
  place('etzel-50', 'Тель-Авив, ул. Эцель, 50', 'Tel Aviv, 50 Etzel St', 'תל אביב, רחוב אצ״ל 50', ['Ха-Тиква', 'HaTikva', 'התקווה'], 32.0525, 34.796),
  place('habarzel-24', 'Тель-Авив, ул. Ха-Барзель, 24', 'Tel Aviv, 24 HaBarzel St', 'תל אביב, רחוב הברזל 24', ['Рамат-а-Хаяль', 'Ramat HaHayal', 'רמת החייל'], 32.1095, 34.839),
  place('balfour-40', 'Бат-Ям, ул. Бальфур, 40', 'Bat Yam, 40 Balfour St', 'בת ים, רחוב בלפור 40', ['Бат-Ям', 'Bat Yam', 'בת ים'], 32.019, 34.75),
];

export const DEFAULT_ADDRESS_ID = 'rothschild-42';

export const addressById = (id: string | null | undefined): DemoAddress | undefined =>
  DEMO_ADDRESSES.find((address) => address.id === id);

/** Addresses matching what was typed, in any of the three languages. Nothing typed lists them all. */
export const suggestAddresses = (rawQuery: string): DemoAddress[] => {
  const query = normalizeQuery(rawQuery);
  if (!query) return DEMO_ADDRESSES;
  return DEMO_ADDRESSES.filter((address) =>
    [...Object.values(address.label), ...Object.values(address.district)].some((text) => normalizeQuery(text).includes(query))
  );
};

const EARTH_RADIUS_KM = 6371;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** Straight-line distance between two points, in km. */
export const distanceKm = (a: GeoPoint, b: GeoPoint): number => {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
};

/** Minutes a courier needs per km; a shop's own times in the data are for packing and handing over. */
const MINUTES_PER_KM = 3;
const roundToFive = (minutes: number) => Math.round(minutes / 5) * 5;

export interface StoreDelivery {
  km: number;
  inRange: boolean;
  timeMin: number;
  timeMax: number;
}

/** What delivery from this shop to this point looks like. */
export const storeDelivery = (store: Pick<Store, 'coords' | 'deliveryRadiusKm' | 'deliveryTimeMin' | 'deliveryTimeMax'>, point: GeoPoint): StoreDelivery => {
  const km = distanceKm(store.coords, point);
  const ride = km * MINUTES_PER_KM;
  return {
    km,
    inRange: km <= store.deliveryRadiusKm,
    timeMin: roundToFive(store.deliveryTimeMin + ride),
    timeMax: roundToFive(store.deliveryTimeMax + ride),
  };
};

/** Closest first, with the shops that cannot deliver here after all the ones that can. */
export const sortByDistance = <T extends Store>(stores: T[], point: GeoPoint): T[] =>
  [...stores].sort((a, b) => {
    const [first, second] = [storeDelivery(a, point), storeDelivery(b, point)];
    return Number(second.inRange) - Number(first.inRange) || first.km - second.km;
  });
