import { Request, Response, NextFunction } from 'express';
import { onboardingService } from '../services/onboarding.service.js';

class OnboardingController {
  async complete(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [ONBOARDING] POST /onboarding/complete');

      const accountId = req.user!.accountId;
      const onboardingData = req.body || {};

      const result = await onboardingService.completeOnboarding(accountId, onboardingData);

      console.log('✅ [ONBOARDING] Onboarding completado');
      res.json(result);
    } catch (error) {
      console.error('❌ [ONBOARDING] Error al completar onboarding:', error);
      next(error);
    }
  }
}

export const onboardingController = new OnboardingController();

