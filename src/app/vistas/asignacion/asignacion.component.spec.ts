import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionComponent } from './asignacion.component';

describe('AsignacionComponent', () => {
  let component: AsignacionComponent;
  let fixture: ComponentFixture<AsignacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsignacionComponent]
    });
    fixture = TestBed.createComponent(AsignacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
