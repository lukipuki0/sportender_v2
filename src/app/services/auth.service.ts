import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
// Importar jwt-decode correctamente
import { jwtDecode, JwtPayload } from 'jwt-decode'; // Importar jwtDecode y JwtPayload

// Definir una interfaz para el payload esperado de tu token
interface CustomJwtPayload extends JwtPayload {
  user: {
    id: number;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Asegúrate de que environment.apiUrl esté definido en tus archivos de entorno
  private apiUrl = environment.apiUrl + '/auth';
  private tokenKey = 'authToken'; // Clave para almacenar el token en localStorage

  // Subject para mantener el estado de autenticación
  private _isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this._isAuthenticated.asObservable(); // Observable para suscribirse al estado

  constructor(private http: HttpClient) {
    // Inicializa el BehaviorSubject basado en si ya hay un token guardado
    this._isAuthenticated.next(this.hasToken());
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    // El backend debería responder con un objeto que contiene la propiedad 'token'
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Si el login es exitoso, guardar el token recibido
        this.saveToken(response.token);
        this._isAuthenticated.next(true); // Actualizar el estado de autenticación
      })
    );
  }

  // *** Métodos para manejar el token ***

  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // *** Definir el método hasToken() ***
  private hasToken(): boolean {
    return this.getToken() !== null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Opcional: verificar si el token ha expirado (más preciso que solo verificar si existe)
    const decoded = this.getDecodedToken();
    if (decoded && decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
      // Si el tiempo de expiración es mayor que el tiempo actual, el token aún es válido
      return decoded.exp > currentTime;
    }

    // Si no hay información de expiración o hay un error al decodificar, asumimos que no es válido
    // o que queremos que el usuario se vuelva a autenticar por seguridad.
    // Depende de tu política de seguridad. Aquí, si no se puede verificar expiración, consideramos no autenticado.
    return false;
  }

  logout(): void {
    // Elimina el token y actualiza el estado de autenticación
    this.removeToken();
    this._isAuthenticated.next(false);
    // Opcional: Redirigir al usuario a la página de login después del logout
    // import { Router } from '@angular/router';
    // constructor(..., private router: Router) { ... }
    // this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  // *** Método para obtener la información del usuario del token ***
  getDecodedToken(): CustomJwtPayload | null {
    const token = this.getToken();
    if (token) {
      try {
        // Usar jwtDecode de jwt-decode
        const decoded = jwtDecode<CustomJwtPayload>(token);
        return decoded;
      } catch (error) {
        console.error('Error decoding token:', error);
        // Si hay un error al decodificar (ej. token inválido), removerlo
        this.logout(); // Invalid token, log out the user
        return null;
      }
    }
    return null;
  }

  getCurrentUserId(): number | null {
    const decoded = this.getDecodedToken();
    // Acceder a user.id dentro del payload decodificado
    return decoded && decoded.user && decoded.user.id ? decoded.user.id : null;
  }

   getCurrentUserRole(): string | null {
    const decoded = this.getDecodedToken();
    // Acceder a user.role dentro del payload decodificado
    return decoded && decoded.user && decoded.user.role ? decoded.user.role : null;
  }


  // Método para añadir el token a los headers de las solicitudes (lo usaremos en un interceptor)
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
}