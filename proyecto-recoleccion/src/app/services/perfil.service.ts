import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private API_URL = 'http://apirecoleccion.gonzaloandreslucio.com/api'; // URL base

  constructor(private http: HttpClient) {}

  // Obtener perfil por ID
  getPerfilPorId(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/perfil/${id}`);
  }
}
