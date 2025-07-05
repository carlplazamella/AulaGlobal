import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TabsAlumnoComponent } from './tabs-alumno.component';

describe('TabsAlumnoComponent', () => {
  let component: TabsAlumnoComponent;
  let fixture: ComponentFixture<TabsAlumnoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TabsAlumnoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
