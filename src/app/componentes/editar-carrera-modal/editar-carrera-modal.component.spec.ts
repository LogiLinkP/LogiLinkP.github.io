import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCarreraModalComponent } from './editar-carrera-modal.component';

describe('EditarCarreraModalComponent', () => {
  let component: EditarCarreraModalComponent;
  let fixture: ComponentFixture<EditarCarreraModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarCarreraModalComponent]
    });
    fixture = TestBed.createComponent(EditarCarreraModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
