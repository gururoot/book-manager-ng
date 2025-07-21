/**
 * Interfaz que define la estructura de un libro
 * Utilizada para tipado fuerte en toda la aplicación
 */
export interface Book {
    id: number;
    name: string;
    author: string;
    pages: number;
    publishDate: string;
  }
  
  /**
   * Interfaz para crear un nuevo libro (sin ID)
   * Utilizada en formularios de creación
   */
  export interface CreateBookRequest {
    name: string;
    author: string;
    pages: number;
    publishDate: string;
  }
  
  /**
   * Interfaz para actualizar un libro existente
   * Todos los campos son opcionales excepto el ID
   */
  export interface UpdateBookRequest {
    id: number;
    name?: string;
    author?: string;
    pages?: number;
    publishDate?: string;
  }