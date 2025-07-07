import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  // raíz
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // autenticación
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro.page').then(m => m.RegistroPage),
  },

  // rutas de alumno
  {
    path: 'alumno',
    loadComponent: () =>
      import('./components/tabs-alumno/tabs-alumno.component').then(
        m => m.TabsAlumnoComponent
      ),
    children: [
      {
        path: 'inicio-alumno',
        loadComponent: () =>
          import('./pages/alumno/inicio-alumno/inicio-alumno.page').then(
            m => m.InicioAlumnoPage
          ),
      },
      {
        path: 'agenda-alumno',
        loadComponent: () =>
          import('./pages/alumno/agenda-alumno/agenda-alumno.page').then(
            m => m.AgendaAlumnoPage
          ),
      },
      {
        path: 'notificaciones-alumno',
        loadComponent: () =>
          import(
            './pages/alumno/notificaciones-alumno/notificaciones-alumno.page'
          ).then(m => m.NotificacionesAlumnoPage),
      },
      {
        path: 'clases-alumno',
        loadComponent: () =>
          import('./pages/alumno/clases-alumno/clases-alumno.page').then(
            m => m.ClasesAlumnoPage
          ),
      },
      {
        path: 'otros-alumno',
        loadComponent: () =>
          import('./pages/alumno/otros-alumno/otros-alumno.page').then(
            m => m.OtrosAlumnoPage
          ),
      },
      {
        path: 'pago-clase/:reservaId',
        loadComponent: () =>
          import('./pages/alumno/pago-clase/pago-clase.page').then(
            m => m.PagoClasePage
          ),
      },
      {
        path: 'clase-en-vivo/:roomName/:reservaId/:alumnoId',
        loadComponent: () =>
          import(
            './pages/alumno/clase-en-vivo/clase-en-vivo.page'
          ).then(m => m.ClaseEnVivoPage),
      },
      // ← Ruta de Historial de Clases (Alumno)
      {
        path: 'historial-clases',
        loadComponent: () =>
          import('./pages/alumno/historial-clases/historial-clases.page').then(
            m => m.HistorialClasesPage
          ),
      },
      { path: '', redirectTo: 'inicio-alumno', pathMatch: 'full' },
    ],
  },

  // rutas de profesor
  {
    path: 'profesor',
    loadComponent: () =>
      import('./components/tabs-profesor/tabs-profesor.component').then(
        m => m.TabsProfesorComponent
      ),
    children: [
      {
        path: 'inicio-profesor',
        loadComponent: () =>
          import('./pages/profesor/inicio-profesor/inicio-profesor.page').then(
            m => m.InicioProfesorPage
          ),
      },
      {
        path: 'agenda-profesor',
        loadComponent: () =>
          import('./pages/profesor/agenda-profesor/agenda-profesor.page').then(
            m => m.AgendaProfesorPage
          ),
      },
      {
        path: 'notificaciones-profesor',
        loadComponent: () =>
          import(
            './pages/profesor/notificaciones-profesor/notificaciones-profesor.page'
          ).then(m => m.NotificacionesProfesorPage),
      },
      {
        path: 'clases-profesor',
        loadComponent: () =>
          import('./pages/profesor/clases-profesor/clases-profesor.page').then(
            m => m.ClasesProfesorPage
          ),
      },
      {
        path: 'otros-profesor',
        loadComponent: () =>
          import('./pages/profesor/otros-profesor/otros-profesor.page').then(
            m => m.OtrosProfesorPage
          ),
      },
      {
        path: 'mis-pagos',
        loadComponent: () =>
          import('./pages/profesor/mis-pagos/mis-pagos.page').then(
            m => m.MisPagosPage
          ),
      },
      {
        path: 'clase-en-vivo/:roomName/:reservaId/:alumnoId',
        loadComponent: () =>
          import(
            './pages/alumno/clase-en-vivo/clase-en-vivo.page'
          ).then(m => m.ClaseEnVivoPage),
      },
      // ← Ruta de Historial de Clases (Profesor)
      {
        path: 'historial-clases',
        loadComponent: () =>
          import('./pages/profesor/historial-clases/historial-clases.page').then(
            m => m.HistorialClasesPage
          ),
      },
      { path: '', redirectTo: 'inicio-profesor', pathMatch: 'full' },
    ],
  },

  // perfil
  {
    path: 'perfil',
    loadComponent: () =>
      import('./pages/perfil/perfil.page').then(m => m.PerfilPage),
  },
  {
    path: 'perfil-usuario',
    loadComponent: () =>
      import('./pages/perfil-usuario/perfil-usuario.page').then(
        m => m.PerfilUsuarioPage
      ),
  },

  // wildcard
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
