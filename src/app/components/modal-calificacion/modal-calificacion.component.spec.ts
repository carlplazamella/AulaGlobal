import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalCalificacionComponent } from './modal-calificacion.component';

describe('ModalCalificacionComponent', () => {
  let component: ModalCalificacionComponent;
  let fixture: ComponentFixture<ModalCalificacionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ModalCalificacionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCalificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
