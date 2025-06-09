import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'; // Importa AlertController
import { AuthService } from '../../services/auth.service'; // Importa AuthService
import { HttpErrorResponse } from '@angular/common/http'; // Importar HttpErrorResponse

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  email: string = ''; // Cambiado de 'usuario' a 'email' para coincidir con el backend
  password: string = ''; // Cambiado de 'contrasena' a 'password'

  constructor(
    private router: Router,
    private alertController: AlertController, // Inyecta AlertController
    private authService: AuthService // Inyecta AuthService
  ) { }

  ngOnInit() {
    // Opcional: Redirigir si ya está autenticado
    // if (this.authService.isAuthenticated()) {
    //   this.router.navigateByUrl('/menu', { replaceUrl: true });
    // }
  }

  async doLogin() { // Marcar como async para usar await con alertas
    console.log('Intentando iniciar sesión...');
    console.log('Email:', this.email);
    console.log('Contraseña:', this.password);

    // Validar campos obligatorios en el frontend
    if (!this.email || !this.password) {
       this.presentAlert('Error', 'Por favor ingrese email y contraseña.');
       return;
    }

    // Datos a enviar al backend
    const credentials = {
      email: this.email,
      password: this.password
    };

    // Llamar al servicio de autenticación para iniciar sesión
    this.authService.login(credentials).subscribe({
      next: (response) => {
        // Inicio de sesión exitoso
        console.log('Inicio de sesión exitoso!', response);
        // El token ya se guardó en el AuthService, redirigir al menú principal
        this.router.navigateByUrl('/menu', { replaceUrl: true }); // replaceUrl: para que el usuario no pueda volver a login con el botón back
      },
      error: (errorResponse: HttpErrorResponse) => {
        // Manejar errores del backend (ej. credenciales inválidas)
        console.error('Error en el inicio de sesión:', errorResponse);
        let errorMessage = 'Ocurrió un error durante el inicio de sesión.';

        if (errorResponse.error && errorResponse.error.error) {
           // Si el backend envía un mensaje de error específico
          errorMessage = errorResponse.error.error;
        } else if (errorResponse.statusText) {
           errorMessage = errorResponse.statusText;
        } else if (errorResponse.message) {
           errorMessage = errorResponse.message;
        }
        
        this.presentAlert('Error de Inicio de Sesión', errorMessage);
      }
    });
  }

  goToRegister() {
    console.log('Navegando a la página de registro...');
    this.router.navigateByUrl('/register');
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
