import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { EditProfileFieldModalComponent } from '../../components/edit-profile-field-modal/edit-profile-field-modal.component';

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

  constructor(
    private router: Router,
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  loadUserProfile() { 

  }

  editProfilePicture() {
    console.log('Intentando editar foto de perfil...');
  }

  async editField(fieldName: string) {
    console.log('Abriendo modal para editar campo:', fieldName);

    let currentVal = '';
    let label = '';
    let type = 'text';

    switch (fieldName) {
      case 'nombreApellido': currentVal = this.nombreApellido; label = 'Nombre y apellido'; type = 'text'; break;
      case 'nombreUsuario': currentVal = this.nombreUsuario; label = 'Nombre de usuario'; type = 'text'; break;
      case 'correo': currentVal = this.correo; label = 'Correo'; type = 'email'; break;
      case 'telefono': currentVal = this.telefono; label = 'Teléfono'; type = 'tel'; break;
      default: console.error('Campo desconocido:', fieldName); return;
    }

    const modal = await this.modalController.create({
      component: EditProfileFieldModalComponent, // Ahora debería encontrar este componente
      componentProps: {
        'fieldName': fieldName, 'fieldLabel': label,
        'currentValue': currentVal, 'fieldType': type
      }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(`Campo ${fieldName} actualizado a:`, data);
      switch (fieldName) {
        case 'nombreApellido': this.nombreApellido = data; break;
        case 'nombreUsuario': this.nombreUsuario = data; break;
        case 'correo': this.correo = data; break;
        case 'telefono': this.telefono = data; break;
      }
      console.log(`TODO: Llamar al backend para guardar el campo ${fieldName}`);
    } else {
      console.log('Edición cancelada');
    }
  }
}