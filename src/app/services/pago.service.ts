// src/app/services/pago.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface Pago {
  fecha: string;
  monto: number;
  clase: string;
  alumno: string;
}

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private apiUrl = `${environment.apiUrl}/pagos`;

  constructor(private http: HttpClient) {}

  /** Devuelve la lista de pagos completados para un profesor */
  getPagosProfesor(profesorId: number): Observable<Pago[]> {
    return this.http
      .get<{ pagos: Pago[] }>(`${this.apiUrl}/profesor/${profesorId}`)
      .pipe(map(res => res.pagos));
  }
}
