import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Upload,
  RefreshCw,
  History,
  CheckCircle2,
  Copy,
  Check,
  FileCheck,
  AlertTriangle,
  ExternalLink,
  Layers,
  Database,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
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
  getBrandAssetPublicUrl,
} from '../../services/supabase';
import { BrandAssetRecord, BrandAssetVariant } from '../../types';

export const BrandAssetsManager: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { showToast } = useToast();
  const { currentUser } = useApp();

  const [selectedVariant, setSelectedVariant] = useState<BrandAssetVariant>('lockup');
  const [records, setRecords] = useState<BrandAssetRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageSource, setStorageSource] = useState<'supabase' | 'fallback'>('fallback');
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
    setStorageSource(res.source);
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

  const historyRecords = records.filter(
    (r) => r.variant === selectedVariant && !r.is_active
  );

  // Handle file selection and preview calculation
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValidationError(null);

    // 1. MIME type validation
    if (!ALLOWED_BRAND_MIME_TYPES.includes(file.type as any)) {
      const err = `Недопустимый формат (${file.type || 'неизвестно'}). Разрешены только PNG, WebP и проверенные SVG.`;
      setValidationError(err);
      showToast({ type: 'error', title: 'Ошибка формата файла', message: err });
      return;
    }

    // 2. Size validation
    if (file.size > MAX_BRAND_FILE_SIZE_BYTES) {
      const err = `Размер файла превышает лимит 10 МБ (${(file.size / (1024 * 1024)).toFixed(2)} МБ).`;
      setValidationError(err);
      showToast({ type: 'error', title: 'Превышен размер файла', message: err });
      return;
    }

    try {
      const [sha, dims] = await Promise.all([
        computeBlobSha256(file),
        readImageDimensions(file),
      ]);

      setStagedFile(file);
      setStagedSha256(sha);
      setStagedDimensions(dims);

      const objectUrl = URL.createObjectURL(file);
      setStagedPreviewUrl(objectUrl);

      showToast({
        type: 'info',
        title: 'Файл проверен и готов к предпросмотру',
        message: `Разрешение: ${dims.width} × ${dims.height} px | SHA-256 рассчитан.`,
      });
    } catch (err) {
      const msg = 'Не удалось прочитать изображение или рассчитать контрольную сумму.';
      setValidationError(msg);
      showToast({ type: 'error', title: 'Ошибка обработки', message: msg });
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
          title: 'Ошибка загрузки',
          message: res.error || 'Не удалось обновить официальный бренд-ассет.',
        });
        setIsUploading(false);
        return;
      }

      showToast({
        type: 'success',
        title: 'Бренд-ассет обновлен',
        message: `Новая версия v${res.record?.version || 2} успешно зафиксирована в Supabase Storage.`,
      });

      clearStaged();
      await loadRecords();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Исключение при обновлении',
        message: err instanceof Error ? err.message : 'Неизвестная ошибка',
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
          title: 'Ошибка отката версии',
          message: res.error || 'Не удалось откатить версию.',
        });
      } else {
        showToast({
          type: 'success',
          title: 'Версия восстановлена',
          message: `Бренд-ассет возвращен к версии v${version}.`,
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
      title: 'Скопировано в буфер',
      message: 'Контрольная сумма SHA-256 скопирована.',
    });
  };

  // 1. Role-based Access Gate: Only 'admin' role has permission
  const isAdmin = currentUser.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-red-200 dark:border-red-900/40 shadow-xs space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-primary">
              {t.admin.adminOnlyNotice}
            </h3>
            <p className="text-sm text-secondary mt-1 leading-relaxed">
              Управление официальными логотипами и бренд-ассетами QIVENTRA в Supabase Storage доступно только учетным записям с правами администратора платформы (Role: <span className="font-mono font-semibold">admin</span>). Покупатели, продавцы и курьеры не имеют прав на изменение бренд-ассетов.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted">
              <span>Текущая роль:</span>
              <Badge variant="neutral" size="sm">
                {currentUser.role}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-theme shadow-xs space-y-6">
      
      {/* Header & Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-theme">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#123B35] text-[#F3F1EA] flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            <ShieldCheck className="w-6 h-6 text-[#B8D96B]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-primary">
                {t.admin.brandAssetsTitle}
              </h2>
              <Badge variant="pistachio" size="sm">
                Supabase Storage
              </Badge>
              <Badge variant="success" size="sm">
                RLS Protected
              </Badge>
            </div>
            <p className="text-xs text-secondary mt-1 max-w-2xl">
              {t.admin.brandAssetsSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={loadRecords}
            disabled={isLoading}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
          >
            Обновить статус
          </Button>
        </div>
      </div>

      {/* Backend & Bucket Info Pill */}
      <div className="p-4 rounded-2xl bg-surface-elevated border border-theme flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#123B35] dark:text-[#B8D96B]" />
          <span className="font-medium text-primary">
            Bucket: <span className="font-mono text-[#123B35] dark:text-[#B8D96B] font-bold">{BRAND_ASSETS_BUCKET}</span>
          </span>
          <span className="text-muted">•</span>
          <span className="text-secondary">Публичное чтение активно, запись ограничена Admin RLS</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className="text-muted">
            {isSupabaseConfigured ? 'Supabase Connected' : 'Local Fallback Mode Active'}
          </span>
        </div>
      </div>

      {/* Tabs: Mark vs Lockup */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-surface-elevated border border-theme max-w-md">
        <button
          type="button"
          onClick={() => {
            setSelectedVariant('lockup');
            clearStaged();
          }}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            selectedVariant === 'lockup'
              ? 'bg-[#123B35] text-[#F3F1EA] shadow-xs'
              : 'text-secondary hover:text-primary'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{t.admin.lockupTitle}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedVariant('mark');
            clearStaged();
          }}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            selectedVariant === 'mark'
              ? 'bg-[#123B35] text-[#F3F1EA] shadow-xs'
              : 'text-secondary hover:text-primary'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{t.admin.markTitle}</span>
        </button>
      </div>

      {/* Main Grid: Active Version & Upload Staging */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Currently Active Version */}
        <div className="p-5 sm:p-6 rounded-2xl bg-surface-elevated border border-theme flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  {t.admin.currentActiveVersion}
                </span>
                <Badge variant="success" size="sm">
                  Active (v{activeRecord.version})
                </Badge>
              </div>
              <span className="text-[11px] font-mono text-muted">
                {FIXED_STORAGE_PATHS[selectedVariant]}
              </span>
            </div>

            {/* Official Logo Render Stage: Both Light and Dark Theme Real-World Previews */}
            {selectedVariant === 'lockup' ? (
              <div className="space-y-3">
                {/* Light theme: darkLockup (dark letters on light background) */}
                <div className="p-4 rounded-xl bg-[#F3F1EA] border border-[#E4E1D7] flex flex-col items-center justify-center gap-2">
                  <span className="text-[10px] font-semibold text-[#4D5956] uppercase tracking-wider">
                    Light Theme & Header (darkLockup)
                  </span>
                  <img
                    src={BRAND_ASSETS.darkLockup}
                    alt="QIVENTRA"
                    className="brand-logo"
                    style={{
                      display: 'block',
                      width: 'auto',
                      height: 'auto',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      objectPosition: 'center',
                      flexShrink: 0,
                      transform: 'none',
                      filter: 'none',
                      maxHeight: '40px',
                      aspectRatio: '4096 / 1120',
                    }}
                    onError={(e) => {
                      e.currentTarget.src = OFFICIAL_BRAND_METADATA.darkLockup.localPng;
                    }}
                  />
                </div>

                {/* Dark theme & Footer: lightLockup (light letters on dark background) */}
                <div className="p-4 rounded-xl bg-[#123B35] border border-[#1C524A] flex flex-col items-center justify-center gap-2">
                  <span className="text-[10px] font-semibold text-[#B8D96B] uppercase tracking-wider">
                    Dark Theme & Footer (lightLockup)
                  </span>
                  <img
                    src={BRAND_ASSETS.lightLockup}
                    alt="QIVENTRA"
                    className="brand-logo"
                    style={{
                      display: 'block',
                      width: 'auto',
                      height: 'auto',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      objectPosition: 'center',
                      flexShrink: 0,
                      transform: 'none',
                      filter: 'none',
                      maxHeight: '40px',
                      aspectRatio: '4096 / 1120',
                    }}
                    onError={(e) => {
                      e.currentTarget.src = OFFICIAL_BRAND_METADATA.lightLockup.localPng;
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="min-h-[160px] p-6 rounded-2xl bg-surface-elevated border border-theme flex flex-col items-center justify-center gap-2 shadow-inner">
                <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider">
                  Mobile Header & Icon (mark: 2048 × 2048)
                </span>
                <img
                  src={BRAND_ASSETS.mark}
                  alt="QIVENTRA"
                  className="brand-logo"
                  style={{
                    display: 'block',
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center',
                    flexShrink: 0,
                    transform: 'none',
                    filter: 'none',
                    maxHeight: '64px',
                    aspectRatio: '1 / 1',
                  }}
                  onError={(e) => {
                    e.currentTarget.src = OFFICIAL_BRAND_METADATA.mark.localPng;
                  }}
                />
              </div>
            )}

            {/* Specifications & Verified Checksums */}
            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-theme/60">
                <span className="text-secondary">{t.admin.actualDimensions}:</span>
                <span className="font-mono font-semibold text-primary">
                  {activeRecord.width || OFFICIAL_BRAND_METADATA[selectedVariant].width} × {activeRecord.height || OFFICIAL_BRAND_METADATA[selectedVariant].height} px
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-theme/60">
                <span className="text-secondary">MIME Type:</span>
                <span className="font-mono text-primary font-medium">{activeRecord.mime_type}</span>
              </div>

              <div className="space-y-1 py-1">
                <div className="flex items-center justify-between">
                  <span className="text-secondary">{t.admin.checksumLabel}:</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(activeRecord.sha256)}
                    className="text-[11px] text-[#123B35] dark:text-[#B8D96B] hover:underline flex items-center gap-1 font-medium"
                  >
                    {copiedSha === activeRecord.sha256 ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedSha === activeRecord.sha256 ? 'Скопировано' : 'Копировать'}</span>
                  </button>
                </div>
                <p className="font-mono text-[10px] break-all bg-surface p-2 rounded-lg border border-theme text-secondary select-all">
                  {activeRecord.sha256}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-muted flex items-center justify-between">
            <span>Каноничный путь: <code className="font-mono">{activeRecord.storage_path}</code></span>
            <span>Версия: v{activeRecord.version}</span>
          </div>
        </div>

        {/* Card 2: Upload Staging & Live Preview */}
        <div className="p-5 sm:p-6 rounded-2xl bg-surface-elevated border border-theme flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                {t.admin.uploadNewVersion}
              </span>
              <span className="text-[11px] text-muted">PNG, WebP, SVG (макс. 10 MB)</span>
            </div>

            {/* Staging Dropzone or Preview */}
            {!stagedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[160px] p-6 rounded-2xl border-2 border-dashed border-theme hover:border-[#123B35] dark:hover:border-[#B8D96B] transition-colors flex flex-col items-center justify-center gap-3 cursor-pointer bg-surface group"
              >
                <div className="w-10 h-10 rounded-xl bg-surface-elevated text-secondary group-hover:text-[#123B35] dark:group-hover:text-[#B8D96B] flex items-center justify-center transition">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-primary">
                    {t.admin.dropFileHere}
                  </p>
                  <p className="text-[11px] text-muted">
                    Файл будет проверен, измерен и вычислена контрольная сумма до сохранения
                  </p>
                </div>
                <Button variant="outline" size="sm" type="button">
                  {t.admin.browseFiles}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-500" />
                    <span>{stagedFile.name}</span>
                  </span>
                  <button
                    type="button"
                    onClick={clearStaged}
                    className="text-xs text-red-500 hover:underline font-medium"
                  >
                    Отменить
                  </button>
                </div>

                {/* Staged Live Preview */}
                <div className="min-h-[140px] p-4 rounded-2xl bg-[#F3F1EA] border border-[#E4E1D7] flex items-center justify-center">
                  {stagedPreviewUrl && (
                    <img
                      src={stagedPreviewUrl}
                      alt="Staged Brand Asset Preview"
                      style={{
                        display: 'block',
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        objectPosition: 'center',
                        flexShrink: 0,
                        transform: 'none',
                        filter: 'none',
                        maxHeight: selectedVariant === 'lockup' ? '48px' : '72px',
                        aspectRatio: selectedVariant === 'lockup' ? '1060 / 280' : '1 / 1',
                      }}
                    />
                  )}
                </div>

                {/* Staged Metadata */}
                {stagedDimensions && stagedSha256 && (
                  <div className="p-3 rounded-xl bg-surface border border-theme text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-secondary">{t.admin.actualDimensions}:</span>
                      <span className="font-mono font-bold text-primary">
                        {stagedDimensions.width} × {stagedDimensions.height} px
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-secondary">Размер файла:</span>
                      <span className="font-mono text-primary">
                        {(stagedFile.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-secondary text-[11px]">Новый SHA-256:</span>
                      <p className="font-mono text-[10px] break-all text-primary bg-surface-elevated p-1.5 rounded border border-theme">
                        {stagedSha256}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {validationError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.webp,.svg,image/png,image/webp,image/svg+xml"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              fullWidth
              disabled={!stagedFile || isUploading}
              onClick={() => setIsConfirmModalOpen(true)}
              leftIcon={<Upload className="w-4 h-4" />}
            >
              {isUploading ? 'Публикация в Supabase Storage...' : 'Зафиксировать замену ассета'}
            </Button>
          </div>
        </div>

      </div>

      {/* Version History & Rollback Section */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#123B35] dark:text-[#B8D96B]" />
            <h3 className="text-sm font-bold text-primary">
              {t.admin.versionHistory} ({selectedVariant})
            </h3>
          </div>
          <span className="text-xs text-secondary">
            Предыдущие версии сохраняются для безопасного отката
          </span>
        </div>

        {historyRecords.length === 0 ? (
          <div className="p-4 rounded-2xl bg-surface-elevated border border-theme text-xs text-secondary text-center">
            Предыдущих версий для этого ассета пока нет. Текущая активная версия является базовой (v1).
          </div>
        ) : (
          <div className="space-y-2">
            {historyRecords.map((hist) => (
              <div
                key={hist.id}
                className="p-3.5 rounded-2xl bg-surface-elevated border border-theme flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">Версия v{hist.version}</span>
                    <Badge variant="neutral" size="sm">Архив</Badge>
                    <span className="text-muted">
                      {new Date(hist.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-muted truncate max-w-md">
                    SHA-256: {hist.sha256}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isUploading}
                    onClick={() => setRollbackTarget(hist.version)}
                  >
                    {t.admin.restoreVersion}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Replacement */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface rounded-3xl border border-theme p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-primary">
                  {t.admin.confirmReplacement}
                </h4>
                <p className="text-xs text-secondary mt-0.5">
                  Замена официального ассета: <span className="font-bold font-mono">{FIXED_STORAGE_PATHS[selectedVariant]}</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              {t.admin.confirmReplacementMsg}
            </p>

            <div className="p-3 rounded-xl bg-surface-elevated border border-theme text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-secondary">Новый размер:</span>
                <span className="text-primary">{stagedDimensions?.width} × {stagedDimensions?.height} px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Новая версия:</span>
                <span className="text-primary">v{activeRecord.version + 1}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsConfirmModalOpen(false)}
                disabled={isUploading}
              >
                Отмена
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmUpload}
                disabled={isUploading}
              >
                {isUploading ? 'Публикация...' : 'Подтвердить и опубликовать'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Rollback */}
      {rollbackTarget !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface rounded-3xl border border-theme p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#123B35] text-[#B8D96B] flex items-center justify-center shrink-0">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-primary">
                  Восстановление версии v{rollbackTarget}
                </h4>
                <p className="text-xs text-secondary mt-0.5">
                  Официальный ассет {selectedVariant}
                </p>
              </div>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              Вы уверены, что хотите переключить активный логотип на версию v{rollbackTarget}? Текущий активный ассет перейдет в архив.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRollbackTarget(null)}
                disabled={isUploading}
              >
                Отмена
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleRollback(rollbackTarget)}
                disabled={isUploading}
              >
                Восстановить версию
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
