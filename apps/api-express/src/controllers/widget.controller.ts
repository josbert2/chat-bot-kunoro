import { Request, Response, NextFunction } from 'express';
import { widgetService } from '../services/widget.service.js';
import { AppError } from '../middleware/error.middleware.js';

class WidgetController {
  async init(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [WIDGET] POST /widget/init');

      const siteKey = req.headers['x-site-key'] as string;

      if (!siteKey) {
        throw new AppError(400, 'x-site-key header es requerido');
      }

      const result = await widgetService.init(siteKey, req.body);

      console.log('✅ [WIDGET] Widget inicializado');
      res.json(result);
    } catch (error) {
      console.error('❌ [WIDGET] Error en init:', error);
      next(error);
    }
  }

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [WIDGET] POST /widget/messages');

      const siteKey = req.headers['x-site-key'] as string;

      if (!siteKey) {
        throw new AppError(400, 'x-site-key header es requerido');
      }

      const result = await widgetService.sendMessage(siteKey, {
        ...req.body,
        pageUrl: req.body.pageUrl,
        userAgent: req.headers['user-agent'],
      });

      console.log('✅ [WIDGET] Mensaje enviado');
      res.json(result);
    } catch (error) {
      console.error('❌ [WIDGET] Error en sendMessage:', error);
      next(error);
    }
  }

  async offlineForm(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [WIDGET] POST /widget/offline');

      const result = await widgetService.handleOfflineForm(req.body);

      console.log('✅ [WIDGET] Formulario offline procesado');
      res.json(result);
    } catch (error) {
      console.error('❌ [WIDGET] Error en offlineForm:', error);
      next(error);
    }
  }
}

export const widgetController = new WidgetController();

