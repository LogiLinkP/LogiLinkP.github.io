import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoYEvaluacionEstudianteComponent } from './info-y-evaluacion-estudiante.component';

describe('InfoYEvaluacionEstudianteComponent', () => {
  let component: InfoYEvaluacionEstudianteComponent;
  let fixture: ComponentFixture<InfoYEvaluacionEstudianteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoYEvaluacionEstudianteComponent]
    });
    fixture = TestBed.createComponent(InfoYEvaluacionEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
