import { Routes } from '@angular/router';
import { BooksPageComponent } from './pages/book-page/books-page.component';

/**
 * Rutas del módulo de libros
 * Utiliza lazy loading y componentes standalone
 */
export const BOOKS_ROUTES: Routes = [
  {
    path: '',
    component: BooksPageComponent,
    title: 'Gestión de Libros'
  }
];