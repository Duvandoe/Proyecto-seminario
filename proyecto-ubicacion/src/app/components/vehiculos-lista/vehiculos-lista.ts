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

  // Variables para el modal
  modalConfirmVisible = false;
  modalSuccessVisible = false;
  vehiculoAEliminar: string | null = null;

  constructor(private vehiculosService: VehiculosService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerVehiculos();
  }

  obtenerVehiculos() {
    this.vehiculosService.getVehiculos().subscribe({
      next: (data) => {
        this.vehiculos = data.data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar los vehículos';
        this.cargando = false;
      }
    });
  }

  crearVehiculo() {
    this.router.navigate(['/vehiculos/registro']);
  }

  gotoRutas() {
    this.router.navigate(['/rutas']);
  }

  actualizarVehiculo(id: string | undefined) {
    if (!id) return;
    this.router.navigate(['/vehiculos/editar', id]);
  }

  // Llamado desde botón "Eliminar"
  eliminarVehiculo(id: string) {
    this.vehiculoAEliminar = id;
    this.modalConfirmVisible = true;
  }

  // Cancelar modal
  cerrarConfirm() {
    this.modalConfirmVisible = false;
    this.vehiculoAEliminar = null;
  }

  // Confirmar eliminación
  confirmarEliminacion() {
    if (!this.vehiculoAEliminar) return;

    this.vehiculosService.deleteVehiculo(this.vehiculoAEliminar).subscribe({
      next: () => {
        this.modalConfirmVisible = false;
        this.modalSuccessVisible = true;
        this.obtenerVehiculos();
      },
      error: (err) => {
        console.error('Error al eliminar vehículo:', err);
      }
    });
  }

  cerrarSuccess() {
    this.modalSuccessVisible = false;
  }
}

