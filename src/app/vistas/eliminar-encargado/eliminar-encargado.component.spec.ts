import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarEncargadoComponent } from './eliminar-encargado.component';

describe('EliminarEncargadoComponent', () => {
  let component: EliminarEncargadoComponent;
  let fixture: ComponentFixture<EliminarEncargadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EliminarEncargadoComponent]
    });
    fixture = TestBed.createComponent(EliminarEncargadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
