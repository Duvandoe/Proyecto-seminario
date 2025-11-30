import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VehiculosService } from '../../services/vehiculos/vehiculos';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehiculo } from '../../../interfaces/Vehiculo';

@Component({
  selector: 'app-vehiculos-actualizacion',
  imports: [CommonModule, FormsModule],
  templateUrl: './vehiculos-actualizacion.html',
  styleUrl: './vehiculos-actualizacion.css'
})
export class VehiculosActualizacion implements OnInit {

  vehiculo: Vehiculo = {
    perfil_id: '',
    placa: '',
    marca: '',
    modelo: '',
    activo: true,
  };

  id: string | null = null;

  constructor(private vehiculosService: VehiculosService, private route: ActivatedRoute, private router: Router) {}
  
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.vehiculosService.getVehiculo(this.id).subscribe({
        next: (data) => {
          this.vehiculo = data;
        },
        error: (err) => {
          console.error('Error al obtener el vehículo:', err);
        }
      });
    }
  }
  
  modalVisible = false;

actualizarVehiculo() {
  if (!this.vehiculo.id) return;

  this.vehiculosService.updateVehiculo(this.vehiculo.id, this.vehiculo).subscribe({
    next: () => {
      this.modalVisible = true; // mostrar modal
    },
    error: (err) => {
      console.error('Error al actualizar:', err);
    }
  });
}

cerrarModal() {
  this.modalVisible = false;
  this.router.navigate(['/vehiculos']);
}

}
