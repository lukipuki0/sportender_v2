import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Event {
  id: number;
  title: string;
  description: string | null;
  location: string; // Backend guarda location como string
  sportType: string;
  dateTime: string;
  capacity: number;
  creatorId: number;
  createdAt: string;
  updatedAt: string;
}

// Define una interfaz para la respuesta esperada del backend al crear un evento
export interface CreateEventResponse extends Event {
  notificationStatus?: string;
  notificationMessage?: string;
}

@Injectable({ providedIn: 'root' })
export class EventService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  /** RF1: búsqueda por proximidad */
  searchEvents(lat: number, lng: number, radius: number)
    : Observable<Event[]> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString())
      .set('radius', radius.toString());
    return this.http.get<Event[]>(`${this.apiUrl}/search`, { params });
  }

  /** Listar todos (GET /api/events) */
  getAll(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  /** Obtener uno (GET /api/events/:id) */
  getById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  /** RF2: crear evento (POST /api/events) */
  createEvent(data: Partial<Event>): Observable<CreateEventResponse> {
    return this.http.post<CreateEventResponse>(this.apiUrl, data);
  }

  /** RF3: unirse (POST /api/events/:id/join) */
  joinEvent(eventId: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventId}/join`, { userId });
  }

  /** RF5: historial (GET /api/events/user/:userId) */
  getUserEvents(userId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/user/${userId}`);
  }
}