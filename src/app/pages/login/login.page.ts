// src/app/pages/login/login.page.ts

import { Component } from '@angular/core';
import { Router }    from '@angular/router';
import {
  IonicModule,            // ← importa IonicModule desde @ionic/angular
  LoadingController,
  AlertController,
  NavController
} from '@ionic/angular';   // ← no desde 'standalone'
import { FormsModule }      from '@angular/forms';
import { CommonModule }     from '@angular/common';
import { AuthService }      from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    IonicModule,          // ← NgModule que Ionic expone
    CommonModule,         // ← NgModule de Angular
    FormsModule           // ← NgModule de Angular
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  credentials = { correo: '', password: '' };
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}

  ionViewWillEnter(): void {
    this.credentials = { correo: '', password: '' };
    this.loading = false;
  }

  async login() {
    if (!this.credentials.correo || !this.credentials.password) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Por favor ingresa tu correo y contraseña',
        buttons: ['OK']
      });
      return alert.present();
    }

    this.loading = true;
    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent'
    });
    await loading.present();

    this.authService.login(this.credentials).subscribe({
      next: () => {
        loading.dismiss();
        this.loading = false;
        const perfil = this.authService.userType;
        if (perfil === 'alumno') {
          this.navCtrl.navigateRoot(['/alumno/inicio-alumno']);
        } else {
          this.navCtrl.navigateRoot(['/profesor/inicio-profesor']);
        }
      },
      error: async err => {
        loading.dismiss();
        this.loading = false;
        let msg = 'Error al iniciar sesión';
        if (err.status === 401) msg = 'Correo o contraseña incorrectos';
        else if (err.status === 0) msg = 'No se pudo conectar al servidor';
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: msg,
          buttons: ['OK']
        });
        return alert.present();
      }
    });
  }

  irARegistro() {
    this.navCtrl.navigateRoot(['/registro']);
  }
}
