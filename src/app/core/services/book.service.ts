import { Injectable, signal, computed } from '@angular/core';
import { Book, CreateBookRequest, UpdateBookRequest } from '../models/book.model';

/**
 * Servicio para gestionar libros usando Angular Signals
 * Implementa operaciones CRUD en memoria con reactividad moderna
 */
@Injectable({
  providedIn: 'root'
})
export class BookService {
  
  // Signal privado que contiene la lista de libros
  private readonly _books = signal<Book[]>([
    {
      id: 1,
      name: 'Cien Años de Soledad',
      author: 'Gabriel García Márquez',
      pages: 417,
      publishDate: '1967-05-30'
    },
    {
      id: 2,
      name: 'El Señor de los Anillos',
      author: 'J.R.R. Tolkien',
      pages: 1178,
      publishDate: '1954-07-29'
    },
    {
      id: 3,
      name: '1984',
      author: 'George Orwell',
      pages: 328,
      publishDate: '1949-06-08'
    },
    {
      id: 4,
      name: 'Un Mundo Feliz',
      author: 'Aldous Huxley',
      pages: 288,
      publishDate: '1932-01-01'
    },
    {
      id: 5,
      name: 'Don Quijote de la Mancha',
      author: 'Miguel de Cervantes',
      pages: 863,
      publishDate: '1605-01-16'
    }
  ]);

  // Signal público readonly para acceder a los libros
  public readonly books = this._books.asReadonly();

  // Computed signal para obtener el próximo ID disponible
  private readonly nextId = computed(() => {
    const currentBooks = this._books();
    return currentBooks.length > 0 ? Math.max(...currentBooks.map(b => b.id)) + 1 : 1;
  });

  /**
   * Obtiene todos los libros
   * @returns Signal readonly con la lista de libros
   */
  getBooks() {
    return this.books;
  }

  /**
   * Busca un libro por ID
   * @param id ID del libro a buscar
   * @returns Libro encontrado o undefined
   */
  getBookById(id: number): Book | undefined {
    return this._books().find(book => book.id === id);
  }

  /**
   * Agrega un nuevo libro
   * @param bookData Datos del libro a crear
   * @returns Libro creado con ID asignado
   */
  addBook(bookData: CreateBookRequest): Book {
    const newBook: Book = {
      id: this.nextId(),
      ...bookData
    };

    this._books.update(books => [...books, newBook]);
    return newBook;
  }

  /**
   * Actualiza un libro existente
   * @param bookData Datos del libro a actualizar
   * @returns Libro actualizado o undefined si no existe
   */
  updateBook(bookData: UpdateBookRequest): Book | undefined {
    const bookIndex = this._books().findIndex(book => book.id === bookData.id);
    
    if (bookIndex === -1) {
      return undefined;
    }

    this._books.update(books => {
      const updatedBooks = [...books];
      updatedBooks[bookIndex] = { ...updatedBooks[bookIndex], ...bookData };
      return updatedBooks;
    });

    return this.getBookById(bookData.id);
  }

  /**
   * Elimina un libro por ID
   * @param id ID del libro a eliminar
   * @returns true si se eliminó, false si no existía
   */
  deleteBook(id: number): boolean {
    const initialLength = this._books().length;
    this._books.update(books => books.filter(book => book.id !== id));
    return this._books().length < initialLength;
  }

  /**
   * Verifica si un ID ya existe
   * @param id ID a verificar
   * @returns true si existe, false si no
   */
  idExists(id: number): boolean {
    return this._books().some(book => book.id === id);
  }
}