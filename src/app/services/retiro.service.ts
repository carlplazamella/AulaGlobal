// src/app/services/retiro.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Retiro {
  id: number;          
  fecha: string;
  monto: number;
  estado: string;
}

@Injectable({ providedIn: 'root' })
export class RetiroService {
  private apiUrl = `${environment.apiUrl}/retiros`;

  constructor(private http: HttpClient) {}

  getRetirosProfesor(profesorId: number): Observable<Retiro[]> {
    return this.http
      .get<{ retiros: Retiro[] }>(`${this.apiUrl}/profesor/${profesorId}`)
      .pipe(map(res => res.retiros));
  }

  solicitarRetiro(profesorId: number, monto: number): Observable<Retiro> {
    return this.http
      .post<{ retiro: Retiro }>(this.apiUrl, { profesorId, monto })
      .pipe(map(res => res.retiro));
  }
}
