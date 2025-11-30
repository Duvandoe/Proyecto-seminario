import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallesService } from '../../services/calles/calles';
import { Calle } from '../../../interfaces/Calles';

@Component({
  selector: 'app-calles-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calle-lista.html',
  styleUrls: ['./calle-lista.css']
})
export class CallesListaComponent implements OnInit {
  calles: Calle[] = [];
  cargando = true;
  error: string | null = null;

  constructor(private callesService: CallesService) {}

  ngOnInit() {
    this.callesService.getCalles().subscribe({
      next: (res) => {
        this.calles = res.data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar las calles';
        this.cargando = false;
      }
    });
  }
}

