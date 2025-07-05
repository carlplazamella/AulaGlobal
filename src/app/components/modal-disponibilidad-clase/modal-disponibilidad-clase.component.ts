import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { ClasesService } from 'src/app/services/clases.service';

@Component({
  selector: 'app-modal-disponibilidad-clase',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './modal-disponibilidad-clase.component.html',
  styleUrls: ['./modal-disponibilidad-clase.component.scss']
})
export class ModalDisponibilidadClaseComponent implements OnInit {
  private clasesService = inject(ClasesService);
  private modalCtrl = inject(ModalController);

  @Input() profesorId!: number;
  @Input() materia!: string;

  disponibilidad: any[] = [];

  ngOnInit() {
    this.obtenerDisponibilidad();
  }

  obtenerDisponibilidad() {
    this.clasesService.obtenerClasesDisponiblesPorProfesorYMateria(this.profesorId, this.materia)
      .subscribe({
        next: (data) => {
          this.disponibilidad = data;
        },
        error: (err) => {
          console.error('Error al cargar disponibilidad:', err);
        }
      });
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }
}
