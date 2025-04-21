// src/app/pages/perfil/perfil.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PerfilPageRoutingModule } from './perfil-routing.module';
import { PerfilPage } from './perfil.page';

import { EditProfileFieldModalComponent } from '../../components/edit-profile-field-modal/edit-profile-field-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilPageRoutingModule
  ],
  // *** 2. DECLARA el componente del Modal aquí ***
  declarations: [PerfilPage, EditProfileFieldModalComponent]
})
export class PerfilPageModule {}