// Punto de entrada del servidor: arranca la aplicación Express y la pone a escuchar peticiones HTTP.

import { env } from './config/env.js';    // Importa la configuración de variables de entorno (puerto, modo, etc.)
import { createApp } from './app.js';      // Importa la función que monta y configura toda la app Express

// Crea la aplicación con todos sus middlewares y rutas ya registrados
const app = createApp();

// Arranca el servidor HTTP en el puerto definido en las variables de entorno.
// El callback solo imprime un mensaje de confirmación en consola.
app.listen(env.PORT, () => {
  console.log(`Listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});