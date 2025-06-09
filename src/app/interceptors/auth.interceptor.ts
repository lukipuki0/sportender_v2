import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Importa tu AuthService
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Obtener el token del AuthService
    const authToken = this.authService.getToken();

    // Clonar la solicitud para añadir el nuevo header
    let authReq = request;

    // Si hay un token, añadir el header de autorización
    // También puedes añadir una condición para NO añadir el header a las rutas de auth/login/register si lo necesitas
    // Aunque en este caso, añadirlo no debería causar problemas si el backend no lo espera
    if (authToken) {
      authReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${authToken}`)
      });
    }

    // Continuar con la solicitud modificada (o la original si no había token)
    return next.handle(authReq);
  }
}
