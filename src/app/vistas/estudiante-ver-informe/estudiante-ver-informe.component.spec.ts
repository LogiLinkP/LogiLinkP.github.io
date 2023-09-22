import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteVerInformeComponent } from './estudiante-ver-informe.component';

describe('EstudianteVerInformeComponent', () => {
  let component: EstudianteVerInformeComponent;
  let fixture: ComponentFixture<EstudianteVerInformeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstudianteVerInformeComponent]
    });
    fixture = TestBed.createComponent(EstudianteVerInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
