// documentsService.ts — Capa de servicio para el recurso "documentos administrativos".
// Contiene la lógica de negocio y el "almacén" en memoria (array).
// No tiene acceso a la petición HTTP: solo trabaja con datos puros.
// Es llamado desde documentsController.ts.

import { randomUUID } from 'node:crypto'; // Generador de UUIDs v4 de Node.js (sin librerías externas)

// Interfaz que define la forma de un documento almacenado
export interface DocumentItem {
  id: string;           // UUID único generado al crear el documento
  title: string;        // Título del documento (obligatorio)
  description?: string; // Descripción opcional (puede no existir)
  createdAt: string;    // Fecha de creación en formato ISO 8601
}

// Interfaz que define qué campos se pueden actualizar en un PATCH
export interface DocumentChanges {
  title?: string;       // Nuevo título (opcional en la actualización)
  description?: string; // Nueva descripción (opcional en la actualización)
}

// Array en memoria para almacenar los documentos temporalmente
// (se reinicia al reiniciar el servidor; en producción sería una base de datos)
const documents: DocumentItem[] = [
  {
        id: '11111111-1111-4111-8111-111111111111',
        title: 'Guía pública del centro',
        description: '',
        createdAt: '2026-09-01T08:00:00.000Z',
    },
    {
        id: '22222222-2222-4222-8222-222222222222',
        title: 'Normas de convivencia',
        description: '',
        createdAt: '2026-09-01T08:00:00.000Z',
    },
];

// Devuelve una página de documentos.
// page: número de página (1-based); limit: cuántos documentos por página.
// Retorna { data, pagination } para que el cliente sepa el total y pueda paginar.
export function list(page: number, limit: number) {
  const start = (page - 1) * limit; // Índice del primer elemento de la página
  return {
    data: documents.slice(start, start + limit), // Corta el array para devolver solo la página pedida
    pagination: {
      page,
      limit,
      total: documents.length, // Total de documentos sin paginar (útil para calcular páginas totales)
    },
  };
}

// Busca un documento por su UUID. Devuelve undefined si no existe.
// Lo usan getById y update del controller para verificar existencia.
export function getById(id: string): DocumentItem | undefined {
  return documents.find((d) => d.id === id); // Búsqueda lineal en el array en memoria
}

// Crea un nuevo documento con un UUID generado y la fecha actual.
// description es opcional; si no se pasa, no se incluye el campo en el objeto.
export function create(title: string, description?: string): DocumentItem {
  const newDoc: DocumentItem = {
    id: randomUUID(),                             // UUID único e irrepetible
    title,
    ...(description ? { description } : {}),      // Solo añade description si tiene valor (spread condicional)
    createdAt: new Date().toISOString(),           // Fecha/hora actual en ISO 8601
  };

  documents.push(newDoc); // Guarda en el array en memoria
  return newDoc;          // Devuelve el documento creado para incluirlo en la respuesta 201
}

// Actualiza los campos especificados de un documento existente.
// Solo modifica los campos que se incluyen en 'changes' (undefined = no tocar).
// Devuelve undefined si el id no existe (el controller lanzará el error correspondiente).
export function update(id: string, changes: DocumentChanges): DocumentItem | undefined {
  const document = getById(id); // Busca el documento; si no existe, devuelve undefined
  if (!document) {
    return undefined;
  }

  // Solo actualiza si el campo se proporcionó (undefined significa "no cambiar")
  if (changes.title !== undefined) {
    document.title = changes.title;
  }

  if (changes.description !== undefined) {
    document.description = changes.description;
  }

  return document; // Devuelve el documento ya mutado con los nuevos valores
}