import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {

  private baseUrl = `${environment.apiBaseUrl}/api/vehiculos`;

  constructor(private http: HttpClient) {}

  // 🔹 Obtener todos los vehículos
  obtenerVehiculos(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // 🔹 Obtener un vehículo por ID
  obtenerVehiculoPorId(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // 🔹 Actualizar un vehículo (opcional)
  actualizarVehiculo(id: string, datos: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, datos);
  }

  // 🔹 Listar vehículos por perfil
  listarVehiculos(perfilId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}?perfil_id=${perfilId}`);
  }
}
