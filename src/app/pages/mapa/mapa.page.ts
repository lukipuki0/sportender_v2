import { Component, AfterViewInit } from '@angular/core'; // Importa AfterViewInit
import { Router } from '@angular/router';

import * as L from 'leaflet';

interface EventItem {
  id: number; type: string; icon: string; title: string; time: string; spots?: number; price: number;
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: false,
})
export class MapaPage implements AfterViewInit {

  private map!: L.Map;

  nearbyEvents: EventItem[] = [
     { id: 1, type: 'futbol', icon: 'football', title: 'Pichanga estadio', time: '19:00', spots: 3, price: 2500, lat: -33.456, lng: -70.648 }, // Coordenadas de ejemplo Santiago
     { id: 3, type: 'tenis', icon: 'tennisball', title: 'Amistoso tenis Colegio Arrayán', time: '12:00', spots: 7, price: 1500, lat: -33.460, lng: -70.652 }
  ];

  constructor(private router: Router) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 50);
  }

  ionViewWillEnter() {
    if (!this.map) {
      this.initMap();
    }
  }

  private initMap(): void {
    if (this.map) return;

    const initialCoords: L.LatLngTuple = [-33.45, -70.66];
    const initialZoom = 13;

    try {
        this.map = L.map('map-container', {
          center: initialCoords,
          zoom: initialZoom
        });

        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          minZoom: 10,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        tiles.addTo(this.map);

        const zoomControls = this.map.zoomControl;
        if (zoomControls) {
          const container = zoomControls.getContainer();
          if (container) {
            container.style.marginTop = '60px';
          }
        }

        this.addMarkers();

    } catch (e) {
        console.error("Error inicializando mapa:", e);
    }
  }

  private addMarkers(): void {
    const eventIcon = L.icon({
    iconUrl: 'assets/icon/chincheta.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    })

    this.nearbyEvents.forEach(event => {
      const marker = L.marker([event.lat, event.lng], { icon: eventIcon });
      marker.addTo(this.map)
        .bindPopup(`<b>${event.title}</b><br>Hora: ${event.time}<br>Cupos: ${event.spots || 'N/A'}`)
        .on('click', () => {
             console.log(`Clic en marcador: ${event.title}`);
        });
    });
  }
}