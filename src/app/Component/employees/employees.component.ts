import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/services/employe-management.service';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeEditDialogComponent } from './edit/employee-edit-dialog/employee-edit-dialog.component';
import { EmployeeCreateDialogComponent } from '../employee-form-dialog/employee-form-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  imports: [CommonModule,
    FormsModule,
    MatListModule,
    MatCardModule,
    MatSidenavModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ]

})
export class EmployeesComponent implements OnInit {
  searchTerm: string = '';
  positionFilter: string = '';
  departmentFilter: string = '';
  
  // Add these arrays with your actual data
  positions: string[] = ['Developer', 'Manager', 'Designer', 'Intern']; // Replace with your actual positions
  departments: any[] = [ // Replace with your actual departments
    { id: 1, name: 'IT' },
    { id: 2, name: 'HR' },
    { id: 3, name: 'Finance' }
  ];

  // Your existing code...
  filteredEmployees: any[] = []; // Make sure this exists
  employees: any[] = [];
  displayedColumns: string[] = ['Lastname', 'Firstname', 'Email', 'Telephone', 'Poste', 'actions'];

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => this.employees = data,
      error: (err) => this.showError('Failed to load employees')
    });
  }
  filterEmployees(): void {
    // Implement your filtering logic here
    // Example:
    this.filteredEmployees = this.employees.filter(employee => {
      const matchesSearch = employee.Lastname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           employee.Firstname.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesPosition = !this.positionFilter || employee.Poste === this.positionFilter;
      const matchesDepartment = !this.departmentFilter || employee.departmentId == this.departmentFilter;
      
      return matchesSearch && matchesPosition && matchesDepartment;
    });
  }

  // Add clear filters method
  clearFilters(): void {
    this.searchTerm = '';
    this.positionFilter = '';
    this.departmentFilter = '';
    this.filterEmployees();
  }


  openCreateDialog(): void {
    const dialogRef = this.dialog.open(EmployeeCreateDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEmployees();
      }
    });
  }

  openEditDialog(employee: any): void {
    const dialogRef = this.dialog.open(EmployeeEditDialogComponent, {
      width: '500px',
      data: employee
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEmployees();
      }
    });
  }

  deleteEmployee(id: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.snackBar.open('Employee deleted successfully', 'Close', { duration: 3000 });
          this.loadEmployees();
        },
        error: () => this.showError('Failed to delete employee')
      });
    }
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
  }
}