import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { BookService } from '../../../../core/services/book.service';
import { Book } from '../../../../core/models/book.model';
import { BookListComponent } from '../../components/book-list/book-list.component';
import { BookFormComponent } from '../../components/book-form/book-form.component';

/**
 * Componente página principal de gestión de libros
 * Utiliza Standalone Components y Signals para máxima modernidad
 */
@Component({
  selector: 'app-books-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    BookListComponent,
    BookFormComponent
  ],
  templateUrl: './books-page.component.html',
  styleUrls: ['./books-page.component.scss']
})
export class BooksPageComponent {
  
  // Signal para controlar el libro seleccionado para edición
  selectedBook = signal<Book | null>(null);
  
  // Signal para controlar la visibilidad del formulario
  showForm = signal(false);

  // Computed signal para el título del formulario
  formTitle = computed(() => 
    this.selectedBook() ? 'Editar Libro' : 'Agregar Nuevo Libro'
  );

  constructor(private readonly bookService: BookService) {}

  /**
   * Maneja la selección de un libro para editar
   * @param book Libro seleccionado
   */
  onEditBook(book: Book): void {
    this.selectedBook.set(book);
    this.showForm.set(true);
  }

  /**
   * Maneja la eliminación de un libro
   * @param bookId ID del libro a eliminar
   */
  onDeleteBook(bookId: number): void {
    this.bookService.deleteBook(bookId);
    
    // Si el libro eliminado era el seleccionado, limpiar selección
    if (this.selectedBook()?.id === bookId) {
      this.selectedBook.set(null);
      this.showForm.set(false);
    }
  }

  /**
   * Muestra el formulario para agregar nuevo libro
   */
  onAddNewBook(): void {
    this.selectedBook.set(null);
    this.showForm.set(true);
  }

  /**
   * Maneja el guardado del formulario
   * @param bookData Datos del libro a guardar
   */
  onSaveBook(bookData: any): void {
    if (this.selectedBook()) {
      // Actualizar libro existente
      this.bookService.updateBook({ id: this.selectedBook()!.id, ...bookData });
    } else {
      // Crear nuevo libro
      this.bookService.addBook(bookData);
    }
    
    // Limpiar selección y ocultar formulario
    this.selectedBook.set(null);
    this.showForm.set(false);
  }

  /**
   * Maneja la cancelación del formulario
   */
  onCancelForm(): void {
    this.selectedBook.set(null);
    this.showForm.set(false);
  }
}