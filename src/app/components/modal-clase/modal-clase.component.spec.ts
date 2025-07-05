import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalClaseComponent } from './modal-clase.component';

describe('ModalClaseComponent', () => {
  let component: ModalClaseComponent;
  let fixture: ComponentFixture<ModalClaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ModalClaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalClaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
