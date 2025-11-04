import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import 'leaflet-draw';
import { FormsModule } from '@angular/forms';
import { CallesService } from '../../services/calles/calles';
import { Calle } from '../../../interfaces/Calles';
import { RutasService } from '../../services/rutas/rutas'; // <-- añadir
import { Ruta as RutaModel } from '../../../interfaces/Rutas'; // <-- añadir
import { environment } from '../../../environments/environments';

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

  // UI / form para nueva ruta
  newRutaName = '';
  newRutaColor = '#ff0000';
  newPerfilId = '1';
  saving = false;

  constructor(
    private ngZone: NgZone,
    private callesService: CallesService,
    private rutasService: RutasService // <-- inyectar servicio de rutas
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

      // FeatureGroup para elementos dibujados por el usuario
      this.drawnItems = new L.FeatureGroup().addTo(this.map);

      // Control de dibujo (leaflet-draw)
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

      // eventos draw
      this.map.on('draw:created', (e: any) => {
        const layer = e.layer;
        // eliminar dibujo previo si existe (mantener solo 1 trazado para guardar)
        if (this.lastDrawnLayer) {
          try { this.drawnItems.removeLayer(this.lastDrawnLayer); } catch {}
        }
        this.drawnItems.addLayer(layer);
        this.lastDrawnLayer = layer;
        const geo = layer.toGeoJSON().geometry;
        this.lastGeo = geo;
        // actualizar color en el estilo si el usuario lo cambia luego
        // mostrar form para guardar (se hace visible por template si lastGeo existe)
      });

      this.map.on('draw:deleted', (e: any) => {
        // si borraron el trazado, limpiar
        this.lastDrawnLayer = undefined;
        this.lastGeo = undefined;
      });

      this.map.whenReady(() => this.map.invalidateSize());

      this.cargarRutasDesdeServicio();
      this.cargarCalles();

      // geolocalización y cargar capas existentes
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

  // --- cargar rutas reales ---
 private cargarRutasDesdeServicio() {
  this.rutasService.getRutas().subscribe({
    next: (res: any) => {
      this.rutas = (res.data || []).map((r: any) => {
        let color = r.color_hex;

        // 🔹 Si backend no devuelve color, buscar en localStorage
        if (!color) {
          const key = `ruta-color-${r.nombre_ruta}`;
          color = localStorage.getItem(key) || '#ff0000';
        }

        return {
          ...r,
          color_hex: color
        };
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

  // --- NUEVO helper para normalizar/parsear shape devuelto por backend ---
  private parseShape(shape?: string | null): any | null {
    if (!shape) return null;
    try {
      // Intentar parsear varias veces si está doble-encoded
      let obj: any = shape;
      if (typeof obj === 'string') {
        obj = JSON.parse(obj);
        // si al parsear obtenemos otra string (doble encoding), parsear otra vez
        if (typeof obj === 'string') {
          obj = JSON.parse(obj);
        }
      }
      // Si viene como Feature con geometry, devolver la Feature completa
      if (obj && typeof obj === 'object' && obj.type) {
        return obj;
      }
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
      try {
        const geoObj = this.parseShape(r.shape);
        if (!geoObj) {
          console.warn('dibujarRutas: shape no parseable para ruta', r.id, r.shape);
          return;
        }

        // Asegurar Feature: si viene una Geometry (LineString, MultiLineString, etc.)
        // envolver en Feature para evitar errores en algunas versiones de Leaflet
        let featureToRender: any;
        if (geoObj.type === 'Feature' || geoObj.type === 'FeatureCollection') {
          featureToRender = geoObj;
        } else if (geoObj.type && geoObj.coordinates) {
          featureToRender = { type: 'Feature', properties: {}, geometry: geoObj };
        } else {
          console.warn('dibujarRutas: GeoJSON con formato inesperado', r.id, geoObj);
          return;
        }

        const color = this.colorOrDefault(r.color_hex || '#ff0000');
        const layer = L.geoJSON(featureToRender, {
          style: { color, weight: 4, opacity: 0.85 }
        }).addTo(this.map);

        this.routeLayers.push(layer);
      } catch (e) {
        console.error('GeoJSON inválido en ruta', r.id, e, 'raw shape:', r.shape);
      }
    });

    const allLayers = this.routeLayers.concat(this.calleLayers);
    if (allLayers.length) {
      const group = L.featureGroup(allLayers);
      try {
        this.map.fitBounds(group.getBounds(), { padding: [20, 20] });
      } catch (e) {
        console.warn('fitBounds falló', e);
      }
      setTimeout(() => this.map.invalidateSize(), 200);
    }
    this.forzarRedraw();
  }

  zoomToRuta(ruta: Ruta) {
    if (!ruta.shape || !this.map) return;
    try {
      const geoObj = this.parseShape(ruta.shape);
      if (!geoObj) {
        console.warn('zoomToRuta: shape no parseable', ruta.id, ruta.shape);
        return;
      }

      let featureToZoom: any;
      if (geoObj.type === 'Feature' || geoObj.type === 'FeatureCollection') {
        featureToZoom = geoObj;
      } else if (geoObj.type && geoObj.coordinates) {
        featureToZoom = { type: 'Feature', properties: {}, geometry: geoObj };
      } else {
        console.warn('zoomToRuta: formato GeoJSON inesperado', ruta.id, geoObj);
        return;
      }

      const layer = L.geoJSON(featureToZoom);
      const bounds = (layer as any).getBounds();
      if (!bounds || !bounds.isValid()) {
        console.warn('zoomToRuta: bounds inválidos para ruta', ruta.id);
        return;
      }
      this.map.fitBounds(bounds, { padding: [20, 20] });
      this.forzarRedraw();
    } catch (e) {
      console.error('Error haciendo zoom a ruta', e, 'raw shape:', ruta.shape);
    }
  }

  private dibujarCalles() {
    if (!this.map) return;
    this.calleLayers.forEach(l => { try { this.map.removeLayer(l); } catch {} });
    this.calleLayers = [];

    this.calles.forEach(c => {
      if (!c.shape) return;
      try {
        const geo = JSON.parse(c.shape);
        const layer = L.geoJSON(geo, {
          style: { color: '#666', weight: 2, opacity: 0.6, dashArray: '4 6' }
        }).addTo(this.map);
        this.calleLayers.push(layer);
      } catch (e) {
        console.error('GeoJSON inválido en calle', c.id, e);
      }
    });
  }

  // valida color en formato #rrggbb, devuelve fallback si es inválido
  private colorOrDefault(c?: string): string {
    return (c && /^#[0-9A-Fa-f]{6}$/.test(c)) ? c : '#ff0000';
  }

  // guardar la ruta trazada por el usuario
  saveDrawnRuta() {
  if (!this.lastGeo) return;

  const payload: any = {
    nombre_ruta: this.newRutaName || 'Sin nombre',
    perfil_id: environment.perfilUrl,
    color_hex: this.colorOrDefault(this.newRutaColor),
    shape: JSON.stringify(this.lastGeo)
  };

  console.log('Payload a enviar:', payload);

  this.saving = true;
  this.rutasService.createRuta(payload).subscribe({
    next: (saved: any) => {
      this.saving = false;
      const added = saved || {};

      // 🔹 Guardar color en localStorage (clave: nombre_ruta o id)
      const key = `ruta-color-${added.nombre_ruta || payload.nombre_ruta}`;
      localStorage.setItem(key, payload.color_hex);

      this.rutas.push({
        id: added.id || Date.now(),
        nombre_ruta: added.nombre_ruta || payload.nombre_ruta,
        color_hex: payload.color_hex,
        perfil_id: added.perfil_id || payload.perfil_id,
        shape: typeof added.shape === 'string'
          ? added.shape
          : JSON.stringify(added.shape || payload.shape)
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

  cancelDraw() {
    this.clearDraw();
  }


  zoomToCalle(calle: Calle) {
    if (!calle.shape || !this.map) return;
    try {
      const geo = JSON.parse(calle.shape);
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