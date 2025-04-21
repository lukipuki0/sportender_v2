import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  standalone: false,
})
export class MisEventosPage implements OnInit {

  misEventosActuales: EventItem[] = [];

  constructor(private router: Router) { }

  ngOnInit() {
    this.loadMisEventos();
  }

  loadMisEventos() {
     this.misEventosActuales = [
        { id: 3, type: 'beisbol', icon: 'volleyball-ball', title: 'Amistoso All Play', time: '22:40', spots: 2, price: 2300, distance: 0.9, level: 'principiante', levelKey: 'principiante' }
     ];
     console.log('Mis eventos cargados:', this.misEventosActuales);
  }

  goToHistorial() {
    console.log('Navegando a Historial...');
    this.router.navigateByUrl('/historial');
  }

}