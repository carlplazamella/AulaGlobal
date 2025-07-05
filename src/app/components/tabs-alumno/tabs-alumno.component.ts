import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  home,
  calendar,
  notifications,
  book,
  ellipsisHorizontal
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs-alumno',
  templateUrl: './tabs-alumno.component.html',
  styleUrls: ['./tabs-alumno.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class TabsAlumnoComponent {
  // En el futuro podrías restaurar la lógica de notificaciones

  constructor() {
    addIcons({ home, calendar, notifications, book, ellipsisHorizontal });
  }
}
