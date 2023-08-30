import { TestBed } from '@angular/core/testing';

import { PreguntasEncuestaFinalService } from './preguntas-encuesta-final.service';

describe('PreguntasEncuestaFinalService', () => {
  let service: PreguntasEncuestaFinalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreguntasEncuestaFinalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
