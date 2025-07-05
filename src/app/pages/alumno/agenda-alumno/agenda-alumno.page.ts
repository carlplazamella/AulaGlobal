// src/app/pages/alumno/agenda-alumno/agenda-alumno.page.ts

import { Component, OnInit }                from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { FormsModule }                      from '@angular/forms';
import {
  IonContent,
  IonSearchbar,
  IonButton,
  IonIcon,
  ModalController
} from '@ionic/angular/standalone';
import { Router }                           from '@angular/router';

import { ClasesService }                    from 'src/app/services/clases.service';
import { AuthService }                      from 'src/app/services/auth.service';
import { ReservaClaseComponent }            from 'src/app/components/reserva-clase/reserva-clase.component';
import { PerfilUsuarioPage }                from 'src/app/pages/perfil-usuario/perfil-usuario.page';

interface GrupoClase {
  materia:           string;
  nivel:             string;
  profesor:          string;
  precio_hora:       number;
  profesor_id:       number;
  // Ahora apuntamos a profesor_id:
  profesorUsuarioId: number;
  bloques:           any[];
}

@Component({
  selector: 'app-agenda-alumno',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonSearchbar,
    IonButton,
    IonIcon,
    ReservaClaseComponent,
    PerfilUsuarioPage
  ],
  templateUrl: './agenda-alumno.page.html',
  styleUrls: ['./agenda-alumno.page.scss']
})
export class AgendaAlumnoPage implements OnInit {
  hoyISO = new Date().toISOString().split('T')[0];

  clases: any[]                 = [];
  clasesAgrupadas: GrupoClase[] = [];
  clasesFiltradas: GrupoClase[] = [];

  constructor(
    private clasesService: ClasesService,
    private authService:   AuthService,
    private modalCtrl:     ModalController,
    private router:        Router
  ) {}

  ngOnInit() {
    this.cargarClases();
  }

  private cargarClases() {
    this.clasesService.obtenerClasesDisponibles().subscribe({
      next: clases => {
        const futuras = clases.filter((c: any) =>
          c.fecha.split('T')[0] >= this.hoyISO
        );
        this.clases = futuras;
        this.agruparClases();
      },
      error: err => console.error('Error al cargar clases disponibles:', err)
    });
  }

  private agruparClases() {
    const mapa = new Map<string, any[]>();
    for (const clase of this.clases) {
      const clave = `${clase.materia}-${clase.nivel}-${clase.profesor}`;
      if (!mapa.has(clave)) mapa.set(clave, []);
      mapa.get(clave)!.push(clase);
    }
    this.clasesAgrupadas = Array
      .from(mapa.entries())
      .map(([_, bloques]) => {
        const b = bloques[0];
        return {
          materia:           b.materia,
          nivel:             b.nivel,
          profesor:          b.profesor,
          precio_hora:       b.precio_hora,
          profesor_id:       b.profesor_id,
          // ← aquí estaba el bug:
          profesorUsuarioId: b.profesor_id,
          bloques
        } as GrupoClase;
      });
    this.clasesFiltradas = [...this.clasesAgrupadas];
  }

  filtrarClases(event: any) {
    const term = (event.detail.value || '').toLowerCase();
    this.clasesFiltradas = this.clasesAgrupadas.filter(g =>
      g.materia.toLowerCase().includes(term) ||
      g.profesor.toLowerCase().includes(term)
    );
  }

  /** Abre modal de perfil */
  async verPerfilProfesor(usuarioId: number) {
    const modal = await this.modalCtrl.create({
      component:      PerfilUsuarioPage,
      componentProps: { usuarioId }
    });
    await modal.present();
  }

  /** Lógica de reserva inalterada */
  async abrirModalReserva(grupo: GrupoClase) {
    const activo = document.activeElement as HTMLElement;
    if (activo?.blur) activo.blur();

    const modal = await this.modalCtrl.create({
      component: ReservaClaseComponent,
      componentProps: {
        profesorId: grupo.profesor_id,
        materia:    grupo.materia
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (!data) return;

    const alumnoId = this.authService.obtenerIdUsuario();
    if (!alumnoId) {
      alert('Debes iniciar sesión como alumno.');
      return;
    }

    const bloque = grupo.bloques.find((b: any) => {
      const sel = new Date(`${data.fecha}T${data.hora_inicio}`).getTime();
      return new Date(`${b.fecha}T${b.hora_inicio}`).getTime() === sel;
    });
    if (!bloque) {
      alert('No se encontró el bloque seleccionado.');
      return;
    }

    const inicio  = new Date(`${data.fecha}T${data.hora_inicio}`).getTime();
    const fin     = new Date(`${data.fecha}T${data.hora_fin}`).getTime();
    const diffMin = (fin - inicio) / 60000;
    if (diffMin !== 105) {
      alert('La reserva debe durar 1 hora y 45 minutos.');
      return;
    }

    this.clasesService
      .reservarClase(alumnoId, bloque.bloque_id)
      .subscribe({
        next: async () => {
          await this.modalCtrl.dismiss();
          this.router.navigate(['/alumno/clases-alumno']);
        },
        error: err => {
          console.error('Error al reservar clase:', err);
          alert('Error al reservar clase');
        }
      });
  }
}
