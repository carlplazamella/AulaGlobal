import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialClasesPage } from './historial-clases.page';

describe('HistorialClasesPage', () => {
  let component: HistorialClasesPage;
  let fixture: ComponentFixture<HistorialClasesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialClasesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
