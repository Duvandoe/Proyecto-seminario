import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../../environments/environments';
import { VehiculosService } from '../../services/vehiculos/vehiculos';
import { Vehiculo } from '../../../interfaces/Vehiculo';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  modalSuccessVisible = false;
  modalErrorVisible = false;
  errorMensaje = "";

  constructor(private vehiculosService: VehiculosService, private router: Router) { }

  registroVehiculo() {
    this.vehiculosService.createVehiculo(this.datos).subscribe({
      next: () => {
        this.modalSuccessVisible = true;
      },
      error: (error) => {
        this.errorMensaje = "Error al registrar el vehículo";
        this.modalErrorVisible = true;
      }
    })
  }

  cerrarSuccess() {
  this.modalSuccessVisible = false;
  this.router.navigate(['/vehiculos']);
}

cerrarError() {
  this.modalErrorVisible = false;
}

volverLista() {
  this.router.navigate(['/vehiculos']);
}
}
