import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Employee {
  name: string;
  role: string;
  status: string;
}

interface Department {
  id: number;
  name: string;
  manager: string;
  performance: { tasksCompleted: number; attendanceRate: number };
  employees: Employee[];
}

@Component({
  selector: 'app-department-list',  
  standalone: true,  
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './department-lis.component.html',
  styleUrls: ['./department-lis.component.css'],
})
export class DepartmentLisComponent {
  departments: Department[] = [
    {
      id: 1,  
      name: 'HR',
      manager: 'John Doe',
      performance: { tasksCompleted: 20, attendanceRate: 85 },
      employees: [
        { name: 'Alice', role: 'Recruiter', status: 'Active' },
        { name: 'Bob', role: 'Manager', status: 'On Leave' }
      ]
    },
    {
      id: 2,  
      name: 'HR',
      manager: 'John Doe',
      performance: { tasksCompleted: 20, attendanceRate: 85 },
      employees: [
        { name: 'Alice', role: 'Recruiter', status: 'Active' },
        { name: 'Bob', role: 'Manager', status: 'On Leave' }
      ]
    }
    ,
    {
      id: 1,  
      name: 'HR',
      manager: 'John Doe',
      performance: { tasksCompleted: 20, attendanceRate: 85 },
      employees: [
        { name: 'Alice', role: 'Recruiter', status: 'Active' },
        { name: 'Bob', role: 'Manager', status: 'On Leave' }
      ]
    }
  ];

  addDepartmentForm!: FormGroup;
  isAddDepartmentFormOpen = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.addDepartmentForm = this.fb.group({
      name: ['', Validators.required],
      manager: ['', Validators.required],
      employees: this.fb.array([]) 
    });
  }

  get employeesFormArray(): FormArray {
    return this.addDepartmentForm.get('employees') as FormArray;
  }

  addEmployee() {
    this.employeesFormArray.push(
      this.fb.group({
        name: ['', Validators.required],
        role: ['', Validators.required],
        status: ['Active', Validators.required]
      })
    );
  }

  removeEmployee(department: Department, index: number) { 
    department.employees.splice(index, 1);
  }

  selectDepartment(department: Department) {
    // Logic to select a department
    console.log('Selected Department: ', department);
  }

  openAddDepartmentForm() {
    this.isAddDepartmentFormOpen = true;
  }

  closeAddDepartmentForm() {
    this.isAddDepartmentFormOpen = false;
    this.addDepartmentForm.reset();
  }

  addDepartment() {
    if (this.addDepartmentForm.valid) {
      const newDepartment = this.addDepartmentForm.value;
      this.departments.push(newDepartment);
      this.closeAddDepartmentForm();
    }
  }

  openAddEmployeeForm(department: Department) {
    console.log('Add employee for: ', department);
  }
  
}
