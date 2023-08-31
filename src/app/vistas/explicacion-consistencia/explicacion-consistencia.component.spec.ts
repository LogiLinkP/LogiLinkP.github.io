import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplicacionConsistenciaComponent } from './explicacion-consistencia.component';

describe('ExplicacionConsistenciaComponent', () => {
  let component: ExplicacionConsistenciaComponent;
  let fixture: ComponentFixture<ExplicacionConsistenciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExplicacionConsistenciaComponent]
    });
    fixture = TestBed.createComponent(ExplicacionConsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
