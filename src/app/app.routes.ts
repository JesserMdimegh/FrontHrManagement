import { Routes } from '@angular/router';
import { LoginComponent } from './Component/login/login.component';
import { DashboardComponent } from './Component/dashboard/dashboard.component';
import { LayoutComponent } from './Component/layout/layout.component';
import { CvSubmissionComponent } from './Component/cv-submission/cv-submission.component';
import { RegisterComponent } from './Component/register/register.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'login',
        component:LoginComponent,
    }
    ,
  
    {
         path: 'register',
         component: RegisterComponent },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path:'CvSubmission',
                component:CvSubmissionComponent,
            }
        ]
    }
               
                
            
        
    
    
    
   
];
