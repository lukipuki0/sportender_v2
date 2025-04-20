import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { format, parseISO } from 'date-fns'; // Necesario para manejar fechas de ion-datetime

@Component({
  selector: 'app-profile-creation',
  templateUrl: './profile-creation.page.html',
  styleUrls: ['./profile-creation.page.scss'],
  standalone: false, // Cambia a true si el componente es standalone
  // NO standalone: true
  // NO imports: [...]
})
export class ProfileCreationPage implements OnInit {

  nombre: string = '';
  apellido: string = '';
  pais: string = '';
  region: string = '';
  comuna: string = '';
  fechaNacimiento: string = ''; // Almacena la fecha como string ISO 8601
  codigoCelular: string = '';
  numeroCelular: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  // Maneja el cambio de fecha desde ion-datetime
  onDateChange(event: any) {
    // El valor viene en formato ISO 8601, lo guardamos así
    this.fechaNacimiento = event.detail.value;
    console.log('Fecha seleccionada (ISO):', this.fechaNacimiento);
    // No necesitas formatear aquí si usas el pipe | date en el HTML
  }


  doContinue() {
    console.log('Intentando continuar con la creación de perfil...');
    console.log('Nombre:', this.nombre);
    console.log('Apellido:', this.apellido);
    console.log('País:', this.pais);
    console.log('Región:', this.region);
    console.log('Comuna:', this.comuna);
    console.log('Fecha Nacimiento (ISO):', this.fechaNacimiento);
    console.log('Código Cel:', this.codigoCelular);
    console.log('Número Cel:', this.numeroCelular);

    // --- LÓGICA PARA GUARDAR PERFIL AQUÍ ---
    // Llamar a un servicio para guardar estos datos asociados al usuario registrado.
    // Por ejemplo:
    // const profileData = { ... };
    // this.profileService.saveProfile(profileData).subscribe(success => {
    //   if (success) {
           // Navegar a la siguiente página (ej. dashboard, home, etc.)
    //   } else {
    //      console.error('Error al guardar el perfil');
    //   }
    // });

    // Placeholder: Navegar a home
    this.router.navigateByUrl('/preferences'); 
  }

  skipStep() {
     console.log('Saltando este paso...');
     // Decide a dónde navegar si se salta este paso
     this.router.navigateByUrl('/home'); // O la ruta que corresponda
  }

}