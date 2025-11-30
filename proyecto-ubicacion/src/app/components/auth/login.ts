import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private auth: Auth, private router: Router) {}

  async login() {
    this.errorMessage = '';
    this.loading = true;

    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      );

      console.log('Usuario logueado:', userCredential.user);

      // Redirige a la página protegida
      this.router.navigate(['/rutas']);

    } catch (error: any) {
      console.error(error);

      switch (error.code) {
        case 'auth/invalid-email':
          this.errorMessage = 'Correo inválido';
          break;
        case 'auth/user-not-found':
          this.errorMessage = 'Usuario no encontrado';
          break;
        case 'auth/wrong-password':
          this.errorMessage = 'Contraseña incorrecta';
          break;
        default:
          this.errorMessage = 'Error al iniciar sesión';
      }
    } finally {
      this.loading = false;
    }
  }
}
