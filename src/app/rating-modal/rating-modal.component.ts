import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-rating-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './rating-modal.component.html',
  styleUrls: ['./rating-modal.component.scss']
})
export class RatingModalComponent {
  estrellas = 0;
  comentario = '';

  constructor(private modalCtrl: ModalController) {}

  seleccionarEstrella(n: number) {
    this.estrellas = n;
  }

  async enviar() {
    if (this.estrellas < 1) return;
    await this.modalCtrl.dismiss({
      submitted: true,
      estrellas: this.estrellas,
      comentario: this.comentario
    });
  }
}
