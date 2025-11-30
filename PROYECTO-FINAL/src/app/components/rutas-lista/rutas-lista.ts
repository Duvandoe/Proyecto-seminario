import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import 'leaflet-draw';
import { FormsModule } from '@angular/forms';
import { CallesService } from '../../services/calles/calles';
import { Calle } from '../../../interfaces/Calles';
import { RutasService } from '../../services/rutas/rutas';
import { Ruta as RutaModel } from '../../../interfaces/Rutas';
import { environment } from '../../../environments/environment';

interface Ruta {
  id: number;
  nombre_ruta: string;
  color_hex: string;
  perfil_id: number;
  shape?: string;
}

@Component({
  selector: 'app-rutas-mapa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rutas-lista.html',
  styleUrls: ['./rutas-lista.css']
})
export class RutasMapaComponent implements AfterViewInit, OnDestroy {
  @ViewChild('containerMapa', { static: true }) containerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('mapEl', { static: true }) mapRef!: ElementRef<HTMLDivElement>;

  private map!: L.Map;
  private routeLayers: L.Layer[] = [];
  private calleLayers: L.Layer[] = [];
  private resizeObserver?: ResizeObserver;
  private drawnItems!: L.FeatureGroup;
  private drawControl?: any;
  private lastDrawnLayer?: L.Layer;
  lastGeo?: GeoJSON.Geometry;

  rutas: Ruta[] = [];
  calles: Calle[] = [];
  loading = true;

  newRutaName = '';
  newRutaColor = '#ff0000';
  newPerfilId = '1';
  saving = false;

  constructor(
    private ngZone: NgZone,
    private callesService: CallesService,
    private rutasService: RutasService
  ) {}

