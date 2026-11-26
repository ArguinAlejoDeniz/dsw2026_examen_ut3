// errorHandler.ts — Middleware de manejo centralizado de errores de Express.
// Express lo reconoce como manejador de errores porque tiene 4 parámetros (err, req, res, next).
// Se registra SIEMPRE al final de la cadena en app.ts, después de todas las rutas.
// Su misión: transformar cualquier error en una respuesta JSON coherente para el cliente.

import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';                                       // Para saber si estamos en producción
import { AppError } from '../errors/AppError.js';                             // Errores de cliente lanzados a propósito
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError.js';   // Error específico de recurso no encontrado

export function errorHandler(
  err: Error,            // El error que propagó next(err) desde cualquier controller o middleware
  req: Request,          // La petición original (se usa para obtener req.requestId en el log)
  res: Response,         // La respuesta con la que contestaremos al cliente
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,   // Obligatorio por la firma de 4 parámetros de Express; no se usa
): void {
  const isProduction = env.NODE_ENV === 'production'; // En producción ocultamos el stack trace

  // Siempre logueamos el error en servidor (el requestId vincula el log con la petición que falló)
  console.error(
  JSON.stringify({
    requestId: req.requestId,                       // ID único de la petición (asignado por requestId.ts)
    error: err.message,                             // Mensaje del error
    stack: isProduction ? undefined : err.stack,    // Stack trace solo en desarrollo
  }),
);

  // Errores esperados: los lanza nuestro código a propósito (400, 404...).
  if (err instanceof AppError) {
    console.log("AppError capturado")
    res.status(err.statusCode).json({ error: err.code ?? 'ERROR', message: err.message });
    return;
  }

  //Error: ResoruceNotFound
  if (err instanceof ResourceNotFoundError) {
    console.log("ResourceNotFoundError capturado")
    res.status(err.statusCode).json({
            message: err.message,
            resourceId: err.resourceId
  }
);
    return;
  }

  // express.json() lanza un SyntaxError si el body no es JSON válido:
  // es culpa del cliente, así que es un 400, no un 500.
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'INVALID_JSON', message: 'Request body is not valid JSON' });
    return;
  }

  // Cualquier otra cosa es inesperada: 500, sin detalles internos en producción.
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: isProduction ? 'An unexpected error occurred' : err.message,
  });
}