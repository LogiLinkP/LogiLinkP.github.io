import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonSolicitarArchivoComponent } from './boton-solicitar-archivo.component';

describe('BotonSolicitarArchivoComponent', () => {
  let component: BotonSolicitarArchivoComponent;
  let fixture: ComponentFixture<BotonSolicitarArchivoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BotonSolicitarArchivoComponent]
    });
    fixture = TestBed.createComponent(BotonSolicitarArchivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
