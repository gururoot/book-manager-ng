import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

/**
 * Punto de entrada de la aplicación
 * Utiliza el nuevo sistema de bootstrap para aplicaciones standalone
 */
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));