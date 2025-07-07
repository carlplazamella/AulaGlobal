import { Component, ElementRef }    from '@angular/core';
import { IonicModule }  from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notificaciones-profesor',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './notificaciones-profesor.page.html',
  styleUrls: ['./notificaciones-profesor.page.scss']
})
export class NotificacionesProfesorPage {
  constructor(el: ElementRef) {
    el.nativeElement.classList.add('ion-page');
  }
  // Puedes implementar lógica de notificaciones aquí más adelante
}
