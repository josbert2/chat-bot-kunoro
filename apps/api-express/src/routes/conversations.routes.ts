import { Router } from 'express';
import { conversationsController } from '../controllers/conversations.controller.js';
import { messagesController } from '../controllers/messages.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const conversationsRouter = Router();

// Todas las rutas requieren autenticación
conversationsRouter.use(authMiddleware);

// Conversaciones
conversationsRouter.get('/', conversationsController.findAll);
conversationsRouter.post('/', conversationsController.create);
conversationsRouter.get('/:conversationId', conversationsController.findOne);
conversationsRouter.patch('/:conversationId', conversationsController.update);
conversationsRouter.delete('/:conversationId', conversationsController.delete);

// Mensajes de una conversación
conversationsRouter.get('/:conversationId/messages', messagesController.findByConversation);
conversationsRouter.post('/:conversationId/messages', messagesController.create);

