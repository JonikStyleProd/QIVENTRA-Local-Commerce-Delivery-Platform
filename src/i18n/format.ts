import { Language } from './translations';

const LOCALES: Record<Language, string> = { ru: 'ru-RU', en: 'en-IL', he: 'he-IL' };

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
