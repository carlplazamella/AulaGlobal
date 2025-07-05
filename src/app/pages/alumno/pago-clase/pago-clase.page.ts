// src/app/pages/alumno/pago-clase/pago-clase.page.ts
import { Component, OnInit }                     from '@angular/core';
import { ActivatedRoute, Router }                from '@angular/router';
import { CommonModule }                          from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { addIcons }                              from 'ionicons';
import { checkmarkCircleOutline }                from 'ionicons/icons';
import { ClasesService }                         from 'src/app/services/clases.service';
import { AuthService }                           from 'src/app/services/auth.service';

addIcons({ checkmarkCircleOutline });

@Component({
  selector: 'app-pago-clase',
  standalone: true,
  imports: [ CommonModule, IonicModule ],
  templateUrl: './pago-clase.page.html',
  styleUrls: ['./pago-clase.page.scss']
})
export class PagoClasePage implements OnInit {
  reservaId!: number;
  clase: any = null;
  mensajePago = '';

  constructor(
    private route: ActivatedRoute,
    private clasesService: ClasesService,
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {
    if (!this.authService.estaAutenticado()) {
      this.router.navigate(['/login']);
      return;
    }
    this.reservaId = +this.route.snapshot.paramMap.get('reservaId')!;
    this.clasesService.obtenerReservaPorId(this.reservaId).subscribe({
      next: res => this.clase = res,
      error: () => this.mostrarToast('Error al cargar datos de la reserva')
    });
  }

  pagar() {
    this.clasesService.simularPago(this.reservaId).subscribe({
      next: async () => {
        this.mensajePago = '✅ ¡Pago realizado con éxito!';
        await this.mostrarToast(this.mensajePago);
        this.router.navigate(['/alumno/clases-alumno']);
      },
      error: async () => {
        await this.mostrarToast('Error al realizar el pago');
      }
    });
  }

  cancelar() {
    this.confirmarCancelacion();
  }

  volver() {
    this.router.navigate(['/alumno/agenda-alumno']);
  }

  private async confirmarCancelacion() {
    const alert = await this.alertCtrl.create({
      header: 'Cancelar reserva',
      message: '¿Deseas cancelar esta reserva?',
      buttons: [
        { text: 'No', role: 'cancel' },
        { text: 'Sí', handler: () => this.procesarCancelacion() }
      ]
    });
    await alert.present();
  }

  private procesarCancelacion() {
    this.clasesService.cancelarReserva(this.reservaId).subscribe({
      next: async () => {
        await this.mostrarToast('Reserva cancelada correctamente');
        this.router.navigate(['/alumno/agenda-alumno']);
      },
      error: async () => {
        await this.mostrarToast('Error al cancelar la reserva');
      }
    });
  }

  private async mostrarToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}
