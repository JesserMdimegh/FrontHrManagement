import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenService } from '../../services/services/token.service';
import { AuthService } from '../../services/services/auth.service';
import { UserResponse } from '../../services/models/UserResponse';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginModel = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
      console.log('token:',localStorage.getItem('token'));

      this.authService.apiAuthLoginPost({ body: loginModel }).subscribe({
        next: (res: any) => {
          this.tokenService.token = res.token as string;
          this.tokenService.user = res.user as UserResponse;
          console.log('Login successful, redirecting...');
          console.log('res.user', res.user);
          
          // ✅ Redirect to dashboard after login
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.log('Login failed', error);
        }
      });
    }
  }
}

