import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  usuario: string = '';
  contrasena: string = '';

  constructor(private router: Router /*, private navCtrl: NavController */) { }

  ngOnInit() {}

  doLogin() {
    console.log('Intentando iniciar sesión...');
    console.log('Usuario:', this.usuario);
    console.log('Contraseña:', this.contrasena);

    if (this.usuario && this.contrasena) {
       this.router.navigateByUrl('/menu');
    } else {
      console.warn('Por favor ingresa usuario y contraseña');
    }
    this.router.navigateByUrl('/menu'); 
  }

  goToRegister() {
    console.log('Navegando a la página de registro...');
    this.router.navigateByUrl('/register');
  }

}