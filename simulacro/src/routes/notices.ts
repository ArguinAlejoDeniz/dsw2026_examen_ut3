// notices.ts — Define las rutas HTTP del recurso "avisos/noticias".
// Se monta en app.ts bajo el prefijo /api/v1/notices.
// Cada ruta delega al controller correspondiente de noticesController.ts.

import { Router } from 'express';
import * as noticesController from '../controllers/noticesController.js'; // Controller que valida y procesa la lógica de avisos

export const noticesRouter = Router(); // Router Express dedicado a los avisos

noticesRouter.get('/', noticesController.list);                   // GET  /api/v1/notices            → lista paginada (con filtro search opcional)
noticesRouter.get('/:noticeId', noticesController.getById);       // GET  /api/v1/notices/:id         → un aviso por su UUID
noticesRouter.post('/', noticesController.create);                // POST /api/v1/notices             → crea un nuevo aviso
noticesRouter.patch('/:noticeId', noticesController.update);      // PATCH /api/v1/notices/:id        → actualiza título/descripción de un aviso