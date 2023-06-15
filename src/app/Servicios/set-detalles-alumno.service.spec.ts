import { TestBed } from '@angular/core/testing';
import { SetDetallesAlumnoService } from './set-detalles-alumno.service';

describe('SetDetallesAlumnoService', () => {
  let service: SetDetallesAlumnoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetDetallesAlumnoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
