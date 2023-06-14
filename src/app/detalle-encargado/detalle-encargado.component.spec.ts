import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleEncargadoComponent } from './detalle-encargado.component';

describe('DetalleEncargadoComponent', () => {
  let component: DetalleEncargadoComponent;
  let fixture: ComponentFixture<DetalleEncargadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleEncargadoComponent]
    });
    fixture = TestBed.createComponent(DetalleEncargadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
