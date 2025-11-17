import { Router } from 'express';
import { aiController } from '../controllers/ai.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const aiRouter = Router();

// Todos los endpoints requieren autenticación
aiRouter.use(authMiddleware);

aiRouter.post('/suggest-reply', aiController.suggestReply);

