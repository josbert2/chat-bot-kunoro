import { Router } from 'express';
import { workspacesController } from '../controllers/workspaces.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const workspacesRouter = Router();

// Todas las rutas requieren autenticación
workspacesRouter.use(authMiddleware);

workspacesRouter.get('/', workspacesController.findAll);
workspacesRouter.get('/:workspaceId', workspacesController.findOne);
workspacesRouter.patch('/:workspaceId', workspacesController.update);

