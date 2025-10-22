import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private mockUser = {
    email: 'liturris@unipacifico.edu.co',
    password: '12345'
  };

  login(data: any): Observable<any> {
    if (data.email === this.mockUser.email && data.password === this.mockUser.password) {
      // Retorna un token simulado (como si viniera del backend)
      return of({ token: 'mock-jwt-token', user: this.mockUser });
    } else {
      return throwError(() => new Error('Credenciales incorrectas'));
    }
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
