
// requestId.ts — Middleware que asigna un identificador único a cada petición HTTP.
// Se registra en app.ts como PRIMER middleware para que todos los siguientes
// (logger, controllers, errorHandler) puedan usar req.requestId y correlacionar
// los mensajes de log de una misma petición.

import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto'; // Generador de UUIDs v4 incluido en Node.js (sin librerías externas)

// Ampliación del tipado global de Express para añadir la propiedad requestId al objeto Request.
// Sin este bloque TypeScript lanzaría un error al hacer req.requestId = ...
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      requestId: string; // Propiedad inyectada por este middleware; disponible en cualquier handler posterior
    }
  }
}

export function requestId(req: Request, _res: Response, next: NextFunction): void {
  req.requestId = randomUUID(); // Genera un UUID único para esta petición y lo adjunta al objeto req
  next();                       // Pasa el control al siguiente middleware (logger, etc.)
}
