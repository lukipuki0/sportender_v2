// src/app/pages/menu/menu.page.ts
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
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
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: false,
})
export class MenuPage implements OnInit {
  selectedSegment: string = 'todos';

  allEvents: EventItem[] = [

    { id: 1, type: 'futbol', icon: 'football', title: 'Pichanga Sporting', time: '19:00', spots: 3, price: 2500, distance: 2.1, level: 'avanzado', levelKey: 'avanzado' },
    { id: 2, type: 'futbol', icon: 'football', title: 'Pichanga Jumbo', time: '21:00', spots: 5, price: 2500, distance: 1.9, level: 'medio', levelKey: 'medio' },
    { id: 3, type: 'beisbol', icon: 'baseball', title: 'Amistoso All Play', time: '22:40', spots: 2, price: 2300, distance: 0.9, level: 'principiante', levelKey: 'principiante' },
    { id: 4, type: 'basquetbol', icon: 'basketball', title: 'Reto Basket', time: '20:00', spots: 6, price: 2000, distance: 3.5, level: 'medio', levelKey: 'medio' },
    { id: 5, type: 'futbol', icon: 'football', title: 'Futbolito Amigos', time: '18:30', spots: 1, price: 3000, distance: 1.2, level: 'principiante', levelKey: 'principiante' }
  ];
  filteredEvents: EventItem[] = [];

  constructor(private alertController: AlertController) { }

  ngOnInit() {
    this.filterEvents();
  }

  segmentChanged(event: any) {
    this.filterEvents();
  }

  filterEvents() {
    if (this.selectedSegment === 'todos') {
      this.filteredEvents = [...this.allEvents];
    } else {
      this.filteredEvents = this.allEvents.filter(event => event.type === this.selectedSegment);
    }
  }
  async joinEvent(event: EventItem, clickEvent: MouseEvent) {
    clickEvent.stopPropagation(); // Detiene la propagación del clic (buena práctica)

    console.log('Intentando unirse al evento:', event.title);

    const alert = await this.alertController.create({
      header: '¡Unido!', 
      message: `Te has unido a "${event.title}".`, 
      buttons: ['OK'] 
    });

    await alert.present(); 

    
  }
}