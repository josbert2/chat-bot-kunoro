import { Router } from 'express';
import { messagesController } from '../controllers/messages.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const messagesRouter = Router();

// Todas las rutas requieren autenticación
messagesRouter.use(authMiddleware);

// Mensaje individual
messagesRouter.get('/:messageId', messagesController.findOne);

