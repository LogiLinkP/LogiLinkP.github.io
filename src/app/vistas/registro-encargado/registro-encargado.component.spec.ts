import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEncargadoComponent } from './registro-encargado.component';

describe('RegistroEncargadoComponent', () => {
  let component: RegistroEncargadoComponent;
  let fixture: ComponentFixture<RegistroEncargadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroEncargadoComponent]
    });
    fixture = TestBed.createComponent(RegistroEncargadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
