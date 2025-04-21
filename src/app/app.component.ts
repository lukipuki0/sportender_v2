// src/app/app.component.ts
import { Component } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
   // --- Array Modificado con los 5 botones solicitados ---
   public appPages = [
    { title: 'Buscar', url: '/menu', icon: 'location' }, // '/menu' es la página principal de búsqueda/filtros
    { title: 'Mapa', url: '/mapa', icon: 'compass' }, 
    { title: 'Publicar', url: '/publicar', icon: 'add-circle' }, // Página para crear un nuevo evento
    { title: 'Mis Eventos', url: '/mis-eventos', icon: 'calendar' },
    { title: 'Historial', url: '/historial', icon: 'document-text' },
    { title: 'Perfil', url: '/perfil', icon: 'person' }
  ];
  public selectedIndex = 0;

  // --- Rutas donde el menú estará habilitado (actualizado) ---
  private menuEnabledRoutes: string[] = ['/menu','/mapa', '/publicar', '/mis-eventos', '/historial', '/perfil'];

  constructor(
    private router: Router,
    private menuCtrl: MenuController
  ) {
    this.listenToRouteChanges();
  }

  listenToRouteChanges() {
    this.router.events.pipe(
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Comprueba si la URL actual comienza con alguna de las rutas habilitadas
      const shouldEnableMenu = this.menuEnabledRoutes.some(route => event.urlAfterRedirects.startsWith(route));
      this.menuCtrl.enable(shouldEnableMenu, 'main-menu');

      // Actualiza el índice seleccionado para resaltar en el menú
      const pageIndex = this.appPages.findIndex(page => event.urlAfterRedirects.startsWith(page.url));
      this.selectedIndex = pageIndex !== -1 ? pageIndex : -1;
    });
  }
}