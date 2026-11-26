// noticesController.ts — Capa de controladores para el recurso "avisos/noticias".
// Recibe las peticiones HTTP del router (notices.ts), valida los datos de entrada,
// llama al servicio (noticesService.ts) y devuelve la respuesta JSON al cliente.
// Si algo falla, llama a next(err) para que errorHandler.ts lo gestione.

import type { Request, Response, NextFunction } from 'express';
import * as noticesService from '../services/noticesService.js'; // Lógica de negocio y datos de avisos en memoria
import { AppError } from '../errors/AppError.js';                // Error controlado (400, 422...)
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError.js'; // Error específico "aviso no existe"

// GET /api/v1/notices?page=1&limit=2&search=texto
// Devuelve una lista paginada de avisos, con filtro opcional por texto en el título.
export function list(req: Request, res: Response, next: NextFunction): void {
  try {
    const page = Number(req.query.page ?? 1);    // Página actual; por defecto 1
    const limit = Number(req.query.limit ?? 2);  // Avisos por página; por defecto 2 (más restrictivo que documents)

    // Validación extra: page y limit deben ser enteros positivos
    if (!Number.isInteger(page) || page <= 0 || !Number.isInteger(limit) || limit <= 0 ){
      throw new AppError(400, `Page and limit must be positive and integer`, `INVALID_PAGINATION`)
    }

    // search es opcional; si se proporciona, filtra por título en el servicio
    const search = req.query.search ? String(req.query.search).trim() : undefined;

    res.json(noticesService.list(page, limit, search)); // Delega la paginación y el filtro al servicio
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/notices/:noticeId
// Busca un aviso por su UUID. Si no existe, lanza ResourceNotFoundError → 404.
export function getById(req: Request, res: Response, next: NextFunction): void {
  try {
    const noticeId = String(req.params.noticeId); // Lee el parámetro de ruta :noticeId
    const notice = noticesService.getById(noticeId); // Busca en el array en memoria

    if (!notice) {
      // No se encontró → lanza error con el ID buscado para incluirlo en la respuesta
      throw new ResourceNotFoundError(404, `Notice with id '${noticeId}' not found`, 'RESOURCE_NOT_FOUND', noticeId);
    }

    res.status(200).json({data: notice}) // Envuelve el aviso en { data: ... }
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/notices
// Crea un nuevo aviso. Valida que title sea cadena no vacía y que description, si existe, sea string.
export function create(req: Request, res: Response, next: NextFunction): void {
  try {
    const { title, description } = req.body; // Extrae campos del body (ya parseado por express.json())

    // Validación: title es obligatorio y debe ser una cadena no vacía
    if (typeof title !== 'string' || title.trim().length === 0) {
      throw new AppError(400, 'Missing or invalid required field: title', 'INVALID_TITLE');
    }

    // Validación adicional a documentsController: description, si existe, debe ser string
    if (description !== undefined && typeof description !== 'string'){
      throw new AppError(400, 'Invalid field: description must be a string', 'INVALID_DESCRIPTION');
    }

    // Si description no existe, se guarda como cadena vacía (a diferencia de documents donde puede ser undefined)
    const cleanDescription = description !== undefined ? description.trim(): '';
    const newNotice = noticesService.create(title.trim(), cleanDescription); // Crea y guarda en memoria

    res.status(201).json({ data: newNotice }); // 201 Created con el aviso recién creado
  } catch (err) {
    next(err);
  }
}

// PATCH /api/v1/notices/:noticeId
// Actualiza parcialmente un aviso. Ambos campos son opcionales pero validados si se envían.
// Si el aviso no existe → ResourceNotFoundError (404).
export function update(req: Request, res: Response, next: NextFunction): void {
  try {
    const noticeId = String(req.params.noticeId); // ID del aviso a actualizar
    const { title, description } = req.body;      // Campos a actualizar (ambos opcionales en PATCH)

    // Si se envía title, debe ser string no vacío
    if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
      throw new AppError(400,'Title must be a non-empty string', 'INVALID_TITLE')
    }

    // Si se envía description, debe ser string (puede ser vacío pero no otro tipo)
    if (description !== undefined && typeof description !== 'string') {
      throw new AppError(400, 'Description must be a string', 'INVALID_DESCRIPTION');
    }

    // Aplica los cambios en el servicio; si id no existe devuelve undefined
    const notice = noticesService.update(noticeId, {
      title: title !== undefined ? title.trim() : undefined,              // Recorta espacios si se proporcionó
      description: description !== undefined ? description.trim() : undefined, // Recorta espacios si se proporcionó
    });

    if (!notice) {
      // El aviso no existía → ResourceNotFoundError (igual que getById, consistente con el recurso)
      throw new ResourceNotFoundError(404, `Notice with id '${noticeId}' not found`, 'RESOURCE_NOT_FOUND', noticeId);
    }

    res.status(200).json({ data: notice }); // Responde con el aviso actualizado
  } catch (err) {
    next(err);
  }
}