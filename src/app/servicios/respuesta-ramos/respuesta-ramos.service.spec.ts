import { TestBed } from '@angular/core/testing';

import { RespuestaRamosService } from './respuesta-ramos.service';

describe('RespuestaRamosService', () => {
  let service: RespuestaRamosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RespuestaRamosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
