import type { Language } from './translations';

export const LOCALES: Record<Language, string> = { ru: 'ru-RU', en: 'en-IL', he: 'he-IL' };

const whole = new Map<Language, Intl.NumberFormat>();
const withAgorot = new Map<Language, Intl.NumberFormat>();

const formatter = (cache: Map<Language, Intl.NumberFormat>, language: Language, digits: number) => {
  let format = cache.get(language);
  if (!format) {
    format = new Intl.NumberFormat(LOCALES[language], {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
    cache.set(language, format);
  }
  return format;
};

/** Shekels in the language's own format and order. Agorot show only when there are some. */
export const formatShekels = (amount: number, language: Language): string =>
  Number.isInteger(amount)
    ? formatter(whole, language, 0).format(amount)
    : formatter(withAgorot, language, 2).format(amount);

const dateFormats = new Map<Language, Intl.DateTimeFormat>();

/** A YYYY-MM-DD date as day and month. It is a calendar date, so no time zone may shift it. */
export const formatPromotionDate = (date: string, language: Language): string => {
  let format = dateFormats.get(language);
  if (!format) {
    format = new Intl.DateTimeFormat(LOCALES[language], { day: 'numeric', month: 'short', timeZone: 'UTC' });
    dateFormats.set(language, format);
  }
  return format.format(new Date(`${date}T00:00:00Z`));
};

const unitFormat = (language: Language, unit: string, maximumFractionDigits = 0) =>
  new Intl.NumberFormat(LOCALES[language], { style: 'unit', unit, unitDisplay: 'short', maximumFractionDigits });

/** "25 мин", "25 min", in the language's own format. */
export const formatMinutesIn = (minutes: number, language: Language): string =>
  unitFormat(language, 'minute').format(minutes);

/** Distance with one decimal: "1,2 км", "1.2 km". */
export const formatKm = (km: number, language: Language): string =>
  unitFormat(language, 'kilometer', 1).format(Math.round(km * 10) / 10);

/** "15–25 мин": the digits are isolated so RTL text does not reverse the range to "25–15". */
export const formatMinutesRange = (min: number, max: number, language: Language): string => {
  const unit =
    unitFormat(language, 'minute')
      .formatToParts(max)
      .find((part) => part.type === 'unit')?.value ?? '';
  return `⁦${min}–${max}⁩ ${unit}`;
};

/** "5 мин. назад", "5 min. ago", in the language's own grammar. */
export const formatMinutesAgo = (minutes: number, language: Language): string =>
  new Intl.RelativeTimeFormat(LOCALES[language], { style: 'short' }).format(-minutes, 'minute');

export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

const pluralRules = new Map<Language, Intl.PluralRules>();

/** Picks the grammatical form for a count through Intl.PluralRules and fills in {n}. */
export const formatCount = (count: number, forms: PluralForms, language: Language): string => {
  let rules = pluralRules.get(language);
  if (!rules) {
    rules = new Intl.PluralRules(LOCALES[language]);
    pluralRules.set(language, rules);
  }
  const form = forms[rules.select(count)] ?? forms.other;
  return form.replace('{n}', new Intl.NumberFormat(LOCALES[language]).format(count));
};
