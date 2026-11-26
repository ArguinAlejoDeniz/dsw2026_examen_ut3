// questions.ts — Define la ruta HTTP del recurso "preguntas".
// Se monta en app.ts bajo el prefijo /api/v1/questions.
// Solo existe un endpoint: POST para hacer una pregunta al sistema.

import { Router } from 'express';
import * as questionsController from '../controllers/questionsController.js'; // Controller que valida la pregunta y llama al servicio

export const questionsRouter = Router(); // Router Express dedicado a las preguntas

// POST /api/v1/questions → recibe { question: string } en el body y devuelve una respuesta simulada con citas de documentos
questionsRouter.post('/', questionsController.ask);