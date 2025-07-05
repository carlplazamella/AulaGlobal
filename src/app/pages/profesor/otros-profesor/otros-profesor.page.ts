import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { cardOutline, logOutOutline } from 'ionicons/icons';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-otros-profesor',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon
  ],
  templateUrl: './otros-profesor.page.html',
  styleUrls: ['./otros-profesor.page.scss'],
})
export class OtrosProfesorPage {
  cardIcon   = cardOutline;
  logoutIcon = logOutOutline;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ cardOutline, logOutOutline });
  }

  logout() {
    this.authService.logout();
  }

  goToMisPagos() {
    // Navega dentro de la pestaña de profesor
    this.router.navigateByUrl('/profesor/mis-pagos');
  }
}
