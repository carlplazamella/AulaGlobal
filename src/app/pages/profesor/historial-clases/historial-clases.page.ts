// src/app/pages/profesor/historial-clases/historial-clases.page.ts

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
  // Iconos para la plantilla
  arrowBackOutline = arrowBackOutline;
  timeOutline     = timeOutline;

  historial: Reserva[] = [];

  constructor(
    private clasesSvc: ClasesService,
    private router:    Router
  ) {}

  ionViewWillEnter(): void {
    const profId = JSON.parse(localStorage.getItem('usuario') || '{}').id;
    this.clasesSvc.obtenerHistorialProfesor(profId).subscribe({
      next: h => this.historial = h,
      error: err => console.error('Error al cargar historial:', err)
    });
  }

  volver() {
    this.router.navigateByUrl('/profesor/inicio-profesor');
  }
}
