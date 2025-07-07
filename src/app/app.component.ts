// src/app/app.component.ts

import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ModalClaseComponent } from './components/modal-clase/modal-clase.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    // Componente raíz de Ionic
    IonApp,
    // Outlet para renderizar tus rutas (login, registro, tabs, etc.)
    IonRouterOutlet,
    // Tu modal, para que Angular compile sus listeners antes de abrirlo
    ModalClaseComponent
  ],
  template: `
    <ion-app>
      <ion-router-outlet/>
    </ion-app>
  `
})
export class AppComponent {}
