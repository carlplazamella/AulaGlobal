import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CalificacionDTO {
  reservaId: number;
  profesorId: number;
  estrellas: number;
  comentario?: string;
}

@Injectable({ providedIn: 'root' })
export class RatingService {
  private baseUrl = '/api/calificaciones';

  constructor(private http: HttpClient) {}

  enviarCalificacion(payload: CalificacionDTO): Observable<any> {
    return this.http.post(this.baseUrl, payload);
  }

  obtenerResumen(profesorId: number): Observable<{ promedio: number; total: number }> {
    return this.http.get<{ promedio: number; total: number }>(
      `${this.baseUrl}/resumen/${profesorId}`
    );
  }

  obtenerResenas(profesorId: number, page = 1): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/${profesorId}?page=${page}`
    );
  }
}
