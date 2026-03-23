import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { asyncHandler } from '../../lib/async-handler';
import { HttpError } from '../../lib/http-error';
import { signAccessToken } from '../../lib/jwt';
import { prisma } from '../../lib/prisma';
import { loginSchema, registerSchema } from './auth.schemas';

const authUserSelect = {
  id: true,
  email: true,
  createdAt: true,
} as const;

export const authRouter = Router();

authRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { email, password } = registerSchema.parse(req.body);
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existingUser) {
      throw new HttpError(409, 'An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
      },
      select: authUserSelect,
    });

    const token = signAccessToken({
      userId: user.id,
      email: user.email,
    });

    res.status(201).json({ token, user });
  })
);

authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);
    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        ...authUserSelect,
        passwordHash: true,
      },
    });

    if (!user) {
      throw new HttpError(401, 'Invalid email or password.');
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      throw new HttpError(401, 'Invalid email or password.');
    }

    const token = signAccessToken({
      userId: user.id,
      email: user.email,
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  })
);
