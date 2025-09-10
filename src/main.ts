import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app';
import {provideRouter} from '@angular/router';
import {provideAnimations} from '@angular/platform-browser/animations';
import {routes} from './app/app.routes';
import {importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    importProvidersFrom(ReactiveFormsModule)
  ]
}).catch(err => console.error(err));
