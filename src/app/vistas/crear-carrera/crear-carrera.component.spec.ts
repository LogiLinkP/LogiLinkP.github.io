import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCarreraComponent } from './crear-carrera.component';

describe('CrearCarreraComponent', () => {
  let component: CrearCarreraComponent;
  let fixture: ComponentFixture<CrearCarreraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearCarreraComponent]
    });
    fixture = TestBed.createComponent(CrearCarreraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
