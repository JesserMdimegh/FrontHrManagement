import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenService } from '../../services/services/token.service';
import { AuthService } from '../../services/services';

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
    var loginModel = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };
    if (this.loginForm.valid) {
      this.authService.apiAuthLoginPost({body:loginModel}).subscribe({
        next: (res:any) => {
          this.tokenService.token = res.token as string;
          //this.router.navigate(['/']);
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }
}

