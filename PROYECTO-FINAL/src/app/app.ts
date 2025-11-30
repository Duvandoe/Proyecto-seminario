import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';  // ← IMPORTAR PARA *ngFor y *ngIf

@Component({
  selector: 'app-root',
  standalone: true, // ← MARCAR COMO STANDALONE
  imports: [RouterOutlet, CommonModule], // ← AGREGAR CommonModule
  templateUrl: './app.html',
  styleUrls: ['./app.css'] // ← styleUrls en plural
})
export class App {
  protected readonly title = signal('proyecto-ubicacion');
}
