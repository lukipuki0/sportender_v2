import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';

// Define la ruta para este módulo.
// Generalmente, la ruta raíz de un módulo cargado con lazy loading es un string vacío '',
// ya que el path principal se define en app-routing.module.ts
const routes: Routes = [
  {
    path: '', // Cuando se navega a la ruta definida para este módulo (p.ej., '/login'), carga LoginPage
    component: LoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Usa forChild para módulos de funcionalidad
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}