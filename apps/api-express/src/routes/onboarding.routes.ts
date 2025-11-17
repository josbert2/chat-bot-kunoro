import { Router } from 'express';
import { onboardingController } from '../controllers/onboarding.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const onboardingRouter = Router();

// El endpoint requiere autenticación
onboardingRouter.post('/complete', authMiddleware, onboardingController.complete);

