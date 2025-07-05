// src/app/pages/alumno/clases-alumno/clases-alumno.page.ts

import { Component, OnInit }      from '@angular/core';
import { CommonModule }            from '@angular/common';
import {
  IonContent,
  IonSpinner,
  IonButton,
  IonIcon,           
  ModalController
} from '@ionic/angular/standalone';
import type { ViewWillEnter }      from '@ionic/angular';
import { Router }                  from '@angular/router';

import { ClasesService, Reserva }  from 'src/app/services/clases.service';
import { AuthService }             from 'src/app/services/auth.service';
import { PerfilUsuarioPage }       from '../../perfil-usuario/perfil-usuario.page';

@Component({
  selector: 'app-clases-alumno',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonSpinner,
    IonButton,
    IonIcon,           
    PerfilUsuarioPage
  ],
  templateUrl: './clases-alumno.page.html',
  styleUrls: ['./clases-alumno.page.scss']
})
export class ClasesAlumnoPage implements OnInit, ViewWillEnter {
  reservas: Reserva[] = [];
  cargando = false;
  alumnoId!: number;

  constructor(
    private clasesService: ClasesService,
    private authService:   AuthService,
    private router:        Router,
    private modalCtrl:     ModalController
  ) {}

  ngOnInit(): void {
    const id = this.authService.obtenerIdUsuario();
    if (id == null) {
      console.error('Usuario no autenticado');
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }
    this.alumnoId = id;
    this.cargarReservas();
  }

  ionViewWillEnter(): void {
    this.cargarReservas();
  }

  private cargarReservas(): void {
    this.cargando = true;
    this.clasesService.obtenerReservasAlumno(this.alumnoId).subscribe({
      next: (datos: Reserva[]) => {
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
        console.error('Error al cargar reservas', err);
        this.cargando = false;
      }
    });
  }

  iniciarClase(reserva: Reserva): void {
    const displayName = `Clase-${reserva.materia}-${reserva.dificultad}-${reserva.fechaBloque}-${reserva.horaInicio}`;
    const sanitized = displayName
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Za-z0-9-]/g, '_')
      .toLowerCase();
    const roomName = encodeURIComponent(sanitized);

    this.router.navigateByUrl(
      `/alumno/clase-en-vivo/${roomName}/${reserva.id}/${reserva.profesorId}`
    );
  }

  async verPerfilUsuario(usuarioId: number) {
    const modal = await this.modalCtrl.create({
      component:     PerfilUsuarioPage,
      componentProps:{ usuarioId }
    });
    await modal.present();
  }
}
