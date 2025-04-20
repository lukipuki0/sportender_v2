import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreferencesPage } from './preferences.page';

const routes: Routes = [
  {
    path: '', // Ruta raíz para este módulo (ej: '/preferences')
    component: PreferencesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreferencesPageRoutingModule {}