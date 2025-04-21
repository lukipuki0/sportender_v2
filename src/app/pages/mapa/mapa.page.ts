import { Component, AfterViewInit } from '@angular/core'; // Importa AfterViewInit
import { Router } from '@angular/router';

// Importa Leaflet
import * as L from 'leaflet';

// Interfaz (mover a archivo compartido)
interface EventItem {
  id: number; type: string; icon: string; title: string; time: string; spots?: number; price: number;
  // Añadir coordenadas para el mapa
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: false, // Cambia a true si el componente es standalone
})
export class MapaPage implements AfterViewInit { // Implementa AfterViewInit

  private map!: L.Map; // Variable para guardar la instancia del mapa

  // Eventos cercanos (ejemplo, deberían cargarse dinámicamente)
  nearbyEvents: EventItem[] = [
     { id: 1, type: 'futbol', icon: 'football', title: 'Pichanga estadio', time: '19:00', spots: 3, price: 2500, lat: -33.456, lng: -70.648 }, // Coordenadas de ejemplo Santiago
     { id: 3, type: 'voleibol', icon: 'volleyball-ball', title: 'Amistoso voleibol colegio arrayan', time: '12:00', spots: 7, price: 1500, lat: -33.460, lng: -70.652 }
  ];

  constructor(private router: Router) { }

  // Usamos AfterViewInit para asegurar que el contenedor del mapa exista en el DOM
  ngAfterViewInit(): void {
    this.initMap();
  }

  ionViewWillEnter() {
    // A veces el mapa necesita reinicializarse si la vista se cachea
    if (!this.map) {
      this.initMap();
    }
  }

  initMap(): void {
     // Evitar reinicializar si ya existe
    if (this.map) return;

    // Coordenadas iniciales (Ej: Santiago centro)
    const initialCoords: L.LatLngTuple = [-33.45, -70.66];
    const initialZoom = 13;

    try {
        // Crear el mapa en el div 'map-container'
        this.map = L.map('map-container', {
          center: initialCoords,
          zoom: initialZoom
        });

        // Añadir capa de tiles (mapa base - OpenStreetMap gratuito)
        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          minZoom: 10,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        tiles.addTo(this.map);

        // Añadir marcadores para los eventos cercanos
        this.addMarkers();

    } catch (e) {
        console.error("Error inicializando mapa:", e);
        // Considera mostrar un mensaje al usuario si el mapa falla
    }
  }

  addMarkers(): void {
     // Icono personalizado (opcional)
    // const eventIcon = L.icon({
    //   iconUrl: 'assets/icon/marker-icon.png', // Tu icono personalizado
    //   iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    // });

    this.nearbyEvents.forEach(event => {
      const marker = L.marker([event.lat, event.lng]/*, { icon: eventIcon }*/);
      marker.addTo(this.map)
        .bindPopup(`<b>${event.title}</b><br>Hora: ${event.time}<br>Cupos: ${event.spots || 'N/A'}`) // Popup básico al hacer clic
        .on('click', () => {
             console.log(`Clic en marcador: ${event.title}`);
            // Aquí podrías hacer algo más, como centrar el mapa o actualizar el panel de info
        });
    });
  }

  // Limpiar mapa al salir de la vista para evitar problemas (opcional pero recomendado)
  ionViewWillLeave() {
    // if (this.map) {
    //   this.map.remove();
    //   this.map = null; // Forzar reinicialización la próxima vez
    // }
  }
}