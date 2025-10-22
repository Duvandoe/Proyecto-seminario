import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RutasService {
  private apiUrl = 'https://apirecoleccion.gonzaloandreslucio.com/api/rutas';

  constructor(private http: HttpClient) {}

  crearRuta(ruta: any): Observable<any> {
    return this.http.post(this.apiUrl, ruta);
  }

  listarRutas(perfilId?: string): Observable<any> {
    const url = perfilId ? `${this.apiUrl}?perfil_id=${perfilId}` : this.apiUrl;
    return this.http.get(url);
  }
}
