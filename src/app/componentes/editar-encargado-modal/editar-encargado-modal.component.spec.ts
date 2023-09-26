import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEncargadoModalComponent } from './editar-encargado-modal.component';

describe('EditarEncargadoModalComponent', () => {
  let component: EditarEncargadoModalComponent;
  let fixture: ComponentFixture<EditarEncargadoModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarEncargadoModalComponent]
    });
    fixture = TestBed.createComponent(EditarEncargadoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
