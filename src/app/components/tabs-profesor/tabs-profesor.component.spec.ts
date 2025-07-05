import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TabsProfesorComponent } from './tabs-profesor.component';

describe('TabsProfesorComponent', () => {
  let component: TabsProfesorComponent;
  let fixture: ComponentFixture<TabsProfesorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TabsProfesorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsProfesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
