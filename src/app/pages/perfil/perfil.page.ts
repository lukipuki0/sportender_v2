import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Opcional, si necesitas navegar desde aquí

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false, // Cambia a true si el componente es standalone
  // NO standalone: true
})
export class PerfilPage implements OnInit {

  // Datos de ejemplo - Carga esto desde un servicio en una app real
  nombreApellido: string = 'Emanuel vega';
  nombreUsuario: string = 'MaNuX';
  correo: string = 'emagoat@gmail.com';
  telefono: string = '+56 9 12345678'; // Ejemplo

  constructor(private router: Router) { }

  ngOnInit() {
    // Aquí cargarías los datos reales del usuario desde un servicio
    // this.loadUserProfile();
  }

  loadUserProfile() {
    // Lógica para llamar a un servicio y obtener datos
    // this.userService.getProfile().subscribe(data => {
    //   this.nombreApellido = data.nombreApellido;
    //   this.nombreUsuario = data.username;
    //   this.correo = data.email;
    //   this.telefono = data.phone;
    // });
  }

  editProfilePicture() {
    console.log('Intentando editar foto de perfil...');
    // Aquí iría la lógica para abrir un selector de imagen, etc.
  }

  editField(fieldName: string) {
    console.log('Intentando editar campo:', fieldName);
    // Aquí iría la lógica para:
    // 1. Abrir un modal/alerta para editar el campo.
    // 2. O navegar a una página de edición específica para ese campo.
    // Ejemplo de navegación:
    // this.router.navigate(['/editar-perfil', fieldName]);
  }

}
