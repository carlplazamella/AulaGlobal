import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FormsModule }       from '@angular/forms';
import { Router }            from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonAvatar,
  IonIcon,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent
} from '@ionic/angular/standalone';
import { addIcons }          from 'ionicons';
import {
  createOutline,
  logOutOutline,
  calendarOutline,
  ribbonOutline,
  timeOutline,
  personOutline,
  barChartOutline
} from 'ionicons/icons';

import { ClasesService, Reserva } from 'src/app/services/clases.service';
import { AuthService }            from 'src/app/services/auth.service';

@Component({
  selector: 'app-inicio-alumno',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonAvatar,
    IonIcon,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardContent
  ],
  templateUrl: './inicio-alumno.page.html',
  styleUrls: ['./inicio-alumno.page.scss']
})
export class InicioAlumnoPage implements OnInit {
  createOutline    = createOutline;
  logOutOutline    = logOutOutline;
  calendarOutline  = calendarOutline;
  ribbonOutline    = ribbonOutline;
  timeOutline      = timeOutline;
  personOutline    = personOutline;
  barChartOutline  = barChartOutline;

  nombreUsuario = 'Alumno';
  tipoUsuario   = 'Alumno';
  fotoPerfil    = 'assets/images/default-profile.png';
  fechaActual   = '';

  proximaClase = {
    fecha:      null as Date | null,
    materia:    '',
    nivel:      '',
    horaInicio: '',
    horaFin:    '',
    profesor:   ''
  };
  estadisticas = { clasesSemana: 0 };

  constructor(
    private router:    Router,
    private authSvc:   AuthService,
    private clasesSvc: ClasesService
  ) {
    addIcons({
      createOutline,
      logOutOutline,
      calendarOutline,
      ribbonOutline,
      timeOutline,
      personOutline,
      barChartOutline
    });
  }

  ngOnInit() {
    this.cargarUsuario();
    this.calcularFechaActual();
    this.cargarReservas();
  }

  private cargarUsuario() {
    const u: any = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!u.id) return;
    this.nombreUsuario = `${u.nombre} ${u.apellido}`;
    this.fotoPerfil    = u.foto_perfil || this.fotoPerfil;
  }

  private calcularFechaActual() {
    const opts: Intl.DateTimeFormatOptions = {
      weekday: 'long', day: 'numeric', month: 'long'
    };
    const txt = new Intl.DateTimeFormat('es-ES', opts).format(new Date());
    this.fechaActual = txt.charAt(0).toUpperCase() + txt.slice(1);
  }

  private cargarReservas() {
    const u: any = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!u.id) return;
    this.clasesSvc.obtenerReservasAlumno(u.id).subscribe({
      next: (reservas: Reserva[]) => {
        const ahora = Date.now();
        const ordenadas = reservas
          .map(r => ({ ...r,
            dateTime: new Date(`${r.fechaBloque}T${r.horaInicio}`)
          }))
          .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

        const futuras = ordenadas.filter(r => r.dateTime.getTime() > ahora);
        const prox    = futuras.length ? futuras[0] : ordenadas[0];
        if (prox) {
          this.proximaClase = {
            fecha:      prox.dateTime,
            materia:    prox.materia,
            nivel:      prox.dificultad,
            horaInicio: prox.horaInicio,
            horaFin:    prox.horaFin,
            profesor:   prox.profesor || ''
          };
        }

        // Estadísticas semanales
        const hoy = new Date();
        const dia = hoy.getDay() || 7;
        const iniSem = new Date(hoy);
        iniSem.setDate(hoy.getDate() - (dia - 1));
        iniSem.setHours(0,0,0,0);
        const fiSem = new Date(iniSem);
        fiSem.setDate(iniSem.getDate() + 7);
        this.estadisticas.clasesSemana = reservas.filter(r => {
          const d = new Date(r.fechaBloque);
          return d >= iniSem && d < fiSem;
        }).length;
      },
      error: err => console.error('Error al cargar reservas alumno:', err)
    });
  }

  irAPerfil() {
    this.router.navigate(['/perfil']);
  }

  verMisClases() {
    this.router.navigate(['/alumno/clases-alumno']);
  }

  verHistorialClases() {
    this.router.navigate(['/alumno/historial-clases']);
  }

  cerrarSesion() {
    this.authSvc.logout();
    this.router.navigateByUrl('/login');
  }
}
