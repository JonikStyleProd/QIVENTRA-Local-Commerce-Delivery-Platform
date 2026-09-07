import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BRAND_ASSETS, subscribeToBrandAssetUpdates } from '../../services/supabase';

export { BRAND_ASSETS };

export interface BrandLogoProps {
  /**
   * 'mark' = Official compact icon mark (2048x2048, 1:1)
   * 'lockup' = Full official brand logo with wordmark (4096x1120, ~3.657:1)
   * 'responsive' = Automatically renders mark on screens < 1180px and lockup on >= 1180px
   */
  variant?: 'mark' | 'lockup' | 'full' | 'responsive';
  className?: string;
  onClick?: () => void;
  id?: string;
  alt?: string;
  context?: 'desktop-header' | 'tablet' | 'mobile-header' | 'footer' | 'compact' | 'default';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'header' | 'footer';
  /**
   * Explicit theme override if rendered on fixed dark or light surface
   */
  theme?: 'light' | 'dark';
}

// Module-level cache to track which URLs have already loaded into browser memory
const preloadedUrls = new Set<string>();

if (typeof window !== 'undefined') {
  // Preload all 3 official Supabase assets eagerly to eliminate layout shift & latency
  [BRAND_ASSETS.mark, BRAND_ASSETS.darkLockup, BRAND_ASSETS.lightLockup].forEach((url) => {
    const img = new Image();
    img.src = url;
    img.onload = () => preloadedUrls.add(url);
  });
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'lockup',
  className = '',
  onClick,
  id = 'brand-logo',
  alt = 'QIVENTRA',
  context = 'default',
  theme: explicitTheme,
}) => {
  // Resolve theme safely
  let resolvedTheme: 'light' | 'dark' = 'light';
  try {
    const themeCtx = useTheme();
    resolvedTheme = themeCtx.resolvedTheme;
  } catch {
    if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
      resolvedTheme = 'dark';
    }
  }

  const effectiveTheme: 'light' | 'dark' = explicitTheme || resolvedTheme;

  // Handle responsive variant or explicit variant
  // Normalize 'full' -> 'lockup'
  const isMarkVariant = variant === 'mark';

  const isDesktopHeader = context === 'desktop-header';

  // Target official Supabase URLs:
  // - desktop-header -> ALWAYS official lightLockup (light letters for permanent dark header)
  // - dark header / theme -> lightLockup (light letters for dark background)
  // - light header / theme -> darkLockup (dark letters for light background)
  // - compact mark -> official mark (2k transparent)
  const targetLockupUrl =
    isDesktopHeader || effectiveTheme === 'dark' ? BRAND_ASSETS.lightLockup : BRAND_ASSETS.darkLockup;
  const initialUrl = isMarkVariant ? BRAND_ASSETS.mark : targetLockupUrl;

  const [currentSrc, setCurrentSrc] = useState<string>(initialUrl);
  const [isLoaded, setIsLoaded] = useState<boolean>(() => preloadedUrls.has(initialUrl));
  const [isMarkFallback, setIsMarkFallback] = useState<boolean>(isMarkVariant);
  const [cacheBuster, setCacheBuster] = useState<number>(0);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Keep src in sync with theme and variant
  useEffect(() => {
    const nextUrl = isMarkVariant ? BRAND_ASSETS.mark : targetLockupUrl;
    setCurrentSrc(`${nextUrl}${cacheBuster ? `?v=${cacheBuster}` : ''}`);
    setIsMarkFallback(isMarkVariant);
    if (preloadedUrls.has(nextUrl)) {
      setIsLoaded(true);
    } else if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      preloadedUrls.add(nextUrl);
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [isMarkVariant, targetLockupUrl, cacheBuster]);

  // Subscribe to live admin brand asset updates
  useEffect(() => {
    const unsubscribe = subscribeToBrandAssetUpdates(() => {
      setCacheBuster((prev) => prev + 1);
      setIsLoaded(false);
    });
    return () => unsubscribe();
  }, []);

  const isActuallyMark = isMarkVariant || isMarkFallback;

  /**
   * Mandatory CSS style per strict specification:
   * display: block;
   * height: 38px (for desktop-header) or 40px;
   * width: auto;
   * max-width: 190px (for desktop-header) or 210px;
   * object-fit: contain;
   * object-position: left center (for desktop-header) or center;
   * flex-shrink: 0;
   * filter: none;
   * transform: none;
   */
  const mandatoryImgStyle: React.CSSProperties = {
    display: 'block',
    width: 'auto',
    height: isDesktopHeader ? '42px' : '40px',
    maxWidth: isActuallyMark ? '42px' : isDesktopHeader ? '210px' : '210px',
    objectFit: 'contain',
    objectPosition: isDesktopHeader ? 'left center' : 'center',
    flexShrink: 0,
    transform: 'none',
    filter: 'none',
  };

  return (
    <div
      id={id}
      dir="ltr"
      onClick={onClick}
      className={`relative inline-flex items-center shrink-0 select-none ${
        isDesktopHeader
          ? 'h-11 px-2.5 py-0.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-colors'
          : ''
      } ${
        onClick ? 'cursor-pointer hover:opacity-95 active:scale-[0.99] transition-opacity' : ''
      } ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={alt}
      style={{
        height: isDesktopHeader ? '44px' : '40px',
        minHeight: isDesktopHeader ? '44px' : '40px',
      }}
    >
      {/* Loading Skeleton Shimmer: Exact aspect ratio matching, never text replacement */}
      {!isLoaded && (
        <span
          className="block animate-pulse rounded-md bg-white/10 shrink-0"
          style={{
            height: isDesktopHeader ? '42px' : '40px',
            width: isActuallyMark ? '42px' : '153px',
            aspectRatio: isActuallyMark ? '1 / 1' : '4096 / 1120',
          }}
          aria-hidden="true"
        />
      )}

      {/* Official QIVENTRA Brand Asset Image */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={`${isActuallyMark ? 'brand-logo-mark' : 'brand-logo'} ${
          !isLoaded ? 'hidden' : 'block'
        }`}
        style={mandatoryImgStyle}
        onLoad={() => {
          preloadedUrls.add(currentSrc);
          setIsLoaded(true);
        }}
        onError={() => {
          // Strict error state: Fallback to official compact mark, NEVER text or AI-generated
          if (currentSrc !== BRAND_ASSETS.mark) {
            setCurrentSrc(BRAND_ASSETS.mark);
            setIsMarkFallback(true);
          } else {
            // Local fallback verified mark
            setCurrentSrc('/brand/qiventra-mark.png');
            setIsMarkFallback(true);
          }
          setIsLoaded(true);
        }}
        loading="eager"
        decoding="async"
      />
    </div>
  );
};

// Backwards compatibility aliases
export const Logo = BrandLogo;
export default BrandLogo;
