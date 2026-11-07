import type { Language } from './translations';

export const LANGUAGE_KEY = 'qiventra_language';

const isLanguage = (value: unknown): value is Language => value === 'ru' || value === 'en' || value === 'he';

/**
 * The saved choice wins; then the browser's languages in their order; then English.
 * index.html runs the same rule before the first paint, so the page never flips.
 */
export const pickLanguage = (saved: unknown, browserLanguages: readonly string[]): Language => {
  if (isLanguage(saved)) return saved;
  for (const tag of browserLanguages) {
    const code = tag.toLowerCase().split('-')[0];
    // "iw" is the old code for Hebrew, still sent by some systems.
    if (code === 'iw') return 'he';
    if (isLanguage(code)) return code;
  }
  return 'en';
};

export const detectLanguage = (): Language => {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(LANGUAGE_KEY);
  } catch {
    // Without storage the browser's language decides.
  }
  const browser = typeof navigator === 'undefined' ? [] : navigator.languages?.length ? navigator.languages : [navigator.language];
  return pickLanguage(saved, browser);
};
