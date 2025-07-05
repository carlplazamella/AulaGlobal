import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';


import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonAvatar,
  IonButton,
  IonIcon,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent
} from '@ionic/angular/standalone';

import { ClasesService, Reserva } from 'src/app/services/clases.service';

@Component({
  selector: 'app-inicio-profesor',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonAvatar,
    IonButton,
    IonIcon,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardContent
  ],
  templateUrl: './inicio-profesor.page.html',
  styleUrls: ['./inicio-profesor.page.scss']
})
export class InicioProfesorPage {
  fotoPerfil    = 'assets/images/default-profile.png';
  nombreUsuario = 'Profesor';
  tipoUsuario   = 'Profesor';
  fechaActual   = '';

  proximaClase: {
    fecha: Date | null;
    dificultad: string;
    horaInicio: string;
    horaFin: string;
    materia: string;
    alumno: string;
  } = {
    fecha: null,
    dificultad: '',
    horaInicio: '',
    horaFin: '',
    materia: '',
    alumno: ''
  };

  estadisticas = { clasesSemana: 0 };

  constructor(
    private router: Router,
    private clasesSvc: ClasesService
  ) {}

  ionViewWillEnter(): void {
    this.calcularFechaActual();
    this.cargarDatosDeLocalStorage();
    this.cargarReservasProfesor();
  }

  private calcularFechaActual() {
    const opts: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const txt = new Intl.DateTimeFormat('es-ES', opts).format(new Date());
    this.fechaActual = txt.charAt(0).toUpperCase() + txt.slice(1);
  }

  private cargarDatosDeLocalStorage() {
    const raw = localStorage.getItem('usuario');
    if (!raw) return;
    const u: any = JSON.parse(raw);
    this.nombreUsuario = `${u.nombre} ${u.apellido}`.trim();
    this.tipoUsuario   = u.tipo === 'alumno' ? 'Alumno' : 'Profesor';
    this.fotoPerfil    = u.foto_perfil || this.fotoPerfil;
  }

  private cargarReservasProfesor() {
    const raw = localStorage.getItem('usuario');
    if (!raw) return;
    const u: any = JSON.parse(raw);
    const profId = u.id;

    this.clasesSvc.obtenerReservasProfesor(profId).subscribe({
      next: (reservas: Reserva[]) => {
        console.log('RAW reservas profesor:', reservas);
        const ahora = new Date();
        const ordenadas = reservas
          .map(r => ({ ...r, dateTime: new Date(`${r.fechaBloque}T${r.horaInicio}:00`) }))
          .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

        const futuras   = ordenadas.filter(r => r.dateTime > ahora);
        const siguiente = (futuras.length ? futuras : ordenadas)[0] || null;

        if (siguiente) {
          this.proximaClase = {
            fecha:      siguiente.dateTime,
            dificultad: siguiente.dificultad,
            horaInicio: siguiente.horaInicio,
            horaFin:    siguiente.horaFin,
            materia:    siguiente.materia,
            alumno:     siguiente.alumno || ''
          };
        }

        // Estadísticas semanales
        const hoy = new Date(), dia = hoy.getDay() || 7;
        const inicioSem = new Date(hoy);
        inicioSem.setDate(hoy.getDate() - (dia - 1));
        inicioSem.setHours(0, 0, 0, 0);
        const finSem = new Date(inicioSem);
        finSem.setDate(inicioSem.getDate() + 7);

        this.estadisticas.clasesSemana = reservas.filter(r => {
          const d = new Date(r.fechaBloque);
          return d >= inicioSem && d < finSem;
        }).length;
      },
      error: err => console.error('Error al cargar reservas profesor:', err)
    });
  }

  irAPerfil()          { this.router.navigate(['/perfil']); }
  verClasesAgendadas() { this.router.navigate(['/profesor/clases-profesor']); }
  cerrarSesion()       { localStorage.clear(); this.router.navigate(['/login'], { replaceUrl: true }); }
  verHistorialClases() { this.router.navigate(['/profesor/historial-clases']); }
}
