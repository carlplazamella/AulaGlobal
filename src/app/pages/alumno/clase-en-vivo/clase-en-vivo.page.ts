// src/app/pages/alumno/clase-en-vivo/clase-en-vivo.page.ts

import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  HostListener,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';

import { ModalCalificacionComponent } from '../../../components/modal-calificacion/modal-calificacion.component';

declare global {
  interface Window { JitsiMeetExternalAPI: any; }
}

@Component({
  selector: 'app-clase-en-vivo',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    ModalCalificacionComponent
  ],
  templateUrl: './clase-en-vivo.page.html',
  styleUrls: ['./clase-en-vivo.page.scss']
})
export class ClaseEnVivoPage implements OnInit, AfterViewInit, OnDestroy {

  // **Restauramos esta propiedad para ngComponentOutlet**
  public modalCalificacionComponent = ModalCalificacionComponent;

  private api!: any;
  public roomName!: string;
  public displayName = 'Usuario';
  private hasJoined = false;

  public reservaId!: number;
  public evaluadoId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    this.roomName  = this.route.snapshot.paramMap.get('roomName')!;
    this.reservaId = +this.route.snapshot.paramMap.get('reservaId')!;
    this.evaluadoId = +this.route.snapshot.paramMap.get('alumnoId')!;

    try {
      const u = JSON.parse(localStorage.getItem('usuario') || '{}');
      if (u.nombre && u.apellido) {
        this.displayName = `${u.nombre} ${u.apellido}`;
      }
    } catch {}
  }

  private loadJitsiScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).JitsiMeetExternalAPI) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.id = 'jitsi-script';
      script.src = 'https://meet.jit.si/external_api.js';
      script.onload = () => resolve();
      script.onerror = () => reject('Error al cargar Jitsi API');
      document.body.appendChild(script);
    });
  }

  async ngAfterViewInit(): Promise<void> {
    try {
      await this.loadJitsiScript();
    } catch (err) {
      console.error(err);
      this.salirDeJitsi();
      return;
    }
    if (!(window as any).JitsiMeetExternalAPI) {
      console.error('Jitsi API no disponible');
      this.salirDeJitsi();
      return;
    }
    this.iniciarJitsi();
  }

  private iniciarJitsi(): void {
    const container = document.getElementById('jitsi-container');
    if (!container) {
      console.error('Contenedor Jitsi no encontrado');
      this.salirDeJitsi();
      return;
    }

    const options = {
      roomName: this.roomName,
      parentNode: container,
      width: '100%',
      height: '100%',
      userInfo: { displayName: this.displayName },
      configOverwrite: {
        prejoinPageEnabled: true,
        enableLobby: false,
        disableDeepLinking: true,
        startWithAudioMuted: false,
        startWithVideoMuted: false
      },
      interfaceConfigOverwrite: {
        SHOW_PROMOTIONAL_CLOSE_PAGE: false,
        HIDE_INVITE_MORE_HEADER: true,
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'chat', 'tileview', 'raisehand', 'hangup'
        ]
      }
    };

    try {
      this.api = new window.JitsiMeetExternalAPI('meet.jit.si', options);
    } catch (err) {
      console.error('Error inicializando Jitsi:', err);
      this.salirDeJitsi();
      return;
    }

    this.api.addEventListener('videoConferenceJoined', () => {
      this.hasJoined = true;
      this.api.executeCommand('displayName', this.displayName);
    });

    const cerrar = () => {
      if (this.hasJoined) {
        this.ngZone.run(() => this.salirDeJitsi());
      }
    };
    this.api.addEventListener('videoConferenceLeft', cerrar);
    this.api.addEventListener('readyToClose',    cerrar);
    this.api.addEventListener('error', (e: any) =>
      console.error('Jitsi Error:', e)
    );
  }

  @HostListener('window:resize')
  onResize(): void {
    this.api?.resize?.();
  }

  public async salirDeJitsi(): Promise<void> {
    if (this.api) {
      this.api.dispose();
      this.api = null!;
    }

    const modal = await this.modalCtrl.create({
      component: this.modalCalificacionComponent,
      componentProps: {
        reservaId:  this.reservaId,
        evaluadoId: this.evaluadoId
      }
    });
    await modal.present();
  }

  ngOnDestroy(): void {
    if (this.api) {
      this.api.dispose();
      this.api = null!;
    }
  }
}
