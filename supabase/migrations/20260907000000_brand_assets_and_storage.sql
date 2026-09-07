-- =========================================================================
-- QIVENTRA SUPABASE MIGRATION: BRAND ASSETS & STORAGE INFRASTRUCTURE
-- Migration Version: 20260907000000_brand_assets_and_storage.sql
-- Description: Creates brand_assets table, storage bucket, RLS policies,
--              and seeds verified official brand assets (mark & lockup).
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Helper function: verify if calling user is an administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Evaluates service_role key, app_metadata role, or user_metadata role
  RETURN (
    coalesce(auth.jwt() ->> 'role', '') = 'service_role' OR
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin' OR
    coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- -------------------------------------------------------------------------
-- 1. Brand Assets Table
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.brand_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_key TEXT UNIQUE NOT NULL,
    storage_path TEXT UNIQUE NOT NULL,
    variant TEXT NOT NULL CHECK (variant IN ('mark', 'lockup')),
    mime_type TEXT NOT NULL CHECK (mime_type IN ('image/png', 'image/webp', 'image/svg+xml')),
    width INTEGER CHECK (width > 0),
    height INTEGER CHECK (height > 0),
    sha256 TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1 CHECK (version >= 1),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_brand_assets_variant_active ON public.brand_assets(variant, is_active);
CREATE INDEX IF NOT EXISTS idx_brand_assets_asset_key ON public.brand_assets(asset_key);
CREATE INDEX IF NOT EXISTS idx_brand_assets_version ON public.brand_assets(variant, version DESC);

-- Automatic updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_brand_assets_updated_at ON public.brand_assets;
CREATE TRIGGER trg_brand_assets_updated_at
BEFORE UPDATE ON public.brand_assets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- -------------------------------------------------------------------------
-- 2. Row Level Security (RLS) Policies on brand_assets
-- -------------------------------------------------------------------------
ALTER TABLE public.brand_assets ENABLE ROW LEVEL SECURITY;

-- SELECT Policy: Public can only view active records; Admins can view history
DROP POLICY IF EXISTS "Public users can view active brand assets" ON public.brand_assets;
CREATE POLICY "Public users can view active brand assets"
ON public.brand_assets
FOR SELECT
USING (is_active = true OR public.is_admin());

-- INSERT Policy: Only Admins can create records
DROP POLICY IF EXISTS "Admins can insert brand assets" ON public.brand_assets;
CREATE POLICY "Admins can insert brand assets"
ON public.brand_assets
FOR INSERT
WITH CHECK (public.is_admin());

-- UPDATE Policy: Only Admins can update records (versioning / active flags)
DROP POLICY IF EXISTS "Admins can update brand assets" ON public.brand_assets;
CREATE POLICY "Admins can update brand assets"
ON public.brand_assets
FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- DELETE Policy: Only Admins can delete archive records
DROP POLICY IF EXISTS "Admins can delete brand assets" ON public.brand_assets;
CREATE POLICY "Admins can delete brand assets"
ON public.brand_assets
FOR DELETE
USING (public.is_admin());

-- -------------------------------------------------------------------------
-- 3. Supabase Storage Bucket & Storage Policies (brand-assets)
-- -------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'brand-assets',
    'brand-assets',
    true,
    10485760, -- 10 MB limit in bytes
    ARRAY['image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/png', 'image/webp', 'image/svg+xml'];

-- Storage RLS: Public Read Access
DROP POLICY IF EXISTS "Public read on brand-assets bucket" ON storage.objects;
CREATE POLICY "Public read on brand-assets bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-assets');

-- Storage RLS: Admin-Only Insert at canonical fixed paths
DROP POLICY IF EXISTS "Admins can upload brand-assets" ON storage.objects;
CREATE POLICY "Admins can upload brand-assets"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'brand-assets'
    AND (
        name = 'qiventra/v1/mark.png' OR 
        name = 'qiventra/v1/lockup.png' OR
        name LIKE 'qiventra/%'
    )
    AND public.is_admin()
);

-- Storage RLS: Admin-Only Update
DROP POLICY IF EXISTS "Admins can update brand-assets" ON storage.objects;
CREATE POLICY "Admins can update brand-assets"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'brand-assets'
    AND public.is_admin()
)
WITH CHECK (
    bucket_id = 'brand-assets'
    AND public.is_admin()
);

-- Storage RLS: Admin-Only Delete
DROP POLICY IF EXISTS "Admins can delete brand-assets" ON storage.objects;
CREATE POLICY "Admins can delete brand-assets"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'brand-assets'
    AND public.is_admin()
);

-- -------------------------------------------------------------------------
-- 4. Initial Seed Data: Official Verified Assets (Checksums & Dimensions)
-- -------------------------------------------------------------------------
INSERT INTO public.brand_assets (
    asset_key,
    storage_path,
    variant,
    mime_type,
    width,
    height,
    sha256,
    version,
    is_active
) VALUES
(
    'qiventra_mark_v1',
    'qiventra/v1/mark.png',
    'mark',
    'image/png',
    512,
    512,
    '9934440ea66c09ace5a53c444108f56ca53434ba98cda646022d3b25db759962',
    1,
    true
),
(
    'qiventra_lockup_v1',
    'qiventra/v1/lockup.png',
    'lockup',
    'image/png',
    1060,
    280,
    'dd633f99f7a2166df709d0ac7f8a1b5dc346603a22c312193bc131f0a3a38d98',
    1,
    true
)
ON CONFLICT (storage_path) DO UPDATE SET
    asset_key = EXCLUDED.asset_key,
    variant = EXCLUDED.variant,
    mime_type = EXCLUDED.mime_type,
    width = EXCLUDED.width,
    height = EXCLUDED.height,
    sha256 = EXCLUDED.sha256,
    version = EXCLUDED.version,
    is_active = EXCLUDED.is_active,
    updated_at = now();
