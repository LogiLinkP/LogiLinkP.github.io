import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarraLateralEncargadoComponent } from './barra-lateral-encargado.component';

describe('BarraLateralEncargadoComponent', () => {
  let component: BarraLateralEncargadoComponent;
  let fixture: ComponentFixture<BarraLateralEncargadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BarraLateralEncargadoComponent]
    });
    fixture = TestBed.createComponent(BarraLateralEncargadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
