import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { HttpError } from './http-error';

export type AuthUser = {
  userId: string;
  email: string;
};

export function signAccessToken(user: AuthUser) {
  return jwt.sign({ email: user.email }, env.JWT_SECRET, {
    subject: user.userId,
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): AuthUser {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (typeof decoded === 'string') {
    throw new HttpError(401, 'Invalid token payload.');
  }

  if (typeof decoded.sub !== 'string' || typeof decoded.email !== 'string') {
    throw new HttpError(401, 'Token is missing required claims.');
  }

  return {
    userId: decoded.sub,
    email: decoded.email,
  };
}
