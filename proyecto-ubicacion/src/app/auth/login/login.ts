import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  form!: FormGroup;  
  errorMsg = '';
  loading = false;
  shakeError = false;


   

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  }

  gotoRegister() {
    this.router.navigate(['/register']);
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    const { email, password } = this.form.value;
    this.auth.signIn(email!, password!).subscribe({
      next: () => this.router.navigateByUrl('/rutas'),
      error: (err) => {
        this.loading = false;
        if (err.message.includes("Invalid login credentials")) {
        this.errorMsg = "Correo o contraseña incorrectos";
        } else {
          this.errorMsg = err.message || "Error al iniciar sesión";
        }
        this.shakeError = true;
        setTimeout(() => this.shakeError = false, 500);
      }
    });
  }
}

