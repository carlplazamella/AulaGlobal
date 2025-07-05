import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgendaAlumnoPage } from './agenda-alumno.page';

describe('AgendaAlumnoPage', () => {
  let component: AgendaAlumnoPage;
  let fixture: ComponentFixture<AgendaAlumnoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaAlumnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
