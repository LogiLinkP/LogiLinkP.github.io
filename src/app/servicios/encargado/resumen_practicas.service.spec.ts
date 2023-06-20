import { TestBed } from '@angular/core/testing';

import { GetDetallesAlumnoService } from './resumen_practicas.service';

describe('GetDetallesAlumnoService', () => {
  let service: GetDetallesAlumnoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetDetallesAlumnoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
