import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]
import { IonicModule } from '@ionic/angular';

import { PreferencesPageRoutingModule } from './preferences-routing.module';
import { PreferencesPage } from './preferences.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, // Importa FormsModule
    IonicModule,
    PreferencesPageRoutingModule
  ],
  declarations: [PreferencesPage] // Declara el componente
})
export class PreferencesPageModule {}