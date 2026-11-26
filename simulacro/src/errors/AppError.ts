// AppError — Error de aplicación esperado (errores del cliente: 400, 401, 403, 404...).
// Se lanza a propósito desde los controllers cuando los datos de entrada son inválidos
// o cuando hay un problema controlado. errorHandler.ts lo captura y responde con el
// statusCode y code correspondientes en lugar del genérico 500.

export class AppError extends Error {
  constructor(
    public statusCode: number, // Código HTTP que se devolverá al cliente (ej. 400, 404)
    message: string,           // Mensaje legible que describe el problema
    public code: string,       // Código de error en mayúsculas (ej. 'INVALID_TITLE') para identificarlo en el cliente
  ) {
    super(message);            // Pasa el mensaje a la clase base Error para que err.message funcione
    this.name = 'AppError';    // Sobreescribe el nombre para identificarlo en logs y en instanceof
  }
}