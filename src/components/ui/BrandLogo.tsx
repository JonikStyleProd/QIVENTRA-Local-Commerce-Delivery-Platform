import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { LOCAL_MARK, LOCAL_MARK_DARK, loadLightRemoteMark, subscribeToBrandAssetUpdates } from '../../services/brandAssets';

interface BrandLogoProps {
  className?: string;
  id?: string;
  alt?: string;
}

const whenIdle = (work: () => void): (() => void) => {
  if ('requestIdleCallback' in window) {
    const handle = window.requestIdleCallback(work, { timeout: 3000 });
    return () => window.cancelIdleCallback(handle);
  }
  const handle = globalThis.setTimeout(work, 1500);
  return () => globalThis.clearTimeout(handle);
};

/**
 * The local WebP mark shows at once. The mark from Supabase replaces it only after it has loaded,
 * and only if it is light enough. The official mark is dark, so dark paper always gets the local light one.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', id = 'brand-logo', alt = 'QIVENTRA' }) => {
  const { resolvedTheme } = useTheme();
  const [remoteMark, setRemoteMark] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => subscribeToBrandAssetUpdates(() => setVersion((current) => current + 1)), []);

  useEffect(() => {
    let isCurrent = true;
    const cancel = whenIdle(() => {
      void loadLightRemoteMark().then((url) => {
        if (isCurrent) setRemoteMark(url);
      });
    });
    return () => {
      isCurrent = false;
      cancel();
    };
  }, [version]);

  const src = resolvedTheme === 'dark' ? LOCAL_MARK_DARK : remoteMark ?? LOCAL_MARK;

  return (
    <img
      id={id}
      src={src}
      alt={alt}
      width={44}
      height={40}
      decoding="async"
      className={`brand-logo-mark block h-10 w-auto max-w-[44px] object-contain shrink-0 ${className}`}
    />
  );
};
