// documentsController.ts — Capa de controladores para el recurso "documentos administrativos".
// Recibe las peticiones HTTP del router (documentsRouter.ts), valida los datos de entrada,
// llama al servicio (documentsService.ts) y devuelve la respuesta JSON al cliente.
// Si algo falla, llama a next(err) para que errorHandler.ts lo gestione.

import type { Request, Response, NextFunction } from 'express';
import * as documentsService from '../services/documentsService.js'; // Lógica de negocio y datos en memoria
import { AppError } from '../errors/AppError.js';                    // Error controlado (400, 404...)
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError.js'; // Error específico "recurso no existe"

// GET /api/v1/admin/documents?page=1&limit=20
// Devuelve una lista paginada de documentos. page y limit tienen valores por defecto.
export function list(req: Request, res: Response, next: NextFunction): void {
  try {
    const page = Number(req.query.page ?? 1);    // Página actual; por defecto 1
    const limit = Number(req.query.limit ?? 20); // Documentos por página; por defecto 20
    res.json(documentsService.list(page, limit)); // Delega al servicio que calcula el slice del array
  } catch (err) {
    next(err); // Propaga el error al errorHandler
  }
}

// GET /api/v1/admin/documents/:documentId
// Busca un documento por su UUID. Si no existe, lanza ResourceNotFoundError → 404.
export function getById(req: Request, res: Response, next: NextFunction): void {
  try {
    const documentId = String(req.params.documentId); // Lee el parámetro de ruta :documentId
    const document = documentsService.getById(documentId); // Busca en el array en memoria

    if (!document) {
      // No se encontró → lanza error específico de recurso no encontrado con el ID buscado
      throw new ResourceNotFoundError(404, `Document with id '${documentId}' not found`, 'RESOURCE_NOT_FOUND', documentId);
    }

    res.status(200).json({ data: document }); // Envuelve el documento en { data: ... }
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/admin/documents
// Crea un nuevo documento. Valida que title sea una cadena no vacía.
// description es opcional y se limpia de espacios en blanco.
export function create(req: Request, res: Response, next: NextFunction): void {
  try {
    const { title, description } = req.body; // Extrae campos del body (ya parseado por express.json())

    // Validación: title es obligatorio y debe ser una cadena no vacía (ni solo espacios)
    if (typeof title !== 'string' || title.trim().length === 0) {
      throw new AppError(400, 'Missing or invalid required field: title', 'INVALID_TITLE');
    }

    // description es opcional; si existe se convierte a string y se recortan espacios
    const cleanDescription = description ? String(description).trim() : undefined;
    const newDoc = documentsService.create(title.trim(), cleanDescription); // Crea y guarda en memoria

    res.status(201).json({ data: newDoc }); // 201 Created con el documento recién creado
  } catch (err) {
    next(err);
  }
}

// PATCH /api/v1/admin/documents/:documentId
// Actualiza parcialmente un documento (solo los campos que se envíen).
// Si title está presente debe ser cadena no vacía. Si el documento no existe → 404.
export function update(req: Request, res: Response, next: NextFunction): void {
  try {
    const documentId = String(req.params.documentId); // ID del documento a actualizar
    const { title, description } = req.body;          // Campos a actualizar (ambos opcionales en PATCH)

    // Si se envía title, debe ser string y no estar vacío (ni solo espacios)
    if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
      res.status(400).json(
        {
          error: 'INVALID_TITLE',
          message: 'Title must be a non-empty string',
        }
      )
      return; // Corta la ejecución; no se llama a next para evitar doble respuesta
    }

    // Aplica los cambios en el servicio; si id no existe devuelve undefined
    const document = documentsService.update(documentId, {
      title: title !== undefined ? title.trim() : undefined,                               // Recorta espacios solo si se proporcionó
      description: description !== undefined ? String(description).trim() : undefined,     // Convierte a string y recorta si se proporcionó
    });

    if (!document) {
      // El documento no existía → error 404 (AppError, no ResourceNotFoundError, por diseño del ejercicio)
      throw new AppError(404, `Document with id '${documentId}' not found`, 'NOT_FOUND');
    }

    res.json({ data: document }); // Responde con el documento actualizado
  } catch (err) {
    next(err);
  }
}