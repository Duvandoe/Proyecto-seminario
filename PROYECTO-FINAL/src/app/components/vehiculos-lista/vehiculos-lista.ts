import { Component, OnInit } from '@angular/core';
import { VehiculosService } from '../../services/vehiculos/vehiculos';
import { Vehiculo } from '../../../interfaces/Vehiculo';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router';

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

  constructor(private vehiculosService: VehiculosService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerVehiculos();
  }

  obtenerVehiculos() {
    this.vehiculosService.getVehiculos().subscribe({
      next: (data) => {
        console.log('Vehículos cargados:', data);
        this.vehiculos = data.data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los vehículos';
        this.cargando = false;
      }
    });
  }
  actualizarVehiculo(id: string | undefined) {
    if (!id) return;
    this.router.navigate(['/vehiculos/editar', id]);
  }

  eliminarVehiculo(id: string) {
  if (!confirm('¿Estás seguro de eliminar este vehículo?')) return;

  this.vehiculosService.deleteVehiculo(id).subscribe({
    next: () => {
      alert('Vehículo eliminado correctamente');
      this.obtenerVehiculos();
    },
    error: (err) => {
      console.error('Error al eliminar vehículo:', err);
    }
  });
}
}
