import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface Notificacion {
  id:         number;
  tipo:       string;
  mensaje:    string;
  entidadId:  number | null;
  isRead:     boolean;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notificaciones`;

  constructor(private http: HttpClient) {}

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/unread-count`);
  }

  getAll(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.apiUrl);
  }

  markAllRead(): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/mark-all-read`, {});
  }
}
