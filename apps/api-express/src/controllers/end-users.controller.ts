import { Request, Response, NextFunction } from 'express';
import { endUsersService } from '../services/end-users.service.js';

class EndUsersController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [END USERS] GET /end-users');

      const accountId = req.user!.accountId;
      const query = {
        siteId: req.query.siteId as string | undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
      };

      const result = await endUsersService.findAll(accountId, query);

      console.log('✅ [END USERS] Visitantes listados');
      res.json(result);
    } catch (error) {
      console.error('❌ [END USERS] Error en findAll:', error);
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [END USERS] GET /end-users/:visitorId');

      const accountId = req.user!.accountId;
      const { visitorId } = req.params;

      const result = await endUsersService.findOne(accountId, visitorId);

      console.log('✅ [END USERS] Visitante encontrado');
      res.json(result);
    } catch (error) {
      console.error('❌ [END USERS] Error en findOne:', error);
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🟢 [END USERS] PATCH /end-users/:visitorId');

      const accountId = req.user!.accountId;
      const { visitorId } = req.params;

      const result = await endUsersService.update(accountId, visitorId, req.body);

      console.log('✅ [END USERS] Visitante actualizado');
      res.json(result);
    } catch (error) {
      console.error('❌ [END USERS] Error en update:', error);
      next(error);
    }
  }
}

export const endUsersController = new EndUsersController();

