import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificacionesProfesorPage } from './notificaciones-profesor.page';

describe('NotificacionesProfesorPage', () => {
  let component: NotificacionesProfesorPage;
  let fixture: ComponentFixture<NotificacionesProfesorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacionesProfesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
