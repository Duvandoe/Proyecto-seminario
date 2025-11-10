import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VehiculosService {

  private apiUrl = `${environment.apiBaseUrl}/vehiculos`;

  constructor(private http: HttpClient) {}

  listarVehiculos(perfil_id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?perfil_id=${perfil_id}`);
  }
}
