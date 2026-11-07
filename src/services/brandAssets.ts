/**
 * What the whole app needs to know about the brand mark. The Supabase client itself loads only
 * with the admin workspace (see supabase.ts), so the buyer's path never downloads it.
 */

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '');

export const BRAND_ASSETS_BUCKET = 'brand-assets';

export const CANONICAL_PATHS = {
  mark: 'qiventra/v1/qiventra-mark-transparent-2k.png',
  lightLockup: 'qiventra/v1/qiventra-lockup-light-transparent-4k.png',
  darkLockup: 'qiventra/v1/qiventra-lockup-dark-transparent-4k.png',
} as const;

const publicUrl = (path: string): string =>
  SUPABASE_URL ? `${SUPABASE_URL}/storage/v1/object/public/${BRAND_ASSETS_BUCKET}/${path}` : '';

/** Empty until VITE_SUPABASE_URL is set. The interface then simply stays on the local files. */
export const BRAND_ASSETS = {
  mark: publicUrl(CANONICAL_PATHS.mark),
  lightLockup: publicUrl(CANONICAL_PATHS.lightLockup),
  darkLockup: publicUrl(CANONICAL_PATHS.darkLockup),
};

export const LOCAL_MARK = '/brand/mark.webp';
export const LOCAL_MARK_DARK = '/brand/mark-light.webp';

/* ------------------------------ Live updates from the admin workspace ------------------------------ */

type BrandAssetListener = () => void;
const listeners = new Set<BrandAssetListener>();

export function subscribeToBrandAssetUpdates(listener: BrandAssetListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyBrandAssetUpdated() {
  remoteMark = undefined;
  try {
    sessionStorage.removeItem(REMOTE_MARK_KEY);
  } catch {
    // Nothing to clear without storage.
  }
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // A listener's failure must not stop the others.
    }
  });
}

/* ------------------------------ The remote mark, only when it is light ------------------------------ */

/** The header shows a small icon, so anything bigger than this stays on the server. */
export const MAX_REMOTE_MARK_BYTES = 50 * 1024;

const REMOTE_MARK_KEY = 'qiventra_remote_mark';

/** The size comes from the response headers, so a heavy file is never downloaded to find out. */
export const isLightEnough = (contentLength: string | null): boolean => {
  const size = Number(contentLength);
  return Number.isFinite(size) && size > 0 && size < MAX_REMOTE_MARK_BYTES;
};

const preload = (url: string) =>
  new Promise<boolean>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image.naturalWidth > 0);
    image.onerror = () => resolve(false);
    image.src = url;
  });

let remoteMark: Promise<string | null> | undefined;

/**
 * Resolves to the remote mark's address if it can replace the local one: configured, under the
 * limit, and actually loaded. The answer is kept for the session, so a failing or heavy file costs
 * one small request, not one per screen.
 */
export const loadLightRemoteMark = (): Promise<string | null> => {
  if (remoteMark) return remoteMark;
  remoteMark = (async () => {
    const url = BRAND_ASSETS.mark;
    if (!url) return null;
    try {
      const saved = sessionStorage.getItem(REMOTE_MARK_KEY);
      if (saved !== null) return saved || null;
    } catch {
      // Without storage it simply asks again next session.
    }
    let result: string | null = null;
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok && isLightEnough(response.headers.get('content-length')) && (await preload(url))) {
        result = url;
      }
    } catch {
      // The local mark is already on screen, so there is nothing to recover.
    }
    try {
      sessionStorage.setItem(REMOTE_MARK_KEY, result ?? '');
    } catch {
      // See above.
    }
    return result;
  })();
  return remoteMark;
};
