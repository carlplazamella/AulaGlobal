import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgendaProfesorPage } from './agenda-profesor.page';

describe('AgendaProfesorPage', () => {
  let component: AgendaProfesorPage;
  let fixture: ComponentFixture<AgendaProfesorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaProfesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
