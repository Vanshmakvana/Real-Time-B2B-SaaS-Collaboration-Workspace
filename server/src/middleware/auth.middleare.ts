import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomResponse } from './response';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_2026';

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const customRes = res as CustomResponse;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    customRes.error('Access denied. No token provided.', 401);
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    customRes.error('Invalid or expired token.', 403);
  }
};
