import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicarPage } from './publicar.page';

const routes: Routes = [
  {
    path: '',
    component: PublicarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicarPageRoutingModule {}