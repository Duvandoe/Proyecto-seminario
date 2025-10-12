import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, JsonPipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Control de Rutas - Calles';
  calles: any[] = [];
  calleId = '';
  selectedCalle: any = null;

  private apiUrl = 'http://apirecoleccion.gonzaloandreslucio.com/api/calles';

  constructor(private http: HttpClient) {
    this.cargarCalles();
  }

  cargarCalles() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        this.calles = response.data || [];
      },
      error: (error) => {
        console.error('Error al cargar las calles:', error);
      }
    });
  }

  buscarCalle() {
    if (!this.calleId.trim()) return;

    this.http.get<any>(`${this.apiUrl}/${this.calleId}`).subscribe({
      next: (data) => {
        this.selectedCalle = data;
      },
      error: (error) => {
        console.error('Error al buscar la calle:', error);
        this.selectedCalle = null;
      }
    });
  }
}
