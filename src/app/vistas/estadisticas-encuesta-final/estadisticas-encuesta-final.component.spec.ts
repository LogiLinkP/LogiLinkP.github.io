import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasEncuestaFinalComponent } from './estadisticas-encuesta-final.component';

describe('EstadisticasEncuestaFinalComponent', () => {
  let component: EstadisticasEncuestaFinalComponent;
  let fixture: ComponentFixture<EstadisticasEncuestaFinalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstadisticasEncuestaFinalComponent]
    });
    fixture = TestBed.createComponent(EstadisticasEncuestaFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
