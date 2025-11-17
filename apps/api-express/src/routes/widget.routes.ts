import { Router } from 'express';
import { widgetController } from '../controllers/widget.controller.js';

export const widgetRouter = Router();

// Endpoints públicos (usados por el widget en sitios web)
widgetRouter.post('/init', widgetController.init);
widgetRouter.post('/messages', widgetController.sendMessage);
widgetRouter.post('/offline', widgetController.offlineForm);

