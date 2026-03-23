import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { env } from '../../config/env';
import { prisma } from '../../lib/prisma';
import {
  storageDirectories,
  toAbsoluteStoragePath,
  toRelativeStoragePath,
} from '../../lib/storage';

type RenderableBook = {
  id: string;
  title: string;
  pagesLayout: unknown;
};

type RenderPayload = {
  bookId: string;
  title: string;
  outputPath: string;
  pagesLayout: unknown;
};

export async function renderBook(book: RenderableBook) {
  const outputPath = toAbsoluteStoragePath(`pdf/${book.id}.pdf`);
  const payloadPath = path.join(storageDirectories.jobs, `${book.id}.json`);
  const payload: RenderPayload = {
    bookId: book.id,
    title: book.title,
    outputPath,
    pagesLayout: book.pagesLayout,
  };

  await fs.writeFile(payloadPath, JSON.stringify(payload, null, 2), 'utf8');

  const stdoutChunks: Buffer[] = [];
  const stderrChunks: Buffer[] = [];

  const child = spawn('python3', [env.PYTHON_RENDERER_PATH, payloadPath], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (chunk: Buffer) => stdoutChunks.push(chunk));
  child.stderr.on('data', (chunk: Buffer) => stderrChunks.push(chunk));

  child.once('close', async (code) => {
    if (code === 0) {
      await prisma.book.update({
        where: { id: book.id },
        data: {
          status: 'Completed',
          finalPdfPath: toRelativeStoragePath(outputPath),
        },
      });
      return;
    }

    const stderr = Buffer.concat(stderrChunks).toString('utf8');
    const stdout = Buffer.concat(stdoutChunks).toString('utf8');
    console.error('PDF rendering failed', {
      bookId: book.id,
      code,
      stdout,
      stderr,
    });

    await prisma.book.update({
      where: { id: book.id },
      data: {
        status: 'Draft',
      },
    });
  });

  child.once('error', async (error) => {
    console.error('Failed to spawn PDF renderer', error);
    await prisma.book.update({
      where: { id: book.id },
      data: {
        status: 'Draft',
      },
    });
  });
}
