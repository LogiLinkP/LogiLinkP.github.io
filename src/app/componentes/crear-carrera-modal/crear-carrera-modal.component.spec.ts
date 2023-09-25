import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCarreraModalComponent } from './crear-carrera-modal.component';

describe('CrearCarreraModalComponent', () => {
  let component: CrearCarreraModalComponent;
  let fixture: ComponentFixture<CrearCarreraModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearCarreraModalComponent]
    });
    fixture = TestBed.createComponent(CrearCarreraModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
