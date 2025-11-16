import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analytics.service.js';

class AnalyticsController {
  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [ANALYTICS] GET /analytics/summary');

      const accountId = req.user!.accountId;
      const query = {
        from: req.query.from as string | undefined,
        to: req.query.to as string | undefined,
        siteId: req.query.siteId as string | undefined,
      };

      const result = await analyticsService.getSummary(accountId, query);

      console.log('✅ [ANALYTICS] Resumen generado');
      res.json(result);
    } catch (error) {
      console.error('❌ [ANALYTICS] Error en getSummary:', error);
      next(error);
    }
  }

  async getConversationsPerDay(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [ANALYTICS] GET /analytics/conversations-per-day');

      const accountId = req.user!.accountId;
      const query = {
        from: req.query.from as string | undefined,
        to: req.query.to as string | undefined,
        siteId: req.query.siteId as string | undefined,
      };

      const result = await analyticsService.getConversationsPerDay(accountId, query);

      console.log('✅ [ANALYTICS] Conversaciones por día generadas');
      res.json(result);
    } catch (error) {
      console.error('❌ [ANALYTICS] Error en getConversationsPerDay:', error);
      next(error);
    }
  }

  async getAgentsPerformance(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [ANALYTICS] GET /analytics/agents-performance');

      const accountId = req.user!.accountId;
      const query = {
        from: req.query.from as string | undefined,
        to: req.query.to as string | undefined,
        siteId: req.query.siteId as string | undefined,
      };

      const result = await analyticsService.getAgentsPerformance(accountId, query);

      console.log('✅ [ANALYTICS] Performance de agentes generada');
      res.json(result);
    } catch (error) {
      console.error('❌ [ANALYTICS] Error en getAgentsPerformance:', error);
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();

