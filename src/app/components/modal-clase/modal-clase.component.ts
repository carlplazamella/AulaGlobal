// src/app/components/modal-clase/modal-clase.component.ts

import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule }                 from '@angular/common';
import {
  IonicModule,
  ModalController,
  AlertController
} from '@ionic/angular';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { environment }                  from 'src/environments/environment';
import { AuthService }                  from 'src/app/services/auth.service';

@Component({
  selector: 'app-modal-clase',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './modal-clase.component.html',
  styleUrls: ['./modal-clase.component.scss']
})
export class ModalClaseComponent implements OnInit {
  private fb          = inject(FormBuilder);
  private http        = inject(HttpClient);
  private modalCtrl   = inject(ModalController);
  private authService = inject(AuthService);
  private alertCtrl   = inject(AlertController);

  @Input() fechas: string[] = [];

  materias: { id: number; nombre: string }[] = [];
  niveles:  { id: number; nombre: string }[] = [];

  formulario = this.fb.group({
    materia:     ['', Validators.required],
    nivel:       ['', Validators.required],
    horaInicio:  ['', Validators.required],
    horaFin:     ['', Validators.required],
    descripcion: [''],
    precioHora:  [null, [Validators.required, Validators.min(0)]]
  });

  horas: string[] = [];

  ngOnInit() {
    this.generarHoras();
    this.cargarMaterias();
    this.cargarNiveles();
  }

  private async cargarMaterias() {
    try {
      console.log('Cargando materias…');
      const resp = await this.http
        .get<any[]>(`${environment.apiUrl}/materias`)
        .toPromise();

      console.log('Respuesta materias:', resp);
      const lista = resp ?? [];
      this.materias = lista.map(m => ({
        id:     m.id,
        // si tu API devuelve nombre_materia, lo usamos; si solo nombre, también:
        nombre: m.nombre_materia ?? m.nombre
      }));
    } catch (err) {
      console.error('Error al cargar materias:', err);
      this.materias = [];
    }
  }

  private async cargarNiveles() {
    try {
      console.log('Cargando niveles…');
      const resp = await this.http
        .get<any[]>(`${environment.apiUrl}/niveles`)
        .toPromise();

      console.log('Respuesta niveles:', resp);
      const lista = resp ?? [];
      const orden = ['Básico', 'Intermedio', 'Avanzado'];
      this.niveles = lista
        .map(n => ({
          id:     n.id,
          nombre: n.nombre_nivel ?? n.nombre
        }))
        .sort((a, b) => orden.indexOf(a.nombre) - orden.indexOf(b.nombre));
    } catch (err) {
      console.error('Error al cargar niveles:', err);
      this.niveles = [];
    }
  }

  generarHoras() {
    this.horas = [];
    for (let h = 9; h <= 21; h++) {
      this.horas.push(h.toString().padStart(2, '0') + ':00');
    }
  }

  obtenerHorasFin(): string[] {
    const hi = this.formulario.get('horaInicio')?.value || '00:00';
    const horaNum = parseInt(hi.split(':')[0], 10);
    const fins: string[] = [];
    for (let h = horaNum + 1; h <= 22; h++) {
      fins.push(h.toString().padStart(2, '0') + ':00');
    }
    return fins;
  }

  get duration(): number | null {
    const hi = this.formulario.get('horaInicio')?.value;
    const hf = this.formulario.get('horaFin')?.value;
    if (!hi || !hf) return null;
    const [h1, m1] = hi.split(':').map(Number);
    const [h2, m2] = hf.split(':').map(Number);
    const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
    return diff > 0 ? diff / 60 : null;
  }

  async guardar() {
    if (this.formulario.invalid || this.fechas.length === 0) return;

    if ((this.duration || 0) < 4) {
      const alerta = await this.alertCtrl.create({
        header: 'Duración insuficiente',
        message: 'La clase debe durar al menos 4 horas.',
        buttons: ['OK']
      });
      await alerta.present();
      return;
    }

    const {
      materia,
      nivel,
      horaInicio,
      horaFin,
      descripcion,
      precioHora
    } = this.formulario.value;
    const profesorId = this.authService.obtenerIdUsuario();

    try {
      for (const fecha of this.fechas) {
        await this.http
          .post(
            `${environment.apiUrl}/clases`,
            {
              materia,
              nivel,
              profesorId,
              fecha,
              hora_inicio: horaInicio,
              hora_fin: horaFin,
              descripcion,
              precioHora
            }
          )
          .toPromise();
      }
      this.modalCtrl.dismiss('guardado');
    } catch (err: any) {
      console.error('Error al guardar clase(s):', err);
      if (err.status === 409) {
        const alerta = await this.alertCtrl.create({
          header: 'Horario ocupado',
          message: err.error?.mensaje || 'Ya tienes otra clase en ese horario.',
          buttons: ['OK']
        });
        await alerta.present();
        return;
      }
      const alerta = await this.alertCtrl.create({
        header: 'Error',
        message: 'Ocurrió un error al guardar la clase. Intenta nuevamente.',
        buttons: ['OK']
      });
      await alerta.present();
    }
  }

  cerrar() {
    this.modalCtrl.dismiss(false);
  }
}
