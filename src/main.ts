import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router'; // Import provideRouter
import { routes } from './app/app.routes'; // Import routes

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    ReactiveFormsModule, // Include reactive form module
    FormsModule,         // Include forms module
    provideRouter(routes) // Provide the router with routes
  ]
}).catch(err => console.error(err));
