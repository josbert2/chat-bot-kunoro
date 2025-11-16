import { Request, Response, NextFunction } from 'express';
import { messagesService } from '../services/messages.service.js';
import { AppError } from '../middleware/error.middleware.js';

class MessagesController {
  async findByConversation(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [MESSAGES] GET /conversations/:conversationId/messages');

      if (!req.user) {
        throw new AppError(401, 'No autenticado');
      }

      const { conversationId } = req.params;
      const { limit, offset } = req.query;

      const result = await messagesService.findByConversation(conversationId, req.user.accountId, {
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });

      console.log('✅ [MESSAGES] Mensajes obtenidos');
      res.json(result);
    } catch (error) {
      console.error('❌ [MESSAGES] Error en findByConversation:', error);
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [MESSAGES] POST /conversations/:conversationId/messages');

      if (!req.user) {
        throw new AppError(401, 'No autenticado');
      }

      const { conversationId } = req.params;
      const { role, content, intent } = req.body;

      if (!role || !content) {
        throw new AppError(400, 'role y content son requeridos');
      }

      if (role !== 'user' && role !== 'assistant') {
        throw new AppError(400, 'role debe ser "user" o "assistant"');
      }

      const result = await messagesService.create(req.user.accountId, {
        conversationId,
        role,
        content,
        intent,
      });

      console.log('✅ [MESSAGES] Mensaje creado');
      res.status(201).json(result);
    } catch (error) {
      console.error('❌ [MESSAGES] Error en create:', error);
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [MESSAGES] GET /messages/:messageId');

      if (!req.user) {
        throw new AppError(401, 'No autenticado');
      }

      const { messageId } = req.params;
      const result = await messagesService.findOne(messageId, req.user.accountId);

      console.log('✅ [MESSAGES] Mensaje obtenido');
      res.json(result);
    } catch (error) {
      console.error('❌ [MESSAGES] Error en findOne:', error);
      next(error);
    }
  }
}

export const messagesController = new MessagesController();

