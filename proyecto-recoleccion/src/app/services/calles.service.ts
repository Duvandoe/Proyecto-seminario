import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CallesService {
  private apiUrl = 'http://apirecoleccion.gonzaloandreslucio.com/api/calles';

  constructor(private http: HttpClient) {}

  // Obtener todas las calles
  getCalles(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Obtener detalles de una calle por ID
  getCalleById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
