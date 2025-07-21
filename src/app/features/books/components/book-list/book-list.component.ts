import { Component, computed, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { BookService } from '../../../../core/services/book.service';
import { Book } from '../../../../core/models/book.model';

/**
 * Componente para mostrar la lista de libros con filtrado
 * Utiliza Signals para reactividad y nuevos Output APIs
 */
@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent {
  
  // Nuevos Output APIs de Angular 17+
  editBook = output<Book>();
  deleteBook = output<number>();

  // Signal para el texto de filtro
  filterText = signal('');

  // Computed signal para libros filtrados
  filteredBooks = computed(() => {
    const books = this.bookService.getBooks()();
    const filter = this.filterText().toLowerCase().trim();
    
    if (!filter) {
      return books;
    }
    
    return books.filter(book => 
      book.name.toLowerCase().includes(filter) ||
      book.author.toLowerCase().includes(filter)
    );
  });

  // Columnas que se muestran en la tabla
  displayedColumns: string[] = ['id', 'name', 'author', 'pages', 'publishDate', 'actions'];

  constructor(private readonly bookService: BookService) {}

  /**
   * Maneja el cambio en el filtro de búsqueda
   * @param event Evento del input
   */
  onFilterChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.filterText.set(target.value);
  }

  /**
   * Emite evento para editar libro
   * @param book Libro a editar
   */
  onEditBook(book: Book): void {
    this.editBook.emit(book);
  }

  /**
   * Emite evento para eliminar libro
   * @param bookId ID del libro a eliminar
   */
  onDeleteBook(bookId: number): void {
    this.deleteBook.emit(bookId);
  }
}