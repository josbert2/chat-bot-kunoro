import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const analyticsRouter = Router();

// Todos los endpoints requieren autenticación
analyticsRouter.use(authMiddleware);

analyticsRouter.get('/summary', analyticsController.getSummary);
analyticsRouter.get('/conversations-per-day', analyticsController.getConversationsPerDay);
analyticsRouter.get('/agents-performance', analyticsController.getAgentsPerformance);

