import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'; // Importa AlertController
import { AuthService } from '../../services/auth.service'; // Importa AuthService
import { HttpErrorResponse } from '@angular/common/http'; // Importar HttpErrorResponse

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false, 
})
export class RegisterPage implements OnInit {

  // Variables para los campos del formulario
  email: string = '';
  username: string = '';
  password?: string = ''; 
  confirmPassword?: string = '';
  rut: string = ''; // Este campo no se envía al backend en la lógica actual
  termsAccepted: boolean = false;

  constructor(
    private router: Router,
    private alertController: AlertController, // Inyecta AlertController
    private authService: AuthService // Inyecta AuthService
  ) { }

  ngOnInit() {
  }

  async doRegister() { // Marcar como async para usar await con alertas
    if (!this.termsAccepted) {
      this.presentAlert('Error', 'Debe aceptar los términos y condiciones.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.presentAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    // Validar que los campos requeridos por el backend existan (además de los del frontend)
     if (!this.username || !this.email || !this.password) {
       this.presentAlert('Error', 'Por favor complete todos los campos obligatorios (Usuario, Email, Contraseña).');
       return;
     }

    console.log('Intentando registrar...');

    // Datos a enviar al backend
    const userData = { 
      username: this.username,
      email: this.email,
      password: this.password 
      // No enviamos confirmPassword ni rut al backend, si no están en el modelo
    };

    // Llamar al servicio de autenticación para registrar al usuario
    this.authService.register(userData).subscribe({
      next: (response) => {
        // Registro exitoso
        console.log('Registro exitoso!', response);
        // Redirigir al usuario a la página de login
        this.presentAlert('Éxito', 'Usuario registrado correctamente. Ahora inicie sesión.');
        this.router.navigateByUrl('/login'); 
      },
      error: (errorResponse: HttpErrorResponse) => {
        // Manejar errores del backend
        console.error('Error en el registro:', errorResponse);
        let errorMessage = 'Ocurrió un error durante el registro.';

        if (errorResponse.error && errorResponse.error.error) {
           // Si el backend envía un mensaje de error específico
          errorMessage = errorResponse.error.error;
        } else if (errorResponse.statusText) {
           errorMessage = errorResponse.statusText;
        } else if (errorResponse.message) {
           errorMessage = errorResponse.message;
        }

        this.presentAlert('Error de Registro', errorMessage);
      }
    });
  }

  goToLogin() {
    console.log('Navegando a la página de login...');
    this.router.navigateByUrl('/login');
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