import type { RequestHandler } from 'express';
import { adminAuth } from '../config/firebase.js';
import { ApiError } from '../lib/ApiError.js';

export interface AuthUser {
  uid: string;
  email: string | null;
  role: string | null;
  isAdmin: boolean;
}

export const verifyFirebaseToken: RequestHandler = async (req, _res, next) => {
  try {
    const header = req.get('authorization') ?? '';
    const [scheme, token] = header.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) throw ApiError.unauthorized();

    const decoded = await adminAuth.verifyIdToken(token, true);
    req.user = {
      uid: decoded.uid,
      email: decoded.email ?? null,
      role: (decoded['role'] as string | undefined) ?? null,
      isAdmin: decoded['admin'] === true,
    } satisfies AuthUser;
    next();
  } catch (err) {
    next(err instanceof ApiError ? err : ApiError.unauthorized('Invalid or expired token'));
  }
};

export const requireAdmin: RequestHandler = (req, _res, next) => {
  if (!req.user?.isAdmin) return next(ApiError.forbidden());
  next();
};
