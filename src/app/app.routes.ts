import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Component/login/login.component';
import { DashboardComponent } from './Component/dashboard/dashboard.component';
import { LayoutComponent } from './Component/layout/layout.component';
import { CvSubmissionComponent } from './Component/cv-submission/cv-submission.component';
import { RegisterComponent } from './Component/register/register.component';
import { JobOffersComponent } from './Component/job-offers/job-offers.component';
import { JobOfferCandidatesComponent } from './Component/job-offer-candidates/job-offer-candidates.component'; // Import the new component
import { CondidatesComponent } from './Component/condidates/condidates.component';
import { EmployeesComponent } from './Component/employees/employees.component';
import { HomeComponent } from './Component/home/home.component';
import { competenceResolver } from './resolver/competence-resolver';
import { authenticationGuard } from './guard/auth-guard.guard';
import { rhGuard } from './guard/rh-guard.guard';
import { candidatGuard } from './guard/candidat-guard.guard';
import { ChatbotComponent } from './Component/shared/chatbot/chatbot.component';
import { EmployeePerformanceComponent } from './Component/employees/employee-performance/employee-performance.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    component: RegisterComponent,
    resolve: { competences: competenceResolver }
  },
  { path: 'performance/:id', component: EmployeePerformanceComponent },


  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authenticationGuard]
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authenticationGuard, rhGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'CvSubmission',
        component: CvSubmissionComponent
      },
      {
        path: 'JobOffers',
        component: JobOffersComponent,
        resolve: { competences: competenceResolver },
        children: [
          {
            path: ':id/candidates',
            component: JobOfferCandidatesComponent
          }]
      },
      {
        path: 'Condidates',
        component: CondidatesComponent
      },
      {
        path: 'Employees',
        component: EmployeesComponent
      }
    ]
  },
  { path: '**', redirectTo: 'login' } // Add a wildcard route for handling invalid paths
];
