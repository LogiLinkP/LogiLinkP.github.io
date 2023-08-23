import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestaFinPracticaComponent } from './encuesta-fin-practica.component';

describe('EncuestaFinPracticaComponent', () => {
  let component: EncuestaFinPracticaComponent;
  let fixture: ComponentFixture<EncuestaFinPracticaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EncuestaFinPracticaComponent]
    });
    fixture = TestBed.createComponent(EncuestaFinPracticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
