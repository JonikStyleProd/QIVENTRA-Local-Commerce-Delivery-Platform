import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BrandAssetRecord, BrandAssetVariant } from '../types';
import { BRAND_ASSETS, BRAND_ASSETS_BUCKET, CANONICAL_PATHS, notifyBrandAssetUpdated } from './brandAssets';

export { BRAND_ASSETS, BRAND_ASSETS_BUCKET };

/* =========================================================================
   1. Supabase Environment Configuration & Initialization
   ========================================================================= */

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Check if credentials are provided and valid
const isMissingConfig =
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl.includes('YOUR_SUPABASE') ||
  supabaseAnonKey.includes('YOUR_ANON');

if (isMissingConfig) {
  if (import.meta.env.DEV) {
    console.warn(
      `[QIVENTRA - Supabase Integration]\n` +
        `Supabase environment variables are missing or placeholders.\n` +
        `Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are declared in .env\n` +
        `Application will proceed safely using verified local official brand fallbacks.`
    );
  }
}

/**
 * Public Supabase client initialized with anon public key.
 * NOTE: Never expose or import the service_role key on the client!
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export const isSupabaseConfigured = !isMissingConfig;

/* =========================================================================
   2. Official Brand Assets Specification & Checksums
   ========================================================================= */

/** Where the live file is served from. The interface reads these addresses, whatever the version. */
export const FIXED_STORAGE_PATHS: Record<BrandAssetVariant, string> = {
  mark: CANONICAL_PATHS.mark,
  lockup: CANONICAL_PATHS.darkLockup,
};

const EXTENSIONS: Record<string, string> = { 'image/png': 'png', 'image/webp': 'webp', 'image/svg+xml': 'svg' };

/** Each version keeps its own file, so storage_path stays unique and a rollback has a file to restore. */
export const versionedStoragePath = (variant: BrandAssetVariant, version: number, sha256: string, mime: string): string =>
  `qiventra/history/${variant}/v${version}-${sha256.slice(0, 12)}.${EXTENSIONS[mime] ?? 'bin'}`;

export const ALLOWED_BRAND_MIME_TYPES = [
  'image/png',
  'image/webp',
  'image/svg+xml',
] as const;

export const MAX_BRAND_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit

/**
 * Exact verified SHA-256 and dimensions of official, non-modified QIVENTRA assets
 */
export const OFFICIAL_BRAND_METADATA = {
  mark: {
    assetKey: 'qiventra_mark_v1',
    variant: 'mark' as BrandAssetVariant,
    storagePath: 'qiventra/v1/qiventra-mark-transparent-2k.png',
    url: BRAND_ASSETS.mark,
    localPng: '/brand/qiventra-mark.png',
    localWebP: '/brand/qiventra-mark.webp',
    width: 2048,
    height: 2048,
    mimeType: 'image/png',
    sha256: '467676c71b16526876ebb80c3cfc6df14079b3fc29c6b2206eb164bc0dd5d66e',
  },
  lightLockup: {
    assetKey: 'qiventra_lockup_light_v1',
    variant: 'lockup' as BrandAssetVariant,
    storagePath: 'qiventra/v1/qiventra-lockup-light-transparent-4k.png',
    url: BRAND_ASSETS.lightLockup,
    localPng: '/brand/qiventra-full.png',
    localWebP: '/brand/qiventra-full.webp',
    width: 4096,
    height: 1120,
    mimeType: 'image/png',
    sha256: '7f6dfb6d911a7d4e816a5f65d5f937a636e7ccdfee7419da0733d73d2dc49d8c',
  },
  darkLockup: {
    assetKey: 'qiventra_lockup_dark_v1',
    variant: 'lockup' as BrandAssetVariant,
    storagePath: 'qiventra/v1/qiventra-lockup-dark-transparent-4k.png',
    url: BRAND_ASSETS.darkLockup,
    localPng: '/brand/qiventra-full.png',
    localWebP: '/brand/qiventra-full.webp',
    width: 4096,
    height: 1120,
    mimeType: 'image/png',
    sha256: '165a0334a1e1014eada611212ac088716e40c23815e40ab6dc364dff2c0354cc',
  },
  lockup: {
    assetKey: 'qiventra_lockup_v1',
    variant: 'lockup' as BrandAssetVariant,
    storagePath: 'qiventra/v1/qiventra-lockup-dark-transparent-4k.png',
    url: BRAND_ASSETS.darkLockup,
    localPng: '/brand/qiventra-full.png',
    localWebP: '/brand/qiventra-full.webp',
    width: 4096,
    height: 1120,
    mimeType: 'image/png',
    sha256: '165a0334a1e1014eada611212ac088716e40c23815e40ab6dc364dff2c0354cc',
  },
} as const;

/* =========================================================================
   3. Helpers: SHA-256 Checksum & Dimensions
   ========================================================================= */

/**
 * Computes standard SHA-256 hexadecimal hash using native Web Crypto API
 */
