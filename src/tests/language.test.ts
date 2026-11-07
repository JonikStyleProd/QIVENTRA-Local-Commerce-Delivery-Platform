import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';
import { demoTranslations } from '../i18n/demo';
import { pickLanguage } from '../i18n/detectLanguage';
import { formatCount, formatKm, formatMinutesAgo, formatMinutesIn, formatMinutesRange, formatPromotionDate, formatShekels } from '../i18n/format';
import { translations } from '../i18n/translations';
import { MOCK_ACTIVE_ORDER, MOCK_CATEGORIES, MOCK_PAST_ORDERS, MOCK_PRODUCTS, MOCK_STORES } from '../data/mockData';

describe('default language', () => {
  it('keeps the saved choice over the browser', () => {
    expect(pickLanguage('ru', ['he-IL', 'en'])).toBe('ru');
  });

  it('follows the browser in its order of preference', () => {
    expect(pickLanguage(null, ['he-IL', 'en'])).toBe('he');
    expect(pickLanguage(null, ['fr-FR', 'ru-RU', 'en'])).toBe('ru');
    expect(pickLanguage(null, ['en-GB'])).toBe('en');
    expect(pickLanguage(null, ['iw-IL'])).toBe('he');
  });

  it('falls back to English, and ignores a broken saved value', () => {
    expect(pickLanguage(null, ['fr-FR', 'de'])).toBe('en');
    expect(pickLanguage(null, [])).toBe('en');
    expect(pickLanguage('klingon', ['ru'])).toBe('ru');
  });
});

