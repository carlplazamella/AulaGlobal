import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {
  FullCalendarModule,
  FullCalendarComponent
} from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { environment } from 'src/environments/environment';
import { ModalClaseComponent } from 'src/app/components/modal-clase/modal-clase.component';
import { AuthService } from 'src/app/services/auth.service';

import { IonicModule } from '@ionic/angular';
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
    IonicModule,
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
export class AgendaProfesorPage implements OnInit {
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
    timeZone: 'local',
    height: 'auto',
    eventDisplay: 'list-item',
    dateClick: this.onDateClick.bind(this),
    eventClick: this.onEventClick.bind(this),
    validRange: { start: new Date().toISOString().split('T')[0] },
    events: []
  };

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    el: ElementRef
  ) {
    addIcons({
      bookOutline,
      calendarOutline,
      timeOutline,
      alertCircleOutline
    });
    // ← ¡Agrega la clase ion-page!
    el.nativeElement.classList.add('ion-page');
  }

  ngOnInit() {
    this.obtenerBloquesProfesor();
  }

  mostrarCalendario() {
    this.calendarioVisible = true;
    setTimeout(() => this.actualizarEventosCalendario(), 100);
  }

  private obtenerBloquesProfesor() {
    const profId = this.authService.obtenerIdUsuario();
    if (!profId) return;

    this.http
      .get<Bloque[]>(`${environment.apiUrl}/clases/bloques/${profId}`)
      .subscribe({
        next: raw => {
          let bloques = raw.map(b => ({
            bloque_id: b.bloque_id,
            fecha: new Date(b.fecha),
            hora_inicio: b.hora_inicio,
            hora_fin: b.hora_fin,
            estado_bloque: b.estado_bloque,
            materia: b.materia,
            nivel: b.nivel
          }));

          bloques = bloques.filter(
            (b, i, a) => a.findIndex(x => x.bloque_id === b.bloque_id) === i
          );

          const ahora = new Date();
          this.clasesAgendadas = bloques.filter(b => {
            const fin = new Date(b.fecha);
            const [h, m] = b.hora_fin.split(':').map(x => +x);
            fin.setHours(h, m, 0, 0);
            return fin >= ahora;
          });

          this.groupedClases = this.agruparPorFechaMateriaNivel(
            this.clasesAgendadas
          );

          if (this.calendarioVisible) {
            setTimeout(() => this.actualizarEventosCalendario(), 100);
          }
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
    return Array.from(mapa.values()).sort(
      (a, b) => a.fecha.getTime() - b.fecha.getTime()
    );
  }

  private actualizarEventosCalendario() {
    if (!this.calendarioVisible) return;

    const events: EventInput[] = [];
    const vistos = new Set<string>();

    this.clasesAgendadas.forEach(b => {
      const iso = b.fecha.toISOString().split('T')[0];
      if (!vistos.has(iso)) {
        vistos.add(iso);
        events.push({
          id: iso,
          title: '',
          start: b.fecha,
          allDay: true
        });
      }
    });

    const api = this.calendarComponent.getApi();
    api.removeAllEvents();
    api.addEventSource(events);
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
        start: new Date(
          +fecha.split('-')[0],
          +fecha.split('-')[1] - 1,
          +fecha.split('-')[2]
        ),
        allDay: true
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
      this.http
        .delete(`${environment.apiUrl}/clases/bloque/${bloqueId}`)
        .subscribe(
          () => this.obtenerBloquesProfesor(),
          e => console.error(e)
        );
    }
  }

  eliminarGrupo(grupo: Grupo) {
    const clave = grupo.fecha.toISOString().split('T')[0];
    const aEliminar = this.clasesAgendadas.filter(
      b =>
        b.fecha.toISOString().split('T')[0] === clave &&
        b.materia === grupo.materia &&
        b.nivel === grupo.nivel
    );
    let cont = 0;
    aEliminar.forEach(b => {
      this.http
        .delete(`${environment.apiUrl}/clases/bloque/${b.bloque_id}`)
        .subscribe(
          () => {
            cont++;
            if (cont === aEliminar.length) this.obtenerBloquesProfesor();
          },
          e => console.error(e)
        );
    });
  }
}
