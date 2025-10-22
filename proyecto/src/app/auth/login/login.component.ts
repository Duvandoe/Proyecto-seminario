import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';        // para *ngIf
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]       // 🔹 Muy importante
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: (resp: any) => {
        localStorage.setItem('token', resp.token);
        this.router.navigate(['/mapa']);
      },
      error: (err) => {
        this.errorMessage = 'Usuario o contraseña incorrectos';
        console.error(err);
      }
    });
  }
}
