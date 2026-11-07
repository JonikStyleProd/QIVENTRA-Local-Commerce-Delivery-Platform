import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Upload, RefreshCw, History, CheckCircle2, Copy, Check, FileCheck, AlertTriangle, Layers, Database } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Skeleton } from '../ui/Skeleton';
import { Panel } from '../collage/Panel';
import { SegmentedControl } from '../collage/SegmentedControl';
import { Stamp } from '../collage/Stamp';
import {
  BRAND_ASSETS,
  OFFICIAL_BRAND_METADATA,
  FIXED_STORAGE_PATHS,
  BRAND_ASSETS_BUCKET,
  ALLOWED_BRAND_MIME_TYPES,
  MAX_BRAND_FILE_SIZE_BYTES,
  computeBlobSha256,
  readImageDimensions,
  fetchBrandAssetRecords,
  uploadBrandAsset,
  rollbackBrandAsset,
  isSupabaseConfigured,
} from '../../services/supabase';
import { BrandAssetRecord, BrandAssetVariant } from '../../types';

const SHEET = 'p-3.5 desk:p-5 bg-paper border-2 border-ink rounded-2xl';
const PREVIEW_LOGO: React.CSSProperties = { maxWidth: '100%', maxHeight: '40px', aspectRatio: '4096 / 1120' };
const TECH = 'font-mono text-xs break-all';

