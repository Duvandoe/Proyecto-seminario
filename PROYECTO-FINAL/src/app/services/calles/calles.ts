import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Calle } from '../../../interfaces/Calles';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CallesService {
  private apiUrl = environment.apiUrl;
  private perfilUrl = environment.perfilUrl;

  constructor(private http: HttpClient) { }

  getCalles(): Observable<{data: Calle[]}> {
    return this.http.get<{data: Calle[]}>(`${this.apiUrl}/calles?perfil_id=${this.perfilUrl}`);
  }

  getCalleId(id: string): Observable<Calle> {
    return this.http.get<Calle>(`${this.apiUrl}/calles/${id}?perfil_id=${this.perfilUrl}`);
  }
}
