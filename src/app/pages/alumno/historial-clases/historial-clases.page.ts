// src/app/pages/alumno/historial-clases/historial-clases.page.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';
import { arrowBackOutline, timeOutline } from 'ionicons/icons';
import { ClasesService, Reserva } from 'src/app/services/clases.service';

@Component({
  selector: 'app-historial-clases',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonList,
    IonItem,
    IonLabel
  ],
  templateUrl: './historial-clases.page.html',
  styleUrls: ['./historial-clases.page.scss']
})
export class HistorialClasesPage {
  arrowBackOutline = arrowBackOutline;
  timeOutline     = timeOutline;
  historial: Reserva[] = [];

  constructor(
    private clasesSvc: ClasesService,
    private router:    Router
  ) {}

  ionViewWillEnter(): void {
    const alumnoId = JSON.parse(localStorage.getItem('usuario') || '{}').id;
    this.clasesSvc.obtenerHistorialAlumno(alumnoId).subscribe({
      next: h => this.historial = h,
      error: err => console.error('Error al cargar historial alumno:', err)
    });
  }

  volver() {
    this.router.navigateByUrl('/alumno/inicio-alumno');
  }
}
