import { TestBed } from '@angular/core/testing';

import { DetallePracticaService } from './detalle-practica.service';

describe('DetallePracticaService', () => {
  let service: DetallePracticaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetallePracticaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
