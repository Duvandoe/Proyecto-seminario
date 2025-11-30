import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { VehiculosService } from '../../services/vehiculos/vehiculos';
import { Vehiculo } from '../../../interfaces/Vehiculo';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  selector: 'app-vehiculos-registro',
  templateUrl: './vehiculos-registro.html',
  styleUrl: './vehiculos-registro.css'
})
export class VehiculosRegistro {

  private perfilUrl = environment.perfilUrl;

  datos: Vehiculo = {
    perfil_id: this.perfilUrl, 
    placa: '',
    marca: null,
    modelo: null,
    activo: true,
  };

  constructor(private vehiculosService: VehiculosService) { }

  registroVehiculo() {
    this.vehiculosService.createVehiculo(this.datos).subscribe({
      next: (respuesta) => {
        console.log('Vehículo registrado:', respuesta);
      },
      error: (error) => {
        console.error('Error al registrar vehículo:', error);
      }
    })
  }
}
