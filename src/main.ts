import { bootstrapApplication } from '@angular/platform-browser';
import { LOCALE_ID }            from '@angular/core';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules
} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs);

// Web components de Ionicons
import { defineCustomElements as ionIconDefine } from 'ionicons/dist/loader';
// Web components de @ionic/pwa-elements
import { defineCustomElements as pwaDefine }     from '@ionic/pwa-elements/loader';
// Web components de Ionic Core
import { defineCustomElements as ionicCoreDefine } from '@ionic/core/loader';

// Registro de iconos
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  timeOutline,
  alertCircleOutline,
  bookOutline,
  walletOutline,
  personOutline,
  personCircleOutline,
  closeCircleOutline,
  returnDownBackOutline,
  star,
  starOutline,
  starHalf,
  createOutline,
  barChartOutline,
  ribbonOutline,
  logOutOutline,
  cashOutline,
} from 'ionicons/icons';

import { routes }        from './app/app.routes';
import { AppComponent }  from './app/app.component';
import { authInterceptor } from './app/services/auth.interceptor';

// Inicializa TODOS los web components
ionIconDefine(window);
pwaDefine(window);
ionicCoreDefine(window);

addIcons({
  'calendar-outline':         calendarOutline,
  'time-outline':             timeOutline,
  'alert-circle-outline':     alertCircleOutline,
  'book-outline':             bookOutline,
  'wallet-outline':           walletOutline,
  'person-outline':           personOutline,
  'person-circle-outline':    personCircleOutline,
  'close-circle-outline':     closeCircleOutline,
  'return-down-back-outline': returnDownBackOutline,
  'star':                     star,
  'star-outline':             starOutline,
  'star-half-outline':        starHalf,
  'create-outline':           createOutline,
  'bar-chart-outline':        barChartOutline,
  'ribbon-outline':           ribbonOutline,
  'log-out-outline':          logOutOutline,
  'cash-outline':             cashOutline,
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({}),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor]))
  ],
}).catch(err => console.error(err));
