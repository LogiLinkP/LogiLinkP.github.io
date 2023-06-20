import { TestBed } from '@angular/core/testing';

import { ObtenerDatosService } from './obtener_datos.service';

describe('ObtenerDatosService', () => {
  let service: ObtenerDatosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObtenerDatosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
