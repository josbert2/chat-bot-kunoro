import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai.service.js';
import { AppError } from '../middleware/error.middleware.js';

class AiController {
  async suggestReply(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [AI] POST /ai/suggest-reply');

      const accountId = req.user!.accountId;
      const { conversationId, lastMessage } = req.body;

      if (!conversationId || !lastMessage) {
        throw new AppError(400, 'conversationId y lastMessage son requeridos');
      }

      const result = await aiService.suggestReply(accountId, conversationId, lastMessage);

      console.log('✅ [AI] Sugerencia generada');
      res.json(result);
    } catch (error) {
      console.error('❌ [AI] Error en suggestReply:', error);
      next(error);
    }
  }
}

export const aiController = new AiController();

