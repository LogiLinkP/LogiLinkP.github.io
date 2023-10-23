import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirDocumentoEncargadoComponent } from './subir-documento-encargado.component';

describe('SubirDocumentoEncargadoComponent', () => {
  let component: SubirDocumentoEncargadoComponent;
  let fixture: ComponentFixture<SubirDocumentoEncargadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubirDocumentoEncargadoComponent]
    });
    fixture = TestBed.createComponent(SubirDocumentoEncargadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
