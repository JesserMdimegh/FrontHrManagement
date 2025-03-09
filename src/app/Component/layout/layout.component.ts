
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [ RouterOutlet,FormsModule,CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  userName: string = '';
  userRole: string = '';
 

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('LayoutComponent initialized');
 
    this.userName = 'John Doe'; 
    this.userRole = 'Admin';

   
  }

 
  redirectToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
