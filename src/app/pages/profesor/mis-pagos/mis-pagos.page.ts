import { Component, OnInit } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { FormsModule }     from '@angular/forms';
import {
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonButton,
  AlertController
} from '@ionic/angular/standalone';
import { forkJoin }        from 'rxjs';
import { map }             from 'rxjs/operators';
import { PagoService, Pago }     from 'src/app/services/pago.service';
import { RetiroService, Retiro } from 'src/app/services/retiro.service';
import { AuthService }           from 'src/app/services/auth.service';

@Component({
  selector: 'app-mis-pagos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonButton
  ],
  templateUrl: './mis-pagos.page.html',
  styleUrls: ['./mis-pagos.page.scss'],
})
export class MisPagosPage implements OnInit {
  tab: 'pagos' | 'retiros' = 'pagos';

  pagos: Pago[]     = [];
  retiros: Retiro[] = [];

  pageSize = 10;
  pagePagos = 0;
  pageRetiros = 0;

  balance = 0;

  private profesorId!: number;

  constructor(
    private pagoSvc: PagoService,
    private retiroSvc: RetiroService,
    private authSvc: AuthService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.profesorId = this.authSvc.obtenerIdUsuario()!;
    this.loadData();
  }

  private loadData() {
    forkJoin({
      pagos: this.pagoSvc.getPagosProfesor(this.profesorId).pipe(
        map(raw => raw.map(p => ({ ...p, monto: Number(p.monto) })))
      ),
      retiros: this.retiroSvc.getRetirosProfesor(this.profesorId).pipe(
        map(raw => raw.map(r => ({ ...r, monto: Number(r.monto) })))
      )
    }).subscribe({
      next: ({ pagos, retiros }) => {
        this.pagos   = pagos;
        this.retiros = retiros;
        this.recalcBalance();
      },
      error: err => console.error('Error cargando datos:', err)
    });
  }

  private recalcBalance() {
    const totalPagos   = this.pagos.reduce((sum, p) => sum + p.monto, 0);
    const totalRetiros = this.retiros.reduce((sum, r) => sum + r.monto, 0);
    this.balance = Math.max(0, totalPagos - totalRetiros);
  }

  get currentPagos() {
    const start = this.pagePagos * this.pageSize;
    return this.pagos.slice(start, start + this.pageSize);
  }
  get currentRetiros() {
    const start = this.pageRetiros * this.pageSize;
    return this.retiros.slice(start, start + this.pageSize);
  }

  get hasMorePagos() {
    return (this.pagePagos + 1) * this.pageSize < this.pagos.length;
  }
  get hasMoreRetiros() {
    return (this.pageRetiros + 1) * this.pageSize < this.retiros.length;
  }

  prevPage(list: 'pagos'|'retiros') {
    if (list === 'pagos' && this.pagePagos > 0) {
      this.pagePagos--;
    }
    if (list === 'retiros' && this.pageRetiros > 0) {
      this.pageRetiros--;
    }
  }

  nextPage(list: 'pagos'|'retiros') {
    if (list === 'pagos' && this.hasMorePagos) {
      this.pagePagos++;
    }
    if (list === 'retiros' && this.hasMoreRetiros) {
      this.pageRetiros++;
    }
  }

  async solicitarRetiro() {
    const alert = await this.alertCtrl.create({
      header: 'Solicitar Retiro',
      inputs: [
        { name: 'monto', type: 'number', placeholder: 'Ingresa el monto' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: async data => {
            const monto = Number(data.monto);
            if (isNaN(monto) || monto <= 0) {
              (await this.alertCtrl.create({
                header: 'Error',
                message: 'Ingresa un monto válido.',
                buttons: ['OK']
              })).present();
              return;
            }
            if (monto > this.balance) {
              (await this.alertCtrl.create({
                header: 'Saldo insuficiente',
                message: `Tu saldo disponible es $${this.balance.toLocaleString()}.`,
                buttons: ['OK']
              })).present();
              return;
            }
            this.retiroSvc.solicitarRetiro(this.profesorId, monto).subscribe({
              next: nuevo => {
                this.retiros.unshift({ ...nuevo, monto: Number(nuevo.monto) });
                this.recalcBalance();
                this.showConfirm();
              },
              error: err => {
                console.error('Error solicitando retiro:', err);
                if (err.status === 400 && err.error?.mensaje) {
                  this.alertCtrl.create({
                    header: 'Error',
                    message: err.error.mensaje,
                    buttons: ['OK']
                  }).then(a => a.present());
                }
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  private async showConfirm() {
    const confirm = await this.alertCtrl.create({
      header: '¡Listo!',
      message: 'Tu dinero se ha enviado a tu cuenta.',
      buttons: ['Aceptar']
    });
    await confirm.present();
  }
}
