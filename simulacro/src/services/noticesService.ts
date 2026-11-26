// noticesService.ts — Capa de servicio para el recurso "avisos/noticias".
// Almacena los avisos en un array en memoria y expone funciones CRUD puras.
// Tiene una particularidad respecto a documentsService: description es siempre
// string (no opcional) y la función list admite un parámetro de búsqueda por título.
// Es llamado desde noticesController.ts.

import { randomUUID } from 'node:crypto'; // UUID v4 de Node.js (sin dependencias externas)

// Interfaz que define la forma de un aviso almacenado
interface Notice {
  id: string;          // UUID único
  title: string;       // Título del aviso (obligatorio)
  description: string; // Descripción (obligatoria en notices, a diferencia de documents donde es opcional)
  createdAt: string;   // Fecha de creación en formato ISO 8601
}

// Interfaz para los campos que se pueden actualizar parcialmente (PATCH)
export interface NoticeChanges {
  title?: string;       // Nuevo título (undefined = no cambiar)
  description?: string; // Nueva descripción (undefined = no cambiar)
}

// Array en memoria para almacenar los documentos temporalmente
// Datos de ejemplo precargados para el simulacro
const notices: Notice[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    title: 'Convocatoria de becas generales del Ministerio',
    description: 'El plazo de solicitud permanecerá abierto hasta el 30 de septiembre a través de la sede electrónica.',
    createdAt: '2026-09-01T08:00:00.000Z',
  },
  {
    id: '22222222-2222-4111-8111-222222222222',
    title: 'Convocatoria de pruebas libres de idiomas',
    description: 'Inscripción disponible en la secretaría del centro en horario de 9:00 a 13:00.',
    createdAt: '2026-09-03T10:15:00.000Z',
  },
  {
    id: '33333333-3333-4111-8111-333333333333',
    title: 'Convocatoria de ayudas para transporte escolar',
    description: 'Documentación requerida disponible en el tablón de anuncios y en la web del instituto.',
    createdAt: '2026-09-05T11:30:00.000Z',
  },
  {
    id: '44444444-4444-4111-8111-444444444444',
    title: 'Calendario de presentaciones del nuevo curso',
    description: 'Consulta el aula y la hora asignada a cada grupo antes del lunes.',
    createdAt: '2026-09-07T09:00:00.000Z',
  },
  {
    id: '55555555-5555-4111-8111-555555555555',
    title: 'Apertura de matrícula para actividades del curso',
    description: 'Plazas limitadas por orden de entrega en conserjería.',
    createdAt: '2026-09-10T12:45:00.000Z',
  },
];

// Devuelve una página de avisos, opcionalmente filtrada por texto en el título.
// search: si se proporciona, filtra los avisos cuyo título contiene la cadena (case-insensitive).
// Después de filtrar, aplica la paginación sobre el subconjunto resultante.
export function list(page: number, limit: number, search?: string) {
  const filtered = search
    ? notices.filter((n) => n.title.toLowerCase().includes(search.toLowerCase())) // Filtra por título si hay búsqueda
    : notices; // Sin búsqueda, usa todos los avisos

  const start = (page - 1) * limit; // Índice del primer elemento de la página
  return {
    data: filtered.slice(start, start + limit), // Página del subconjunto filtrado
    pagination: {
      page,
      limit,
      total: filtered.length, // Total de avisos FILTRADOS (no el total global), para paginar correctamente
    },
  };
}

// Busca un aviso por su UUID. Devuelve undefined si no existe.
export function getById(id: string): Notice | undefined {
  return notices.find((d) => d.id === id); // Búsqueda lineal en el array en memoria
}

// Crea un nuevo aviso con UUID generado y fecha actual.
// description es obligatoria en la interfaz Notice; si no se pasa, se guarda como cadena vacía.
export function create(title: string, description?: string): Notice {
  const newNotice: Notice = {
    id: randomUUID(),           // UUID único
    title,
    description: description ?? '', // Si description es undefined, se almacena como '' (string vacío)
    createdAt: new Date().toISOString(),
  };

  notices.push(newNotice); // Guarda en memoria
  return newNotice;        // Devuelve el aviso creado para la respuesta 201
}

// Actualiza los campos especificados de un aviso existente.
// Devuelve undefined si el id no existe (el controller lanzará ResourceNotFoundError).
export function update(id: string, changes: NoticeChanges): Notice | undefined {
  const document = getById(id); // Reutiliza getById para buscar el aviso
  if (!document) {
    return undefined;
  }

  // Solo sobrescribe los campos que se incluyeron en el PATCH
  if (changes.title !== undefined) {
    document.title = changes.title;
  }

  if (changes.description !== undefined) {
    document.description = changes.description;
  }

  return document; // Devuelve el aviso mutado con los nuevos valores
}