describe('the script in index.html', () => {
  const html = fs.readFileSync(path.resolve('index.html'), 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? '';

  const run = (saved: Record<string, string>, languages: string[]) => {
    const classes = new Set<string>();
    const root = {
      lang: 'en',
      dir: 'ltr',
      classList: { add: (name: string) => classes.add(name) },
    };
    vm.runInNewContext(script, {
      document: { documentElement: root },
      localStorage: { getItem: (key: string) => saved[key] ?? null },
      navigator: { languages, language: languages[0] },
      matchMedia: () => ({ matches: false }),
      String,
    });
    return { lang: root.lang, dir: root.dir, classes };
  };

  it('agrees with pickLanguage in every case', () => {
    const cases: [Record<string, string>, string[]][] = [
      [{}, ['he-IL']],
      [{}, ['ru']],
      [{}, ['fr', 'de']],
      [{}, ['iw']],
      [{ qiventra_language: 'en' }, ['he']],
      [{ qiventra_language: 'he' }, ['ru']],
      [{ qiventra_language: 'zz' }, ['ru']],
    ];
    cases.forEach(([saved, languages]) => {
      expect(run(saved, languages).lang).toBe(pickLanguage(saved.qiventra_language ?? null, languages));
    });
  });

  it('sets direction and theme before anything renders', () => {
    expect(run({}, ['he'])).toMatchObject({ lang: 'he', dir: 'rtl' });
    expect(run({}, ['he']).classes.has('rtl')).toBe(true);
    expect(run({}, ['ru'])).toMatchObject({ lang: 'ru', dir: 'ltr' });
    expect(run({ 'qiventra-theme': 'dark' }, ['en']).classes.has('dark')).toBe(true);
  });
});

describe('copy', () => {
  const shape = (value: unknown): unknown =>
    value && typeof value === 'object' && !Array.isArray(value)
      ? Object.fromEntries(Object.entries(value as object).map(([key, entry]) => [key, shape(entry)]).sort())
      : Array.isArray(value)
      ? value.length
      : typeof value;

  // Hebrew has its own plural forms, so these are compared separately.
  const withoutCounts = ({ counts: _counts, ...rest }: typeof demoTranslations.ru) => rest;
  const withoutDemo = ({ demo: _demo, ...rest }: (typeof translations)['ru']) => rest;

  it('has the same keys in all three languages', () => {
    expect(shape(withoutCounts(demoTranslations.en))).toEqual(shape(withoutCounts(demoTranslations.ru)));
    expect(shape(withoutCounts(demoTranslations.he))).toEqual(shape(withoutCounts(demoTranslations.ru)));
    expect(shape(withoutDemo(translations.en))).toEqual(shape(withoutDemo(translations.ru)));
    expect(shape(withoutDemo(translations.he))).toEqual(shape(withoutDemo(translations.ru)));
  });

  it('leaves no Cyrillic in the English and Hebrew copy', () => {
    const cyrillic = /[А-Яа-яЁё]/;
    const strings = (value: unknown): string[] =>
      typeof value === 'string' ? [value] : value && typeof value === 'object' ? Object.values(value).flatMap(strings) : [];
    (['en', 'he'] as const).forEach((language) => {
      const leaks = strings(translations[language]).filter((text) => cyrillic.test(text));
      expect(leaks, language).toEqual([]);
    });
  });

  it('keeps the demo notice everywhere', () => {
    expect(translations.ru.collage.common.demo).toMatch(/демо/i);
    expect(translations.en.collage.common.demo).toMatch(/demo/i);
    expect(translations.he.collage.common.demo).toMatch(/הדגמ/);
  });
});

describe('catalog data', () => {
  const cyrillic = /[А-Яа-яЁё]/;
  const checkLocalized = (name: string, text?: { ru?: string; en?: string; he?: string }) => {
    expect(text?.ru, `${name} ru`).toBeTruthy();
    expect(text?.en, `${name} en`).toBeTruthy();
    expect(text?.he, `${name} he`).toBeTruthy();
    expect(cyrillic.test(text?.en ?? ''), `${name} en has Cyrillic`).toBe(false);
    expect(cyrillic.test(text?.he ?? ''), `${name} he has Cyrillic`).toBe(false);
  };

  it('has shops, products, categories and orders in all three languages', () => {
    MOCK_STORES.forEach((store) => {
      checkLocalized(`${store.id} name`, store.names);
      checkLocalized(`${store.id} category`, store.categories);
      checkLocalized(`${store.id} address`, store.addresses);
    });
    MOCK_PRODUCTS.forEach((product) => {
      checkLocalized(`${product.id} name`, product.names);
      checkLocalized(`${product.id} description`, product.descriptions);
      checkLocalized(`${product.id} unit`, product.units);
      checkLocalized(`${product.id} store`, product.storeNames);
      if (product.origin) checkLocalized(`${product.id} origin`, product.origins);
    });
    MOCK_CATEGORIES.forEach((category) => {
      checkLocalized(`${category.id} name`, category.names);
      checkLocalized(`${category.id} description`, category.descriptions);
    });
    [MOCK_ACTIVE_ORDER, ...MOCK_PAST_ORDERS].forEach((order) => {
      checkLocalized(`${order.id} store`, order.storeNames);
      checkLocalized(`${order.id} address`, order.addresses);
      checkLocalized(`${order.id} date`, order.createdAts);
      order.items.forEach((item) => checkLocalized(`${order.id} ${item.productId}`, item.names));
    });
  });
});

describe('formats through Intl', () => {
  it('formats shekels', () => {
    expect(formatShekels(1200, 'ru')).toContain('₪');
    expect(formatShekels(49.5, 'en')).toContain('49.50');
    expect(formatShekels(20, 'he')).toContain('₪');
  });

  it('formats minutes and distance per language', () => {
    expect(formatMinutesIn(25, 'ru')).toBe('25 мин');
    expect(formatMinutesIn(25, 'he')).toContain('דק');
    expect(formatKm(1.25, 'ru')).toMatch(/^1,[23] км$/);
    expect(formatKm(1.25, 'en')).toMatch(/^1\.[23] km$/);
    expect(formatKm(1.25, 'he')).toContain('ק״מ');
  });

  it('isolates a time range for right-to-left text', () => {
    const range = formatMinutesRange(15, 25, 'he');
    expect(range).toContain('⁦15–25⁩');
    expect(range).toContain('דק');
  });

  it('says how long ago in the language\'s own grammar', () => {
    expect(formatMinutesAgo(5, 'en')).toContain('5');
    expect(formatMinutesAgo(5, 'ru')).toContain('назад');
  });

  it('formats a calendar date without shifting it', () => {
    expect(formatPromotionDate('2026-03-01', 'en')).toContain('1');
  });

  it('declines through Intl.PluralRules', () => {
    const shops = demoTranslations.ru.counts.shops;
    expect(formatCount(1, shops, 'ru')).toBe('1 лавка');
    expect(formatCount(3, shops, 'ru')).toBe('3 лавки');
    expect(formatCount(5, shops, 'ru')).toBe('5 лавок');
    expect(formatCount(21, shops, 'ru')).toBe('21 лавка');
    expect(formatCount(1, demoTranslations.en.counts.shops, 'en')).toBe('1 shop');
    expect(formatCount(2, demoTranslations.en.counts.shops, 'en')).toBe('2 shops');
    expect(formatCount(2, demoTranslations.he.counts.shops, 'he')).toBe('שתי חנויות');
    expect(formatCount(6, demoTranslations.he.counts.shops, 'he')).toBe('6 חנויות');
  });
});
