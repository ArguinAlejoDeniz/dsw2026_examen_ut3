// questionsService.ts — Servicio para el sistema de preguntas y respuestas.
// En este simulacro devuelve siempre una respuesta fija (hardcoded) con citas de documentos del centro.
// En un sistema real, aquí iría la lógica de búsqueda semántica, consulta a una IA, etc.
// Es llamado desde questionsController.ts.

// Interfaz que representa una cita de un documento en la respuesta
export interface Citation {
  documentId: string; // UUID del documento del que procede la cita
  title: string;      // Título del documento citado
  excerpt: string;    // Fragmento relevante del documento que apoya la respuesta
}

// Interfaz que define la estructura completa de una respuesta a una pregunta
export interface QuestionAnswer {
  answer: string;       // Texto de la respuesta generada
  citations: Citation[]; // Lista de documentos citados como fuente de la respuesta
}

// Genera y devuelve una respuesta simulada.
// Actualmente ignora el texto de la pregunta y siempre devuelve lo mismo.
// La cita referencia el documento '11111111...' (Guía pública del centro) de documentsService.ts.
export function answerQuestion(): QuestionAnswer {
  return {
    answer: 'Respuesta simulada: consulta la documentación pública del centro.',
    citations: [
      {
        documentId: '11111111-1111-4111-8111-111111111111', // ID del documento "Guía pública del centro"
        title: 'Guía pública del centro',
        excerpt: 'La información actualizada está disponible en los canales oficiales.',
      },
    ],
  };
}