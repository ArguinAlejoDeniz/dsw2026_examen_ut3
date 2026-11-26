// documentsRouter.ts — Define las rutas HTTP del recurso "documentos administrativos".
// Se monta en app.ts bajo el prefijo /api/v1/admin/documents.
// Cada ruta delega la lógica al controller correspondiente de documentsController.ts.

import { Router } from 'express';
import * as documentsController from '../controllers/documentsController.js'; // Importa todas las funciones del controller de documentos

export const documentsRouter = Router(); // Crea un router Express independiente (mini-app de rutas)

documentsRouter.get('/', documentsController.list);                       // GET  /api/v1/admin/documents         → lista paginada de documentos
documentsRouter.get('/:documentId', documentsController.getById);         // GET  /api/v1/admin/documents/:id      → un documento por su UUID
documentsRouter.post('/', documentsController.create);                    // POST /api/v1/admin/documents         → crea un nuevo documento
documentsRouter.patch('/:documentId', documentsController.update);        // PATCH /api/v1/admin/documents/:id    → actualiza título/descripción de un documento