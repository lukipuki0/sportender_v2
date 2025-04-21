import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-creation',
  templateUrl: './profile-creation.page.html',
  styleUrls: ['./profile-creation.page.scss'],
  standalone: false,
})

export class ProfileCreationPage implements OnInit {

  nombre: string = '';
  apellido: string = '';
  pais: string = '';
  region: string = '';
  comuna: string = '';
  fechaNacimiento: string = '';
  codigoCelular: string = '';
  numeroCelular: string = '';

  constructor(private router: Router) { }

  ngOnInit() {}

  onDateChange(event: any)
  {
    this.fechaNacimiento = event.detail.value;
    console.log('Fecha seleccionada (ISO):', this.fechaNacimiento);
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

    this.router.navigateByUrl('/preferences'); 
  }

  skipStep() {
     console.log('Saltando este paso...');
     this.router.navigateByUrl('/home');
  }
}