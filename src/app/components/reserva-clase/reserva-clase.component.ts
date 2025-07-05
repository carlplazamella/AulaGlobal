import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonDatetime,
  AlertController,
  ModalController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { ClasesService } from 'src/app/services/clases.service';
import { AuthService }   from 'src/app/services/auth.service';

interface Bloque {
  bloqueHorarioId: number;
  fecha:           string;
  hora_inicio:     string;
  hora_fin:        string;
}

@Component({
  selector: 'app-reserva-clase',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonDatetime,
  ],
  templateUrl: './reserva-clase.component.html',
  styleUrls: ['./reserva-clase.component.scss']
})
export class ReservaClaseComponent implements OnInit {
  @Input() profesorId!: number;
  @Input() materia!: string;

  alumnoId: number | null = null;
  disponibilidad: Bloque[] = [];
  diasDisponibles: string[] = [];
  fechaSeleccionada: string | null = null;
  horasDisponibles: Bloque[] = [];
  mensajeConfirmacion = '';

  private clasesSvc   = inject(ClasesService);
  private authService = inject(AuthService);
  private modalCtrl   = inject(ModalController);
  private alertCtrl   = inject(AlertController);
  private router      = inject(Router);

  private hoyISO = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    this.alumnoId = this.authService.obtenerIdUsuario();
    this.cargarDisponibilidad();
  }

  private cargarDisponibilidad() {
    this.clasesSvc
      .obtenerClasesDisponiblesPorProfesorYMateria(this.profesorId, this.materia)
      .subscribe({
        next: bloques => {
          this.disponibilidad = bloques.map((b: any) => ({
            bloqueHorarioId: b.bloque_id,
            fecha:           b.fecha.split('T')[0],
            hora_inicio:     b.hora_inicio,
            hora_fin:        b.hora_fin
          }));

          this.diasDisponibles = Array.from(
            new Set(this.disponibilidad.map(b => b.fecha))
          )
          .filter(d => d >= this.hoyISO)
          .sort();

          if (this.diasDisponibles.length) {
            this.seleccionarFecha({ detail: { value: this.diasDisponibles[0] } });
          }
        },
        error: err => console.error('Error al obtener disponibilidad:', err)
      });
  }

  seleccionarFecha(event: any) {
    const iso = (event.detail.value as string).split('T')[0];
    this.fechaSeleccionada = iso;
    this.mensajeConfirmacion = '';
    this.generarHorasDisponibles();
  }

  private generarHorasDisponibles() {
    if (!this.fechaSeleccionada) {
      this.horasDisponibles = [];
      return;
    }

    const now = new Date();

    this.horasDisponibles = this.disponibilidad.filter(b => {
      const fechaHoraInicio = new Date(`${b.fecha}T${b.hora_inicio}`);
      return b.fecha === this.fechaSeleccionada && fechaHoraInicio > now;
    });
  }

  isDateEnabled = (isoString: string): boolean => {
    const fecha = isoString.split('T')[0];
    return fecha >= this.hoyISO && this.diasDisponibles.includes(fecha);
  };

  async reservarClase(hora: Bloque) {
    if (!this.alumnoId) return;

    this.clasesSvc
      .reservarClase(this.alumnoId, hora.bloqueHorarioId)
      .subscribe({
        next: async (resp: any) => {
          const reservaId = resp.reservaId;
          await this.modalCtrl.dismiss();
          this.router.navigate(['/alumno/pago-clase', reservaId]);
        },
        error: async err => {
          console.error('Error al reservar clase:', err);
          const alert = await this.alertCtrl.create({
            header:  err.status === 409 ? 'Horario ocupado' : 'Error',
            message: err.status === 409
              ? 'Ya tienes una clase a esta hora'
              : 'Ocurrió un error al reservar la clase.',
            buttons: ['OK']
          });
          await alert.present();
        }
      });
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }
}
