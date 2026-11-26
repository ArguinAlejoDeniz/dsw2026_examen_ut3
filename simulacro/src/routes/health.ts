// health.ts — Rutas de salud del servidor (health checks).
// Se monta en app.ts bajo el prefijo /health.
// Usadas por balanceadores de carga, orquestadores (Kubernetes, etc.) y herramientas
// de monitorización para saber si el servidor está vivo y listo para recibir tráfico.

import { Router } from 'express';

export const healthRouter = Router(); // Router independiente para los endpoints de salud

// GET /health/live → El servidor está vivo (el proceso corre); responde 200 inmediatamente.
// Se usa para detectar si el proceso ha colgado y necesita reiniciarse.
healthRouter.get('/live', (_req, res) => {
  res.status(200).json({ status: 'live' });
});

// GET /health/ready → El servidor está listo para recibir peticiones reales (ej. base de datos conectada).
// En este proyecto no hay BD, así que siempre responde 200; en producción podría verificar dependencias.
healthRouter.get('/ready', (_req, res) => {
  res.status(200).json({ status: 'ready' });
});