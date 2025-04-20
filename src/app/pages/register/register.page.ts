import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Importa AlertController para mostrar mensajes si lo necesitas
// import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false, // Cambia a true si el componente es standalone
  // NO standalone: true
  // NO imports: [...]
})
export class RegisterPage implements OnInit {

  // Variables para los campos del formulario
  email: string = '';
  username: string = '';
  password?: string = ''; // Usa ? si puede ser undefined inicialmente
  confirmPassword?: string = '';
  rut: string = '';
  termsAccepted: boolean = false;

  constructor(
    private router: Router,
    // private alertController: AlertController // Descomenta si usas alertas
  ) { }

  ngOnInit() {
  }

  doRegister() {
    if (!this.termsAccepted) {
      console.warn('Debe aceptar los términos y condiciones.');
      // Podrías mostrar una alerta aquí
      // this.presentAlert('Error', 'Debe aceptar los términos y condiciones.');
      
      return;
    }

    if (this.password !== this.confirmPassword) {
      console.warn('Las contraseñas no coinciden.');
      // Podrías mostrar una alerta aquí
      // this.presentAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    console.log('Intentando registrar...');
    console.log('Email:', this.email);
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    console.log('Confirm Password:', this.confirmPassword);
    console.log('RUT:', this.rut);
    console.log('Términos aceptados:', this.termsAccepted);
    this.router.navigateByUrl('/profile-creation');
    // --- LÓGICA DE REGISTRO AQUÍ ---
    // Aquí llamarías a tu servicio de backend para crear la nueva cuenta.
    // Por ejemplo:
    // const userData = { email: this.email, username: this.username, password: this.password, rut: this.rut };
    // this.authService.register(userData).subscribe(success => {
    //   if (success) {
    //     console.log('Registro exitoso!');
    //     this.router.navigateByUrl('/login'); // Navegar a login después del registro
    //   } else {
    //     console.error('Error en el registro.');
    //     // Mostrar mensaje de error desde el backend
    //   }
    // });

     // Placeholder: Navegar a login (simulación)
     
  }

  goToLogin() {
    console.log('Navegando a la página de login...');
    this.router.navigateByUrl('/login');
  }

  // --- Helper para mostrar alertas (Opcional) ---
  // async presentAlert(header: string, message: string) {
  //   const alert = await this.alertController.create({
  //     header: header,
  //     message: message,
  //     buttons: ['OK']
  //   });
  //   await alert.present();
  // }

}