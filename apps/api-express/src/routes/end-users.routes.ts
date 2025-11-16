import { Router } from 'express';
import { endUsersController } from '../controllers/end-users.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const endUsersRouter = Router();

// Todos los endpoints requieren autenticación
endUsersRouter.use(authMiddleware);

endUsersRouter.get('/', endUsersController.findAll);
endUsersRouter.get('/:visitorId', endUsersController.findOne);
endUsersRouter.patch('/:visitorId', endUsersController.update);

