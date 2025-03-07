// layout.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet,FormsModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  userName: string = '';
  userRole: string = '';
 

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Implement your initialization logic here
    console.log('LayoutComponent initialized');
    
    // Example: Load user data if needed
    this.userName = 'John Doe'; // Replace with actual logic
    this.userRole = 'Admin'; // Replace with actual role

   
  }

 
  redirectToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
