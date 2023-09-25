import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEncargadoModalComponent } from './crear-encargado-modal.component';

describe('CrearEncargadoModalComponent', () => {
  let component: CrearEncargadoModalComponent;
  let fixture: ComponentFixture<CrearEncargadoModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearEncargadoModalComponent]
    });
    fixture = TestBed.createComponent(CrearEncargadoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
