import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoClasePage } from './pago-clase.page';

describe('PagoClasePage', () => {
  let component: PagoClasePage;
  let fixture: ComponentFixture<PagoClasePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoClasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
