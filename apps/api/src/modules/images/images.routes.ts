import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { asyncHandler } from '../../lib/async-handler';
import { HttpError } from '../../lib/http-error';
import { prisma } from '../../lib/prisma';
import { toAbsoluteStoragePath, toPublicStorageUrl } from '../../lib/storage';

type ImageAssetRecord = {
  id: string;
  userId: string;
  filePath: string;
  width: number;
  height: number;
  createdAt: Date;
};

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const extensionByMimeType: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 12,
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    if (allowedMimeTypes.has(file.mimetype)) {
      callback(null, true);
      return;
    }

    callback(new HttpError(400, 'Only JPG, PNG, and WEBP files are supported.'));
  },
});

function buildThumbnailPath(asset: ImageAssetRecord) {
  return `thumbnails/${asset.userId}/${asset.id}.webp`;
}

function toImageResponse(asset: ImageAssetRecord) {
  return {
    id: asset.id,
    filePath: asset.filePath,
    fileUrl: toPublicStorageUrl(asset.filePath),
    thumbnailUrl: toPublicStorageUrl(buildThumbnailPath(asset)),
    width: asset.width,
    height: asset.height,
    createdAt: asset.createdAt,
  };
}

export const imagesRouter = Router();
export const uploadRouter = Router();

imagesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const items = await prisma.imageAsset.findMany({
      where: { userId: req.auth.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      items: items.map(toImageResponse),
    });
  })
);

uploadRouter.post(
  '/',
  upload.array('files', 12),
  asyncHandler(async (req, res) => {
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files?.length) {
      throw new HttpError(400, 'Please attach at least one image.');
    }

    const items = await Promise.all(
      files.map(async (file) => {
        const assetId = crypto.randomUUID();
        const extension = extensionByMimeType[file.mimetype];
        const originalRelativePath = `uploads/${req.auth.userId}/${assetId}${extension}`;
        const thumbnailRelativePath = `thumbnails/${req.auth.userId}/${assetId}.webp`;
        const originalAbsolutePath = toAbsoluteStoragePath(originalRelativePath);
        const thumbnailAbsolutePath = toAbsoluteStoragePath(thumbnailRelativePath);

        await fs.mkdir(path.dirname(originalAbsolutePath), { recursive: true });
        await fs.mkdir(path.dirname(thumbnailAbsolutePath), { recursive: true });

        const image = sharp(file.buffer).rotate();
        const metadata = await image.metadata();

        if (!metadata.width || !metadata.height) {
          throw new HttpError(400, `Could not read image dimensions for ${file.originalname}.`);
        }

        await image.clone().toFile(originalAbsolutePath);
        await image
          .clone()
          .resize({
            width: 640,
            height: 640,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: 84 })
          .toFile(thumbnailAbsolutePath);

        const asset = await prisma.imageAsset.create({
          data: {
            id: assetId,
            userId: req.auth.userId,
            filePath: originalRelativePath,
            width: metadata.width,
            height: metadata.height,
          },
        });

        return toImageResponse(asset);
      })
    );

    res.status(201).json({ items });
  })
);
