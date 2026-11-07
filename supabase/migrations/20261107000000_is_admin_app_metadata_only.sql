-- =========================================================================
-- QIVENTRA SUPABASE MIGRATION: ADMIN CHECK AND BRAND ASSET HISTORY
-- Migration Version: 20261107000000_is_admin_app_metadata_only.sql
--
-- 1. is_admin() trusted user_metadata.role. Any signed-in user can write
--    user_metadata from the client (supabase.auth.updateUser), so any user could
--    make themselves an administrator and pass the RLS policies below.
--    app_metadata can be written only with the service_role key, on the server.
-- 2. The seed rows pointed at files that are not in the bucket, so rolling back
--    to version 1 could not find its file.
--
-- It is not applied automatically. See "Applying the security migration" in README.md.
-- =========================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
END;
$$ LANGUAGE plpgsql STABLE SET search_path = '';

-- Point version 1 at the files that exist, with their real checksums and sizes.
UPDATE public.brand_assets
SET storage_path = 'qiventra/v1/qiventra-mark-transparent-2k.png',
    width = 2048,
    height = 2048,
    sha256 = '467676c71b16526876ebb80c3cfc6df14079b3fc29c6b2206eb164bc0dd5d66e'
WHERE asset_key = 'qiventra_mark_v1' AND storage_path = 'qiventra/v1/mark.png';

UPDATE public.brand_assets
SET storage_path = 'qiventra/v1/qiventra-lockup-dark-transparent-4k.png',
    width = 4096,
    height = 1120,
    sha256 = '165a0334a1e1014eada611212ac088716e40c23815e40ab6dc364dff2c0354cc'
WHERE asset_key = 'qiventra_lockup_v1' AND storage_path = 'qiventra/v1/lockup.png';
