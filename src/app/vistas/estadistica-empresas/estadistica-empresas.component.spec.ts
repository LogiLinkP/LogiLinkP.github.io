import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticaEmpresasComponent } from './estadistica-empresas.component';

describe('EstadisticaEmpresasComponent', () => {
  let component: EstadisticaEmpresasComponent;
  let fixture: ComponentFixture<EstadisticaEmpresasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstadisticaEmpresasComponent]
    });
    fixture = TestBed.createComponent(EstadisticaEmpresasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
