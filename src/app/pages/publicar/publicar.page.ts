import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publicar',
  templateUrl: './publicar.page.html',
  styleUrls: ['./publicar.page.scss'],
  standalone: false,
})

export class PublicarPage implements OnInit {

  ubicacion: string = '';
  deporte: string = '';
  cupos: number | null = null;
  cuota: number | null = null;
  nivel: string = '';
  descripcion: string = '';

  constructor(private router: Router) { }

  ngOnInit() {}

  doPublish() {
    console.log('Intentando publicar evento...');
    if (!this.ubicacion || !this.deporte || !this.cupos || !this.nivel) {
      console.warn('Faltan campos obligatorios');
      return;
    }

    const eventoData = {
      ubicacion: this.ubicacion,
      deporte: this.deporte,
      cupos: this.cupos,
      cuota: this.cuota,
      nivel: this.nivel,
      descripcion: this.descripcion
    };

    console.log('Datos del evento:', eventoData);
    
    alert('Evento publicado (simulación). Redirigiendo al menú.');
    this.router.navigateByUrl('/menu');
  }

}