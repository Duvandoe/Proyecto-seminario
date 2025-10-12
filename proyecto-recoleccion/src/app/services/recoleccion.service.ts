import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecoleccionService {

  private apiUrl = 'http://apirecoleccion.gonzaloandreslucio.com/api';
  private perfilId = '2ec8003d-6d56-4124-bce5-fc60ed79c4b8'; // tu perfil de grupo

  constructor(private http: HttpClient) {}

  // Obtener todas las calles
  getCalles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/calles`);
  }

  // Obtener detalles de una calle por ID
  getCallePorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/calles/${id}`);
  }

  // Registrar algo con tu perfil (ejemplo)
  registrarRecoleccion(datos: any): Observable<any> {
    const body = { ...datos, perfil_id: this.perfilId };
    return this.http.post(`${this.apiUrl}/recolecciones`, body);
  }
}
