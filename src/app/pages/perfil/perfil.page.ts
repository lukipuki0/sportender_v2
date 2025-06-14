import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular'; // Importar AlertController
import { EditProfileFieldModalComponent } from '../../components/edit-profile-field-modal/edit-profile-field-modal.component';
import { AuthService } from '../../services/auth.service'; // Importar AuthService
import { UserService, User } from '../../services/user.service'; // Importar UserService y la interfaz User
import { HttpErrorResponse } from '@angular/common/http'; // Importar HttpErrorResponse

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {

  // Propiedad para almacenar los datos del usuario cargado del backend
  currentUser: User | null = null;

  // Mantener las propiedades originales para la visualización inicial o si no se carga el usuario
  // Serán actualizadas con los datos de currentUser si la carga es exitosa.
  nombreApellido: string = ''; // Asumiendo que esto podría venir de otro campo o combinación (ej. username)
  nombreUsuario: string = '';
  correo: string = '';
  telefono: string = ''; // Este campo no está en el modelo User del backend, lo dejaremos aquí por ahora.

  constructor(
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController, // Inyectar AlertController
    private authService: AuthService, // Inyectar AuthService
    private userService: UserService // Inyectar UserService
  ) { }

  ngOnInit() {
    this.loadUserProfile(); // Cargar el perfil del usuario al iniciar la página
  }

  async loadUserProfile() {
    const userId = await this.authService.getCurrentUserId(); // Obtener el ID del usuario autenticado

    if (userId !== null) {
      this.userService.getUserById(userId).subscribe({
        next: (user) => {
          this.currentUser = user;
          // Actualizar las propiedades locales con los datos del backend
          this.nombreUsuario = user.username;
          this.correo = user.email;
          // Nota: nombreApellido y telefono no están directamente en el modelo User del backend
          // Si necesitas estos campos, deberías añadirlos al modelo User y las migraciones.
          console.log('Perfil del usuario cargado:', this.currentUser);
        },
        error: (errorResponse: HttpErrorResponse) => {
          console.error('Error al cargar el perfil del usuario:', errorResponse);
          let errorMessage = 'No se pudo cargar la información del perfil.';
           if (errorResponse.error && errorResponse.error.error) {
             errorMessage = errorResponse.error.error;
           } else if (errorResponse.statusText) {
              errorMessage = errorResponse.statusText;
           } else if (errorResponse.message) {
              errorMessage = errorResponse.message;
           }
          this.presentAlert('Error de Carga de Perfil', errorMessage);
          // Opcional: redirigir al login si no se puede cargar el perfil
          // this.authService.logout();
          // this.router.navigateByUrl('/login');
        }
      });
    } else {
      console.warn('No hay usuario autenticado para cargar el perfil.');
      // Si no hay usuario autenticado, quizás redirigir al login
      // this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }

  editProfilePicture() {
    console.log('Intentando editar foto de perfil...');
    // TODO: Implementar lógica para subir/cambiar foto de perfil
    this.presentAlert('Funcionalidad Pendiente', 'La edición de la foto de perfil aún no está implementada.');
  }

  async editField(fieldName: string) {
    console.log('Abriendo modal para editar campo:', fieldName);

    if (!this.currentUser) {
      console.warn('No se puede editar el campo: usuario no cargado.');
       this.presentAlert('Error', 'No se ha podido cargar la información del usuario.');
      return;
    }

    let currentVal: string = '';
    let label = '';
    let type = 'text'; // Tipo de input en el modal
    let backendFieldName: keyof User | null = null; // Nombre del campo en el backend si aplica

    // Mapear fieldName del frontend a propiedades del currentUser y nombres del backend
    switch (fieldName) {
      case 'nombreUsuario': 
        currentVal = this.currentUser.username; 
        label = 'Nombre de usuario'; 
        type = 'text';
        backendFieldName = 'username';
        break;
      case 'correo': 
        currentVal = this.currentUser.email; 
        label = 'Correo'; 
        type = 'email';
        backendFieldName = 'email';
        break;
      // nombreApellido y telefono no están directamente en el modelo backend User
      // case 'nombreApellido': currentVal = this.nombreApellido; label = 'Nombre y apellido'; type = 'text'; break; // No mapea a backend User
      // case 'telefono': currentVal = this.telefono; label = 'Teléfono'; type = 'tel'; break; // No mapea a backend User
      default: console.error('Campo desconocido o no editable:', fieldName); 
               this.presentAlert('Error', 'Este campo no se puede editar.');
               return;
    }

    // Si el campo no mapea a un campo del backend User que se pueda actualizar, salir
    if (!backendFieldName) {
         console.warn(`El campo ${fieldName} no mapea a un campo actualizable en el backend User.`);
         this.presentAlert('Información', 'Este campo es solo de visualización o requiere otra lógica de actualización.');
         return;
    }

    const modal = await this.modalController.create({
      component: EditProfileFieldModalComponent,
      componentProps: {
        'fieldName': fieldName, // Usar nombre del frontend para el modal
        'fieldLabel': label,
        'currentValue': currentVal,
        'fieldType': type
      }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data !== undefined && data !== null) {
      console.log(`Campo ${fieldName} (backend: ${String(backendFieldName)}) actualizado a:`, data);
      
      const userId = await this.authService.getCurrentUserId();
      if (userId === null) {
        console.error('No se pudo obtener el ID del usuario autenticado para actualizar.');
        this.presentAlert('Error', 'No se pudo identificar al usuario para actualizar el perfil.');
        return;
      }

      // Preparar los datos para enviar al backend (solo el campo modificado)
      const updateData: Partial<User> = {};
      updateData[backendFieldName] = data; // Usar el nombre del campo del backend

      // Si el campo es email o username, y ya existe, el backend debería dar un error 409
      // Asegúrate de que tu backend PUT /api/users/:id maneje esto.
      
      // Llamar al servicio de usuario para actualizar el perfil en el backend
      this.userService.updateUser(userId, updateData).subscribe({
        next: (updatedUser) => {
          console.log('Perfil actualizado con éxito en backend:', updatedUser);
          // Actualizar la propiedad currentUser y la vista con los datos recibidos del backend
          this.currentUser = updatedUser;
          this.nombreUsuario = updatedUser.username; // Asumiendo que el backend devuelve el username actualizado
          this.correo = updatedUser.email;     // Asumiendo que el backend devuelve el email actualizado
          // Si nombreApellido o telefono fueran campos de backend y se pudieran actualizar, actualízalos aquí también.
          this.presentAlert('Éxito', 'Perfil actualizado correctamente.');
        },
        error: (errorResponse: HttpErrorResponse) => {
           console.error('Error al actualizar el perfil en backend:', errorResponse);
           let errorMessage = 'Ocurrió un error al actualizar el perfil.';

           if (errorResponse.status === 409) {
              errorMessage = 'El nombre de usuario o correo electrónico ya existen.';
           } else if (errorResponse.error && errorResponse.error.error) {
              errorMessage = errorResponse.error.error;
           } else if (errorResponse.statusText) {
              errorMessage = errorResponse.statusText;
           } else if (errorResponse.message) {
              errorMessage = errorResponse.message;
           }

           this.presentAlert('Error de Actualización', errorMessage);
           // Opcional: recargar el perfil desde el backend para asegurar consistencia
           this.loadUserProfile();
        }
      });

    } else {
      console.log('Edición cancelada o datos no válidos.');
    }
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

  // --- Métodos para eliminar cuenta ---
  async confirmAndDeleteAccount() {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Está seguro de que desea eliminar su cuenta? Esta acción es irreversible.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Eliminación cancelada');
          }
        }, {
          text: 'Eliminar',
          cssClass: 'danger', // Opcional: para que el botón sea rojo
          handler: () => {
            this.deleteAccount(); // Llamar al método de eliminación si se confirma
          }
        }
      ]
    });

    await alert.present();
  }

  deleteAccount() {
    if (!this.currentUser || this.currentUser.id === undefined) {
      console.error('No hay usuario autenticado o ID de usuario no disponible.');
      this.presentAlert('Error', 'No se pudo identificar al usuario para eliminar.');
      return;
    }

    const userIdToDelete = this.currentUser.id;

    this.userService.deleteUser(userIdToDelete).subscribe({
      next: () => {
        console.log(`Usuario ${userIdToDelete} eliminado con éxito.`);
        this.presentAlert('Cuenta Eliminada', 'Su cuenta ha sido eliminada correctamente.').then(() => {
           // Luego de mostrar la alerta, cerrar sesión y redirigir
           this.authService.logout().then(() => {
             this.router.navigateByUrl('/login', { replaceUrl: true });
           });
        });
      },
      error: (errorResponse: HttpErrorResponse) => {
        console.error('Error al eliminar usuario:', errorResponse);
        let errorMessage = 'Ocurrió un error al intentar eliminar su cuenta.';

        if (errorResponse.error && errorResponse.error.error) {
           errorMessage = errorResponse.error.error;
        } else if (errorResponse.statusText) {
           errorMessage = errorResponse.statusText;
        } else if (errorResponse.message) {
           errorMessage = errorResponse.message;
        }

        this.presentAlert('Error de Eliminación', errorMessage);
      }
    });
  }
}
