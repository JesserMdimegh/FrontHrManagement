
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-department-performance',
  imports: [CommonModule, FormsModule],
  templateUrl: './department-performance.component.html',
  styleUrl: './department-performance.component.css'
})


  export class DepartmentPerformanceComponent implements OnInit {
  
    departmentId: number | undefined;
    department: any;
  
    constructor(private route: ActivatedRoute) {}
  
    ngOnInit(): void {
      this.route.params.subscribe(params => {
        this.departmentId = +params['id'];
        // Fetch department data based on the id
        this.getDepartmentPerformance();
      });
    }
  
    // Simulating fetching department data
    getDepartmentPerformance() {
      // For simplicity, use a static list; you can replace this with API calls
      const departments = [
        { id: 1, name: 'HR', performance: { tasksCompleted: 20, kpiAchievement: 90 } },
        { id: 2, name: 'Engineering', performance: { tasksCompleted: 40, kpiAchievement: 85 } },
        { id: 3, name: 'Sales', performance: { tasksCompleted: 30, kpiAchievement: 80 } }
      ];
  
      this.department = departments.find(d => d.id === this.departmentId);
    }
  }
  

