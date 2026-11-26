
// app.ts — Fábrica de la aplicación Express.
// Aquí se monta todo: middlewares, rutas y manejadores de error.
// server.ts llama a createApp() para obtener la instancia lista para escuchar.

import express from 'express';
import type { Application } from 'express';

// --- Middlewares propios ---
import { errorHandler } from './middlewares/errorHandler.js'; // Captura todos los errores y los convierte en respuestas JSON estructuradas
import { logger } from './middlewares/logger.js';             // Registra en consola cada petición con método, ruta, status y duración
import { notFound } from './middlewares/notFound.js';         // Responde 404 JSON para cualquier ruta no definida
import { requestId } from './middlewares/requestId.js';       // Genera un UUID único por petición y lo adjunta a req.requestId

// --- Routers (grupos de rutas por recurso) ---
import { documentsRouter } from './routes/documentsRouter.js'; // CRUD de documentos administrativos → /api/v1/admin/documents
import { healthRouter } from './routes/health.js';             // Endpoints de salud del servidor → /health
import { questionsRouter } from './routes/questions.js';       // Endpoint para formular preguntas → /api/v1/questions
import { noticesRouter } from './routes/notices.js';           // CRUD de avisos/noticias → /api/v1/notices

export function createApp(): Application {
  const app = express();

  // Middlewares: se ejecutan en este orden
  app.use(requestId);       // 1º: asigna un ID único a la petición antes de cualquier otra cosa
  app.use(logger);          // 2º: registra la petición (usa req.requestId asignado justo antes)
  app.use(express.json());  // 3º: parsea el body como JSON; si el JSON está mal formado lanza SyntaxError

  // Rutas de Connectia
  app.use('/health', healthRouter);                          // GET /health/live y /health/ready
  app.use('/api/v1/admin/documents', documentsRouter);       // GET/POST/PATCH de documentos
  app.use('/api/v1/questions', questionsRouter);             // POST para hacer preguntas
  app.use('/api/v1/notices', noticesRouter)                  // GET/POST/PATCH de avisos

  // Ruta de prueba que ya teníamos
  app.get('/test/:team', (req, res) => {
    const { team } = req.params;  // Lee el parámetro de ruta :team
    res.status(200).json({ team });
  });

  // Manejadores de errores: siempre después de las rutas
  app.use(notFound);      // Si ninguna ruta coincidió, devuelve 404
  app.use(errorHandler);  // Intercepta cualquier error lanzado y lo formatea como JSON

  return app;
}
