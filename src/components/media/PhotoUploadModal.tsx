import React, { useState, useRef } from 'react';
import { Upload, Camera, RefreshCw, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { mediaService } from '../../services/MediaService';
import { MediaItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

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
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileSelect = async (file: File) => {
    setErrorMessage(null);
    setIsSuccess(false);

    const validation = await mediaService.validateFile(file);
    if (!validation.valid) {
      const msg =
        validation.errorKey === 'media.fileTooLarge'
          ? t.media.fileTooLarge
          : validation.errorKey === 'media.invalidSignature'
          ? t.media.invalidSignature
          : t.media.invalidType;
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
      const mediaItem = await mediaService.uploadFile(selectedFile, category, entityId, (pct) => setProgress(pct));

      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(mediaItem.dataUrl, mediaItem);
        onClose();
      }, 500);
    } catch (err: any) {
      setProgress(null);
      setErrorMessage(err.message || t.media.invalidType);
    }
  };

  const handleDelete = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onDelete?.();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="space-y-4">
        {errorMessage && (
          <p role="alert" className="flex items-center gap-2 p-3 bg-danger-bg text-danger border-2 border-danger rounded-xl text-sm font-bold">
            <AlertCircle aria-hidden="true" className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </p>
        )}

        {isSuccess && (
          <p role="status" className="flex items-center gap-2 p-3 bg-success-bg text-success border-2 border-success rounded-xl text-sm font-bold">
            <CheckCircle2 aria-hidden="true" className="w-4 h-4 shrink-0" />
            <span>{t.media.uploadSuccess}</span>
          </p>
        )}

        {previewUrl ? (
          <div className="flex flex-col items-center gap-3">
            <div className="bg-card p-2 pb-3 -rotate-2 shadow-polaroid">
              <div className="w-44 h-44 desk:w-52 desk:h-52 overflow-hidden bg-tint-pets">
                <img
                  src={previewUrl}
                  alt=""
                  style={{ transform: `scale(${zoom})` }}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 w-full text-sm font-bold">
              <span className="shrink-0">{t.media.zoom}</span>
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 min-w-0 accent-action"
              />
              <span className="shrink-0 tabular-nums">{Math.round(zoom * 100)}%</span>
            </label>

            <div className="flex flex-wrap gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RefreshCw aria-hidden="true" className="w-4 h-4" />}
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                {t.media.replace}
              </Button>
              {currentImageUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Trash2 aria-hidden="true" className="w-4 h-4" />}
                  onClick={handleDelete}
                >
                  {t.media.delete}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-3 p-5 text-center border-2 border-dashed border-ink rounded-2xl ${
              isDragging ? 'bg-tint-gift' : 'bg-tint-pets'
            }`}
          >
            <Upload aria-hidden="true" className="w-7 h-7" />
            <div>
              <p className="font-black">{t.media.dropzoneTitle}</p>
              <p className="mt-0.5 text-sm font-bold text-ink-2">{t.media.allowedFormats}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                {t.media.browse}
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Camera aria-hidden="true" className="w-4 h-4" />}
                onClick={() => cameraInputRef.current?.click()}
                className="desk:hidden"
              >
                {t.media.camera}
              </Button>
            </div>
          </div>
        )}

        {progress !== null && (
          <div role="status">
            <div className="flex justify-between mb-1 text-sm font-bold">
              <span>{t.media.uploading}</span>
              <span className="tabular-nums">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-card border-2 border-ink rounded-full overflow-hidden">
              <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

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

        <div className="flex flex-wrap justify-end gap-2 pt-1">
          <Button variant="outline" size="sm" onClick={onClose} disabled={progress !== null}>
            {t.common.cancel}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!selectedFile || progress !== null} isLoading={progress !== null}>
            {t.common.save}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
