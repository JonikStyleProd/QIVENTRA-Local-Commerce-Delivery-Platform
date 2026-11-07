import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MAX_REMOTE_MARK_BYTES, isLightEnough } from '../services/brandAssets';

const repoFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (['node_modules', 'dist', '.git', 'design', 'public'].includes(entry.name)) return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? repoFiles(full) : [full];
  });

describe('the admin check in the database', () => {
  const dir = path.resolve('supabase/migrations');
  const latest = fs.readdirSync(dir).sort().at(-1) ?? '';
  const sql = fs.readFileSync(path.join(dir, latest), 'utf8');
  const body = sql.slice(sql.indexOf('CREATE OR REPLACE FUNCTION public.is_admin'), sql.indexOf('$$ LANGUAGE'));

  it('trusts only app_metadata', () => {
    expect(body).toContain("'app_metadata'");
    expect(body).not.toContain('user_metadata');
  });

  it('is described in the README', () => {
    expect(fs.readFileSync(path.resolve('README.md'), 'utf8')).toContain(latest);
  });
});

describe('secrets', () => {
  it('keeps none in the repository', () => {
    const patterns = [
      /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/, // JWT, the form of Supabase keys
      /sb_(secret|publishable)_[A-Za-z0-9]{10,}/,
      /AIza[0-9A-Za-z_-]{30,}/,
      /sk_live_[0-9a-zA-Z]{10,}/,
    ];
    repoFiles(path.resolve('.'))
      .filter((file) => !/\.(png|webp|ico|lock)$/.test(file) && !file.endsWith('brand.test.ts'))
      .forEach((file) => {
        const text = fs.readFileSync(file, 'utf8');
        patterns.forEach((pattern) => expect(pattern.test(text), `${file} matches ${pattern}`).toBe(false));
      });
  });

  it('documents only public variables', () => {
    const example = fs.readFileSync(path.resolve('.env.example'), 'utf8');
    expect(example).toContain('VITE_SUPABASE_URL=\n'.trimEnd());
    expect(example).not.toMatch(/^SUPABASE_SERVICE/m);
    expect(example).not.toMatch(/=\S+/);
  });
});

describe('the remote mark', () => {
  it('replaces the local one only when it is under the limit', () => {
    expect(isLightEnough(String(MAX_REMOTE_MARK_BYTES - 1))).toBe(true);
    expect(isLightEnough(String(MAX_REMOTE_MARK_BYTES))).toBe(false);
    expect(isLightEnough('2500000')).toBe(false);
    expect(isLightEnough(null)).toBe(false);
    expect(isLightEnough('')).toBe(false);
  });

  it('does not preload the heavy PNG in the page', () => {
    const html = fs.readFileSync(path.resolve('index.html'), 'utf8');
    expect(html).not.toMatch(/rel="preload"[^>]*\.png/);
    expect(html).not.toContain('supabase.co');
  });
});

