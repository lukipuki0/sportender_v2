import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Definición de la interfaz (Idealmente mover a un archivo .ts compartido)
interface EventItem {
  id: number;
  type: string;
  icon: string;
  title: string;
  time: string;
  spots: number;
  price: number;
  distance: number;
  level: string;
  levelKey: string;
}

@Component({
  selector: 'app-mis-eventos',
  templateUrl: './mis-eventos.page.html',
  styleUrls: ['./mis-eventos.page.scss'],
  standalone: false, // Cambia a true si el componente es standalone
  // NO standalone
})
export class MisEventosPage implements OnInit {

  // Datos de ejemplo - Deberían venir de un servicio que filtra por usuario
  misEventosActuales: EventItem[] = [];

  constructor(private router: Router) { }

  ngOnInit() {
    // Simular carga de datos (reemplazar con llamada a servicio)
    this.loadMisEventos();
  }

  loadMisEventos() {
     // Aquí llamarías a tu servicio para obtener los eventos del usuario logueado
     // this.eventService.getMisEventosActuales().subscribe(data => {
     //   this.misEventosActuales = data;
     // });

     // Datos de ejemplo hardcodeados por ahora:
     this.misEventosActuales = [
        { id: 3, type: 'voleibol', icon: 'volleyball-ball', title: 'Amistoso All Play', time: '22:40', spots: 2, price: 2300, distance: 0.9, level: 'principiante', levelKey: 'principiante' }
        // Añade más eventos si el usuario tuviera más
     ];
     console.log('Mis eventos cargados:', this.misEventosActuales);
  }

  goToHistorial() {
    console.log('Navegando a Historial...');
    this.router.navigateByUrl('/historial'); // Asegúrate que esta ruta exista
  }

}