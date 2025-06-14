import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, from, catchError, tap, throwError } from 'rxjs'; // Import catchError and throwError
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Preferences } from '@capacitor/preferences';

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
  private apiUrl = environment.apiUrl;
  private authApiUrl = this.apiUrl + '/auth';
  private emailApiUrl = this.apiUrl + '/api/email'; // URL para el backend de email
  private tokenKey = 'authToken'; // Clave para almacenar el token

  // Subject para mantener el estado de autenticación. Inicialmente desconocido o false.
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this._isAuthenticated.asObservable();

  // Subject to indicate if the service has finished loading the token
  private _isInitialized = new BehaviorSubject<boolean>(false);
  isInitialized$ = this._isInitialized.asObservable();

  constructor(private http: HttpClient) {
    this.loadTokenAndAuthState(); // Start loading token asynchronously
  }

  // Async method to load token and set auth state
  private async loadTokenAndAuthState(): Promise<void> {
    const token = await this.getToken();
    if (token && this.isTokenValid(token)) {
      this._isAuthenticated.next(true);
    } else {
      this._isAuthenticated.next(false);
      // Optionally remove invalid token
      if(token) {
         await this.removeToken();
      }
    }
    this._isInitialized.next(true); // Mark service as initialized
  }


  register(userData: any): Observable<any> {
    return this.http.post(`${this.authApiUrl}/register`, userData).pipe(
        tap(async (response) => {
            // Registro exitoso
            console.log('Registro exitoso, enviando correo de bienvenida!');
            await this.sendWelcomeEmail(userData.email, userData.username); // Enviar correo de bienvenida
        }),
        catchError(this.handleError) // Handle errors
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post<{ token: string }>(`${this.authApiUrl}/login`, credentials).pipe(
      tap(async response => {
        await this.saveToken(response.token); // Await the async save
        this._isAuthenticated.next(true); // Update auth state after saving
      }),
      catchError(this.handleError)
    );
  }

   // Método para enviar correo de bienvenida
   async sendWelcomeEmail(to: string, username: string): Promise<void> {
     const subject = 'Bienvenido a Sportender!';
     const text = `Hola ${username},

¡Bienvenido a Sportender! Gracias por registrarte en nuestra plataforma.

Esperamos que disfrutes de la experiencia.

Atentamente,
El equipo de Sportender`;

    const body = { to, subject, text };

    try {
      // Ensure you have the auth token if needed by your backend to send emails
       const headers = await this.getAuthHeaders(); // Get headers with token if needed

       await this.http.post(this.emailApiUrl + '/send', body, { headers }).toPromise();
       console.log('Correo de bienvenida enviado correctamente!');
     } catch (error) {
       console.error('Error al enviar el correo de bienvenida:', error);
     }
   }

  // *** Métodos para manejar el token (ahora async) ***

  private async saveToken(token: string): Promise<void> {
    await Preferences.set({ key: this.tokenKey, value: token });
  }

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: this.tokenKey });
    return value;
  }

  async removeToken(): Promise<void> {
    await Preferences.remove({ key: this.tokenKey });
  }

  // Helper to check token validity (sync)
  private isTokenValid(token: string): boolean {
     if (!token) {
       return false;
     }
     try {
       const decoded = jwtDecode<CustomJwtPayload>(token);
       if (decoded && decoded.exp) {
         const currentTime = Math.floor(Date.now() / 1000);
         return decoded.exp > currentTime;
       }
       return false; // No expiration info or invalid token
     } catch (error) {
       console.error('Error decoding token during validity check:', error);
       return false; // Invalid token format
     }
  }


  // isAuthenticated now relies on the BehaviorSubject state
  // A component or guard should subscribe to isAuthenticated$
  // The async check is done once during service initialization
  // However, for methods that need the current state *right now*,
  // we might need an async version or rely on the subject's current value
  // after initialization.
  // Let's keep a synchronous check based on the Subject's value after initialization.
  // Note: This synchronous method should *ideally* only be called after isInitialized$ is true.
  // Or, components/guards should primarily rely on the isAuthenticated$ observable.
  syncIsAuthenticated(): boolean {
     return this._isAuthenticated.value;
  }


  async logout(): Promise<void> {
    await this.removeToken();
    this._isAuthenticated.next(false);
    // Opcional: Redirigir al usuario
    // import { Router } from '@angular/router';
    // constructor(..., private router: Router) { ... }
    // this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  // *** Métodos para obtener la información del usuario del token (ahora async) ***
  async getDecodedToken(): Promise<CustomJwtPayload | null> {
    const token = await this.getToken(); // Await the async getToken
    if (token) {
      try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        // Add a basic check for expected user structure in payload
         if (decoded && decoded.user && typeof decoded.user.id === 'number' && typeof decoded.user.role === 'string') {
            return decoded;
         } else {
             console.error('Decoded token does not have expected user structure');
             await this.logout(); // Invalid token structure
             return null;
         }
      } catch (error) {
        console.error('Error decoding token:', error);
        await this.logout(); // Invalid token, log out the user
        return null;
      }
    }
    // If no token or token is invalid (checked implicitly by try/catch or isTokenValid), return null
    return null;
  }

  async getCurrentUserId(): Promise<number | null> {
    const decoded = await this.getDecodedToken(); // Await
    return decoded && decoded.user && decoded.user.id ? decoded.user.id : null;
  }

   async getCurrentUserRole(): Promise<string | null> {
    const decoded = await this.getDecodedToken(); // Await
    return decoded && decoded.user && decoded.user.role ? decoded.user.role : null;
  }


  // Método para añadir el token a los headers de las solicitudes (usado en interceptor)
  // This method *must* be async as it calls async getToken
  async getAuthHeaders(): Promise<HttpHeaders> {
    const token = await this.getToken(); // Await
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

   // Method to get the token as an Observable for use in interceptors or guards
   // This is often more convenient in an Angular/RxJS context
   getTokenObservable(): Observable<string | null> {
      return from(this.getToken()); // Convert the async method to an Observable
   }

   // Method to get auth headers as an Observable
   getAuthHeadersObservable(): Observable<HttpHeaders> {
       return this.getTokenObservable().pipe(
           switchMap(token => {
               let headers = new HttpHeaders();
               if (token) {
                   headers = headers.set('Authorization', `Bearer ${token}`);
               }
               // Return as an observable of HttpHeaders
               return [headers]; // or of(headers)
           })
       );
   }

    // Error handling function
    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`
            );
        }
        // Return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.'
        );
    }
}