import { Router } from 'express';
import { projectsController } from '../controllers/projects.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const projectsRouter = Router();

// Endpoint público (sin auth)
projectsRouter.get('/widget/config', projectsController.getWidgetConfigByAppId);

// Rutas protegidas (requieren auth)
projectsRouter.get('/', authMiddleware, projectsController.findAll);
projectsRouter.post('/', authMiddleware, projectsController.create);
projectsRouter.get('/:projectId', authMiddleware, projectsController.findOne);
projectsRouter.patch('/:projectId', authMiddleware, projectsController.update);
projectsRouter.delete('/:projectId', authMiddleware, projectsController.remove);
projectsRouter.get('/:projectId/widget', authMiddleware, projectsController.getWidgetConfig);
projectsRouter.patch('/:projectId/widget', authMiddleware, projectsController.updateWidgetConfig);

