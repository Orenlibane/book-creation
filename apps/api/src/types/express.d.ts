import { AuthUser } from '../lib/jwt';

declare global {
  namespace Express {
    interface Request {
      auth: AuthUser;
    }
  }
}

export {};
