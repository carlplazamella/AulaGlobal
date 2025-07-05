import { Component, Input, OnInit } from '@angular/core';
import {
  IonicModule,
  ModalController,
  ToastController
} from '@ionic/angular';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  star,
  checkmarkDoneOutline
} from 'ionicons/icons';

import {
  ValoracionesService,
  Valoracion
} from '../../services/valoraciones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-calificacion',
  standalone: true,
  imports: [
    IonicModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './modal-calificacion.component.html',
  styleUrls: ['./modal-calificacion.component.scss']
})
export class ModalCalificacionComponent implements OnInit {
  @Input() reservaId!: number;
  @Input() evaluadoId!: number;

  ratingForm!: FormGroup;

  starIcon  = star;
  checkIcon = checkmarkDoneOutline;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private valorSvc: ValoracionesService,
    private router: Router
  ) {
    addIcons({ star, checkmarkDoneOutline });
  }

  ngOnInit() {
    this.ratingForm = this.fb.group({
      estrellas:  [5, [Validators.required]],
      comentario: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  async enviar() {
    if (this.ratingForm.invalid) {
      this.ratingForm.markAllAsTouched();
      return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const payload: Valoracion = {
      reservaId:   this.reservaId,
      evaluadorId: usuario.id,
      evaluadoId:  this.evaluadoId,
      estrellas:   this.ratingForm.value.estrellas,
      comentario:  this.ratingForm.value.comentario.trim()
    };

    this.valorSvc.postValoracion(payload).subscribe({
      next: async () => {
        (await this.toastCtrl.create({
          message: '¡Gracias por tu comentario!',
          duration: 2000
        })).present();

        await this.modalCtrl.dismiss();

        const inicio = usuario.perfil === 'ALUMNO'
          ? '/alumno/inicio-alumno'
          : '/profesor/inicio-profesor';
        this.router.navigateByUrl(inicio);
      },
      error: err => {
        console.error('Error al enviar calificación', err);
      }
    });
  }
}
