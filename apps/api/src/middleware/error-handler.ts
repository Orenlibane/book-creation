import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { ZodError } from 'zod';
import { HttpError } from '../lib/http-error';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  void next;

  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      message: 'Validation failed.',
      issues: error.flatten(),
    });
    return;
  }

  if (error instanceof multer.MulterError) {
    res.status(400).json({ message: error.message });
    return;
  }

  if (error instanceof Error) {
    console.error(error);
    res.status(500).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: 'Unexpected server error.' });
}