describe('logo versions in storage', () => {
  type Row = { variant: string; version: number; storage_path: string; mime_type: string; is_active: boolean; asset_key: string };

  /** A small stand-in for Supabase with the same constraint as the table: storage_path is unique. */
  const makeFake = () => {
    const rows: Row[] = [
      { variant: 'mark', version: 1, storage_path: 'qiventra/v1/qiventra-mark-transparent-2k.png', mime_type: 'image/png', is_active: true, asset_key: 'qiventra_mark_v1' },
    ];
    const files = new Map<string, string>([['qiventra/v1/qiventra-mark-transparent-2k.png', 'first']]);

    const table = () => {
      const filters: [string, unknown][] = [];
      let patch: Partial<Row> | null = null;
      const matching = () => rows.filter((row) => filters.every(([key, value]) => row[key as keyof Row] === value));
      const query = {
        select: () => query,
        eq: (key: string, value: unknown) => {
          filters.push([key, value]);
          return query;
        },
        order: () => query,
        limit: () => Promise.resolve({ data: [...matching()].sort((a, b) => b.version - a.version).slice(0, 1) }),
        single: () => Promise.resolve({ data: matching()[0] ?? null, error: matching()[0] ? null : { message: 'none' } }),
        update: (next: Partial<Row>) => {
          patch = next;
          return query;
        },
        insert: ([row]: [Row]) => {
          if (rows.some((existing) => existing.storage_path === row.storage_path)) {
            return { select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'duplicate storage_path' } }) }) };
          }
          rows.push(row);
          return { select: () => ({ single: () => Promise.resolve({ data: row, error: null }) }) };
        },
        // An update runs when it is awaited, after all its filters are known, as in Supabase.
        then: (resolve: (value: { error: null }) => void) => {
          if (patch) matching().forEach((row) => Object.assign(row, patch));
          resolve({ error: null });
        },
      };
      return query;
    };

    const storage = {
      from: () => ({
        upload: async (target: string, file: { text: () => Promise<string> }, options: { upsert: boolean }) => {
          if (files.has(target) && !options.upsert) return { error: { message: 'exists' } };
          files.set(target, await file.text());
          return { error: null };
        },
        download: async (target: string) =>
          files.has(target)
            ? { data: new Blob([files.get(target)!]), error: null }
            : { data: null, error: { message: 'not found' } },
      }),
    };
    return { rows, files, client: { from: table, storage } };
  };

  const fake = makeFake();

  const loadService = async () => {
    vi.resetModules();
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.test');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon');
    vi.doMock('@supabase/supabase-js', () => ({ createClient: () => fake.client }));
    vi.stubGlobal('Image', class {
      naturalWidth = 10;
      naturalHeight = 10;
      onload?: () => void;
      set src(_: string) {
        queueMicrotask(() => this.onload?.());
      }
    });
    vi.stubGlobal('URL', Object.assign(URL, { createObjectURL: () => 'blob:x', revokeObjectURL: () => undefined }));
    return import('../services/supabase');
  };

  const logoFile = (content: string) => new File([content], 'logo.png', { type: 'image/png' });

  beforeEach(() => {
    fake.rows.splice(1);
    fake.rows[0].is_active = true;
    fake.files.clear();
    fake.files.set('qiventra/v1/qiventra-mark-transparent-2k.png', 'first');
  });

  it('gives each version its own path', async () => {
    const { versionedStoragePath } = await loadService();
    expect(versionedStoragePath('mark', 2, 'abcdef0123456789', 'image/png')).toBe('qiventra/history/mark/v2-abcdef012345.png');
    expect(versionedStoragePath('mark', 3, 'abcdef0123456789', 'image/webp')).not.toBe(
      versionedStoragePath('mark', 2, 'abcdef0123456789', 'image/webp')
    );
  });

  it('survives uploading twice in a row, even the same file', async () => {
    const { uploadBrandAsset } = await loadService();
    const upload = (content: string) => uploadBrandAsset({ file: logoFile(content), variant: 'mark', userRole: 'admin', userId: 'u' });

    expect((await upload('second')).success).toBe(true);
    expect((await upload('second')).success).toBe(true);

    const paths = fake.rows.map((row) => row.storage_path);
    expect(new Set(paths).size).toBe(paths.length);
    expect(fake.rows.filter((row) => row.is_active).map((row) => row.version)).toEqual([3]);
    expect(fake.files.get('qiventra/v1/qiventra-mark-transparent-2k.png')).toBe('second');
  });

  it('puts the old file back on rollback', async () => {
    const { uploadBrandAsset, rollbackBrandAsset } = await loadService();
    await uploadBrandAsset({ file: logoFile('second'), variant: 'mark', userRole: 'admin', userId: 'u' });
    expect(fake.files.get('qiventra/v1/qiventra-mark-transparent-2k.png')).toBe('second');

    // Version 1's own file is the live one here, so roll back to a history version instead.
    await uploadBrandAsset({ file: logoFile('third'), variant: 'mark', userRole: 'admin', userId: 'u' });
    const result = await rollbackBrandAsset({ variant: 'mark', targetVersion: 2, userRole: 'admin' });

    expect(result.success).toBe(true);
    expect(fake.files.get('qiventra/v1/qiventra-mark-transparent-2k.png')).toBe('second');
    expect(fake.rows.filter((row) => row.is_active).map((row) => row.version)).toEqual([2]);
  });

  it('changes nothing when the old file is missing', async () => {
    const { uploadBrandAsset, rollbackBrandAsset } = await loadService();
    await uploadBrandAsset({ file: logoFile('second'), variant: 'mark', userRole: 'admin', userId: 'u' });
    const lost = fake.rows.find((row) => row.version === 2)!;
    fake.files.delete(lost.storage_path);
    fake.rows.find((row) => row.version === 1)!.storage_path = 'qiventra/v1/gone.png';

    const result = await rollbackBrandAsset({ variant: 'mark', targetVersion: 1, userRole: 'admin' });

    expect(result.success).toBe(false);
    expect(fake.rows.filter((row) => row.is_active).map((row) => row.version)).toEqual([2]);
  });

  it('refuses anyone but an admin', async () => {
    const { uploadBrandAsset, rollbackBrandAsset } = await loadService();
    expect((await uploadBrandAsset({ file: logoFile('x'), variant: 'mark', userRole: 'customer' })).success).toBe(false);
    expect((await rollbackBrandAsset({ variant: 'mark', targetVersion: 1, userRole: 'courier' })).success).toBe(false);
  });
});
