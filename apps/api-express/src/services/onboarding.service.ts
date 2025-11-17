import { eq } from 'drizzle-orm';
import { db } from '../db/connection.js';
import { accounts } from '../db/schema.js';
import { AppError } from '../middleware/error.middleware.js';

interface OnboardingData {
  businessModel?: string;
  industry?: string;
  conversationsRange?: string;
  goalId?: string;
  visitorsRange?: string;
  platform?: string;
  agentCount?: string;
  useAi?: boolean;
}

class OnboardingService {
  async completeOnboarding(accountId: string, data: OnboardingData) {
    console.log('🟢 [ONBOARDING SERVICE] Completando onboarding para cuenta:', accountId);
    console.log('🟢 [ONBOARDING SERVICE] Datos recibidos:', data);

    const database = await db.connect();

    // Verificar que la cuenta existe
    const [account] = await database
      .select()
      .from(accounts)
      .where(eq(accounts.id, accountId))
      .limit(1);

    if (!account) {
      throw new AppError(404, 'Cuenta no encontrada');
    }

    // Preparar campos a actualizar (solo los que vienen en data)
    const updateData: any = {};
    
    if (data.businessModel !== undefined) updateData.businessModel = data.businessModel;
    if (data.industry !== undefined) updateData.industry = data.industry;
    if (data.conversationsRange !== undefined) updateData.conversationsRange = data.conversationsRange;
    if (data.goalId !== undefined) updateData.goalId = data.goalId;
    if (data.visitorsRange !== undefined) updateData.visitorsRange = data.visitorsRange;
    if (data.platform !== undefined) updateData.platform = data.platform;
    if (data.agentCount !== undefined) updateData.agentCount = data.agentCount;
    if (data.useAi !== undefined) updateData.useAi = data.useAi;

    console.log('🟢 [ONBOARDING SERVICE] Campos a actualizar:', Object.keys(updateData));

    // Actualizar cuenta con los campos específicos
    if (Object.keys(updateData).length > 0) {
      await database
        .update(accounts)
        .set(updateData)
        .where(eq(accounts.id, accountId));
    }

    console.log('✅ [ONBOARDING SERVICE] Onboarding completado');

    return {
      success: true,
      message: 'Onboarding completado exitosamente',
    };
  }
}

export const onboardingService = new OnboardingService();

