/** Hourly delivery windows, built from the current time. Hours are the shops' local (device) time. */

export type DayKey = 'today' | 'tomorrow' | 'dayAfter';

/** A chosen window. `startsAt` is an ISO timestamp, so a saved order still reads correctly later. */
export type DeliveryWindow = { kind: 'asap' } | { kind: 'slot'; startsAt: string };

export interface SlotDay {
  key: DayKey;
  /** ISO start of each one-hour window, earliest first. */
  windows: string[];
}

/** Windows from 8–9 to 21–22, the range of the design's slots. */
export const FIRST_WINDOW_HOUR = 8;
export const LAST_WINDOW_HOUR = 21;

const DAY_KEYS: DayKey[] = ['today', 'tomorrow', 'dayAfter'];

/**
 * Today, tomorrow and the day after, without past hours. A window that has already begun counts as
 * past, and a day with no windows left is omitted.
 */
export const buildSlotDays = (now: Date): SlotDay[] =>
  DAY_KEYS.flatMap((key, offset) => {
    const firstHour = offset === 0 ? Math.max(FIRST_WINDOW_HOUR, now.getHours() + 1) : FIRST_WINDOW_HOUR;
    const windows: string[] = [];
    for (let hour = firstHour; hour <= LAST_WINDOW_HOUR; hour += 1) {
      windows.push(new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, hour).toISOString());
    }
    return windows.length ? [{ key, windows }] : [];
  });

export const partOfDay = (hour: number): 'morning' | 'midday' | 'evening' => {
  if (hour < 12) return 'morning';
  return hour < 17 ? 'midday' : 'evening';
};

/** "18–19". The range is isolated so RTL text does not reverse it. */
export const formatWindowHours = (startsAt: string): string => {
  const hour = new Date(startsAt).getHours();
  return `⁦${hour}–${hour + 1}⁩`;
};

interface WindowStrings {
  asap: string;
  days: Record<DayKey, string>;
}

/** "сегодня 18–19" while the day is near, the calendar date once it is further away or has passed. */
export const formatWindow = (window: DeliveryWindow, strings: WindowStrings, locale: string, now: Date): string => {
  if (window.kind === 'asap') return strings.asap;

  const start = new Date(window.startsAt);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const offset = Math.round((startDay - today) / 86_400_000);
  const day =
    offset >= 0 && offset < DAY_KEYS.length
      ? strings.days[DAY_KEYS[offset]]
      : start.toLocaleDateString(locale, { day: 'numeric', month: 'short' });

  return `${day} ${formatWindowHours(window.startsAt)}`;
};
