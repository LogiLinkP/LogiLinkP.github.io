import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarraLateralAlumnoComponent } from './barra-lateral-alumno.component';

describe('BarraLateralAlumnoComponent', () => {
  let component: BarraLateralAlumnoComponent;
  let fixture: ComponentFixture<BarraLateralAlumnoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BarraLateralAlumnoComponent]
    });
    fixture = TestBed.createComponent(BarraLateralAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
