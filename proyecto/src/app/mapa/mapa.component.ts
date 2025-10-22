import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { RutasService } from '../mapa/rutas.service';
import { VehiculosService } from '../mapa/vehiculos.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class MapaComponent implements OnInit {

  mapa!: mapboxgl.Map;
  puntos: [number, number][] = [];
  mostrarModal = false;
  nombreRuta = '';
  perfilId = '2ec8003d-6d56-4124-bce5-fc60ed79c4b8';
  rutas: any[] = []; // 🔹 Aquí guardamos las rutas cargadas

  constructor(
    private rutasService: RutasService,
    private vehiculosService: VehiculosService
  ) {}

  ngOnInit(): void {
    // Inicializar mapa centrado en Buenaventura
    this.mapa = new mapboxgl.Map({
      accessToken: 'pk.eyJ1IjoibmVvMTk5OTIiLCJhIjoiY21oMDIxbzl6MHh2ODJscG9mYWYxbnp5eiJ9.CsAEqW3UVmpayCRVWfqqng',
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

  // 🔹 Cargar rutas y guardarlas para mostrar en el panel
  cargarRutas(): void {
    this.rutasService.listarRutas(this.perfilId).subscribe({
      next: (rutas: any[]) => {
        this.rutas = rutas;
        console.log('📍 Rutas cargadas:', rutas);
        rutas.forEach((ruta) => {
          if (ruta.shape?.coordinates) {
            const id = `ruta-${ruta.id}`;
            if (!this.mapa.getSource(id)) {
              this.mapa.addSource(id, {
                type: 'geojson',
                data: { type: 'Feature', geometry: ruta.shape, properties: {} }
              });
              this.mapa.addLayer({
                id,
                type: 'line',
                source: id,
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: { 'line-color': '#FF9800', 'line-width': 3 }
              });
            }
          }
        });
      },
      error: (err: any) => console.error('❌ Error al cargar rutas:', err)
    });
  }

  // 🔹 Cargar vehículos
  cargarVehiculos(): void {
    this.vehiculosService.listarVehiculos(this.perfilId).subscribe({
      next: (vehiculos: any[]) => {
        vehiculos.forEach((vehiculo) => {
          if (vehiculo.ubicacion?.coordinates) {
            const [lng, lat] = vehiculo.ubicacion.coordinates;
            new mapboxgl.Marker({ color: '#28a745' })
              .setLngLat([lng, lat])
              .setPopup(new mapboxgl.Popup().setText(`🚘 ${vehiculo.nombre || 'Vehículo sin nombre'}`))
              .addTo(this.mapa);
          }
        });
      },
      error: (err: any) => console.error('❌ Error al cargar vehículos:', err)
    });
  }

  // 🔹 Centrar el mapa sobre una ruta seleccionada
  centrarRuta(ruta: any): void {
    if (ruta.shape?.coordinates?.length) {
      const coords = ruta.shape.coordinates;
      const bounds = new mapboxgl.LngLatBounds();
      coords.forEach((c: [number, number]) => bounds.extend(c));
      this.mapa.fitBounds(bounds, { padding: 40 });

      // Resaltar la ruta seleccionada
      const id = `ruta-${ruta.id}`;
      if (this.mapa.getLayer(id)) {
        this.mapa.setPaintProperty(id, 'line-color', '#2196F3');
        this.mapa.setPaintProperty(id, 'line-width', 5);
      }
    }
  }

  // 🔹 Agregar punto con clic
  agregarPunto(lngLat: mapboxgl.LngLat) {
    const punto: [number, number] = [lngLat.lng, lngLat.lat];
    this.puntos.push(punto);
    new mapboxgl.Marker().setLngLat(punto).addTo(this.mapa);

    if (this.puntos.length === 2) {
      this.dibujarLinea();
      this.mostrarModal = true;
    }
  }

  // 🔹 Dibujar línea temporal
  dibujarLinea() {
    const geojson: any = {
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: this.puntos }
    };

    if (this.mapa.getSource('linea')) {
      (this.mapa.getSource('linea') as mapboxgl.GeoJSONSource).setData(geojson);
    } else {
      this.mapa.addSource('linea', { type: 'geojson', data: geojson });
      this.mapa.addLayer({
        id: 'linea',
        type: 'line',
        source: 'linea',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#007bff', 'line-width': 4 }
      });
    }
  }

  // 🔹 Guardar la nueva ruta
  confirmarGuardarRuta() {
    const nuevaRuta = {
      nombre_ruta: this.nombreRuta || 'Ruta sin nombre',
      perfil_id: this.perfilId,
      shape: { type: 'LineString', coordinates: this.puntos },
      calles_ids: []
    };

    this.rutasService.crearRuta(nuevaRuta).subscribe({
      next: () => {
        alert('✅ Ruta guardada correctamente');
        this.resetMapa();
        this.cargarRutas();
      },
      error: (err) => {
        alert('❌ Error al guardar la ruta');
        console.error(err);
      }
    });

    this.mostrarModal = false;
  }

  cancelarGuardarRuta() {
    this.mostrarModal = false;
    this.resetMapa();
  }

  resetMapa() {
    this.puntos = [];
    this.nombreRuta = '';
    if (this.mapa.getSource('linea')) {
      this.mapa.removeLayer('linea');
      this.mapa.removeSource('linea');
    }
  }
}
