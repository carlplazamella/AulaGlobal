import { Component } from '@angular/core';
import {
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { AuthService } from '../../../services/auth.service';
import { addIcons } from 'ionicons';
import { logOut } from 'ionicons/icons';

@Component({
  selector: 'app-otros-alumno',
  templateUrl: './otros-alumno.page.html',
  styleUrls: ['./otros-alumno.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonIcon
  ]
})
export class OtrosAlumnoPage {
  constructor(private authService: AuthService) {
    addIcons({ logOut });
  }

  logout() {
    this.authService.logout();
  }
}