export async function computeBlobSha256(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Safely measures image dimensions in browser without rendering
 */
export async function readImageDimensions(
  fileOrBlob: Blob
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(fileOrBlob);
    img.onload = () => {
      const dimensions = { width: img.naturalWidth, height: img.naturalHeight };
      URL.revokeObjectURL(url);
      resolve(dimensions);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to decode image dimensions'));
    };
    img.src = url;
  });
}

/**
 * Returns public Supabase Storage URL for a given brand asset variant
 */
export function getBrandAssetPublicUrl(variant: BrandAssetVariant): string {
  if (!isSupabaseConfigured) {
    return OFFICIAL_BRAND_METADATA[variant].localPng;
  }
  const path = FIXED_STORAGE_PATHS[variant];
  return `${supabaseUrl}/storage/v1/object/public/${BRAND_ASSETS_BUCKET}/${path}`;
}

/* =========================================================================
   4. Brand Assets Service: Fetch, Upload, Versioning, Rollback
   ========================================================================= */

/**
 * Fetches all brand asset records from Supabase `brand_assets` table.
 * If offline, not yet migrated, or network error occurs, returns local baseline.
 */
export async function fetchBrandAssetRecords(): Promise<{
  data: BrandAssetRecord[];
  error?: string;
  source: 'supabase' | 'fallback';
}> {
  if (!isSupabaseConfigured) {
    return {
      data: getDefaultBrandAssetRecords(),
      source: 'fallback',
    };
  }

  try {
    const { data, error } = await supabase
      .from('brand_assets')
      .select('*')
      .order('version', { ascending: false });

    if (error) {
      console.warn('[Supabase] Could not fetch brand_assets:', error.message);
      return {
        data: getDefaultBrandAssetRecords(),
        error: error.message,
        source: 'fallback',
      };
    }

    if (!data || data.length === 0) {
      return {
        data: getDefaultBrandAssetRecords(),
        source: 'fallback',
      };
    }

    return {
      data: data as BrandAssetRecord[],
      source: 'supabase',
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Network error';
    return {
      data: getDefaultBrandAssetRecords(),
      error: msg,
      source: 'fallback',
    };
  }
}

/**
 * Returns baseline initial records matching the official files
 */
export function getDefaultBrandAssetRecords(): BrandAssetRecord[] {
  const now = new Date().toISOString();
  return [
    {
      id: '00000000-0000-0000-0000-000000000001',
      asset_key: OFFICIAL_BRAND_METADATA.mark.assetKey,
      storage_path: OFFICIAL_BRAND_METADATA.mark.storagePath,
      variant: 'mark',
      mime_type: 'image/png',
      width: OFFICIAL_BRAND_METADATA.mark.width,
      height: OFFICIAL_BRAND_METADATA.mark.height,
      sha256: OFFICIAL_BRAND_METADATA.mark.sha256,
      version: 1,
      is_active: true,
      created_at: now,
      updated_at: now,
      created_by: null,
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      asset_key: OFFICIAL_BRAND_METADATA.lockup.assetKey,
      storage_path: OFFICIAL_BRAND_METADATA.lockup.storagePath,
      variant: 'lockup',
      mime_type: 'image/png',
      width: OFFICIAL_BRAND_METADATA.lockup.width,
      height: OFFICIAL_BRAND_METADATA.lockup.height,
      sha256: OFFICIAL_BRAND_METADATA.lockup.sha256,
      version: 1,
      is_active: true,
      created_at: now,
      updated_at: now,
      created_by: null,
    },
  ];
}

/**
 * Administrative upload & update of an official brand asset.
 * Enforces admin authorization, format validation, size limit, fixed storage path,
 * SHA-256 calculation, and database record update with versioning.
 */
export async function uploadBrandAsset(params: {
  file: File;
  variant: BrandAssetVariant;
  userRole: string;
  userId?: string;
}): Promise<{
  success: boolean;
  record?: BrandAssetRecord;
  error?: string;
}> {
  const { file, variant, userRole, userId } = params;

  // 1. Role-based security check (admin only)
  if (userRole !== 'admin') {
    return {
      success: false,
      error: 'Security Exception: Only administrators can update official brand assets.',
    };
  }

  // 2. Format validation
  const mime = file.type;
  if (!ALLOWED_BRAND_MIME_TYPES.includes(mime as any)) {
    return {
      success: false,
      error: `Invalid file format (${mime}). Allowed formats: PNG, WebP, SVG.`,
    };
  }

  // 3. File size check
  if (file.size > MAX_BRAND_FILE_SIZE_BYTES) {
    return {
      success: false,
      error: `File exceeds maximum allowed size of 10 MB (size: ${(file.size / (1024 * 1024)).toFixed(2)} MB).`,
    };
  }

  // 4. Compute Checksum and Dimensions
  let sha256: string;
  let dimensions: { width: number; height: number };
  try {
    sha256 = await computeBlobSha256(file);
    dimensions = await readImageDimensions(file);
  } catch (err) {
    return {
      success: false,
      error: 'Failed to inspect image dimensions or checksum.',
    };
  }

  // 5. The live file's address never changes; each version also keeps a file of its own
  const canonicalPath = FIXED_STORAGE_PATHS[variant];
  const storagePath = versionedStoragePath(variant, 2, sha256, mime);

  // 6. Upload to Supabase Storage if configured
  if (isSupabaseConfigured) {
    try {
      // Fetch current max version for this variant
      const { data: existingRecords } = await supabase
        .from('brand_assets')
        .select('version')
        .eq('variant', variant)
        .order('version', { ascending: false })
        .limit(1);

      const nextVersion = existingRecords && existingRecords.length > 0 ? existingRecords[0].version + 1 : 2;
      const nextPath = versionedStoragePath(variant, nextVersion, sha256, mime);

      // The version's own file first: if this fails, nothing about the live logo has changed.
      const { error: storageError } = await supabase.storage
        .from(BRAND_ASSETS_BUCKET)
        .upload(nextPath, file, { cacheControl: '31536000', upsert: false, contentType: mime });

      if (storageError) {
        return {
          success: false,
          error: `Supabase Storage upload failed: ${storageError.message}`,
        };
      }

      const { error: liveError } = await supabase.storage
        .from(BRAND_ASSETS_BUCKET)
        .upload(canonicalPath, file, { cacheControl: '3600', upsert: true, contentType: mime });

      if (liveError) {
        return {
          success: false,
          error: `Supabase Storage upload failed: ${liveError.message}`,
        };
      }

      // Set previous records for this variant to inactive
      await supabase
        .from('brand_assets')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('variant', variant);

      // Insert new active version
      const assetKey = `qiventra_${variant}_v${nextVersion}`;
      const newRecord = {
        asset_key: assetKey,
        storage_path: nextPath,
        variant,
        mime_type: mime as any,
        width: dimensions.width,
        height: dimensions.height,
        sha256,
        version: nextVersion,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: userId || null,
      };

      const { data: inserted, error: insertError } = await supabase
        .from('brand_assets')
        .insert([newRecord])
        .select()
        .single();

      if (insertError) {
        return {
          success: false,
          error: `Database registration failed: ${insertError.message}`,
        };
      }

      notifyBrandAssetUpdated();
      return {
        success: true,
        record: inserted as BrandAssetRecord,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unexpected storage exception',
      };
    }
  } else {
    // If Supabase credentials are not yet linked to backend, simulate successful local record update
    notifyBrandAssetUpdated();
    return {
      success: true,
      record: {
        id: crypto.randomUUID(),
        asset_key: `qiventra_${variant}_v2`,
        storage_path: storagePath,
        variant,
        mime_type: mime as any,
        width: dimensions.width,
        height: dimensions.height,
        sha256,
        version: 2,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: userId || null,
      },
    };
  }
}

/**
 * Reverts to a previous version of a brand asset
 */
export async function rollbackBrandAsset(params: {
  variant: BrandAssetVariant;
  targetVersion: number;
  userRole: string;
}): Promise<{
  success: boolean;
  error?: string;
}> {
  const { variant, targetVersion, userRole } = params;

  if (userRole !== 'admin') {
    return {
      success: false,
      error: 'Security Exception: Only administrators can roll back brand assets.',
    };
  }

  if (isSupabaseConfigured) {
    try {
      const { data: target, error: findError } = await supabase
        .from('brand_assets')
        .select('storage_path, mime_type')
        .eq('variant', variant)
        .eq('version', targetVersion)
        .single();

      if (findError || !target) {
        return { success: false, error: findError?.message ?? 'This version does not exist.' };
      }

      // Put the old file back at the live address before touching any record: a missing file
      // leaves the current logo and its record exactly as they were.
      const { data: file, error: downloadError } = await supabase.storage
        .from(BRAND_ASSETS_BUCKET)
        .download(target.storage_path);

      if (downloadError || !file) {
        return { success: false, error: downloadError?.message ?? 'The file of this version is missing.' };
      }

      const { error: restoreError } = await supabase.storage
        .from(BRAND_ASSETS_BUCKET)
        .upload(FIXED_STORAGE_PATHS[variant], file, { cacheControl: '3600', upsert: true, contentType: target.mime_type });

      if (restoreError) {
        return { success: false, error: restoreError.message };
      }

      // Set all for this variant to inactive
      await supabase
        .from('brand_assets')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('variant', variant);

      // Set target version to active
      const { error } = await supabase
        .from('brand_assets')
        .update({ is_active: true, updated_at: new Date().toISOString() })
        .eq('variant', variant)
        .eq('version', targetVersion);

      if (error) {
        return { success: false, error: error.message };
      }

      notifyBrandAssetUpdated();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Rollback failed',
      };
    }
  }

  notifyBrandAssetUpdated();
  return { success: true };
}
