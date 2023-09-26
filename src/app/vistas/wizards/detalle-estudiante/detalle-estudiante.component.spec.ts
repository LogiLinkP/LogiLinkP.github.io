import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleEstudianteComponent } from './detalle-estudiante.component';

describe('DetalleEstudianteComponent', () => {
  let component: DetalleEstudianteComponent;
  let fixture: ComponentFixture<DetalleEstudianteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleEstudianteComponent]
    });
    fixture = TestBed.createComponent(DetalleEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
