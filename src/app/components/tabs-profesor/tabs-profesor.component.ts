// src/app/components/tabs-profesor/tabs-profesor.component.ts

import { Component }      from '@angular/core';
import { CommonModule }   from '@angular/common';
import { RouterModule }   from '@angular/router';
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  home,
  calendar,
  notifications,
  book
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs-profesor',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonTabs,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel
  ],
  templateUrl: './tabs-profesor.component.html',
  styleUrls: ['./tabs-profesor.component.scss']
})
export class TabsProfesorComponent {
  constructor() {
    addIcons({ home, calendar, notifications, book });
  }
}
