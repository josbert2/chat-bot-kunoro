import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { AppError } from '../middleware/error.middleware.js';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [AUTH] POST /auth/register');
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        throw new AppError(400, 'Faltan campos requeridos: name, email, password');
      }

      const result = await authService.register({ name, email, password });

      console.log('✅ [AUTH] Registro exitoso:', email);
      res.status(201).json(result);
    } catch (error) {
      console.error('❌ [AUTH] Error en registro:', error);
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [AUTH] POST /auth/login');
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError(400, 'Faltan campos requeridos: email, password');
      }

      const result = await authService.login({ email, password });

      console.log('✅ [AUTH] Login exitoso:', email);
      res.json(result);
    } catch (error) {
      console.error('❌ [AUTH] Error en login:', error);
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [AUTH] GET /auth/me');
      
      if (!req.user) {
        throw new AppError(401, 'No autenticado');
      }

      const result = await authService.getMe(req.user.userId);

      console.log('✅ [AUTH] Usuario obtenido:', req.user.email);
      res.json(result);
    } catch (error) {
      console.error('❌ [AUTH] Error en me:', error);
      next(error);
    }
  }
}

export const authController = new AuthController();

