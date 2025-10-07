import { Component, OnInit } from '@angular/core';
import { VehiculosService, Vehiculo } from '../../services/vehiculos/vehiculos';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  selector: 'app-vehiculos-lista',
  templateUrl: './vehiculos-lista.html',
  styleUrls: ['./vehiculos-lista.css']
})
export class VehiculosListaComponent implements OnInit {
  vehiculos: Vehiculo[] = [];
  cargando = true;
  error: string | null = null;

  constructor(private vehiculosService: VehiculosService) {}

  ngOnInit(): void {
    this.obtenerVehiculos();
  }

  obtenerVehiculos() {
    this.vehiculosService.getVehiculos().subscribe({
      next: (data) => {
        console.log('Vehículos cargados:', data);
        this.vehiculos = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los vehículos';
        this.cargando = false;
      }
    });
  }
}
