import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMaterias(): Observable<any> {
    return this.http.get(`${this.baseUrl}/materias`);
  }

  getNiveles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/niveles`);
  }
}
