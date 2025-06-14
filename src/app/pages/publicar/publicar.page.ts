import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { EventService, CreateEventResponse } from '../../services/event.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-publicar',
  templateUrl: './publicar.page.html',
  styleUrls: ['./publicar.page.scss'],
  standalone: false,
})

export class PublicarPage implements OnInit {

  title: string = '';
  ubicacion: string = '';
  deporte: string = '';
  cupos: number | null = null;
  dateTime: string = '';
  descripcion: string = '';

  cuota: number | null = null;
  nivel: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private eventService: EventService
  ) { }

  ngOnInit() {}

  async doPublish() {
    console.log('Intentando publicar evento...');

    if (!this.title || !this.ubicacion || !this.deporte || this.cupos === null || this.cupos <= 0 || !this.dateTime) {
      this.presentAlert('Campos incompletos', 'Por favor complete todos los campos obligatorios (Título, Ubicación, Deporte, Cupos, Fecha y Hora).');
      return;
    }

    let currentPosition;
    try {
      currentPosition = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true
      });
      console.log('Ubicación actual:', currentPosition);
    } catch (error: any) {
      console.error('Error al obtener la ubicación:', error);
      let errorMessage = 'No se pudo obtener la ubicación actual. Por favor, asegúrese de que los servicios de ubicación están activados y los permisos concedidos.';
      if (error.message) {
         errorMessage = `Error de geolocalización: ${error.message}`;
      }
      this.presentAlert('Error de Ubicación', errorMessage);
      return;
    }

    const eventData = {
      title: this.title,
      location: this.ubicacion,
      sportType: this.deporte,
      capacity: this.cupos,
      dateTime: this.dateTime,
      description: this.descripcion || null
    };

    console.log('Datos del evento a enviar:', eventData);

    this.eventService.createEvent(eventData).subscribe({
      next: (response: CreateEventResponse) => {
        console.log('Evento publicado con éxito!', response);

        let successMessage = 'Evento publicado correctamente.';

        if (response.notificationStatus === 'Notification generated (placeholder)' && response.notificationMessage) {
             successMessage += `
Notification: ${response.notificationMessage}`;
             console.log('Mensaje de notificación del backend:', response.notificationMessage);
        }

        this.presentAlert('Éxito', successMessage);
        this.router.navigateByUrl('/menu', { replaceUrl: true });
      },
      error: (errorResponse: HttpErrorResponse) => {
        console.error('Error al publicar evento:', errorResponse);
        let errorMessage = 'Ocurrió un error al publicar el evento.';

         if (errorResponse.error && errorResponse.error.error) {
          errorMessage = errorResponse.error.error;
        } else if (errorResponse.statusText) {
           errorMessage = errorResponse.statusText;
        } else if (errorResponse.message) {
           errorMessage = errorResponse.message;
        } else {
          errorMessage = 'Ocurrió un error desconocido.'; // Simplificar el mensaje de error
        }

        this.presentAlert('Error al Publicar', errorMessage);
      }
    });
  }

   async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

}