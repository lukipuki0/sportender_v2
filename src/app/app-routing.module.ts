import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // ... tus otras rutas (login, register, profile-creation, preferences) ...
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'profile-creation',
    loadChildren: () => import('./pages/profile-creation/profile-creation.module').then( m => m.ProfileCreationPageModule)
    // Probablemente necesites un AuthGuard aquí para proteger esta ruta
  },
  {
    path: 'preferences',
    loadChildren: () => import('./pages/preferences/preferences.module').then( m => m.PreferencesPageModule)
     // Probablemente necesites un AuthGuard aquí
  },
  { // <-- AÑADE ESTA RUTA PARA MENU -->
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule)
     // Probablemente necesites un AuthGuard aquí
  },
  // Ruta por defecto o redirección (ej: redirigir a login o menu)
  {
    path: '',
    redirectTo: 'login', // O '/menu' si quieres que sea la página por defecto si estás logueado
    pathMatch: 'full'
  },
  {
    path: 'buscar',
    loadChildren: () => import('./pages/buscar/buscar.module').then( m => m.BuscarPageModule)
  },
  {
    path: 'publicar',
    loadChildren: () => import('./pages/publicar/publicar.module').then( m => m.PublicarPageModule)
  },
  {
    path: 'mis-eventos',
    loadChildren: () => import('./pages/mis-eventos/mis-eventos.module').then( m => m.MisEventosPageModule)
  },
  {
    path: 'historial',
    loadChildren: () => import('./pages/historial/historial.module').then( m => m.HistorialPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'mapa',
    loadChildren: () => import('./pages/mapa/mapa.module').then( m => m.MapaPageModule)
  },
  // Asegúrate de tener una ruta '**' al final si manejas rutas no encontradas
  // { path: '**', redirectTo: 'login' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }