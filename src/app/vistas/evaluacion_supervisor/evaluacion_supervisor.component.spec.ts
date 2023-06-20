import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionComponent } from './evaluacion_supervisor.component';

describe('EvaluacionComponent', () => {
  let component: EvaluacionComponent;
  let fixture: ComponentFixture<EvaluacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluacionComponent]
    });
    fixture = TestBed.createComponent(EvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
