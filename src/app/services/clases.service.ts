// src/app/services/clases.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

export interface Reserva {
  id: number;
  fechaBloque: string;    // Fecha en formato ISO o dd-MM-YYYY según endpoint
  horaInicio: string;     // HH:mm
  horaFin: string;        // HH:mm
  materia: string;
  dificultad: string;
  profesor?: string;
  profesorId?: number;
  alumno?: string;
  alumnoId?: number;
}

export interface Bloque {
  bloque_id:   number;
  fecha:       string;   // ISO date
  hora_inicio: string;   // HH:mm:ss
  hora_fin:    string;   // HH:mm:ss
  materia:     string;
  nivel:       string;
  precio_hora: number;
  profesor:    string;
  profesor_id: number;
}

@Injectable({ providedIn: 'root' })
export class ClasesService {
  private apiUrl     = `${environment.apiUrl}/clases`;
  private reservaUrl = `${environment.apiUrl}/reservas`;
  private pagosUrl   = `${environment.apiUrl}/pagos`;

  constructor(private http: HttpClient) {}

  /** Obtiene todas las clases de un profesor */
  obtenerClasesDelProfesor(profesorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${profesorId}`);
  }

  /** Elimina un bloque por su ID */
  eliminarClase(bloqueId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bloque/${bloqueId}`);
  }

  /** Edita un bloque */
  editarClase(bloqueId: number, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/bloque/${bloqueId}`, datos);
  }

  /** Trae todas las clases disponibles */
  obtenerClasesDisponibles(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/disponibles`)
      .pipe(tap(r => console.log('Disponibles:', r)));
  }

  /** Bloques disponibles por profesor y materia */
  obtenerClasesDisponiblesPorProfesorYMateria(
    profesorId: number,
    materia: string
  ): Observable<any[]> {
    return this.http
      .get<any[]>(
        `${this.apiUrl}/disponibles/${profesorId}/${encodeURIComponent(materia)}`
      )
      .pipe(tap(b => console.log('Bloques disponibles:', b)));
  }

  /** Reserva un bloque */
  reservarClase(alumnoId: number, bloqueHorarioId: number): Observable<any> {
    return this.http
      .post(
        `${this.reservaUrl}/reservar`,
        { alumnoId, bloqueHorarioId }
      )
      .pipe(tap(r => console.log('Respuesta reserva:', r)));
  }

  /** Obtiene reservas de un alumno (futuras, sin evaluar) */
  obtenerReservasAlumno(alumnoId: number): Observable<Reserva[]> {
    return this.http
      .get<any[]>(`${this.reservaUrl}/alumno/${alumnoId}`)
      .pipe(
        tap(raw => console.log('RAW reservas alumno:', raw)),
        map(raw =>
          raw.map(r => ({
            id:          r.id,
            fechaBloque: r.fechaBloque,
            horaInicio:  r.horaInicio,
            horaFin:     r.horaFin,
            materia:     r.materia,
            dificultad:  r.dificultad,
            profesor:    r.profesor,
            profesorId:  r.profesorId
          } as Reserva))
        )
      );
  }

  /** Obtiene historial de un alumno (clases pasadas) */
  obtenerHistorialAlumno(alumnoId: number): Observable<Reserva[]> {
    return this.http
      .get<any[]>(`${this.reservaUrl}/alumno/${alumnoId}/historial`)
      .pipe(
        tap(raw => console.log('RAW historial alumno:', raw)),
        map(raw =>
          raw.map(r => ({
            id:          r.id,
            fechaBloque: r.fechaBloque,
            horaInicio:  r.horaInicio,
            horaFin:     r.horaFin,
            materia:     r.materia,
            dificultad:  r.dificultad,
            profesor:    r.profesor,
            profesorId:  r.profesorId
          } as Reserva))
        )
      );
  }

  /** Obtiene reservas de un profesor (futuras, sin evaluar) */
  obtenerReservasProfesor(profesorId: number): Observable<Reserva[]> {
    return this.http
      .get<any[]>(`${this.reservaUrl}/profesor/${profesorId}`)
      .pipe(
        tap(raw => console.log('RAW reservas profesor:', raw)),
        map(raw =>
          raw.map(r => {
            const [d, m, y] = r.fechaBloque
              .split('-')
              .map((x: string) => parseInt(x, 10));
            const isoDate = `${y.toString().padStart(4,'0')}-${m
              .toString().padStart(2,'0')}-${d.toString().padStart(2,'0')}`;
            return {
              id:          r.id,
              fechaBloque: isoDate,
              horaInicio:  r.horaInicio,
              horaFin:     r.horaFin,
              materia:     r.materia,
              dificultad:  r.dificultad,
              alumno:      r.alumno,
              alumnoId:    r.alumnoId
            } as Reserva;
          })
        )
      );
  }

  /** Obtiene historial de un profesor (clases pasadas) */
  obtenerHistorialProfesor(profesorId: number): Observable<Reserva[]> {
    return this.http
      .get<any[]>(`${this.reservaUrl}/profesor/${profesorId}/historial`)
      .pipe(
        tap(raw => console.log('RAW historial profesor:', raw)),
        map(raw =>
          raw.map(r => ({
            id:          r.id,
            fechaBloque: r.fechaBloque,
            horaInicio:  r.horaInicio,
            horaFin:     r.horaFin,
            materia:     r.materia,
            dificultad:  r.dificultad,
            alumno:      r.alumno,
            alumnoId:    r.alumnoId
          } as Reserva))
        )
      );
  }

  /** Obtiene bloques agendados (clases reservadas) de un profesor */
  obtenerBloquesAgendados(profesorId: number): Observable<Bloque[]> {
    return this.http
      .get<Bloque[]>(`${this.apiUrl}/agendadas/${profesorId}`)
      .pipe(tap(bs => console.log('Bloques agendados:', bs)));
  }

  /** Detalle de una reserva por ID */
  obtenerReservaPorId(reservaId: number): Observable<any> {
    return this.http.get(`${this.reservaUrl}/${reservaId}`);
  }

  /** Simula un pago para la reserva */
  simularPago(reservaId: number, metodo: string = 'TARJETA'): Observable<any> {
    return this.http
      .post(
        `${this.pagosUrl}/pagar`,
        { reservaId, metodo_pago: metodo }
      )
      .pipe(tap(r => console.log('Respuesta pago:', r)));
  }

  /** Cancela una reserva existente */
  cancelarReserva(reservaId: number): Observable<any> {
    return this.http
      .post(
        `${this.reservaUrl}/cancelar`,
        { reservaId }
      )
      .pipe(tap(r => console.log('Reserva cancelada:', r)));
  }
}
