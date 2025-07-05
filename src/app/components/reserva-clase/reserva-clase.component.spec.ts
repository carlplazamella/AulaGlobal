import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReservaClaseComponent } from './reserva-clase.component';

describe('ReservaClaseComponent', () => {
  let component: ReservaClaseComponent;
  let fixture: ComponentFixture<ReservaClaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReservaClaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservaClaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
