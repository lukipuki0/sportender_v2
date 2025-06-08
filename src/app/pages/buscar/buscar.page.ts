import { Component, OnInit } from '@angular/core';
import { EventService, Event } from '../../services/event.service';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
  standalone: false, // Cambia a true si estás usando Angular Standalone Components
})
export class BuscarPage implements OnInit {
  events: Event[] = [];
  loading = false;

  // Puedes cambiar estos valores por los obtenidos con GPS
  lat = 40.4168;
  lng = -3.7038;
  radius = 5; // km

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.buscarEventos();
  }

  buscarEventos() {
    this.loading = true;
    this.eventService.searchEvents(this.lat, this.lng, this.radius).subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al buscar eventos', err);
        this.loading = false;
      }
    });
  }
}
