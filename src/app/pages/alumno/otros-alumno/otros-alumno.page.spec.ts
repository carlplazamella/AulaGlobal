import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtrosAlumnoPage } from './otros-alumno.page';

describe('OtrosAlumnoPage', () => {
  let component: OtrosAlumnoPage;
  let fixture: ComponentFixture<OtrosAlumnoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OtrosAlumnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
