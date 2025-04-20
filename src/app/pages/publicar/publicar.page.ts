import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router para navegar

@Component({
  selector: 'app-publicar',
  templateUrl: './publicar.page.html',
  styleUrls: ['./publicar.page.scss'],
  standalone: false, // Cambia a true si el componente es standalone
  // NO standalone: true
})
export class PublicarPage implements OnInit {

  // Variables para el formulario
  ubicacion: string = '';
  deporte: string = '';
  cupos: number | null = null; // Usar null para números opcionales
  cuota: number | null = null;
  nivel: string = '';
  descripcion: string = '';

  constructor(private router: Router) { } // Inyectar Router

  ngOnInit() {
  }

  doPublish() {
    console.log('Intentando publicar evento...');
    // Validaciones básicas (puedes añadir más)
    if (!this.ubicacion || !this.deporte || !this.cupos || !this.nivel) {
      console.warn('Faltan campos obligatorios');
      // Aquí podrías mostrar una alerta al usuario
      return;
    }

    const eventoData = {
      ubicacion: this.ubicacion,
      deporte: this.deporte,
      cupos: this.cupos,
      cuota: this.cuota, // Puede ser null si no se ingresa
      nivel: this.nivel,
      descripcion: this.descripcion
    };

    console.log('Datos del evento:', eventoData);

    // --- LÓGICA PARA GUARDAR EVENTO AQUÍ ---
    // Llamarías a un servicio para enviar 'eventoData' al backend.
    // Por ejemplo:
    // this.eventService.createEvent(eventoData).subscribe(
    //   (nuevoEvento) => {
    //     console.log('Evento publicado con éxito:', nuevoEvento);
           // Navegar a alguna parte, por ejemplo, a la página del evento creado o a Mis Eventos
    //     this.router.navigateByUrl('/mis-eventos'); // O a '/menu'
    //   },
    //   (error) => {
    //     console.error('Error al publicar evento:', error);
           // Mostrar alerta de error
    //   }
    // );

    // Placeholder: Navegar de vuelta al menú después de 'publicar'
    alert('Evento publicado (simulación). Redirigiendo al menú.'); // Alerta temporal
    this.router.navigateByUrl('/menu');
  }

}