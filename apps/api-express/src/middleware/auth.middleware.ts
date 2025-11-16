import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware.js';

export interface AuthUser {
  userId: string;
  accountId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ [AUTH] No se proporcionó header de autenticación');
      throw new AppError(401, 'No se proporcionó token de autenticación');
    }

    const token = authHeader.split(' ')[1];
    console.log('🔵 [AUTH] Token recibido (primeros 20 chars):', token.substring(0, 20) + '...');
    
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-me';
    console.log('🔵 [AUTH] Usando JWT_SECRET:', secret === 'your-secret-key-change-me' ? 'DEFAULT' : 'FROM ENV');

    const decoded = jwt.verify(token, secret) as AuthUser;
    console.log('✅ [AUTH] Token válido para usuario:', decoded.email);
    
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error('❌ [AUTH] Token inválido:', error.message);
      next(new AppError(401, 'Token inválido'));
    } else if (error instanceof jwt.TokenExpiredError) {
      console.error('❌ [AUTH] Token expirado');
      next(new AppError(401, 'Token expirado'));
    } else {
      console.error('❌ [AUTH] Error desconocido:', error);
      next(error);
    }
  }
}

