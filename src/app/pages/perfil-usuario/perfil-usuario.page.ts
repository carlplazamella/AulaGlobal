import { Component, Input, OnInit } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { UsuarioService, Usuario }   from 'src/app/services/usuario.service';
import {
  ValoracionesService,
  ResultadoValoraciones
} from 'src/app/services/valoraciones.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    IonicModule     
  ],
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss']
})
export class PerfilUsuarioPage implements OnInit {
  @Input() usuarioId!: number;

  usuario?: Usuario;
  formattedRut = '';

  promedio = 0;
  total    = 0;
  comentarios: ResultadoValoraciones['items'] = [];

  constructor(
    private usuarioSvc: UsuarioService,
    private valorSvc:   ValoracionesService,
    private modalCtrl:  ModalController
  ) {}

  ngOnInit() {
    this.usuarioSvc.obtenerUsuario(this.usuarioId).subscribe({
      next: u => {
        this.usuario     = u;
        this.formattedRut = this.formatRut(u.rut, u.dv);
      },
      error: err => console.error('Error al cargar usuario', err)
    });

    this.valorSvc.getValoracionesPorUsuario(this.usuarioId).subscribe({
      next: res => {
        this.promedio    = parseFloat(res.promedio);
        this.total       = res.total;
        this.comentarios = res.items;
      },
      error: err => console.error('Error al cargar valoraciones', err)
    });
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  private formatRut(rut: string|number, dv: string): string {
    const s = rut.toString();
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;
  }

  fullStars(count: number): any[]    { return Array(Math.floor(count)); }
  hasHalfStar(count: number): boolean { return (count - Math.floor(count)) >= 0.5; }
  emptyStars(count: number): any[]   {
    const used = Math.floor(count) + (this.hasHalfStar(count) ? 1 : 0);
    return Array(5 - used);
  }
}
