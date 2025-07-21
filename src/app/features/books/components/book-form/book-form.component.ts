import { Component, OnInit, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';

import { Book } from '../../../../core/models/book.model';
import { BookService } from '../../../../core/services/book.service';

/**
 * Componente formulario para crear/editar libros
 * Utiliza nuevos Input/Output APIs y Effects
 */
@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule
  ],
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent implements OnInit {
  
  // Nuevos Input/Output APIs
  bookToEdit = input<Book | null>(null);
  saveBook = output<any>();
  cancelForm = output<void>();

  bookForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService
  ) {
    // Effect para manejar cambios en bookToEdit
    effect(() => {
      const book = this.bookToEdit();
      if (book) {
        this.populateForm(book);
      } else {
        this.resetForm();
      }
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Inicializa el formulario reactivo con validaciones
   */
  private initializeForm(): void {
    this.bookForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      author: ['', [Validators.required, Validators.minLength(2)]],
      pages: [null, [Validators.required, Validators.min(1), Validators.max(9999)]],
      publishDate: ['', [Validators.required]]
    });
  }

  /**
   * Llena el formulario con los datos del libro a editar
   * @param book Libro a editar
   */
  private populateForm(book: Book): void {
    this.bookForm.patchValue({
      name: book.name,
      author: book.author,
      pages: book.pages,
      publishDate: book.publishDate
    });
  }

  /**
   * Resetea el formulario
   */
  private resetForm(): void {
    this.bookForm.reset();
    this.bookForm.markAsUntouched();
  }

  /**
   * Maneja el envío del formulario
   */
  onSubmit(): void {
    if (this.bookForm.valid) {
      const formData = this.bookForm.value;
      
      // Formatear fecha si es necesario
      if (formData.publishDate instanceof Date) {
        formData.publishDate = formData.publishDate.toISOString().split('T')[0];
      }
      
      this.saveBook.emit(formData);
      this.resetForm();
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.bookForm.markAllAsTouched();
    }
  }

  /**
   * Maneja la cancelación del formulario
   */
  onCancel(): void {
    this.resetForm();
    this.cancelForm.emit();
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   * @param fieldName Nombre del campo
   * @returns Mensaje de error o cadena vacía
   */
  getErrorMessage(fieldName: string): string {
    const control = this.bookForm.get(fieldName);
    
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (control.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
      }
      if (control.errors['min']) {
        return `${this.getFieldLabel(fieldName)} debe ser mayor a ${control.errors['min'].min}`;
      }
      if (control.errors['max']) {
        return `${this.getFieldLabel(fieldName)} debe ser menor a ${control.errors['max'].max}`;
      }
    }
    
    return '';
  }

  /**
   * Obtiene la etiqueta del campo
   * @param fieldName Nombre del campo
   * @returns Etiqueta del campo
   */
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'name': 'Nombre',
      'author': 'Autor',
      'pages': 'Páginas',
      'publishDate': 'Fecha de publicación'
    };
    return labels[fieldName] || fieldName;
  }
}