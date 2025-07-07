import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  home,
  calendar,
  notifications,
  book,
  ellipsisHorizontal,
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs-alumno',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,           // ← IMPORTANTE: para que routerLink funcione
    IonTabs,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
  ],
  templateUrl: './tabs-alumno.component.html',
  styleUrls: ['./tabs-alumno.component.scss'],
})
export class TabsAlumnoComponent {
  constructor() {
    addIcons({ home, calendar, notifications, book, ellipsisHorizontal });
  }
}
