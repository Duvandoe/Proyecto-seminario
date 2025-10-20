import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Ruta } from '../../../interfaces/Rutas';

@Injectable({
  providedIn: 'root'
})
export class RutasService {
  private apiUrl = environment.apiUrl;
  private perfilUrl = environment.perfilUrl;

  constructor(private http: HttpClient) { }

  getRutas(): Observable<{data: Ruta[]}> {
    return this.http.get<{data: Ruta[]}>(`${this.apiUrl}/rutas?perfil_id=${this.perfilUrl}`);
  }

  createRuta(ruta: Ruta): Observable<Ruta> {
    return this.http.post<Ruta>(`${this.apiUrl}/rutas?perfil_id=${this.perfilUrl}`, ruta);
  }

  getRuta(id: string): Observable<Ruta> {
    return this.http.get<Ruta>(`${this.apiUrl}/rutas/${id}?perfil_id=${this.perfilUrl}`);
  }
}
