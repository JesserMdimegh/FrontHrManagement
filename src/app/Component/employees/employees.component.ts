import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
interface PerformanceData {
  attendance: number;
  taskCompletion: number;
  qualityOfWork: string;
  goalsAchieved: number;
}

interface Employee {
  id: number;
  name: string;
}

@Component({
  selector: 'app-employees',
  imports: [FormsModule,CommonModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit {
  performanceData: { [key: number]: PerformanceData } = {
    1: { attendance: 85, taskCompletion: 90, qualityOfWork: 'Good', goalsAchieved: 4 },
    2: { attendance: 90, taskCompletion: 95, qualityOfWork: 'Excellent', goalsAchieved: 5 },
  };

  
  employees: Employee[] = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' },
  ];

  constructor() { }

  ngOnInit(): void {
  }
}