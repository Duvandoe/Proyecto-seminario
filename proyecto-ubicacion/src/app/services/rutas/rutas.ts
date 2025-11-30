import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Ruta } from '../../../interfaces/Rutas';

@Injectable({
  providedIn: 'root'
})
export class RutasService {
  private apiUrl = environment.apiUrl;
  private perfilUrl = environment.perfilUrl; // <-- usar perfil como en VehiculosService

  constructor(private https: HttpClient) { }

  // Obtener todas las rutas filtradas por perfil_id
  getRutas(): Observable<{ data: Ruta[] }> {
    return this.https.get<{ data: Ruta[] }>(`${this.apiUrl}/rutas?perfil_id=${this.perfilUrl}`);
  }

  // Crear una ruta (perfil_id por query string, igual que VehiculosService)
  createRuta(ruta: Ruta): Observable<Ruta> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.https.post<Ruta>(`${this.apiUrl}/rutas?perfil_id=${this.perfilUrl}`, ruta, { headers });
  }

  // Obtener ruta por id (incluye perfil_id)
  getRuta(id: string): Observable<Ruta> {
    return this.https.get<Ruta>(`${this.apiUrl}/rutas/${id}?perfil_id=${this.perfilUrl}`);
  }

  // Opcionales: actualizar / eliminar rutas (siguiendo el mismo patrón)
  updateRuta(id: string, ruta: Ruta): Observable<Ruta> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.https.put<Ruta>(`${this.apiUrl}/rutas/${id}?perfil_id=${this.perfilUrl}`, ruta, { headers });
  }

  deleteRuta(id: string): Observable<void> {
    return this.https.delete<void>(`${this.apiUrl}/rutas/${id}?perfil_id=${this.perfilUrl}`);
  }
}
