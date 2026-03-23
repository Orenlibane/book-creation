import { Book, Prisma } from '@prisma/client';
import { Router } from 'express';
import { asyncHandler } from '../../lib/async-handler';
import { HttpError } from '../../lib/http-error';
import { prisma } from '../../lib/prisma';
import { toPublicStorageUrl } from '../../lib/storage';
import { renderBook } from './book-renderer';
import { createBookSchema, updateBookSchema } from './book.schemas';

type BookResponse = Pick<
  Book,
  'id' | 'title' | 'status' | 'pagesLayout' | 'finalPdfPath' | 'createdAt' | 'updatedAt'
> & {
  finalPdfUrl: string | null;
};

function toBookResponse(book: Book): BookResponse {
  return {
    id: book.id,
    title: book.title,
    status: book.status,
    pagesLayout: book.pagesLayout,
    finalPdfPath: book.finalPdfPath,
    finalPdfUrl: toPublicStorageUrl(book.finalPdfPath),
    createdAt: book.createdAt,
    updatedAt: book.updatedAt,
  };
}

async function getOwnedBookOrThrow(bookId: string, userId: string) {
  const book = await prisma.book.findFirst({
    where: { id: bookId, userId },
  });

  if (!book) {
    throw new HttpError(404, 'Book not found.');
  }

  return book;
}

export const booksRouter = Router();

booksRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const { title } = createBookSchema.parse(req.body);
    const book = await prisma.book.create({
      data: {
        userId: req.auth.userId,
        title: title?.trim() || undefined,
        pagesLayout: [] as Prisma.InputJsonValue,
      },
    });

    res.status(201).json({ item: toBookResponse(book) });
  })
);

booksRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const book = await getOwnedBookOrThrow(req.params.id, req.auth.userId);
    res.json({ item: toBookResponse(book) });
  })
);

booksRouter.put(
  '/:id',
  asyncHandler(async (req, res) => {
    await getOwnedBookOrThrow(req.params.id, req.auth.userId);
    const { title, pagesLayout } = updateBookSchema.parse(req.body);

    const book = await prisma.book.update({
      where: { id: req.params.id },
      data: {
        title,
        pagesLayout: pagesLayout as Prisma.InputJsonValue | undefined,
      },
    });

    res.json({ item: toBookResponse(book) });
  })
);

booksRouter.post(
  '/:id/generate',
  asyncHandler(async (req, res) => {
    const book = await getOwnedBookOrThrow(req.params.id, req.auth.userId);

    if (book.status === 'Rendering') {
      throw new HttpError(409, 'This book is already being rendered.');
    }

    const renderingBook = await prisma.book.update({
      where: { id: book.id },
      data: { status: 'Rendering' },
    });

    void renderBook(renderingBook);

    res.status(202).json({
      item: toBookResponse(renderingBook),
    });
  })
);

booksRouter.get(
  '/:id/status',
  asyncHandler(async (req, res) => {
    const book = await getOwnedBookOrThrow(req.params.id, req.auth.userId);

    res.json({
      id: book.id,
      status: book.status,
      finalPdfPath: book.finalPdfPath,
      finalPdfUrl: toPublicStorageUrl(book.finalPdfPath),
      updatedAt: book.updatedAt,
    });
  })
);
