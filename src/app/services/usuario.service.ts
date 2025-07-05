import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface PerfilUpdate {
  descripcion:  string;
  foto_perfil?: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  rut: number;
  dv: string;
  correo: string;
  tipo: string;
  descripcion: string;
  foto_perfil: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  /** Actualiza biografía y URL de foto */
  actualizarPerfil(id: number, datos: PerfilUpdate) {
    return this.http.put(`${this.apiUrl}/${id}`, datos);
  }

  /** Sube foto en multipart/form-data y devuelve { url } */
  subirFotoPerfil(id: number, form: FormData) {
    return this.http.post<{ url: string }>(
      `${this.apiUrl}/${id}/foto`,
      form
    );
  }

  /** Obtiene todos los datos de un usuario por su ID */
  obtenerUsuario(id: number) {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }
}
