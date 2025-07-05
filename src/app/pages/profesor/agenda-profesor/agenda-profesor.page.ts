// src/app/pages/profesor/agenda-profesor/agenda-profesor.page.ts

import { Component, ViewChild } from '@angular/core';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { CalendarOptions } from '@fullcalendar/core';
import { environment } from 'src/environments/environment';
import { ModalClaseComponent } from 'src/app/components/modal-clase/modal-clase.component';
import { AuthService } from 'src/app/services/auth.service';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  ModalController,
  NavController
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  bookOutline,
  calendarOutline,
  timeOutline,
  alertCircleOutline
} from 'ionicons/icons';

interface Bloque {
  bloque_id: number;
  fecha: Date;
  hora_inicio: string;
  hora_fin: string;
  estado_bloque: string;
  materia: string;
  nivel: string;
}

interface Grupo {
  fecha: Date;
  materia: string;
  nivel: string;
  horarios: { hora_inicio: string; hora_fin: string }[];
  estadoGrupo: string;
}

@Component({
  selector: 'app-agenda-profesor',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgForOf,
    HttpClientModule,
    FullCalendarModule,
    ModalClaseComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent
  ],
  templateUrl: './agenda-profesor.page.html',
  styleUrls: ['./agenda-profesor.page.scss']
})
export class AgendaProfesorPage {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarioVisible = false;
  diasSeleccionados: string[] = [];
  clasesAgendadas: Bloque[] = [];
  groupedClases: Grupo[] = [];

  bookOutline = bookOutline;
  calendarOutline = calendarOutline;
  timeOutline = timeOutline;
  alertCircleOutline = alertCircleOutline;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    eventDisplay: 'block',
    eventContent: arg => ({
      html: `<span class="fc-event-dot ${
        arg.event.extendedProps['estado_bloque'] === 'RESERVADO'
          ? 'fc-dot--reserved'
          : 'fc-dot--available'
      }"></span>`
    }),
    dateClick: this.onDateClick.bind(this),
    eventClick: this.onEventClick.bind(this),
    validRange: { start: new Date().toISOString().split('T')[0] },
    events: []
  };

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) {
    addIcons({
      bookOutline,
      calendarOutline,
      timeOutline,
      alertCircleOutline
    });
  }

  ionViewWillEnter() {
    this.obtenerBloquesProfesor();
  }

  mostrarCalendario() {
    this.calendarioVisible = true;
    setTimeout(() => this.obtenerBloquesProfesor(), 300);
  }

  private obtenerBloquesProfesor() {
    const profId = this.authService.obtenerIdUsuario();
    if (profId == null) return;

    this.http.get<any[]>(`${environment.apiUrl}/clases/bloques/${profId}`)
      .subscribe({
        next: raw => {
          const bloques = raw.map(b => ({
            bloque_id: b.bloque_id,
            fecha: new Date(b.fecha),
            hora_inicio: b.hora_inicio,
            hora_fin: b.hora_fin,
            estado_bloque: b.estado_bloque,
            materia: b.materia,
            nivel: b.nivel
          })) as Bloque[];

          const ahora = new Date();
          this.clasesAgendadas = bloques.filter(b => {
            const fin = new Date(b.fecha);
            const [h, m] = b.hora_fin.split(':').map(x => +x);
            fin.setHours(h, m, 0, 0);
            return fin >= ahora;
          });

          this.groupedClases = this.agruparPorFechaMateriaNivel(this.clasesAgendadas);
          setTimeout(() => this.actualizarEventosCalendario(), 100);
        },
        error: err => console.error('Error al obtener bloques:', err)
      });
  }

  private agruparPorFechaMateriaNivel(bloques: Bloque[]): Grupo[] {
    const mapa = new Map<string, Grupo>();
    bloques.forEach(b => {
      const iso = b.fecha.toISOString().split('T')[0];
      const key = `${iso}|${b.materia}|${b.nivel}`;
      if (!mapa.has(key)) {
        mapa.set(key, {
          fecha: b.fecha,
          materia: b.materia,
          nivel: b.nivel,
          horarios: [],
          estadoGrupo: 'DISPONIBLE'
        });
      }
      const grp = mapa.get(key)!;
      grp.horarios.push({ hora_inicio: b.hora_inicio, hora_fin: b.hora_fin });
      if (b.estado_bloque === 'RESERVADO') grp.estadoGrupo = 'RESERVADO';
    });
    return Array.from(mapa.values()).sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  }

  private actualizarEventosCalendario() {
    if (!this.calendarioVisible) return;
    const api = this.calendarComponent.getApi();
    api.removeAllEvents();
    this.clasesAgendadas.forEach(b => {
      const iso = b.fecha.toISOString().split('T')[0];
      api.addEvent({
        id: `bloque-${b.bloque_id}`,
        title: '',
        start: `${iso}T${b.hora_inicio}`,
        end: `${iso}T${b.hora_fin}`,
        backgroundColor: b.estado_bloque === 'RESERVADO'
          ? '#d61c1c'
          : 'var(--color-principal)',
        borderColor: b.estado_bloque === 'RESERVADO'
          ? '#d61c1c'
          : 'var(--color-principal)',
        extendedProps: { estado_bloque: b.estado_bloque }
      });
    });
    this.diasSeleccionados.forEach(fecha => {
      api.addEvent({
        id: fecha,
        title: '',
        start: fecha,
        allDay: true,
        backgroundColor: 'var(--color-principal)',
        borderColor: 'var(--color-principal)'
      });
    });
  }

  onDateClick(info: any) {
    const fecha = info.dateStr;
    const hoy = new Date().toISOString().split('T')[0];
    if (fecha < hoy) return;
    const api = this.calendarComponent.getApi();
    if (this.diasSeleccionados.includes(fecha)) {
      this.diasSeleccionados = this.diasSeleccionados.filter(d => d !== fecha);
      api.getEventById(fecha)?.remove();
    } else {
      this.diasSeleccionados.push(fecha);
      api.addEvent({
        id: fecha,
        title: '',
        start: fecha,
        allDay: true,
        backgroundColor: 'var(--color-principal)',
        borderColor: 'var(--color-principal)'
      });
    }
  }

  async abrirModalClase() {
    const modal = await this.modalCtrl.create({
      component: ModalClaseComponent,
      componentProps: { fechas: this.diasSeleccionados }
    });
    modal.onDidDismiss().then(res => {
      if (res.data === 'guardado') {
        this.diasSeleccionados = [];
        this.obtenerBloquesProfesor();
        this.calendarioVisible = false;
      }
    });
    await modal.present();
  }

  onEventClick(info: any) {
    const id = info.event.id;
    if (!id.startsWith('bloque-')) return;
    const bloqueId = +id.replace('bloque-', '');
    if (confirm('¿Eliminar este bloque?')) {
      this.http.delete(`${environment.apiUrl}/clases/bloque/${bloqueId}`)
        .subscribe(() => this.obtenerBloquesProfesor(), e => console.error(e));
    }
  }

  eliminarGrupo(grupo: Grupo) {
    const clave = grupo.fecha.toISOString().split('T')[0];
    const aEliminar = this.clasesAgendadas.filter(b =>
      b.fecha.toISOString().split('T')[0] === clave &&
      b.materia === grupo.materia &&
      b.nivel === grupo.nivel
    );
    let cont = 0;
    aEliminar.forEach(b => {
      this.http.delete(`${environment.apiUrl}/clases/bloque/${b.bloque_id}`)
        .subscribe(() => {
          cont++;
          if (cont === aEliminar.length) this.obtenerBloquesProfesor();
        }, e => console.error(e));
    });
  }
}
