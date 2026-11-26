// env.ts — Centraliza el acceso a las variables de entorno.
// Lee el fichero .env del proyecto y exporta un objeto tipado con los valores.
// Usar este objeto en lugar de process.env directamente garantiza valores por defecto
// y un único punto de cambio si se añaden nuevas variables.

process.loadEnvFile(); // Carga el fichero .env en process.env (equivalente a dotenv sin librería externa)

export const env = {
  PORT: Number(process.env.PORT ?? 3000),          // Puerto donde escucha el servidor; por defecto 3000
  NODE_ENV: process.env.NODE_ENV ?? 'development', // Entorno de ejecución ('development' | 'production' | 'test')
  APP_NAME: process.env.APP_NAME,                  // Nombre de la aplicación (opcional, puede ser undefined)
  LOG: process.env.LOG ?? 'ON'                     // Activa o desactiva el logger ('ON' | 'OFF'); por defecto 'ON'
};
