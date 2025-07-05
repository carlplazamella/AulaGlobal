import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClasesAlumnoPage } from './clases-alumno.page';

describe('ClasesAlumnoPage', () => {
  let component: ClasesAlumnoPage;
  let fixture: ComponentFixture<ClasesAlumnoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasesAlumnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
