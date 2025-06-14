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

    if (!this.username || !this.email || !this.password || !this.rut) {
       this.presentAlert('Error', 'Por favor complete todos los campos obligatorios.');
       return;
     }

    if (this.password !== this.confirmPassword) {
      this.presentAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    // Frontend validation
    if (!this.validateRut(this.rut)) {
      this.presentAlert('Error', 'El formato del RUT no es válido.');
      return;
    }

    if (!this.validatePassword(this.password)) {
      this.presentAlert('Error', 'La contraseña debe tener al menos 8 caracteres, incluyendo un número.');
      return;
    }

    console.log('Intentando registrar...');

    // Datos a enviar al backend
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
      rut: this.rut // Include RUT as per the requirement for validation
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

  // --- Frontend Validation Helpers ---
  validateRut(rut: string): boolean {
    if (!rut) {
      return false;
    }

    // Remove dots and hyphens
    rut = rut.replace(/\./g, '').replace('-', '');

    // Separate body and verifier digit
    const body = rut.slice(0, -1);
    const dv = rut.slice(-1).toUpperCase();

    // Check if body is a number
    if (!/^\d+$/.test(body)) {
      return false;
    }

    // Calculate expected verifier digit
    let sum = 0;
    let multiplier = 2;
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i], 10) * multiplier;
      multiplier = multiplier < 7 ? multiplier + 1 : 2;
    }

    const remainder = sum % 11;
    const expectedDv = 11 - remainder === 11 ? '0' : (11 - remainder === 10 ? 'K' : (11 - remainder).toString());

    return expectedDv === dv;
  }

  validatePassword(password: string | undefined): boolean {
    if (!password) {
      return false;
    }
    // Minimum 8 characters, at least one number
    const passwordRegex = /^(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  }

}
