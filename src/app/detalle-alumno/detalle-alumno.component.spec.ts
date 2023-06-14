import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAlumnoComponent } from './detalle-alumno.component';

describe('DetalleAlumnoComponent', () => {
  let component: DetalleAlumnoComponent;
  let fixture: ComponentFixture<DetalleAlumnoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleAlumnoComponent]
    });
    fixture = TestBed.createComponent(DetalleAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
