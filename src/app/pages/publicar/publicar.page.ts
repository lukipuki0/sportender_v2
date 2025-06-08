import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'; // Importa AlertController
import { EventService } from '../../services/event.service'; // Importa EventService
import { HttpErrorResponse } from '@angular/common/http'; // Importar HttpErrorResponse
import { Geolocation } from '@capacitor/geolocation'; // Importar Geolocation

@Component({
  selector: 'app-publicar',
  templateUrl: './publicar.page.html',
  styleUrls: ['./publicar.page.scss'],
  standalone: false,
})

export class PublicarPage implements OnInit {

  // Campos del formulario (ajustados para coincidir o mapear con el backend)
  title: string = ''; // Nuevo campo para el título del evento (obligatorio en backend)
  ubicacion: string = ''; // Mapea a 'location.address' en backend (obligatorio)
  deporte: string = ''; // Mapea a 'activityType' en backend (obligatorio)
  cupos: number | null = null; // Mapea a 'capacity' en backend (obligatorio)
  dateTime: string = ''; // Mapea a 'startTime' en backend (obligatorio)
  descripcion: string = ''; // Mapea a 'description' en backend (opcional)

  // Campos que no están en el modelo backend (puedes eliminarlos si no los usas)
  cuota: number | null = null;
  nivel: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController, // Inyecta AlertController
    private eventService: EventService // Inyecta EventService
  ) { }

  ngOnInit() {}

  async doPublish() { // Marcar como async para usar await con alertas y Geolocation
    console.log('Intentando publicar evento...');

    // Validar campos obligatorios
    if (!this.title || !this.ubicacion || !this.deporte || this.cupos === null || this.cupos <= 0 || !this.dateTime) {
      this.presentAlert('Campos incompletos', 'Por favor complete todos los campos obligatorios (Título, Ubicación, Deporte, Cupos, Fecha y Hora).');
      return;
    }

    let currentPosition;
    try {
      // Obtener la ubicación actual del usuario
      currentPosition = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true
      });
      console.log('Ubicación actual:', currentPosition);
    } catch (error: any) {
      console.error('Error al obtener la ubicación:', error);
      // Manejar el error de geolocalización
      let errorMessage = 'No se pudo obtener la ubicación actual. Por favor, asegúrese de que los servicios de ubicación están activados y los permisos concedidos.';
      if (error.message) {
         errorMessage = `Error de geolocalización: ${error.message}`;
      }
      this.presentAlert('Error de Ubicación', errorMessage);
      return; // Detener el proceso si no se obtiene la ubicación
    }

    // Preparar los datos para enviar al backend, mapeando los nombres
    const eventData = {
      title: this.title,
      location: { // Crear el objeto location con la dirección y las coordenadas
        address: this.ubicacion,
        lat: currentPosition.coords.latitude,
        lng: currentPosition.coords.longitude,
      },
      activityType: this.deporte, // Mapeado a activityType
      capacity: this.cupos,
      startTime: this.dateTime, // Mapeado a startTime
      description: this.descripcion || null // Enviar null si está vacío
      // creatorId NO se envía aquí, el backend lo obtiene del token JWT
    };

    console.log('Datos del evento a enviar:', eventData);

    // Llamar al servicio de eventos para crear el evento
    this.eventService.createEvent(eventData).subscribe({
      next: (response) => {
        // Creación de evento exitosa
        console.log('Evento publicado con éxito!', response);
        this.presentAlert('Éxito', 'Evento publicado correctamente.');
        this.router.navigateByUrl('/menu'); // Redirigir al menú principal o a la página del evento
      },
      error: (errorResponse: HttpErrorResponse) => {
        // Manejar errores del backend
        console.error('Error al publicar evento:', errorResponse);
        let errorMessage = 'Ocurrió un error al publicar el evento.';

         if (errorResponse.error && errorResponse.error.error) {
           // Si el backend envía un mensaje de error específico
          errorMessage = errorResponse.error.error;
        } else if (errorResponse.statusText) {
           errorMessage = errorResponse.statusText;
        } else if (errorResponse.message) {
           errorMessage = errorResponse.message;
        }

        this.presentAlert('Error al Publicar', errorMessage);
      }
    });
  }

   // --- Helper para mostrar alertas ---
   async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

}