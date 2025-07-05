// src/app/pages/registro/registro.page.ts

import { Component } from '@angular/core';
import { Router }    from '@angular/router';
import {
  IonicModule,
  LoadingController,
  AlertController
} from '@ionic/angular';
import { FormsModule }  from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, RegisterData } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss']
})
export class RegistroPage {
  usuario: RegisterData = {
    nombre:      '',
    apellido:    '',
    correo:      '',
    password:    '',
    rut:         '',
    dv:          '',
    tipoUsuario: 'alumno'
  };
  confirmarPassword = '';
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ionViewWillEnter() {
    this.usuario = {
      nombre:      '',
      apellido:    '',
      correo:      '',
      password:    '',
      rut:         '',
      dv:          '',
      tipoUsuario: 'alumno'
    };
    this.confirmarPassword = '';
    this.errorMessage      = '';
    this.loading           = false;
  }

  volver() {
    this.router.navigateByUrl('/login');
  }

  formatearRut() {
    this.usuario.rut = this.usuario.rut.replace(/[^0-9kK]/g, '');
  }

  validarRut(): boolean {
    const rutValido = /^[0-9]+$/.test(this.usuario.rut);
    const dvValido  = /^[0-9Kk]$/.test(this.usuario.dv);
    return rutValido && dvValido;
  }

  async registrar() {
    this.errorMessage = '';

    if (!this.validarRut()) {
      this.errorMessage = 'Por favor ingresa un RUT válido';
      return;
    }
    if (this.usuario.password !== this.confirmarPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.loading = true;
    const loading = await this.loadingCtrl.create({
      message: 'Registrando...',
      spinner: 'crescent'
    });
    await loading.present();

    this.authService.register(this.usuario).subscribe({
      next: async () => {
        await loading.dismiss();
        await this.alertCtrl.create({
          header: 'Registro exitoso',
          message: 'Tu cuenta ha sido creada correctamente',
          buttons: ['OK']
        }).then(a => a.present());
        this.router.navigateByUrl('/login');
      },
      error: async err => {
        await loading.dismiss();
        this.loading = false;
        if (err.status === 409) {
          this.errorMessage = err.error?.mensaje || 'Ya existe ese dato';
        } else if (err.status === 0) {
          this.errorMessage = 'No se pudo conectar al servidor';
        } else {
          this.errorMessage = 'Error al registrar. Intenta nuevamente.';
        }
      }
    });
  }
}
