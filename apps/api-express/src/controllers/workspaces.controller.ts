import { Request, Response, NextFunction } from 'express';
import { workspacesService } from '../services/workspaces.service.js';
import { AppError } from '../middleware/error.middleware.js';

class WorkspacesController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [WORKSPACES] GET /workspaces');

      if (!req.user) {
        throw new AppError(401, 'No autenticado');
      }

      const result = await workspacesService.findAll(req.user.userId);

      console.log('✅ [WORKSPACES] Workspaces obtenidos');
      res.json(result);
    } catch (error) {
      console.error('❌ [WORKSPACES] Error en findAll:', error);
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [WORKSPACES] GET /workspaces/:workspaceId');

      if (!req.user) {
        throw new AppError(401, 'No autenticado');
      }

      const { workspaceId } = req.params;
      const result = await workspacesService.findOne(workspaceId, req.user.userId);

      console.log('✅ [WORKSPACES] Workspace obtenido');
      res.json(result);
    } catch (error) {
      console.error('❌ [WORKSPACES] Error en findOne:', error);
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [WORKSPACES] PATCH /workspaces/:workspaceId');

      if (!req.user) {
        throw new AppError(401, 'No autenticado');
      }

      const { workspaceId } = req.params;
      const result = await workspacesService.update(workspaceId, req.user.userId, req.body);

      console.log('✅ [WORKSPACES] Workspace actualizado');
      res.json(result);
    } catch (error) {
      console.error('❌ [WORKSPACES] Error en update:', error);
      next(error);
    }
  }
}

export const workspacesController = new WorkspacesController();

