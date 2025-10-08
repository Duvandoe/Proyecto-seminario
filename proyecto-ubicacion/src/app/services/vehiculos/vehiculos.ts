import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Vehiculo } from '../../../interfaces/Vehiculo';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {
  private apiUrl = environment.apiUrl;
  private perfilUrl = environment.perfilUrl;

  constructor(private http: HttpClient) { }

  getVehiculos(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${this.apiUrl}/vehiculos?perfil_id=${this.perfilUrl}`);
  }

  createVehiculo(vehiculo: Vehiculo): Observable<Vehiculo> {
    return this.http.post<Vehiculo>(`${this.apiUrl}/vehiculos?perfil_id=${this.perfilUrl}`, vehiculo);
  }

  getVehiculo(id: string): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${this.apiUrl}/vehiculos/${id}?perfil_id=${this.perfilUrl}`);
  }

  updateVehiculo(id: string, vehiculo: Vehiculo): Observable<Vehiculo> {
    return this.http.put<Vehiculo>(`${this.apiUrl}/vehiculos/${id}?perfil_id=${this.perfilUrl}`, vehiculo);
  }

  deleteVehiculo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vehiculos/${id}?perfil_id=${this.perfilUrl}`);
  }

}
