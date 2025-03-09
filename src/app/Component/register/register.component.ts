import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterService } from '../../services/register.service'; 
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,  
    private router: Router 
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],  
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { 
      validator: this.passwordMatchValidator  
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;  // Get the form values

      // Call the register service to make the HTTP request
      this.registerService.registerUser(formData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          // Redirect the user to the login page or show a success message
          this.router.navigate(['/login']);  // You can change this to any route you want
        },
        error: (err) => {
          console.error('Registration failed:', err);
          // Handle error (show error message to user)
        }
      });
    }
  }
}
