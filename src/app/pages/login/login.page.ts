import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Importa NavController si prefieres usarlo para navegación dentro de Ionic
// import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false // Cambia a true si el componente es standalone
})
export class LoginPage implements OnInit {

  // Variables para vincular con los inputs usando ngModel (si usas FormsModule)
  // Asegúrate de importar FormsModule en login.module.ts
  usuario: string = '';
  contrasena: string = '';

  // Inyecta Router para poder navegar a otras páginas
  constructor(private router: Router /*, private navCtrl: NavController */) { }

  ngOnInit() {
    // Código que se ejecuta cuando la página se inicializa
  }

  doLogin() {
    console.log('Intentando iniciar sesión...');
    console.log('Usuario:', this.usuario);
    console.log('Contraseña:', this.contrasena);

    // --- LÓGICA DE AUTENTICACIÓN AQUÍ ---
    // Aquí llamarías a tu servicio de autenticación para verificar las credenciales.
    // Por ejemplo:
    // this.authService.login(this.usuario, this.contrasena).subscribe(success => {
    //   if (success) {
    //     this.router.navigateByUrl('/home'); // O la ruta principal de tu app
    //   } else {
    //     // Mostrar mensaje de error
    //     console.error('Credenciales inválidas');
    //   }
    // });

    // Placeholder: Navegar a una página 'home' después del intento (¡quitar esto en producción!)
    if (this.usuario && this.contrasena) {
       this.router.navigateByUrl('/home'); // Cambia '/home' por tu ruta real post-login
    } else {
      console.warn('Por favor ingresa usuario y contraseña');
      // Aquí podrías mostrar una alerta al usuario
    }
  }

  goToRegister() {
    console.log('Navegando a la página de registro...');
    // Navega a la página de registro (asegúrate que la ruta '/register' exista en tu app-routing.module.ts o donde corresponda)
    this.router.navigateByUrl('/register');
    // O usando NavController:
    // this.navCtrl.navigateForward('/register');
  }

}