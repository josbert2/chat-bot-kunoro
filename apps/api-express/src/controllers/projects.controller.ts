import { Request, Response, NextFunction } from 'express';
import { projectsService } from '../services/projects.service.js';
import { AppError } from '../middleware/error.middleware.js';

class ProjectsController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [PROJECTS] GET /projects');

      if (!req.user) {
        throw new AppError(401, 'No autenticado');
      }

      const result = await projectsService.findAll(req.user.accountId);

      console.log('✅ [PROJECTS] Proyectos obtenidos');
      res.json(result);
    } catch (error) {
      console.error('❌ [PROJECTS] Error en findAll:', error);
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [PROJECTS] POST /projects');

      if (!req.user) {
        throw new AppError(401, 'No autenticado');
      }

      const { name, domain } = req.body;

      if (!name) {
        throw new AppError(400, 'El campo name es requerido');
      }

      const result = await projectsService.create(req.user.accountId, { name, domain });

      console.log('✅ [PROJECTS] Proyecto creado');
      res.status(201).json(result);
    } catch (error) {
      console.error('❌ [PROJECTS] Error en create:', error);
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [PROJECTS] GET /projects/:projectId');

      if (!req.user) {
        throw new AppError(401, 'No autenticado');
      }

      const { projectId } = req.params;
      const result = await projectsService.findOne(projectId, req.user.accountId);

      console.log('✅ [PROJECTS] Proyecto obtenido');
      res.json(result);
    } catch (error) {
      console.error('❌ [PROJECTS] Error en findOne:', error);
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [PROJECTS] PATCH /projects/:projectId');

      if (!req.user) {
        throw new AppError(401, 'No autenticado');
      }

      const { projectId } = req.params;
      const result = await projectsService.update(projectId, req.user.accountId, req.body);

      console.log('✅ [PROJECTS] Proyecto actualizado');
      res.json(result);
    } catch (error) {
      console.error('❌ [PROJECTS] Error en update:', error);
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [PROJECTS] DELETE /projects/:projectId');

      if (!req.user) {
        throw new AppError(401, 'No autenticado');
      }

      const { projectId } = req.params;
      const result = await projectsService.remove(projectId, req.user.accountId);

      console.log('✅ [PROJECTS] Proyecto eliminado');
      res.json(result);
    } catch (error) {
      console.error('❌ [PROJECTS] Error en remove:', error);
      next(error);
    }
  }

  // Endpoint público para obtener widget config
  async getWidgetConfigByAppId(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [PROJECTS] GET /projects/widget/config?appId=...');

      const { appId } = req.query;

      if (!appId || typeof appId !== 'string') {
        throw new AppError(400, 'appId es requerido');
      }

      const result = await projectsService.getWidgetConfig(appId);

      console.log('✅ [PROJECTS] Widget config obtenido');
      res.json(result);
    } catch (error) {
      console.error('❌ [PROJECTS] Error en getWidgetConfigByAppId:', error);
      next(error);
    }
  }

  async getWidgetConfig(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [PROJECTS] GET /projects/:projectId/widget');

      if (!req.user) {
        throw new AppError(401, 'No autenticado');
      }

      const { projectId } = req.params;
      const site = await projectsService.findOne(projectId, req.user.accountId);

      console.log('✅ [PROJECTS] Widget config obtenido');
      res.json({
        appId: site.data.appId,
        config: site.data.widgetConfig,
      });
    } catch (error) {
      console.error('❌ [PROJECTS] Error en getWidgetConfig:', error);
      next(error);
    }
  }

  async updateWidgetConfig(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [PROJECTS] PATCH /projects/:projectId/widget');

      if (!req.user) {
        throw new AppError(401, 'No autenticado');
      }

      const { projectId } = req.params;
      const result = await projectsService.updateWidgetConfig(projectId, req.user.accountId, req.body);

      console.log('✅ [PROJECTS] Widget config actualizado');
      res.json(result);
    } catch (error) {
      console.error('❌ [PROJECTS] Error en updateWidgetConfig:', error);
      next(error);
    }
  }
}

export const projectsController = new ProjectsController();

