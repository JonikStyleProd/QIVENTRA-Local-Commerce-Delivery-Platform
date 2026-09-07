import { MediaItem } from '../types';

const DB_NAME = 'qiventra_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'media_files';
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

class MediaService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not supported'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('entityId', 'entityId', { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  /**
   * Validate file signature (magic bytes), mime type, and file size.
   * Disallows SVG, HTML, scripts, executables.
   */
  async validateFile(file: File): Promise<{ valid: boolean; errorKey?: string; mimeType?: string }> {
    if (!file) {
      return { valid: false, errorKey: 'media.noFile' };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return { valid: false, errorKey: 'media.fileTooLarge' };
    }

    // Check extension
    const extMatch = file.name.match(/\.([0-9a-z]+)$/i);
    const ext = extMatch ? extMatch[1].toLowerCase() : '';
    const allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
    if (!allowedExts.includes(ext)) {
      return { valid: false, errorKey: 'media.invalidType' };
    }

    // Inspect first 12 bytes for true magic byte signatures
    try {
      const buffer = await file.slice(0, 12).arrayBuffer();
      const bytes = new Uint8Array(buffer);

      // JPEG: FF D8 FF
      const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;

      // PNG: 89 50 4E 47 0D 0A 1A 0A
      const isPng =
        bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4e &&
        bytes[3] === 0x47 &&
        bytes[4] === 0x0d &&
        bytes[5] === 0x0a &&
        bytes[6] === 0x1a &&
        bytes[7] === 0x0a;

      // WebP: RIFF (52 49 46 46) ... WEBP (57 45 42 50)
      const isWebp =
        bytes[0] === 0x52 &&
        bytes[1] === 0x49 &&
        bytes[2] === 0x46 &&
        bytes[3] === 0x46 &&
        bytes[8] === 0x57 &&
        bytes[9] === 0x45 &&
        bytes[10] === 0x42 &&
        bytes[11] === 0x50;

      if (!isJpeg && !isPng && !isWebp) {
        return { valid: false, errorKey: 'media.invalidSignature' };
      }

      const mimeType = isJpeg ? 'image/jpeg' : isPng ? 'image/png' : 'image/webp';
      return { valid: true, mimeType };
    } catch {
      return { valid: false, errorKey: 'media.readError' };
    }
  }

  /**
   * Upload and persist file in IndexedDB with real progress updates
   */
  async uploadFile(
    file: File,
    category: MediaItem['category'],
    entityId?: string,
    onProgress?: (progress: number) => void
  ): Promise<MediaItem> {
    const validation = await this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.errorKey || 'Validation failed');
    }

    // Emulate smooth progress reading
    onProgress?.(15);

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          const pct = Math.round(15 + (e.loaded / e.total) * 60);
          onProgress(pct);
        }
      };
      reader.readAsDataURL(file);
    });

    onProgress?.(80);

    const extMatch = file.name.match(/\.([0-9a-z]+)$/i);
    const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
    const safeFilename = `media_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const mediaItem: MediaItem = {
      id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      category,
      filename: safeFilename,
      mimeType: validation.mimeType || file.type,
      dataUrl,
      sizeBytes: file.size,
      uploadedAt: new Date().toISOString(),
      entityId,
    };

    // Save into IndexedDB
    const db = await this.getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(mediaItem);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    onProgress?.(100);
    return mediaItem;
  }

  /**
   * Retrieve single media item by ID
   */
  async getMedia(id: string): Promise<MediaItem | null> {
    try {
      const db = await this.getDB();
      return new Promise<MediaItem | null>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return null;
    }
  }

  /**
   * Delete media item by ID
   */
  async deleteMedia(id: string): Promise<boolean> {
    try {
      const db = await this.getDB();
      return new Promise<boolean>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return false;
    }
  }

  /**
   * List media items by entity
   */
  async getMediaByEntity(entityId: string): Promise<MediaItem[]> {
    try {
      const db = await this.getDB();
      return new Promise<MediaItem[]>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const index = store.index('entityId');
        const req = index.getAll(entityId);
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return [];
    }
  }
}

export const mediaService = new MediaService();
