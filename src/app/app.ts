import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proyecto-ubicacion');
  isLoggedIn = false;
  userEmail: string | null = null;

  constructor(private auth: Auth, private authService: AuthService, private router: Router) {
    onAuthStateChanged(this.auth, (user) => {
      this.isLoggedIn = !!user;
      this.userEmail = user?.email ?? null;
    });
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
