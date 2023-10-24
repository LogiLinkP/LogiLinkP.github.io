import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarArchivoEncargadoComponent } from './editar-archivo-encargado.component';

describe('EditarArchivoEncargadoComponent', () => {
  let component: EditarArchivoEncargadoComponent;
  let fixture: ComponentFixture<EditarArchivoEncargadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarArchivoEncargadoComponent]
    });
    fixture = TestBed.createComponent(EditarArchivoEncargadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
