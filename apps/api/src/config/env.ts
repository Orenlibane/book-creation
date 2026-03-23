import path from 'node:path';
import { config } from 'dotenv';
import { z } from 'zod';

config();

const workspaceRoot = process.cwd();
const storageRoot = path.resolve(workspaceRoot, process.env.STORAGE_ROOT ?? './storage');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3333),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required.'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long.'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  FRONTEND_ORIGIN: z.string().default('http://localhost:4200'),
  STORAGE_ROOT: z.string().default(storageRoot),
  UPLOADS_DIR: z.string().default(path.join(storageRoot, 'uploads')),
  THUMBNAILS_DIR: z.string().default(path.join(storageRoot, 'thumbnails')),
  PDF_OUTPUT_DIR: z.string().default(path.join(storageRoot, 'pdf')),
  PYTHON_RENDERER_PATH: z.string().default(
    path.join(workspaceRoot, 'tools', 'renderer', 'render_book.py')
  ),
});

const parsedEnv = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
  STORAGE_ROOT: path.resolve(workspaceRoot, process.env.STORAGE_ROOT ?? './storage'),
  UPLOADS_DIR: path.resolve(workspaceRoot, process.env.UPLOADS_DIR ?? './storage/uploads'),
  THUMBNAILS_DIR: path.resolve(
    workspaceRoot,
    process.env.THUMBNAILS_DIR ?? './storage/thumbnails'
  ),
  PDF_OUTPUT_DIR: path.resolve(workspaceRoot, process.env.PDF_OUTPUT_DIR ?? './storage/pdf'),
  PYTHON_RENDERER_PATH: path.resolve(
    workspaceRoot,
    process.env.PYTHON_RENDERER_PATH ?? './tools/renderer/render_book.py'
  ),
});

if (!parsedEnv.success) {
  console.error('Environment validation failed.');
  console.error(parsedEnv.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration.');
}

export const env = parsedEnv.data;
