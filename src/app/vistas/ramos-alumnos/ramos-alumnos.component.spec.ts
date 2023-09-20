import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RamosAlumnosComponent } from './ramos-alumnos.component';

describe('RamosAlumnosComponent', () => {
  let component: RamosAlumnosComponent;
  let fixture: ComponentFixture<RamosAlumnosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RamosAlumnosComponent]
    });
    fixture = TestBed.createComponent(RamosAlumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
