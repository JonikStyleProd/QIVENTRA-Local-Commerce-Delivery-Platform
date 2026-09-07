import React, { useState, useRef } from 'react';
import { Upload, X, Camera, RefreshCw, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { mediaService } from '../../services/MediaService';
import { MediaItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';

export interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: MediaItem['category'];
  entityId?: string;
  currentImageUrl?: string;
  title: string;
  onSuccess: (dataUrl: string, mediaItem: MediaItem) => void;
  onDelete?: () => void;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  category,
  entityId,
  currentImageUrl,
  title,
  onSuccess,
  onDelete,
}) => {
  const { t, isRTL } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = async (file: File) => {
    setErrorMessage(null);
    setIsSuccess(false);

    const validation = await mediaService.validateFile(file);
    if (!validation.valid) {
      const msg =
        validation.errorKey === 'media.fileTooLarge'
          ? (t.media?.fileTooLarge || 'File size exceeds 8MB limit')
          : validation.errorKey === 'media.invalidSignature'
          ? (t.media?.invalidSignature || 'Corrupted or unsupported image file. Only JPG, PNG and WebP allowed.')
          : (t.media?.invalidType || 'Only JPG, PNG and WebP formats supported');
      setErrorMessage(msg);
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setZoom(1);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      if (previewUrl) {
        onClose();
      }
      return;
    }

    try {
      setProgress(10);
      const mediaItem = await mediaService.uploadFile(
        selectedFile,
        category,
        entityId,
        (pct) => setProgress(pct)
      );

      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(mediaItem.dataUrl, mediaItem);
        onClose();
      }, 500);
    } catch (err: any) {
      setProgress(null);
      setErrorMessage(err.message || 'Upload failed');
    }
  };

  const handleDelete = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onDelete?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`relative w-full max-w-md rounded-2xl bg-surface p-5 sm:p-6 shadow-2xl border border-theme text-primary transition-all select-none ${
          isRTL ? 'text-right' : 'text-left'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-theme">
          <h3 className="text-base font-bold text-primary">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted hover:text-primary hover:bg-surface-elevated transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-[#FDECEB] dark:bg-[#3D1919] border border-[#C53030]/30 text-[#C53030] dark:text-[#FC8181] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {isSuccess && (
            <div className="p-3 rounded-xl bg-[#E8F5EE] dark:bg-[#132E20] border border-[#1E824C]/30 text-[#1E824C] dark:text-[#48BB78] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{t.media?.uploadSuccess || 'Image saved successfully!'}</span>
            </div>
          )}

          {/* Image Preview & Crop Area */}
          {previewUrl ? (
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-theme bg-[#EDE9DE] dark:bg-[#1A2220] shadow-inner">
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ transform: `scale(${zoom})` }}
                  className="w-full h-full object-cover transition-transform duration-100"
                />
              </div>

              {/* Zoom & Adjust */}
              <div className="w-full px-4 flex items-center gap-3 text-xs text-secondary">
                <span>{t.media?.zoom || 'Scale:'}</span>
                <input
                  type="range"
                  min="1"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-[#123B35] dark:accent-[#B8D96B]"
                />
                <span className="tabular-nums font-mono text-[11px]">{Math.round(zoom * 100)}%</span>
              </div>

              {/* Action Buttons for current image */}
              <div className="flex items-center gap-2 w-full pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-surface-elevated hover:bg-[#EDE9DE] dark:hover:bg-[#252E2B] border border-theme text-xs font-semibold text-primary transition"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-secondary" />
                  <span>{t.media?.replace || 'Replace'}</span>
                </button>
                {currentImageUrl && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#FDECEB] dark:bg-[#3D1919] hover:bg-red-200 dark:hover:bg-red-900/40 text-xs font-semibold text-[#C53030] dark:text-[#FC8181] transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t.media?.delete || 'Delete'}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Drag & Drop Dropzone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition ${
                isDragging
                  ? 'border-[#123B35] dark:border-[#B8D96B] bg-[#123B35]/5 dark:bg-[#B8D96B]/10'
                  : 'border-theme hover:border-secondary bg-surface-elevated'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#252E2B] shadow-xs flex items-center justify-center text-[#123B35] dark:text-[#B8D96B] mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-primary mb-1">
                {t.media?.dropzoneTitle || 'Drag and drop image here or click to browse'}
              </h4>
              <p className="text-[11px] text-muted max-w-xs mb-3">
                {t.media?.allowedFormats || 'Supports JPG, PNG, WebP up to 8MB'}
              </p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-surface border border-theme text-xs font-semibold text-primary">
                  {t.media?.browse || 'Choose File'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    cameraInputRef.current?.click();
                  }}
                  className="sm:hidden flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface border border-theme text-xs font-semibold text-primary"
                >
                  <Camera className="w-3.5 h-3.5 text-secondary" />
                  <span>{t.media?.camera || 'Camera'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {progress !== null && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-muted font-semibold">
                <span>{t.media?.uploading || 'Saving...'}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-elevated overflow-hidden border border-theme">
                <div
                  className="h-full bg-[#123B35] dark:bg-[#B8D96B] transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Hidden Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />
        </div>

        {/* Footer actions */}
        <div className="mt-5 pt-3 border-t border-theme flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={progress !== null}>
            {t.common?.cancel || 'Cancel'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={!selectedFile || progress !== null}
            isLoading={progress !== null}
          >
            {t.common?.save || 'Save Photo'}
          </Button>
        </div>
      </div>
    </div>
  );
};
