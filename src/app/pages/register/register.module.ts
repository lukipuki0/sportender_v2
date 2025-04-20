import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]
import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';
import { RegisterPage } from './register.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, // Importa FormsModule
    IonicModule,
    RegisterPageRoutingModule
  ],
  declarations: [RegisterPage] // Declara el componente (NO standalone)
})
export class RegisterPageModule {}