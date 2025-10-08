import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VehiculosListaComponent } from './components/vehiculos-lista/vehiculos-lista';
import { VehiculosRegistro } from './components/vehiculos-registro/vehiculos-registro';
import { VehiculosActualizacion } from './components/vehiculos-actualizacion/vehiculos-actualizacion';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, VehiculosListaComponent, VehiculosRegistro, VehiculosActualizacion],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proyecto-ubicacion');
}
