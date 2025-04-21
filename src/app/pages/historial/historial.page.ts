import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface EventItem {
  id: number;
  type: string;
  icon: string;
  title: string;
  date: string;
  location?: string;
  time: string;
  spots?: number;
  price: number;
  distance?: number;
  level: string;
  levelKey: string;
}

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: false,
})
export class HistorialPage implements OnInit {

  allItems: EventItem[] = [];
  displayedEvents: EventItem[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private router: Router) { }

  ngOnInit() {
    this.loadHistorialData();
  }

  loadHistorialData() {
    this.allItems = [
       { id: 6, type: 'futbol', icon: 'football', title: 'Final Campeonato', date: '2025-04-15', location: 'Estadio Nacional', time: '17:00', price: 5000, level: 'avanzado', levelKey: 'avanzado' },
       { id: 7, type: 'tenis', icon: 'tennisball', title: 'Clase Tenis A', date: '2025-04-14', location: 'Club Providencia', time: '10:00', price: 10000, level: 'principiante', levelKey: 'principiante' },
       { id: 8, type: 'basquetbol', icon: 'basketball', title: '3x3 Urbano', date: '2025-04-12', location: 'Parque Araucano', time: '16:00', price: 1000, level: 'medio', levelKey: 'medio' },
       { id: 9, type: 'futbol', icon: 'football', title: 'Pichanga Nocturna', date: '2025-04-10', location: 'Espacio Don Oscar', time: '21:30', price: 2800, level: 'medio', levelKey: 'medio' },
       { id: 10, type: 'padel', icon: 'tennisball', /*icono?*/ title: 'Padel Amigos Maipu', date: '2025-04-09', location: 'Club Padel Maipu', time: '19:00', price: 4000, level: 'principiante', levelKey: 'principiante' },
       { id: 11, type: 'futbol', icon: 'football', title: 'Entrenamiento Libre', date: '2025-04-08', location: 'Municipal La Florida', time: '18:00', price: 0, level: 'todos', levelKey: 'medio' }, // Ejemplo página 2
    ];

    this.totalPages = Math.ceil(this.allItems.length / this.itemsPerPage);
    this.updateDisplayedEvents();
    console.log('Historial cargado, total páginas:', this.totalPages);
  }

  updateDisplayedEvents() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedEvents = this.allItems.slice(startIndex, endIndex);
     console.log('Mostrando página', this.currentPage, this.displayedEvents);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedEvents();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedEvents();
    }
  }
}