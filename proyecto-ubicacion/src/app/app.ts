import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VehiculosListaComponent } from './components/vehiculos-lista/vehiculos-lista';
import { VehiculosRegistro } from './components/vehiculos-registro/vehiculos-registro';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, VehiculosListaComponent, VehiculosRegistro],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proyecto-ubicacion');
}
