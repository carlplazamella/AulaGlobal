import { Component, OnInit, ElementRef } from '@angular/core';
import { CommonModule }           from '@angular/common';
import { NgIf, NgForOf }          from '@angular/common';
import { Router }                 from '@angular/router';
import {
  IonicModule,
  ModalController,
  ViewWillEnter
} from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent
} from '@ionic/angular/standalone';

import { ClasesService, Reserva } from 'src/app/services/clases.service';
import { AuthService }            from 'src/app/services/auth.service';
import { PerfilUsuarioPage }      from 'src/app/pages/perfil-usuario/perfil-usuario.page';

@Component({
  selector: 'app-clases-profesor',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgForOf,
    IonicModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSpinner,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    PerfilUsuarioPage
  ],
  templateUrl: './clases-profesor.page.html',
  styleUrls: ['./clases-profesor.page.scss']
})
export class ClasesProfesorPage implements OnInit, ViewWillEnter {
  reservas: Reserva[] = [];
  cargando = false;
  profesorId!: number;

  constructor(
    private clasesService: ClasesService,
    private authService:   AuthService,
    private router:        Router,
    private modalCtrl:     ModalController,
    el: ElementRef
  ) {
    // ← ¡Agrega la clase ion-page!
    el.nativeElement.classList.add('ion-page');
  }

  ngOnInit(): void {
    const id = this.authService.obtenerIdUsuario();
    if (id == null) {
      console.error('Profesor no autenticado');
      return;
    }
    this.profesorId = id;
    this.cargarReservas();
  }

  ionViewWillEnter(): void {
    this.cargarReservas();
  }

  private cargarReservas(): void {
    this.cargando = true;
    this.clasesService.obtenerReservasProfesor(this.profesorId).subscribe({
      next: datos => {
        const ahora = Date.now();
        this.reservas = datos
          .filter(r => {
            const ts = new Date(`${r.fechaBloque}T${r.horaInicio}`).getTime();
            return ts > ahora;
          })
          .sort((a, b) => {
            const t1 = new Date(`${a.fechaBloque}T${a.horaInicio}`).getTime();
            const t2 = new Date(`${b.fechaBloque}T${b.horaInicio}`).getTime();
            return t1 - t2;
          });
        this.cargando = false;
      },
      error: err => {
        console.error('Error al cargar reservas del profesor', err);
        this.cargando = false;
      }
    });
  }

  async verPerfilAlumno(alumnoId?: number) {
    if (!alumnoId) return;
    const modal = await this.modalCtrl.create({
      component: PerfilUsuarioPage,
      componentProps: { usuarioId: alumnoId }
    });
    await modal.present();
  }

  iniciarClase(reserva: Reserva): void {
    const displayName =
      `Clase-${reserva.materia}-${reserva.dificultad}-${reserva.fechaBloque}-${reserva.horaInicio}`;
    const sanitized = displayName
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Za-z0-9-]/g, '_')
      .toLowerCase();
    const roomName = encodeURIComponent(sanitized);
    this.router.navigateByUrl(
      `/profesor/clase-en-vivo/${roomName}/${reserva.id}/${reserva.alumnoId}`
    );
  }
}
