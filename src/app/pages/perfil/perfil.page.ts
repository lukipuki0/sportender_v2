import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {

  nombreApellido: string = 'Emanuel vega';
  nombreUsuario: string = 'MaNuX';
  correo: string = 'emagoat@gmail.com';
  telefono: string = '+56 9 12345678';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  loadUserProfile() {}

  editProfilePicture() {
    console.log('Intentando editar foto de perfil...');
  }

  editField(fieldName: string) {
    console.log('Intentando editar campo:', fieldName);
  }

}
