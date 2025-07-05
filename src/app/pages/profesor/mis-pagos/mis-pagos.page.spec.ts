import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisPagosPage } from './mis-pagos.page';

describe('MisPagosPage', () => {
  let component: MisPagosPage;
  let fixture: ComponentFixture<MisPagosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MisPagosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
