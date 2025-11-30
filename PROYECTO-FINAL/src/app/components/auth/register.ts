import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})

export class RegisterComponent {

  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private auth: Auth, private router: Router) {}

  async register() {
    this.errorMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.loading = true;

    try {
      await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      this.router.navigate(['/login']); // redirige al login
    } catch (error: any) {
      switch (error.code) {
        case 'auth/invalid-email':
          this.errorMessage = 'Correo inválido';
          break;
        case 'auth/email-already-in-use':
          this.errorMessage = 'El correo ya está en uso';
          break;
        case 'auth/weak-password':
          this.errorMessage = 'La contraseña es muy débil';
          break;
        default:
          this.errorMessage = 'Error al registrarse';
      }
    } finally {
      this.loading = false;
    }
  }
}
