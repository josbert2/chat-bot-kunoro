import { Router } from 'express';
import { simulateConversation, simulateMessage } from '../controllers/simulator.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Simular nueva conversación
router.post('/conversation', authMiddleware, simulateConversation);

// Simular nuevo mensaje en conversación existente
router.post('/message/:conversationId', authMiddleware, simulateMessage);

export { router as simulatorRouter };

