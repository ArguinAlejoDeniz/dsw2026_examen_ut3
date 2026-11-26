// questionsController.ts — Controlador para el recurso "preguntas al sistema".
// Solo expone un endpoint POST que recibe una pregunta en texto libre y devuelve
// una respuesta simulada con citas de documentos del centro.
// La lógica de la respuesta está encapsulada en questionsService.ts.

import type { Request, Response, NextFunction } from 'express';
import * as questionsService from '../services/questionsService.js'; // Servicio que genera la respuesta simulada
import { AppError } from '../errors/AppError.js';                    // Error controlado para validaciones

// POST /api/v1/questions
// Espera { question: string } en el body. Valida que sea una cadena no vacía.
// Llama al servicio para obtener la respuesta y la devuelve envuelta en { data: ... }.
export function ask(req: Request, res: Response, next: NextFunction): void {
  try {
    const { question } = req.body; // Extrae la pregunta del body parseado por express.json()

    // Validación: question es obligatoria y debe ser una cadena con contenido real
    if (typeof question !== 'string' || question.trim().length === 0) {
      throw new AppError(400, 'Missing or invalid required field: question', 'INVALID_QUESTION');
    }

    // El servicio devuelve siempre una respuesta simulada (no usa el texto de la pregunta actualmente)
    res.status(200).json({
      data: questionsService.answerQuestion(), // { answer: string, citations: Citation[] }
    });
  } catch (err) {
    next(err); // Propaga el error al errorHandler
  }
}