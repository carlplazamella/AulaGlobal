import { Component, OnInit } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { Router }             from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { addIcons }           from 'ionicons';
import {
  arrowBackOutline,
  camera,
  star,
  starOutline,
  starHalf,
  personCircleOutline
} from 'ionicons/icons';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonTextarea,
  IonCard
} from '@ionic/angular/standalone';
import { concat, Observable, of } from 'rxjs';
import { last, switchMap, tap }    from 'rxjs/operators';

import { environment }    from 'src/environments/environment';
import { AuthService }    from 'src/app/services/auth.service';
import { UsuarioService, Usuario } from 'src/app/services/usuario.service';
import {
  ValoracionesService,
  ResultadoValoraciones
} from 'src/app/services/valoraciones.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonIcon,
    IonTextarea,
    IonCard
  ],
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss']
})
export class PerfilPage implements OnInit {
  arrowBackOutline = arrowBackOutline;
  camera           = camera;
  star             = star;
  starHalf         = starHalf;
  starOutline      = starOutline;
  personCircle     = personCircleOutline;

  usuarioRealId!: number;

  nombreUsuario = '';
  rut           = '';
  descripcion   = '';               // <-- renombrado
  fotoPerfil    = 'assets/images/default-profile.png';
  perfil        = '';
  editando      = false;

  promedio = 0;
  total    = 0;
  items: ResultadoValoraciones['items'] = [];

  pageSize = 5;
  pageComentarios = 0;

  private fotoCambiada = false;
  private backendBase  = environment.apiUrl.replace(/\/api\/?$/, '');

  constructor(
    private router:         Router,
    private authSvc:        AuthService,
    private usuarioService: UsuarioService,
    private valorSvc:       ValoracionesService
  ) {
    addIcons({
      arrowBackOutline,
      camera,
      star,
      starHalf,
      starOutline,
      personCircleOutline
    });
  }

  ngOnInit() {
    this.usuarioRealId = this.authSvc.usuarioIdReal!;
    if (!this.usuarioRealId) {
      console.error('❌ No hay usuario en sesión');
      this.router.navigate(['/login']);
      return;
    }

    this.usuarioService.obtenerUsuario(this.usuarioRealId)
      .subscribe({
        next: (u: Usuario) => {
          this.nombreUsuario = `${u.nombre} ${u.apellido}`.trim();
          this.rut           = this.formatRut(u.rut, u.dv);
          this.perfil        = u.tipo;
          this.descripcion   = u.descripcion;          // <-- aquí
          this.fotoPerfil    = u.foto_perfil || this.fotoPerfil;
        },
        error: err => console.error('❌ No se pudo cargar el perfil', err)
      });

    this.loadValoraciones();
  }

  private loadValoraciones() {
    this.valorSvc.getValoracionesPorUsuario(this.usuarioRealId)
      .subscribe({
        next: res => {
          this.promedio = parseFloat(res.promedio);
          this.total    = res.total;
          this.items    = res.items;
        },
        error: err => console.error('❌ fallo al cargar valoraciones', err)
      });
  }

  toggleEdicion() {
    this.editando = !this.editando;
    if (!this.editando) {
      let fotoUpload$: Observable<any> = of(null);
      if (this.fotoCambiada && this.fotoPerfil.startsWith('data:')) {
        const blob = this.dataURLtoBlob(this.fotoPerfil);
        const form = new FormData();
        form.append('foto', blob, 'perfil.png');
        fotoUpload$ = this.usuarioService
          .subirFotoPerfil(this.usuarioRealId, form)
          .pipe(tap(res => {
            this.fotoPerfil = `${this.backendBase}${res.url}`;
          }));
      }

      fotoUpload$
        .pipe(
          switchMap(() =>
            this.usuarioService.actualizarPerfil(this.usuarioRealId, {
              descripcion: this.descripcion,      // <-- aquí
              foto_perfil: this.fotoPerfil
            })
          ),
          last(),
          tap(() => {
            console.log('✅ Perfil actualizado');
          })
        )
        .subscribe({
          error: err => console.error('❌ Error al actualizar perfil', err)
        });
    }
  }

  async cambiarFoto() {
    if (!this.editando) return;
    try {
      const image = await Camera.getPhoto({
        quality:      90,
        allowEditing: true,
        resultType:   CameraResultType.DataUrl
      });
      if (image.dataUrl) {
        this.fotoPerfil   = image.dataUrl;
        this.fotoCambiada = true;
      }
    } catch {}
  }

  volver() {
    const ruta = this.perfil === 'PROFESOR'
      ? '/profesor/inicio-profesor'
      : '/alumno/inicio-alumno';
    this.router.navigateByUrl(ruta);
  }

  formatRut(rut: string|number, dv: string): string {
    return rut.toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      + '-' + dv;
  }

  private dataURLtoBlob(dataUrl: string): Blob {
    const [header, base64] = dataUrl.split(',');
    const mime            = header.match(/:(.*?);/)![1];
    const bin             = atob(base64);
    const arr             = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }

  get fullStars(): any[] {
    return Array(Math.floor(this.promedio));
  }
  get hasHalfStar(): boolean {
    return (this.promedio - Math.floor(this.promedio)) >= 0.5;
  }
  get emptyStars(): any[] {
    const used = Math.floor(this.promedio) + (this.hasHalfStar ? 1 : 0);
    return Array(5 - used);
  }
  estrellasArray(count: number): any[] {
    return Array(count);
  }

  // Paginación de comentarios
  get currentComentarios() {
    const start = this.pageComentarios * this.pageSize;
    return this.items.slice(start, start + this.pageSize);
  }
  get hasMoreComentarios() {
    return (this.pageComentarios + 1) * this.pageSize < this.items.length;
  }
  prevPage() {
    if (this.pageComentarios > 0) this.pageComentarios--;
  }
  nextPage() {
    if (this.hasMoreComentarios) this.pageComentarios++;
  }
  trackByIdx(index: number): number {
    return index;
  }
}
