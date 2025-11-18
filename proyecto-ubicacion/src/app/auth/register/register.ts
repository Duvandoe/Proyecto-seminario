import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
})
export class RegisterComponent {
  form!: FormGroup;
  errorMsg = '';
  infoMsg = '';
  loading = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    const { email, password } = this.form.value;

    this.auth.signUp(email!, password!).subscribe({
      next: () => {
        this.infoMsg = 'Registro exitoso.';
        this.loading = false;
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        this.errorMsg = err.message || 'Error al registrarte';
        this.loading = false;
      }
    });
  }
}

