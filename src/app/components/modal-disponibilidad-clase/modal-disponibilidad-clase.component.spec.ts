import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalDisponibilidadClaseComponent } from './modal-disponibilidad-clase.component';

describe('ModalDisponibilidadClaseComponent', () => {
  let component: ModalDisponibilidadClaseComponent;
  let fixture: ComponentFixture<ModalDisponibilidadClaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ModalDisponibilidadClaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDisponibilidadClaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