export const BrandAssetsManager: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { currentUser } = useApp();
  const copy = t.screens.brand;

  const [selectedVariant, setSelectedVariant] = useState<BrandAssetVariant>('lockup');
  const [records, setRecords] = useState<BrandAssetRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedSha, setCopiedSha] = useState<string | null>(null);

  // Staged upload state for preview before save
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [stagedPreviewUrl, setStagedPreviewUrl] = useState<string | null>(null);
  const [stagedSha256, setStagedSha256] = useState<string | null>(null);
  const [stagedDimensions, setStagedDimensions] = useState<{ width: number; height: number } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Confirmation modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Rollback confirmation
  const [rollbackTarget, setRollbackTarget] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load brand asset records
  const loadRecords = async () => {
    setIsLoading(true);
    const res = await fetchBrandAssetRecords();
    setRecords(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  // Filter records for active tab
  const activeRecord = records.find((r) => r.variant === selectedVariant && r.is_active) || {
    id: 'active-default',
    asset_key: OFFICIAL_BRAND_METADATA[selectedVariant].assetKey,
    storage_path: OFFICIAL_BRAND_METADATA[selectedVariant].storagePath,
    variant: selectedVariant,
    mime_type: OFFICIAL_BRAND_METADATA[selectedVariant].mimeType as any,
    width: OFFICIAL_BRAND_METADATA[selectedVariant].width,
    height: OFFICIAL_BRAND_METADATA[selectedVariant].height,
    sha256: OFFICIAL_BRAND_METADATA[selectedVariant].sha256,
    version: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
  };

  const historyRecords = records.filter((r) => r.variant === selectedVariant && !r.is_active);

  // Handle file selection and preview calculation
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValidationError(null);

    // 1. MIME type validation
    if (!ALLOWED_BRAND_MIME_TYPES.includes(file.type as any)) {
      const err = copy.badFormat.replace('{type}', file.type || copy.unknownType);
      setValidationError(err);
      showToast({ type: 'error', title: copy.badFormatTitle, message: err });
      return;
    }

    // 2. Size validation
    if (file.size > MAX_BRAND_FILE_SIZE_BYTES) {
      const err = copy.tooBig.replace('{size}', (file.size / (1024 * 1024)).toFixed(2));
      setValidationError(err);
      showToast({ type: 'error', title: copy.tooBigTitle, message: err });
      return;
    }

    try {
      const [sha, dims] = await Promise.all([computeBlobSha256(file), readImageDimensions(file)]);

      setStagedFile(file);
      setStagedSha256(sha);
      setStagedDimensions(dims);

      const objectUrl = URL.createObjectURL(file);
      setStagedPreviewUrl(objectUrl);

      showToast({
        type: 'info',
        title: copy.fileReadyTitle,
        message: copy.fileReadyMsg.replace('{w}', String(dims.width)).replace('{h}', String(dims.height)),
      });
    } catch (err) {
      setValidationError(copy.readError);
      showToast({ type: 'error', title: copy.readErrorTitle, message: copy.readError });
    }
  };

  const clearStaged = () => {
    if (stagedPreviewUrl) {
      URL.revokeObjectURL(stagedPreviewUrl);
    }
    setStagedFile(null);
    setStagedPreviewUrl(null);
    setStagedSha256(null);
    setStagedDimensions(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Perform upload upon confirmation
  const handleConfirmUpload = async () => {
    if (!stagedFile) return;

    setIsUploading(true);
    setIsConfirmModalOpen(false);

    try {
      const res = await uploadBrandAsset({
        file: stagedFile,
        variant: selectedVariant,
        userRole: currentUser.role,
        userId: currentUser.id,
      });

      if (!res.success) {
        showToast({
          type: 'error',
          title: copy.uploadErrorTitle,
          message: res.error || copy.uploadError,
        });
        setIsUploading(false);
        return;
      }

      showToast({
        type: 'success',
        title: copy.uploadedTitle,
        message: copy.uploadedMsg.replace('{version}', String(res.record?.version || 2)),
      });

      clearStaged();
      await loadRecords();
    } catch (err) {
      showToast({
        type: 'error',
        title: copy.uploadExceptionTitle,
        message: err instanceof Error ? err.message : copy.unknownError,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Rollback to previous version
  const handleRollback = async (version: number) => {
    setIsUploading(true);
    try {
      const res = await rollbackBrandAsset({
        variant: selectedVariant,
        targetVersion: version,
        userRole: currentUser.role,
      });

      if (!res.success) {
        showToast({
          type: 'error',
          title: copy.rollbackErrorTitle,
          message: res.error || copy.rollbackError,
        });
      } else {
        showToast({
          type: 'success',
          title: copy.rolledBackTitle,
          message: copy.rolledBackMsg.replace('{version}', String(version)),
        });
        await loadRecords();
      }
    } finally {
      setIsUploading(false);
      setRollbackTarget(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSha(text);
    setTimeout(() => setCopiedSha(null), 2000);
    showToast({
      type: 'success',
      title: copy.copiedTitle,
      message: copy.copiedMsg,
    });
  };

  // 1. Role-based Access Gate: Only 'admin' role has permission
  const isAdmin = currentUser.role === 'admin';

  if (!isAdmin) {
    return (
      <Panel tone="food" as="section">
        <div className="flex items-start gap-3.5">
          <ShieldAlert aria-hidden="true" className="w-7 h-7 shrink-0 text-danger" />
          <div className="min-w-0">
            <h2 className="text-lg desk:text-xl font-black">{t.admin.adminOnlyNotice}</h2>
            <p className="mt-1 font-bold text-ink-2">{copy.adminOnlyBody}</p>
            <p className="flex flex-wrap items-center gap-2 mt-2.5 text-sm font-bold text-ink-2">
              {copy.currentRole}:
              <Stamp>{t.screens.portal.roles[currentUser.role as keyof typeof t.screens.portal.roles] ?? currentUser.role}</Stamp>
            </p>
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <Panel as="section" tape="blue" aria-label={t.admin.brandAssetsTitle}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="min-w-0 flex-[1_1_280px]">
          <h2 className="text-[22px] desk:text-[28px] font-black tracking-tight leading-tight">{t.admin.brandAssetsTitle}</h2>
          <p className="mt-1 max-w-[720px] text-sm font-bold text-ink-2">{t.admin.brandAssetsSubtitle}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadRecords}
          disabled={isLoading}
          leftIcon={<RefreshCw aria-hidden="true" className={`w-4 h-4 ${isLoading ? 'anim-spin' : ''}`} />}
        >
          {copy.refresh}
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 p-3 mb-4 bg-tint-pets border-2 border-ink rounded-xl text-sm font-bold">
        <p className="flex items-start gap-2 min-w-0">
          <Database aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="min-w-0">
            <bdi className="font-mono font-extrabold">{BRAND_ASSETS_BUCKET}</bdi> · {copy.bucketNote}
          </span>
        </p>
        <Stamp tone={isSupabaseConfigured ? 'success' : 'warn'}>{isSupabaseConfigured ? copy.connected : copy.fallback}</Stamp>
      </div>

      <SegmentedControl
        label={t.admin.brandAssetsTitle}
        value={selectedVariant}
        onChange={(variant) => {
          setSelectedVariant(variant);
          clearStaged();
        }}
        className="flex w-full max-w-[640px] mb-5"
        options={[
          { value: 'lockup', label: t.admin.lockupTitle, icon: <Layers aria-hidden="true" className="w-4 h-4 shrink-0" /> },
          { value: 'mark', label: t.admin.markTitle, icon: <CheckCircle2 aria-hidden="true" className="w-4 h-4 shrink-0" /> },
        ]}
      />

      <div className="grid desk:grid-cols-2 gap-5">
        {/* ---------- Active version ---------- */}
        <div className={SHEET}>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h3 className="font-black">{t.admin.currentActiveVersion}</h3>
            <Stamp tone="success">
              {copy.active} · v{activeRecord.version}
            </Stamp>
          </div>

          {isLoading ? (
            <Skeleton className="h-40" />
          ) : selectedVariant === 'lockup' ? (
            <div className="space-y-3">
              {/* These two sheets show the logo on a fixed ground, whatever the app's theme. */}
              <div className="flex flex-col items-center gap-2 p-4 bg-[#FFF8EC] text-[#5A554C] border-2 border-[#1E1E1E] rounded-xl">
                <span className="text-xs font-extrabold">{copy.previewLight}</span>
                <img
                  src={BRAND_ASSETS.darkLockup}
                  alt="QIVENTRA"
                  style={PREVIEW_LOGO}
                  onError={(e) => {
                    e.currentTarget.src = OFFICIAL_BRAND_METADATA.darkLockup.localPng;
                  }}
                />
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-[#1E1E1E] text-[#FFD84D] border-2 border-[#1E1E1E] rounded-xl">
                <span className="text-xs font-extrabold">{copy.previewDark}</span>
                <img
                  src={BRAND_ASSETS.lightLockup}
                  alt="QIVENTRA"
                  style={PREVIEW_LOGO}
                  onError={(e) => {
                    e.currentTarget.src = OFFICIAL_BRAND_METADATA.lightLockup.localPng;
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 p-6 bg-[#FFF8EC] text-[#5A554C] border-2 border-[#1E1E1E] rounded-xl">
              <span className="text-xs font-extrabold">{copy.previewMark}</span>
              <img
                src={BRAND_ASSETS.mark}
                alt="QIVENTRA"
                style={{ maxWidth: '100%', maxHeight: '64px', aspectRatio: '1 / 1' }}
                onError={(e) => {
                  e.currentTarget.src = OFFICIAL_BRAND_METADATA.mark.localPng;
                }}
              />
            </div>
          )}

          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex flex-wrap justify-between gap-x-3 pb-2 border-b-2 border-paper-dot">
              <dt className="font-bold text-ink-2">{t.admin.actualDimensions}</dt>
              <dd className="font-extrabold tabular-nums" dir="ltr">
                {activeRecord.width || OFFICIAL_BRAND_METADATA[selectedVariant].width} ×{' '}
                {activeRecord.height || OFFICIAL_BRAND_METADATA[selectedVariant].height} px
              </dd>
            </div>
            <div className="flex flex-wrap justify-between gap-x-3 pb-2 border-b-2 border-paper-dot">
              <dt className="font-bold text-ink-2">MIME</dt>
              <dd className={TECH} dir="ltr">
                {activeRecord.mime_type}
              </dd>
            </div>
            <div className="flex flex-wrap justify-between gap-x-3 pb-2 border-b-2 border-paper-dot">
              <dt className="font-bold text-ink-2">{copy.canonicalPath}</dt>
              <dd className={TECH} dir="ltr">
                {FIXED_STORAGE_PATHS[selectedVariant]}
              </dd>
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-between gap-x-3">
                <dt className="font-bold text-ink-2">{t.admin.checksumLabel}</dt>
                <dd>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(activeRecord.sha256)}
                    className="inline-flex items-center gap-1 min-h-11 px-1 font-extrabold cursor-pointer hover:underline"
                  >
                    {copiedSha === activeRecord.sha256 ? (
                      <Check aria-hidden="true" className="w-4 h-4 text-success" />
                    ) : (
                      <Copy aria-hidden="true" className="w-4 h-4" />
                    )}
                    {copiedSha === activeRecord.sha256 ? copy.copied : copy.copy}
                  </button>
                </dd>
              </div>
              <p className={`${TECH} p-2 bg-card border-2 border-ink rounded-lg`} dir="ltr">
                {activeRecord.sha256}
              </p>
            </div>
          </dl>
        </div>

        {/* ---------- Upload ---------- */}
        <div className={`${SHEET} flex flex-col gap-3`}>
          <div className="flex flex-wrap items-center justify-between gap-x-3">
            <h3 className="font-black">{t.admin.uploadNewVersion}</h3>
            <span className="text-xs font-bold text-ink-2">{copy.formats}</span>
          </div>

          {!stagedFile ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 min-h-[180px] p-5 text-center border-2 border-dashed border-ink rounded-2xl bg-card cursor-pointer hover:bg-tint-gift"
            >
              <Upload aria-hidden="true" className="w-7 h-7" />
              <span className="font-black">{t.admin.dropFileHere}</span>
              <span className="text-sm font-bold text-ink-2">{copy.stagingHint}</span>
              <span className="inline-flex items-center min-h-11 px-4 mt-1 bg-card text-sm font-extrabold border-2 border-ink rounded-[14px]">
                {t.admin.browseFiles}
              </span>
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 min-w-0 text-sm font-extrabold">
                  <FileCheck aria-hidden="true" className="w-4 h-4 shrink-0 text-success" />
                  <bdi className="truncate">{stagedFile.name}</bdi>
                </span>
                <Button variant="ghost" size="sm" onClick={clearStaged}>
                  {t.common.cancel}
                </Button>
              </div>

              <div className="flex items-center justify-center min-h-[140px] p-4 bg-[#FFF8EC] border-2 border-[#1E1E1E] rounded-xl">
                {stagedPreviewUrl && (
                  <img
                    src={stagedPreviewUrl}
                    alt={copy.previewAlt}
                    style={{
                      maxWidth: '100%',
                      maxHeight: selectedVariant === 'lockup' ? '48px' : '72px',
                      aspectRatio: selectedVariant === 'lockup' ? '1060 / 280' : '1 / 1',
                    }}
                  />
                )}
              </div>

              {stagedDimensions && stagedSha256 && (
                <dl className="p-3 space-y-1.5 bg-card border-2 border-ink rounded-xl text-sm">
                  <div className="flex flex-wrap justify-between gap-x-3">
                    <dt className="font-bold text-ink-2">{t.admin.actualDimensions}</dt>
                    <dd className="font-extrabold tabular-nums" dir="ltr">
                      {stagedDimensions.width} × {stagedDimensions.height} px
                    </dd>
                  </div>
                  <div className="flex flex-wrap justify-between gap-x-3">
                    <dt className="font-bold text-ink-2">{copy.fileSize}</dt>
                    <dd className="font-extrabold tabular-nums" dir="ltr">
                      {(stagedFile.size / 1024).toFixed(1)} KB
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold text-ink-2">{copy.newSha}</dt>
                    <dd className={TECH} dir="ltr">
                      {stagedSha256}
                    </dd>
                  </div>
                </dl>
              )}
            </div>
          )}

          {validationError && (
            <p role="alert" className="flex items-center gap-2 p-3 bg-danger-bg text-danger border-2 border-danger rounded-xl text-sm font-bold">
              <AlertTriangle aria-hidden="true" className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.webp,.svg,image/png,image/webp,image/svg+xml"
            className="hidden"
            onChange={handleFileSelect}
          />

          <Button
            fullWidth
            disabled={!stagedFile || isUploading}
            onClick={() => setIsConfirmModalOpen(true)}
            leftIcon={<Upload aria-hidden="true" className="w-4 h-4" />}
            className="mt-auto whitespace-normal"
          >
            {isUploading ? copy.publishing : copy.commit}
          </Button>
        </div>
      </div>

      {/* ---------- Version history ---------- */}
      <div className="mt-6">
        <h3 className="flex items-center gap-2 text-lg font-black">
          <History aria-hidden="true" className="w-5 h-5 shrink-0" />
          {t.admin.versionHistory}
        </h3>
        <p className="mb-3 text-sm font-bold text-ink-2">{copy.historyHint}</p>

        {historyRecords.length === 0 ? (
          <p className="p-4 text-center text-sm font-bold text-ink-2 border-2 border-dashed border-ink rounded-2xl">
            {copy.historyEmpty}
          </p>
        ) : (
          <ul className="space-y-2.5">
            {historyRecords.map((hist) => (
              <li key={hist.id} className={`${SHEET} flex flex-wrap items-center justify-between gap-3`}>
                <div className="min-w-0 flex-[1_1_240px]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-black">
                      {copy.version} v{hist.version}
                    </span>
                    <Stamp>{copy.archive}</Stamp>
                    <span className="text-sm font-bold text-ink-3">{new Date(hist.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className={`${TECH} mt-1 text-ink-2`} dir="ltr">
                    {hist.sha256}
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled={isUploading} onClick={() => setRollbackTarget(hist.version)}>
                  {t.admin.restoreVersion}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ---------- Confirm replacement ---------- */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title={t.admin.confirmReplacement}
        maxWidth="md"
      >
        <p className="font-bold text-ink-2">{t.admin.confirmReplacementMsg}</p>
        <dl className="mt-3 p-3 space-y-1.5 bg-tint-pets border-2 border-ink rounded-xl text-sm">
          <div className="flex flex-wrap justify-between gap-x-3">
            <dt className="font-bold text-ink-2">{copy.replacing}</dt>
            <dd className={TECH} dir="ltr">
              {FIXED_STORAGE_PATHS[selectedVariant]}
            </dd>
          </div>
          <div className="flex flex-wrap justify-between gap-x-3">
            <dt className="font-bold text-ink-2">{copy.newSize}</dt>
            <dd className="font-extrabold tabular-nums" dir="ltr">
              {stagedDimensions?.width} × {stagedDimensions?.height} px
            </dd>
          </div>
          <div className="flex flex-wrap justify-between gap-x-3">
            <dt className="font-bold text-ink-2">{copy.newVersion}</dt>
            <dd className="font-extrabold tabular-nums">v{activeRecord.version + 1}</dd>
          </div>
        </dl>
        <div className="flex flex-wrap justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => setIsConfirmModalOpen(false)} disabled={isUploading}>
            {t.common.cancel}
          </Button>
          <Button size="sm" onClick={handleConfirmUpload} disabled={isUploading}>
            {isUploading ? copy.publishing : copy.confirmPublish}
          </Button>
        </div>
      </Modal>

      {/* ---------- Confirm rollback ---------- */}
      <Modal
        isOpen={rollbackTarget !== null}
        onClose={() => setRollbackTarget(null)}
        title={copy.rollbackTitle.replace('{version}', String(rollbackTarget))}
        subtitle={copy.rollbackAsset.replace('{variant}', selectedVariant)}
        maxWidth="md"
      >
        <p className="font-bold text-ink-2">{copy.rollbackConfirm.replace('{version}', String(rollbackTarget))}</p>
        <div className="flex flex-wrap justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => setRollbackTarget(null)} disabled={isUploading}>
            {t.common.cancel}
          </Button>
          <Button size="sm" onClick={() => rollbackTarget !== null && handleRollback(rollbackTarget)} disabled={isUploading}>
            {copy.rollbackBtn}
          </Button>
        </div>
      </Modal>
    </Panel>
  );
};
