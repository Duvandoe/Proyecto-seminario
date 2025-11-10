import { Component, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { RutasService } from '../mapa/rutas.service';
import { VehiculosService } from '../mapa/vehiculos.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { Feature, Geometry } from 'geojson';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MapaComponent implements OnInit {
  mapa!: mapboxgl.Map;
  puntos: [number, number][] = [];
  mostrarModal = false;
  mostrarPanelRutas = false;
  nombreRuta = '';
  rutas: any[] = [];
  rutaSeleccionada: any = null;

  constructor(
    private rutasService: RutasService,
    private vehiculosService: VehiculosService
  ) {}

  ngOnInit(): void {
    (mapboxgl as any).accessToken = environment.mapboxToken;

    this.mapa = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-77.02824, 3.8801],
      zoom: 13
    });

    this.mapa.on('click', (event) => this.agregarPunto(event.lngLat));

    this.mapa.on('load', () => {
      this.cargarRutas();
      this.cargarVehiculos();
    });
  }

    cargarRutas(): void {
    this.rutasService.listarRutas(environment.perfil_id).subscribe({
      next: (rutas: any[]) => {
        this.rutas = rutas.map(ruta => {
          try {
            if (typeof ruta.shape === 'string') {
              ruta.shape = JSON.parse(ruta.shape);
            }
          } catch {
            console.warn('⚠️ Ruta con shape inválido:', ruta.nombre_ruta);
          }
          return ruta;
        });
        console.log('✅ Rutas cargadas:', this.rutas);
      },
      error: (err) => console.error('❌ Error al cargar rutas:', err)
    });
  }

  obtenerDetallesRuta(id: string): void {
    this.rutasService.obtenerRutaPorId(id, environment.perfil_id).subscribe({
      next: (ruta) => {
        try {
          if (typeof ruta.shape === 'string') {
            ruta.shape = JSON.parse(ruta.shape);
          }
          console.log('📍 Detalles de ruta obtenidos:', ruta);
          this.dibujarRutaSeleccionada(ruta);
        } catch (e) {
          console.error('⚠️ Error al procesar ruta:', e);
        }
      },
      error: (err) => console.error('❌ Error al obtener detalles de ruta:', err)
    });
  }

  dibujarRutaSeleccionada(ruta: any): void {
    if (!ruta || !ruta.shape) {
      console.warn('⚠️ Ruta sin geometría válida');
      return;
    }

    // Eliminar la anterior si ya hay una
    this.eliminarRutaSeleccionada();

    let coords: [number, number][] = [];

    if (ruta.shape.type === 'LineString') {
      coords = ruta.shape.coordinates;
    } else if (ruta.shape.type === 'MultiLineString') {
      coords = ruta.shape.coordinates[0];
    }

    if (!coords || coords.length === 0) {
      console.warn('⚠️ Ruta sin coordenadas');
      return;
    }

    this.mapa.addSource('rutaSeleccionada', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coords
        },
        properties: {}
      }
    });

    this.mapa.addLayer({
      id: 'rutaSeleccionada',
      type: 'line',
      source: 'rutaSeleccionada',
      paint: {
        'line-color': ruta.color_hex || '#ff0000',
        'line-width': 5
      }
    });

    const bounds = new mapboxgl.LngLatBounds();
    coords.forEach(coord => bounds.extend(coord));
    this.mapa.fitBounds(bounds, { padding: 50 });

    this.rutaSeleccionada = ruta;
  }

  eliminarRutaSeleccionada(): void {
    if (this.mapa.getLayer('rutaSeleccionada')) {
      this.mapa.removeLayer('rutaSeleccionada');
    }
    if (this.mapa.getSource('rutaSeleccionada')) {
      this.mapa.removeSource('rutaSeleccionada');
    }
  }

  cargarVehiculos(): void {
    this.vehiculosService.listarVehiculos(environment.perfil_id).subscribe({
      error: (err) => console.error('❌ Error al cargar vehículos:', err)
    });
  }


  abrirModalGuardarRuta() {
    if (this.puntos.length < 2) {
      alert('⚠️ Debe marcar al menos dos puntos para guardar una ruta.');
      return;
    }
    this.mostrarModal = true;
  }

  agregarPunto(lngLat: mapboxgl.LngLat) {
    const punto: [number, number] = [lngLat.lng, lngLat.lat];
    this.puntos.push(punto);
    new mapboxgl.Marker().setLngLat(punto).addTo(this.mapa);
    this.dibujarLinea();
  }

  dibujarLinea() {
    const geojson: Feature<Geometry> = {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: this.puntos },
      properties: {}
    };

    if (this.mapa.getSource('linea')) {
      (this.mapa.getSource('linea') as mapboxgl.GeoJSONSource).setData(geojson);
    } else {
      this.mapa.addSource('linea', { type: 'geojson', data: geojson });
      this.mapa.addLayer({
        id: 'linea',
        type: 'line',
        source: 'linea',
        paint: { 'line-color': '#87e487ff', 'line-width': 4 }
      });
    }
  }

  confirmarGuardarRuta() {
    const nombreRutaFinal = (this.nombreRuta || '').trim();
    if (!nombreRutaFinal) {
      alert('⚠️ Debes escribir un nombre para la ruta antes de guardar.');
      return;
    }

    if (this.puntos.length < 2) {
      alert('⚠️ Debes marcar al menos dos puntos en el mapa.');
      return;
    }

    const shapeObject = {
      type: 'MultiLineString',
      coordinates: [this.puntos]
    };

    const body = {
      nombre_ruta: nombreRutaFinal,
      perfil_id: environment.perfil_id,
      color_hex: '#8ee6a4ff',
      shape: JSON.stringify(shapeObject)
    };

    this.rutasService.crearRuta(body).subscribe({
      next: () => {
        alert(`✅ Ruta "${nombreRutaFinal}" guardada correctamente`);
        this.resetMapa();
        this.cargarRutas();
        this.nombreRuta = '';
        this.mostrarModal = false;
      },
      error: (err) => {
        console.error('❌ Error al guardar ruta:', err);
        alert('❌ Error al guardar la ruta.');
      }
    });
  }

  cancelarGuardarRuta() {
    this.mostrarModal = false;
  }

  resetMapa() {
    this.puntos = [];
    this.nombreRuta = '';
    if (this.mapa.getSource('linea')) {
      this.mapa.removeLayer('linea');
      this.mapa.removeSource('linea');
    }
    this.eliminarRutaSeleccionada();
  }

  centrarRuta(ruta: any): void {
    this.obtenerDetallesRuta(ruta.id);
  }

  togglePanelRutas() {
    this.mostrarPanelRutas = !this.mostrarPanelRutas;
  }
}
