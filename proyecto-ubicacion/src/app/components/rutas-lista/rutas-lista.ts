import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

interface Ruta {
  id: number;
  nombre_ruta: string;
  color_hex: string;
  perfil_id: number;
  shape?: string; // GeoJSON string (coordinates as [lon, lat])
}

@Component({
  selector: 'app-rutas-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rutas-lista.html',
  styleUrls: ['./rutas-lista.css']
})
export class RutasMapaComponent implements AfterViewInit, OnDestroy {
  @ViewChild('containerMapa', { static: true }) containerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('mapEl', { static: true }) mapRef!: ElementRef<HTMLDivElement>;

  private map!: L.Map;
  private routeLayers: L.Layer[] = [];
  private resizeObserver?: ResizeObserver;
  rutas: Ruta[] = [];
  loading = true;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.cargarRutasDemo();
    // Esperar a que el contenedor tenga tamaño visible
    const container = this.containerRef.nativeElement;
    if (container.clientWidth > 0 && container.clientHeight > 0) {
      this.inicializarMapa();
    } else {
      this.resizeObserver = new ResizeObserver(() => {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
          this.resizeObserver?.disconnect();
          this.inicializarMapa();
        }
      });
      this.resizeObserver.observe(container);
    }
  }

  private inicializarMapa() {
    this.ngZone.runOutsideAngular(() => {
      // limpiar si ya existe
      if (this.map) {
        try { this.map.remove(); } catch {}
      }

      // Crear mapa usando el elemento directamente (evita problemas de id)
      this.map = L.map(this.mapRef.nativeElement, {
        preferCanvas: true,
        zoomControl: true,
        minZoom: 3,
        maxZoom: 19
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(this.map);

      // Asegurar que Leaflet recalcule tamaño al estar listo
      this.map.whenReady(() => this.map.invalidateSize());

      // Geolocalización (si el usuario lo permite)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            this.map.setView([pos.coords.latitude, pos.coords.longitude], 14);
            L.marker([pos.coords.latitude, pos.coords.longitude]).addTo(this.map)
              .bindPopup('Tu ubicación actual');
            this.dibujarRutas();
            this.forzarRedraw();
          },
          () => {
            // fallback
            this.map.setView([3.8777, -77.0276], 13);
            this.dibujarRutas();
            this.forzarRedraw();
          },
          { enableHighAccuracy: false, timeout: 5000 }
        );
      } else {
        this.map.setView([3.8777, -77.0276], 13);
        this.dibujarRutas();
        this.forzarRedraw();
      }

      // Observador para redimensionar correctamente
      this.resizeObserver = new ResizeObserver(() => {
        if (this.map) this.map.invalidateSize();
      });
      this.resizeObserver.observe(this.mapRef.nativeElement);
      window.addEventListener('resize', this.onWindowResize);
    });
  }

  private cargarRutasDemo() {
    // Reemplaza por tu servicio real. GeoJSON usa [lon, lat].
    setTimeout(() => {
      this.rutas = [
        { id: 1, nombre_ruta: 'Ruta Centro', color_hex: '#ff0000', perfil_id: 1,
          shape: JSON.stringify({ type: 'LineString', coordinates: [[-77.0276, 3.8777], [-77.0300, 3.8800]] }) },
        { id: 2, nombre_ruta: 'Ruta Norte', color_hex: '#0066ff', perfil_id: 2,
          shape: JSON.stringify({ type: 'LineString', coordinates: [[-77.0276, 3.8777], [-77.0250, 3.8790]] }) }
      ];
      this.loading = false;
      // si el mapa ya existe, dibujar
      if (this.map) this.dibujarRutas();
    }, 600);
  }

  private dibujarRutas() {
    if (!this.map) return;
    // eliminar anteriores
    this.routeLayers.forEach(l => { try { this.map.removeLayer(l); } catch {} });
    this.routeLayers = [];

    this.rutas.forEach(r => {
      if (!r.shape) return;
      try {
        const geo = JSON.parse(r.shape);
        const layer = L.geoJSON(geo, {
          style: { color: r.color_hex, weight: 4, opacity: 0.85 }
        }).addTo(this.map);
        this.routeLayers.push(layer);
      } catch (e) {
        console.error('GeoJSON inválido', e);
      }
    });

    if (this.routeLayers.length) {
      const group = L.featureGroup(this.routeLayers);
      this.map.fitBounds(group.getBounds(), { padding: [20, 20] });
      setTimeout(() => this.map.invalidateSize(), 200);
    }
    this.forzarRedraw();
  }

  zoomToRuta(ruta: Ruta) {
    if (!ruta.shape || !this.map) return;
    try {
      const geo = JSON.parse(ruta.shape);
      const layer = L.geoJSON(geo);
      this.map.fitBounds(layer.getBounds(), { padding: [20, 20] });
      this.forzarRedraw();
    } catch (e) {
      console.error(e);
    }
  }

  private forzarRedraw() {
    if (!this.map) return;
    requestAnimationFrame(() => this.map.invalidateSize());
    setTimeout(() => this.map.invalidateSize(), 120);
    setTimeout(() => this.map.invalidateSize(), 400);
  }

  private onWindowResize = () => {
    if (this.map) this.map.invalidateSize();
  };

  ngOnDestroy() {
    window.removeEventListener('resize', this.onWindowResize);
    this.resizeObserver?.disconnect();
    if (this.map) this.map.remove();
  }
}