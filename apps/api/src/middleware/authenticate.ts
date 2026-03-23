import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../lib/jwt';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authorization = req.header('authorization');

  if (!authorization?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication token is missing.' });
    return;
  }

  try {
    const token = authorization.slice('Bearer '.length).trim();
    req.auth = verifyAccessToken(token);
    next();
  } catch {
    res.status(401).json({ message: 'Authentication token is invalid.' });
  }
}
