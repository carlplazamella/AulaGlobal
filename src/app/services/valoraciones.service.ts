import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface Valoracion {
  reservaId:    number;
  evaluadorId:  number;
  evaluadoId:   number;
  estrellas:    number;
  comentario:   string;
}

export interface ResultadoValoraciones {
  promedio: string;  
  total:    number;
  items: Array<{
    estrellas:        number;
    comentario:       string;
    evaluadorNombre:  string;
    evaluadorRut:     string;
    fecha:            string;  
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class ValoracionesService {
  private apiUrl = `${environment.apiUrl}/calificacion`;

  constructor(private http: HttpClient) { }


  postValoracion(payload: Valoracion): Observable<{ mensaje: string; id: number }> {
    return this.http.post<{ mensaje: string; id: number }>(this.apiUrl, payload);
  }


  getValoracionesPorUsuario(usuarioId: number): Observable<ResultadoValoraciones> {
    return this.http.get<ResultadoValoraciones>(
      `${this.apiUrl}/usuario/${usuarioId}`
    );
  }
}
