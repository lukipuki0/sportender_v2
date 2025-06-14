import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { EditProfileFieldModalComponent } from '../../components/edit-profile-field-modal/edit-profile-field-modal.component';
import { AuthService } from '../../services/auth.service';
import { UserService, User } from '../../services/user.service';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpClient, HttpHeaders
import { environment } from '../../../environments/environment'; // Import environment

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {

  currentUser: User | null = null;
  profilePictureUrl: string | null = null; // URL de la foto de perfil

  nombreApellido: string = '';
  nombreUsuario: string = '';
  correo: string = '';
  telefono: string = '';

  constructor(
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController,
    private authService: AuthService,
    private userService: UserService,
    private http: HttpClient // Inyectar HttpClient
  ) { }

  ngOnInit() {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    const userId = await this.authService.getCurrentUserId(); // Await the userId

    if (userId !== null) {
      this.userService.getUserById(userId).subscribe({
        next: (user) => {
          this.currentUser = user;
          this.nombreUsuario = user.username;
          this.correo = user.email;
          console.log('Perfil del usuario cargado:', this.currentUser);
          this.profilePictureUrl = 'URL_DE_LA_IMAGEN_DESDE_EL_BACKEND'; // Reemplaza con la URL real
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
        }
      });
    } else {
      console.warn('No hay usuario autenticado para cargar el perfil.');
    }
  }

  async editProfilePicture(event: any) {
    console.log('Intentando editar foto de perfil...');

    const file = event.target.files[0];
    if (file) {
      await this.uploadProfilePicture(file);
    } else {
      this.presentAlert('Error', 'Por favor seleccione una imagen.');
    }
  }

  async uploadProfilePicture(file: File) {
    console.log('Subiendo foto de perfil...', file);

    const formData = new FormData();
    formData.append('file', file); // 'file' debe coincidir con el nombre del campo esperado por Multer en el backend

    try {
      const token = await this.authService.getToken();
      if (!token) {
        console.error('No se pudo obtener el token de autenticación.');
        this.presentAlert('Error', 'No se pudo autenticar.');
        return;
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      this.http.post<{ url: string }>(`${environment.apiUrl}/storage/upload`, formData, { headers }).subscribe({
        next: (response) => {
          console.log('Foto de perfil subida con éxito:', response.url);
          this.profilePictureUrl = response.url; // Actualizar la URL de la foto de perfil
          this.presentAlert('Éxito', 'Foto de perfil actualizada correctamente.');

           //Opcional: Actualizar el modelo User en el backend con la nueva URL
           //this.updateUserProfile({profilePictureUrl: response.url});
        },
        error: (errorResponse: HttpErrorResponse) => {
          console.error('Error al subir la foto de perfil:', errorResponse);
          let errorMessage = 'Ocurrió un error al subir la foto de perfil.';

           if (errorResponse.error && errorResponse.error.error) {
             errorMessage = errorResponse.error.error;
           } else if (errorResponse.statusText) {
              errorMessage = errorResponse.statusText;
           } else if (errorResponse.message) {
              errorMessage = errorResponse.message;
           }

          this.presentAlert('Error al Subir Foto', errorMessage);
        }
      });

    } catch (error) {
      console.error('Error al subir la foto de perfil:', error);
      this.presentAlert('Error', 'Ocurrió un error inesperado al subir la foto de perfil.');
    }
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
    let type = 'text';
    let backendFieldName: keyof User | null = null;

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
      default: console.error('Campo desconocido o no editable:', fieldName); 
               this.presentAlert('Error', 'Este campo no se puede editar.');
               return;
    }

    if (!backendFieldName) {
         console.warn(`El campo ${fieldName} no mapea a un campo actualizable en el backend User.`);
         this.presentAlert('Información', 'Este campo es solo de visualización o requiere otra lógica de actualización.');
         return;
    }

    const modal = await this.modalController.create({
      component: EditProfileFieldModalComponent,
      componentProps: {
        'fieldName': fieldName,
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

      const updateData: Partial<User> = {};
      updateData[backendFieldName] = data;

      this.userService.updateUser(userId, updateData).subscribe({
        next: (updatedUser) => {
          console.log('Perfil actualizado con éxito en backend:', updatedUser);
          this.currentUser = updatedUser;
          this.nombreUsuario = updatedUser.username;
          this.correo = updatedUser.email;
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

}