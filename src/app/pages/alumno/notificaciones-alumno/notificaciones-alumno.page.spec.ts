import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificacionesAlumnoPage } from './notificaciones-alumno.page';

describe('NotificacionesAlumnoPage', () => {
  let component: NotificacionesAlumnoPage;
  let fixture: ComponentFixture<NotificacionesAlumnoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacionesAlumnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
