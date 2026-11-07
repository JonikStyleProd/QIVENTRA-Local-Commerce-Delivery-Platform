import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const SPLASH_TIME_MS = 2100;
const SEEN_KEY = 'qiventra_splash_seen';

/** Installed app, once per launch. "?splash=1" shows it in a browser tab for review. */
const shouldShowSplash = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;

  const isRequested = new URLSearchParams(window.location.search).get('splash') === '1';
  const isInstalled =
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  if (isRequested) return true;
  if (!isInstalled) return false;

  try {
    if (sessionStorage.getItem(SEEN_KEY)) return false;
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Without storage the splash simply shows again; it never blocks anything.
  }
  return true;
};

/**
 * Yellow launch screen: the logo sticker sticks on, then everything fades out in about 2 seconds.
 * It never delays the app: the page renders underneath and pointer events pass through.
 */
export const PwaSplash: React.FC = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(shouldShowSplash);

  useEffect(() => {
    if (!isVisible) return;
    const timer = window.setTimeout(() => setIsVisible(false), SPLASH_TIME_MS);
    return () => window.clearTimeout(timer);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      aria-hidden="true"
      className="splash-screen fixed inset-0 z-[100] grid place-items-center bg-accent pointer-events-none"
    >
      <div className="text-center">
        <div className="splash-sticker inline-block px-[22px] py-5 bg-white border-[3px] border-ink rounded-[28px] shadow-hard-6">
          <img src="/brand/mark.png" alt="" width={72} height={66} className="block w-[72px] h-[66px]" />
        </div>
        <p className="hand anim-in mt-5 text-[34px]" style={{ animationDelay: '0.7s' }}>
          {t.collage.landing.hello}
        </p>
      </div>
    </div>
  );
};
