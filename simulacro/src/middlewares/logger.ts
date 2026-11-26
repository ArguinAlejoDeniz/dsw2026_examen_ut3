
// logger.ts — Middleware de registro de peticiones HTTP.
// Se registra en app.ts justo después de requestId para que req.requestId ya esté disponible.
// Solo actúa si la variable de entorno LOG está en 'ON' (valor por defecto).
// Usa el evento 'finish' de la respuesta para registrar DESPUÉS de que la petición se complete,
// así se puede incluir el status code real y la duración total.

import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js'; // Lee LOG para saber si el logger está activado

export function logger(req: Request, res: Response, next: NextFunction): void {
  const start = performance.now(); // Empieza a medir lo que tarda la petición

  const LogState = env.LOG; // 'ON' o 'OFF' — controla si se imprime o no el log

  if (LogState === "ON"){
    res.on('finish', () => {
    // Se ejecuta cuando la petición ha terminado después de pasar por todos los middlewares y handlers
    const duration = Math.round(performance.now() - start); // Duración total en milisegundos

    // Objeto con todos los datos relevantes de la petición para el log
    const entry = {
      requestId: req.requestId,         // ID único (asignado por requestId.ts) para correlacionar logs
      method: req.method,               // Verbo HTTP: GET, POST, PATCH...
      path: req.path,                   // Ruta solicitada (sin query string)
      status: res.statusCode,           // Código HTTP de la respuesta enviada
      durationMs: duration,             // Tiempo que tardó en procesarse la petición
      timestamp: new Date().toISOString(), // Momento exacto en que terminó la petición
    };
    console.log(JSON.stringify(entry)); // Loguea en pantalla la información de la petición
  });
  }
  

  next(); // Pasa el control al siguiente middleware en la cadena
}
