import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router'; // Provide the router with routes
import { importProvidersFrom } from '@angular/core'; // Import providers for module imports
import { routes } from './app/app.routes'; // Import your routes

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes), // Provide the router with routes
    importProvidersFrom(   // Import providers for ReactiveFormsModule and FormsModule
      ReactiveFormsModule,
      FormsModule
    ),
  ]
}).catch(err => console.error(err));
