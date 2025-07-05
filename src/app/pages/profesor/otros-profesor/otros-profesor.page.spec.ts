import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtrosProfesorPage } from './otros-profesor.page';

describe('OtrosProfesorPage', () => {
  let component: OtrosProfesorPage;
  let fixture: ComponentFixture<OtrosProfesorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OtrosProfesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
