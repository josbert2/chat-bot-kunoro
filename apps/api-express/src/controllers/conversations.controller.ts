import { Request, Response, NextFunction } from 'express';
import { conversationsService } from '../services/conversations.service.js';
import { AppError } from '../middleware/error.middleware.js';

class ConversationsController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [CONVERSATIONS] GET /conversations');

      if (!req.user) {
        throw new AppError(401, 'No autenticado');
      }

      const { siteId, status, limit, offset } = req.query;

      const result = await conversationsService.findAll(req.user.accountId, {
        siteId: siteId as string,
        status: status as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });

      console.log('✅ [CONVERSATIONS] Conversaciones obtenidas:', result.length);
      res.json(result);
    } catch (error) {
      console.error('❌ [CONVERSATIONS] Error en findAll:', error);
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [CONVERSATIONS] GET /conversations/:conversationId');

      if (!req.user) {
        throw new AppError(401, 'No autenticado');
      }

      const { conversationId } = req.params;
      const result = await conversationsService.findOne(conversationId, req.user.accountId);

      console.log('✅ [CONVERSATIONS] Conversación obtenida');
      res.json(result);
    } catch (error) {
      console.error('❌ [CONVERSATIONS] Error en findOne:', error);
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [CONVERSATIONS] POST /conversations');

      if (!req.user) {
        throw new AppError(401, 'No autenticado');
      }

      const { siteId, visitorId, metadata } = req.body;

      if (!siteId) {
        throw new AppError(400, 'siteId es requerido');
      }

      const result = await conversationsService.create(req.user.accountId, {
        siteId,
        visitorId,
        metadata,
      });

      console.log('✅ [CONVERSATIONS] Conversación creada');
      res.status(201).json(result);
    } catch (error) {
      console.error('❌ [CONVERSATIONS] Error en create:', error);
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [CONVERSATIONS] PATCH /conversations/:conversationId');

      if (!req.user) {
        throw new AppError(401, 'No autenticado');
      }

      const { conversationId } = req.params;
      const result = await conversationsService.update(conversationId, req.user.accountId, req.body);

      console.log('✅ [CONVERSATIONS] Conversación actualizada');
      res.json(result);
    } catch (error) {
      console.error('❌ [CONVERSATIONS] Error en update:', error);
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [CONVERSATIONS] DELETE /conversations/:conversationId');

      if (!req.user) {
        throw new AppError(401, 'No autenticado');
      }

      const { conversationId } = req.params;
      const result = await conversationsService.delete(conversationId, req.user.accountId);

      console.log('✅ [CONVERSATIONS] Conversación eliminada');
      res.json(result);
    } catch (error) {
      console.error('❌ [CONVERSATIONS] Error en delete:', error);
      next(error);
    }
  }
}

export const conversationsController = new ConversationsController();

