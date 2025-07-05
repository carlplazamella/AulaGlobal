// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router }     from '@angular/router';
import { environment } from 'src/environments/environment';
import { Observable, tap } from 'rxjs';

export interface RegisterData {
  nombre:      string;
  apellido:    string;
  correo:      string;
  password:    string;
  rut:         string;
  dv:          string;
  tipoUsuario: 'alumno' | 'profesor';
}

export interface LoginResponse {
  token:   string;
  usuario: {
    id:       number;
    nombre:   string;
    apellido: string;
    email:    string;
    role:     'alumno' | 'profesor';
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // 🔐 LOGIN
  login(credentials: { correo: string; password: string }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem(
            'usuario',
            JSON.stringify({
              id:         response.usuario.id,
              nombre:     response.usuario.nombre,
              apellido:   response.usuario.apellido,
              email:      response.usuario.email,
              perfil:     response.usuario.role,
              fotoPerfil: null,
              biografia:  ''
            })
          );
        })
      );
  }

  // 📝 REGISTRO
  register(datosRegistro: RegisterData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, datosRegistro);
  }

  // 🚪 LOGOUT
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigateByUrl('/login');
  }

  // 🔑 TOKEN raw
  get token(): string | null {
    return localStorage.getItem('token');
  }

  // 📌 ID guardado (tabla perfil)
  obtenerIdUsuario(): number | null {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario).id : null;
  }

  // 📌 ID real extraído del JWT
  get usuarioIdReal(): number {
    const t = this.token;
    if (!t) return 0;
    const payload = this.parseJwt(t);
    return payload.id || 0;
  }

  // 👤 Tipo de usuario
  get userType(): string | null {
    const usr = localStorage.getItem('usuario');
    return usr ? JSON.parse(usr).perfil : null;
  }

  // ✅ Usuario autenticado
  estaAutenticado(): boolean {
    return !!this.token;
  }

  /** decodifica el JWT sin librerías externas */
  private parseJwt(token: string): any {
    try {
      const base64 = token.split('.')[1];
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json);
    } catch {
      return {};
    }
  }
}
