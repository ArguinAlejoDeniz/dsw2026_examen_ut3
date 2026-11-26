// ResourceNotFoundError — Error específico para cuando un recurso no existe en el sistema.
// Extiende Error añadiendo el statusCode, un código de error y el ID del recurso buscado.
// Se diferencia de AppError en que incluye resourceId, útil para que el cliente sepa
// exactamente qué ID no fue encontrado. errorHandler.ts lo detecta con instanceof y lo
// devuelve con el formato { message, resourceId } en lugar del formato genérico { error, message }.

export class ResourceNotFoundError extends Error {
  constructor(
    public statusCode: number,  // Siempre 404 en la práctica
    message: string,            // Descripción del error (ej. "Notice with id '...' not found")
    public code: string,        // Código string (ej. 'RESOURCE_NOT_FOUND')
    public resourceId: string,  // ID del recurso que no se encontró, se incluye en la respuesta JSON
  ) {
    super(message);                        // Propaga el mensaje a la clase Error base
    this.name = 'ResourceNotFoundError';   // Nombre del error para logs y depuración
  }
}