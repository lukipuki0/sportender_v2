import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]
import { IonicModule } from '@ionic/angular';


import { ProfileCreationPageRoutingModule } from './profile-creation-routing.module';
import { ProfileCreationPage } from './profile-creation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, // Importa FormsModule
    IonicModule,
    ProfileCreationPageRoutingModule
  ],
  declarations: [ProfileCreationPage] // Declara el componente
})
export class ProfileCreationPageModule {}