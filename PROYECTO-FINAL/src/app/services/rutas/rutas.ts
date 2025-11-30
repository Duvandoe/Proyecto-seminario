import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Ruta } from '../../../interfaces/Rutas';

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  private apiUrl = environment.apiUrl;
  private perfilId = environment.perfilUrl;

  constructor(private http: HttpClient) {}

  // 🔹 OBTENER SOLO RUTAS DEL PERFIL
  getRutas(): Observable<{ data: Ruta[] }> {
    return this.http.get<{ data: Ruta[] }>(
      `${this.apiUrl}/rutas?perfil_id=${this.perfilId}`
    );
  }

  // 🔹 CREAR RUTA
  createRuta(ruta: Ruta): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      `${this.apiUrl}/rutas?perfil_id=${this.perfilId}`,
      ruta,
      { headers }
    );
  }

  // 🔹 OBTENER UNA RUTA POR ID
  getRuta(id: number): Observable<Ruta> {
    return this.http.get<Ruta>(
      `${this.apiUrl}/rutas/${id}?perfil_id=${this.perfilId}`
    );
  }

  // 🔹 ACTUALIZAR
  updateRuta(id: number, ruta: Ruta): Observable<Ruta> {
    return this.http.put<Ruta>(
      `${this.apiUrl}/rutas/${id}?perfil_id=${this.perfilId}`,
      ruta
    );
  }

  // 🔹 ELIMINAR
  deleteRuta(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/rutas/${id}?perfil_id=${this.perfilId}`
    );
  }
}
