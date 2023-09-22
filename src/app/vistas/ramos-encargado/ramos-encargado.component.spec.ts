import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RamosEncargadoComponent } from './ramos-encargado.component';

describe('RamosEncargadoComponent', () => {
  let component: RamosEncargadoComponent;
  let fixture: ComponentFixture<RamosEncargadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RamosEncargadoComponent]
    });
    fixture = TestBed.createComponent(RamosEncargadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
