import fs from 'node:fs';
import path from 'node:path';
import { env } from '../config/env';

export const storageDirectories = {
  uploads: env.UPLOADS_DIR,
  thumbnails: env.THUMBNAILS_DIR,
  pdf: env.PDF_OUTPUT_DIR,
  jobs: path.join(env.PDF_OUTPUT_DIR, 'jobs'),
};

export function ensureStorageDirectories() {
  Object.values(storageDirectories).forEach((directory) => {
    fs.mkdirSync(directory, { recursive: true });
  });
}

export function toAbsoluteStoragePath(relativePath: string) {
  return path.join(env.STORAGE_ROOT, relativePath);
}

export function toRelativeStoragePath(absolutePath: string) {
  return path.relative(env.STORAGE_ROOT, absolutePath).split(path.sep).join('/');
}

export function toPublicStorageUrl(relativePath: string | null | undefined) {
  if (!relativePath) {
    return null;
  }

  return `/storage/${relativePath.replace(/\\/g, '/')}`;
}
