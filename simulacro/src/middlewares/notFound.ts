// notFound.ts — Middleware "catch-all" para rutas no definidas.
// Se registra en app.ts DESPUÉS de todos los routers. Si ninguna ruta coincidió
// con la petición, Express llega aquí y se devuelve un 404 JSON con el método
// y la ruta que el cliente intentó usar, facilitando la depuración.
// NOTA: NO tiene el parámetro 'next' porque no delega a ningún otro middleware;
// es el último punto de la cadena normal (antes del errorHandler).

import type { Request, Response} from 'express';

export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Route not found: ${req.method} ${req.path}`, // Incluye el verbo y la ruta para que el cliente entienda qué falló
  });
}