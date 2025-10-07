import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VehiculosListaComponent } from './components/vehiculos-lista/vehiculos-lista';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, VehiculosListaComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proyecto-ubicacion');
}