  ngAfterViewInit(): void {
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
      if (this.map) {
        try { this.map.remove(); } catch {}
      }

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

      this.drawnItems = new L.FeatureGroup().addTo(this.map);

      const drawOptions = {
        draw: {
          polyline: { shapeOptions: { color: this.newRutaColor, weight: 4 } },
          polygon: false,
          rectangle: false,
          circle: false,
          marker: false,
          circlemarker: false
        },
        edit: { featureGroup: this.drawnItems, remove: true }
      };
      this.drawControl = new (L.Control as any).Draw(drawOptions);
      this.map.addControl(this.drawControl);

      this.map.on('draw:created', (e: any) => {
        const layer = e.layer;
        if (this.lastDrawnLayer) {
          try { this.drawnItems.removeLayer(this.lastDrawnLayer); } catch {}
        }
        this.drawnItems.addLayer(layer);
        this.lastDrawnLayer = layer;
        this.lastGeo = layer.toGeoJSON().geometry;
      });

      this.map.on('draw:deleted', (e: any) => {
        this.lastDrawnLayer = undefined;
        this.lastGeo = undefined;
      });

      this.map.whenReady(() => this.map.invalidateSize());

      this.cargarRutasDesdeServicio();
      this.cargarCalles();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            this.map.setView([pos.coords.latitude, pos.coords.longitude], 14);
            L.marker([pos.coords.latitude, pos.coords.longitude]).addTo(this.map)
              .bindPopup('Tu ubicación actual');
            this.dibujarRutas();
            this.dibujarCalles();
            this.forzarRedraw();
          },
          () => {
            this.map.setView([3.8777, -77.0276], 13);
            this.dibujarRutas();
            this.dibujarCalles();
            this.forzarRedraw();
          },
          { enableHighAccuracy: false, timeout: 5000 }
        );
      } else {
        this.map.setView([3.8777, -77.0276], 13);
        this.dibujarRutas();
        this.dibujarCalles();
        this.forzarRedraw();
      }

      this.resizeObserver = new ResizeObserver(() => {
        if (this.map) this.map.invalidateSize();
      });
      this.resizeObserver.observe(this.mapRef.nativeElement);
      window.addEventListener('resize', this.onWindowResize);
    });
  }

  private cargarRutasDesdeServicio() {
    this.rutasService.getRutas().subscribe({
      next: (res: any) => {
        this.rutas = (res.data || []).map((r: any) => {
          let color = r.color_hex;
          if (!color) {
            const key = `ruta-color-${r.nombre_ruta}`;
            color = localStorage.getItem(key) || '#ff0000';
          }
          return { ...r, color_hex: color };
        });
        this.loading = false;
        if (this.map) this.dibujarRutas();
      },
      error: err => {
        console.error('Error cargando rutas', err);
        this.loading = false;
      }
    });
  }

  private cargarCalles() {
    this.callesService.getCalles().subscribe({
      next: (res) => {
        this.calles = res.data;
        if (this.map) this.dibujarCalles();
      },
      error: (err) => {
        console.error('Error cargando calles', err);
      }
    });
  }

  private parseShape(shape?: string | null): any | null {
    if (!shape) return null;
    try {
      let obj: any = shape;
      if (typeof obj === 'string') {
        obj = JSON.parse(obj);
        if (typeof obj === 'string') obj = JSON.parse(obj);
      }
      if (obj && typeof obj === 'object' && obj.type) return obj;
      return null;
    } catch (e) {
      console.warn('parseShape: error parsing shape', e, 'raw:', shape);
      return null;
    }
  }

  private dibujarRutas() {
    if (!this.map) return;
    this.routeLayers.forEach(l => { try { this.map.removeLayer(l); } catch {} });
    this.routeLayers = [];

    this.rutas.forEach(r => {
      if (!r.shape) return;
      const geoObj = this.parseShape(r.shape);
      if (!geoObj) return;

      let featureToRender: any;
      if (geoObj.type === 'Feature' || geoObj.type === 'FeatureCollection') {
        featureToRender = geoObj;
      } else if (geoObj.type && geoObj.coordinates) {
        featureToRender = { type: 'Feature', properties: {}, geometry: geoObj };
      } else return;

      const color = this.colorOrDefault(r.color_hex || '#ff0000');
      const layer = L.geoJSON(featureToRender, { style: { color, weight: 4, opacity: 0.85 } }).addTo(this.map);
      this.routeLayers.push(layer);
    });
    this.forzarRedraw();
  }

  private dibujarCalles() {
    if (!this.map) return;
    this.calleLayers.forEach(l => { try { this.map.removeLayer(l); } catch {} });
    this.calleLayers = [];

    this.calles.forEach(c => {
      if (!c.shape) return;
      try {
        const geo = JSON.parse(c.shape);
        const layer = L.geoJSON(geo, { style: { color: '#666', weight: 2, opacity: 0.6, dashArray: '4 6' } }).addTo(this.map);
        this.calleLayers.push(layer);
      } catch (e) {
        console.error('GeoJSON inválido en calle', c.id, e);
      }
    });
  }

  private colorOrDefault(c?: string): string {
    return (c && /^#[0-9A-Fa-f]{6}$/.test(c)) ? c : '#ff0000';
  }

  saveDrawnRuta() {
    if (!this.lastGeo) return;

    const payload: any = {
      nombre_ruta: this.newRutaName || 'Sin nombre',
      perfil_id: environment.perfilUrl,
      color_hex: this.colorOrDefault(this.newRutaColor),
      shape: JSON.stringify(this.lastGeo)
    };

    this.saving = true;
    this.rutasService.createRuta(payload).subscribe({
      next: (saved: any) => {
        this.saving = false;
        const added = saved || {};
        const key = `ruta-color-${added.nombre_ruta || payload.nombre_ruta}`;
        localStorage.setItem(key, payload.color_hex);

        this.rutas.push({
          id: added.id || Date.now(),
          nombre_ruta: added.nombre_ruta || payload.nombre_ruta,
          color_hex: payload.color_hex,
          perfil_id: added.perfil_id || payload.perfil_id,
          shape: typeof added.shape === 'string' ? added.shape : JSON.stringify(added.shape || payload.shape)
        } as Ruta);

        this.dibujarRutas();
        this.clearDraw();
      },
      error: (err) => {
        this.saving = false;
        console.error('Error guardando ruta:', err);
      }
    });
  }

  clearDraw() {
    if (this.lastDrawnLayer && this.drawnItems) {
      try { this.drawnItems.removeLayer(this.lastDrawnLayer); } catch {}
    }
    this.lastDrawnLayer = undefined;
    this.lastGeo = undefined;
    this.newRutaName = '';
  }

  cancelDraw() { this.clearDraw(); }

 // --- variables adicionales ---
private highlightedLayer?: L.Layer;


// Resaltar solo una ruta
resaltarRuta(ruta: Ruta) {
  if (!ruta.shape || !this.map) return;

  // borrar resaltado previo
  if (this.highlightedLayer) {
    try { this.map.removeLayer(this.highlightedLayer); } catch {}
    this.highlightedLayer = undefined;
  }

  const geoObj = this.parseShape(ruta.shape);
  if (!geoObj) return;

  // usar color de ruta (del backend o localStorage)
  const color = this.colorOrDefault(ruta.color_hex || '#ff0000');

  const layer = L.geoJSON(geoObj, { style: { color, weight: 5, opacity: 0.9 } }).addTo(this.map);
  this.highlightedLayer = layer;

  const bounds = layer.getBounds();
  if (bounds.isValid()) this.map.fitBounds(bounds, { padding: [20, 20] });
}

// Resaltar solo una calle
resaltarCalle(calle: Calle) {
  if (!calle.shape || !this.map) return;

  if (this.highlightedLayer) {
    try { this.map.removeLayer(this.highlightedLayer); } catch {}
    this.highlightedLayer = undefined;
  }

  try {
    const geo = JSON.parse(calle.shape);
    const layer = L.geoJSON(geo, { style: { color: '#ff9900', weight: 5, opacity: 0.9 } }).addTo(this.map);
    this.highlightedLayer = layer;

    const bounds = layer.getBounds();
    if (bounds.isValid()) this.map.fitBounds(bounds, { padding: [20, 20] });
  } catch (e) {
    console.error('Error resaltando calle', e);
  }
}


  private forzarRedraw() {
    if (!this.map) return;
    requestAnimationFrame(() => this.map.invalidateSize());
    setTimeout(() => this.map.invalidateSize(), 120);
    setTimeout(() => this.map.invalidateSize(), 400);
  }

  private onWindowResize = () => { if (this.map) this.map.invalidateSize(); };

  ngOnDestroy() {
    window.removeEventListener('resize', this.onWindowResize);
    this.resizeObserver?.disconnect();
    if (this.map) this.map.remove();
  }

  // --- Método para logout ---
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  limpiarMapa() {
    this.routeLayers.forEach(l => { try { this.map.removeLayer(l); } catch {} });
    this.calleLayers.forEach(l => { try { this.map.removeLayer(l); } catch {} });
    this.routeLayers = [];
    this.calleLayers = [];
    this.clearDraw();
  }
}
