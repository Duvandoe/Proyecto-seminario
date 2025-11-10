import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RutasService {
  private apiUrl = `${environment.apiBaseUrl}/rutas`;

  constructor(private http: HttpClient) {}

  crearRuta(ruta: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl, ruta, { headers });
  }

  listarRutas(perfil_id: string): Observable<any[]> {
    const params = new HttpParams().set('perfil_id', perfil_id);
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      // si la API devuelve { data: [...] } devolvemos data, si devuelve directamente array devolvemos eso
      map(response => {
        if (!response) return [];
        if (Array.isArray(response)) return response;
        if (response.data && Array.isArray(response.data)) return response.data;
        // por si vienen envueltos de otra forma
        return response.data || [];
      })
    );
  }

  obtenerRutaPorId(id: string, perfil_id: string): Observable<any> {
    const params = new HttpParams().set('perfil_id', perfil_id);
    return this.http.get<any>(`${this.apiUrl}/${id}`, { params }).pipe(
      map(response => {
        // la API puede devolver la ruta directamente o { data: ruta }
        if (!response) return null;
        return response.data ? response.data : response;
      })
    );
  }
}
